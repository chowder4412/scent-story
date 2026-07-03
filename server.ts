import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { PERFUME_INVENTORY } from "./src/perfumesData.js"; // In ESM/TS, node can resolve this

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Admin Auth Configuration
const ADMIN_SESSION_TOKEN = crypto.randomBytes(32).toString("hex");

function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }
  const token = authHeader.substring(7);
  if (token !== ADMIN_SESSION_TOKEN) {
    return res.status(401).json({ error: "Unauthorized: Invalid authentication token" });
  }
  next();
}

// JSON Database Setup
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "perfumes.json");
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, "admin_config.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(PERFUME_INVENTORY, null, 2), "utf8");
}

if (!fs.existsSync(ADMIN_CONFIG_FILE)) {
  const defaultCredentials = {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "debsstory2026",
    securityQuestion: "",
    securityAnswer: ""
  };
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(defaultCredentials, null, 2), "utf8");
}

function readAdminConfig() {
  try {
    const data = fs.readFileSync(ADMIN_CONFIG_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading admin config file:", err);
    return {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "debsstory2026",
      securityQuestion: "",
      securityAnswer: ""
    };
  }
}

function writeAdminConfig(config: any) {
  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing admin config file:", err);
  }
}

function readPerfumes(): any[] {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading perfumes file:", err);
    return PERFUME_INVENTORY;
  }
}

function writePerfumes(perfumes: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(perfumes, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing perfumes file:", err);
  }
}

// Serve admin panel statically BEFORE Vite middleware so it doesn't get captured by SPA routes
app.use("/admin", express.static(path.join(process.cwd(), "admin")));

// REST API Routes for Perfume Management
app.post("/api/admin/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const config = readAdminConfig();
    if (username === config.username && password === config.password) {
      res.json({ token: ADMIN_SESSION_TOKEN });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "An error occurred during login" });
  }
});

// GET security config (filters out password and answer for safety)
app.get("/api/admin/security", requireAdminAuth, (req, res) => {
  try {
    const config = readAdminConfig();
    res.json({
      username: config.username,
      securityQuestion: config.securityQuestion,
      hasSecurityAnswer: !!config.securityAnswer
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load security settings" });
  }
});

// POST update security config
app.post("/api/admin/security/update", requireAdminAuth, (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword, securityQuestion, securityAnswer } = req.body;
    
    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required to save changes" });
    }
    
    const config = readAdminConfig();
    if (currentPassword !== config.password) {
      return res.status(401).json({ error: "Incorrect current password" });
    }
    
    if (newUsername) config.username = newUsername.trim();
    if (newPassword) config.password = newPassword;
    if (securityQuestion !== undefined) config.securityQuestion = securityQuestion.trim();
    if (securityAnswer !== undefined) config.securityAnswer = securityAnswer.trim();
    
    writeAdminConfig(config);
    res.json({ message: "Security settings updated successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update security settings" });
  }
});

// GET security question challenge (returns the question for a username)
app.post("/api/admin/forgot-password/challenge", (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    const config = readAdminConfig();
    if (username.trim() !== config.username) {
      return res.status(404).json({ error: "Admin username not found" });
    }
    
    if (!config.securityQuestion) {
      return res.status(400).json({ error: "No security question has been set up for recovery. Please contact host support." });
    }
    
    res.json({ securityQuestion: config.securityQuestion });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch security challenge" });
  }
});

// POST reset password using security question
app.post("/api/admin/forgot-password/reset", (req, res) => {
  try {
    const { username, securityAnswer, newPassword } = req.body;
    
    if (!username || !securityAnswer || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const config = readAdminConfig();
    if (username.trim() !== config.username) {
      return res.status(404).json({ error: "Admin username not found" });
    }
    
    if (!config.securityAnswer) {
      return res.status(400).json({ error: "No security answer has been configured." });
    }
    
    if (securityAnswer.trim().toLowerCase() === config.securityAnswer.trim().toLowerCase()) {
      config.password = newPassword;
      writeAdminConfig(config);
      res.json({ message: "Password reset successful" });
    } else {
      res.status(401).json({ error: "Incorrect answer to security question" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to reset password" });
  }
});

app.get("/api/perfumes", (req, res) => {
  try {
    const perfumes = readPerfumes();
    res.json(perfumes);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to load perfumes" });
  }
});

app.post("/api/perfumes", requireAdminAuth, (req, res) => {
  try {
    const perfumes = readPerfumes();
    const newPerfume = req.body;
    
    // Auto-generate ID
    let nextIdNum = 1;
    perfumes.forEach(p => {
      const match = p.id.match(/^p(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= nextIdNum) nextIdNum = num + 1;
      }
    });
    newPerfume.id = `p${nextIdNum}`;
    
    if (newPerfume.price && !newPerfume.priceFormatted) {
      newPerfume.priceFormatted = "₦" + Number(newPerfume.price).toLocaleString();
    }
    
    perfumes.push(newPerfume);
    writePerfumes(perfumes);
    
    res.status(201).json(newPerfume);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create perfume" });
  }
});

app.put("/api/perfumes/:id", requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const perfumes = readPerfumes();
    const index = perfumes.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Perfume not found" });
    }
    
    const updatedPerfume = { ...perfumes[index], ...req.body, id };
    
    if (req.body.price !== undefined) {
      updatedPerfume.priceFormatted = "₦" + Number(req.body.price).toLocaleString();
    }
    
    perfumes[index] = updatedPerfume;
    writePerfumes(perfumes);
    
    res.json(updatedPerfume);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update perfume" });
  }
});

app.delete("/api/perfumes/:id", requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const perfumes = readPerfumes();
    const index = perfumes.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Perfume not found" });
    }
    
    const deleted = perfumes.splice(index, 1);
    writePerfumes(perfumes);
    
    res.json({ message: "Perfume deleted successfully", deleted: deleted[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete perfume" });
  }
});

app.post("/api/perfumes/reset", requireAdminAuth, (req, res) => {
  try {
    writePerfumes(PERFUME_INVENTORY);
    res.json({ message: "Catalog reset to factory defaults successfully", perfumes: PERFUME_INVENTORY });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to reset catalog" });
  }
});

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Smart rule-based fallback when GEMINI_API_KEY is missing
function getRuleBasedRecommendations(preferences: any) {
  const { gender, intensity, families, occasion } = preferences;
  
  // Filter by gender category
  let matches = readPerfumes().filter(p => {
    if (gender === 'Unisex') return true;
    return p.category === gender || p.category === 'Unisex';
  });

  // Calculate matching scores based on vibe/family keywords
  const scoredMatches = matches.map(p => {
    let score = 0;
    // Check vibes
    if (families && Array.isArray(families)) {
      families.forEach((fam: string) => {
        if (p.vibes.some(v => v.toLowerCase().includes(fam.toLowerCase()))) {
          score += 3;
        }
        if (p.topNotes.some(n => n.toLowerCase().includes(fam.toLowerCase())) ||
            p.middleNotes.some(n => n.toLowerCase().includes(fam.toLowerCase())) ||
            p.baseNotes.some(n => n.toLowerCase().includes(fam.toLowerCase()))) {
          score += 2;
        }
      });
    }
    
    // Check occasion matches
    if (occasion) {
      const occLower = occasion.toLowerCase();
      if (occLower === 'work' || occLower === 'office') {
        if (p.vibes.includes('Professional') || p.vibes.includes('Clean') || p.vibes.includes('Fresh')) score += 2;
      } else if (occLower === 'romantic' || occLower === 'date-night') {
        if (p.vibes.includes('Sensual') || p.vibes.includes('Warm') || p.vibes.includes('Romantic') || p.vibes.includes('Sweet')) score += 2;
      } else if (occLower === 'night-out' || occLower === 'party') {
        if (p.vibes.includes('Bold') || p.vibes.includes('Mysterious') || p.vibes.includes('Oud')) score += 2;
      } else { // casual
        if (p.vibes.includes('Fresh') || p.vibes.includes('Clean') || p.vibes.includes('Playful')) score += 2;
      }
    }

    // Match intensity
    if (intensity) {
      if (intensity === 'strong' && (p.type === 'Arabian Oud' || p.type === 'Perfume Oil')) score += 1;
      if (intensity === 'light' && p.type === 'Eau de Toilette') score += 1;
    }

    return { perfume: p, score };
  });

  // Sort by score descending
  scoredMatches.sort((a, b) => b.score - a.score);
  
  // Get top 3 IDs
  const recommendedIds = scoredMatches.slice(0, 3).map(sm => sm.perfume.id);
  
  // If no matches, return top 3 general ones
  if (recommendedIds.length === 0) {
    recommendedIds.push("p1", "p2", "p3");
  }

  return {
    isDemoFallback: true,
    analysis: `Here is your customized recommendation curated by our expert scent mapping algorithms! (To unlock our advanced GPT-style Gemini Scent Consultant with natural language processing, please add your GEMINI_API_KEY in the AI Studio Secrets panel.) Based on your selection for ${gender} scent profiles suited for ${occasion} wear with a preference for ${intensity} strength, we selected these outstanding matches that align with your taste.`,
    recommendedIds,
    generalAdvice: "To maximize sillage, apply these concentrated formulations directly onto damp skin at your primary pulse points—wrists, neck, inner elbows, and behind the ears. This allows the scent to diffuse organically with your body heat."
  };
}

// API Routes
app.post("/api/scent-finder", async (req, res) => {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({ error: "Preferences are required" });
    }

    // Attempt to use Gemini
    try {
      const ai = getAiClient();
      
      const promptText = `
You are the elite AI Scent Consultant for "Debs Scent Story", an exquisite perfume boutique specializing in luxury designer perfumes, concentrated designer perfume oils (highly concentrated and long-lasting rollerballs), and rich Middle Eastern/Arabian Oud fragrances.

The user is seeking perfume suggestions based on their specific taste profile:
- Scent Profile For: ${preferences.gender || "Unisex"}
- Desired Strength/Intensity: ${preferences.intensity || "Any"}
- Scent Families/Notes They Love: ${(preferences.families || []).join(", ") || "Any"}
- Occasion they will wear it for: ${preferences.occasion || "Any"}
- Personal notes / custom description: "${preferences.customText || "No additional comments"}"

Here is Debs Scent Story's official stock list (in JSON format):
${JSON.stringify(readPerfumes(), null, 2)}

Identify the best 1 to 3 perfumes from our stock that match their taste. If we have highly relevant matches, list them. If some popular options fit their general description, suggest them.

Generate a JSON response that conforms EXACTLY to this schema:
{
  "analysis": "A conversational, friendly, and highly descriptive explanation (around 100-150 words) written in a luxury boutique voice. Explain to the customer why these selected perfumes match their vibes, their preferred notes, and the occasion. Be welcoming and highly professional.",
  "recommendedIds": ["id1", "id2"], // array of matching perfume IDs from our stock, ordered by match strength. Max 3 IDs.
  "generalAdvice": "Tailored expert tips (50-80 words) on how they should apply, layer, or care for these specific perfume types (e.g., if they are oils, advise about rubbing; if EDPs, advise about pulse points, or how to combine them)."
}

Do not add any markdown block, prefix, or extra text. Output ONLY valid JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { 
                type: Type.STRING, 
                description: "Conversational, welcoming explanation of the matching results." 
              },
              recommendedIds: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of matching IDs from our inventory (p1 to p12)." 
              },
              generalAdvice: { 
                type: Type.STRING, 
                description: "Custom fragrance application and care advice." 
              }
            },
            required: ["analysis", "recommendedIds", "generalAdvice"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);

    } catch (apiError: any) {
      // Fallback gracefully to rule-based recommendations if Gemini fails or is unconfigured
      console.warn("Gemini Scent Finder error (using smart fallback):", apiError.message);
      const fallbackResult = getRuleBasedRecommendations(preferences);
      res.json(fallbackResult);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "An unexpected error occurred" });
  }
});

// App Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Vite Middleware integration for development
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
