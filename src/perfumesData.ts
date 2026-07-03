export interface Perfume {
  id: string;
  name: string;
  brand: string;
  category: 'Men' | 'Women' | 'Unisex';
  type: 'Eau de Parfum' | 'Eau de Toilette' | 'Perfume Oil' | 'Arabian Oud';
  price: number; // in NGN
  priceFormatted: string;
  size: string; // e.g. "100ml", "50ml", "10ml Oil"
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  description: string;
  vibes: string[];
  imageUrl: string;
}

export const PERFUME_INVENTORY: Perfume[] = [
  {
    id: "p1",
    name: "Khamrah",
    brand: "Lattafa",
    category: "Unisex",
    type: "Arabian Oud",
    price: 38000,
    priceFormatted: "₦38,000",
    size: "100ml",
    topNotes: ["Cinnamon", "Nutmeg", "Bergamot"],
    middleNotes: ["Dates", "Praline", "Tuberose", "Lily-of-the-Valley"],
    baseNotes: ["Vanilla", "Amberwood", "Myrrh", "Benzoin", "Tonka Bean"],
    description: "A luxurious, warm, and highly intoxicating Middle Eastern blend of sweet vanilla, warm cinnamon, and rich amber. One of our top-selling gourmand masterpieces.",
    vibes: ["Sweet", "Warm", "Sensual", "Gourmand", "Oud"],
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p2",
    name: "Baccarat Rouge 540 (Oil)",
    brand: "Designer Scent",
    category: "Unisex",
    type: "Perfume Oil",
    price: 8500,
    priceFormatted: "₦8,500",
    size: "10ml Roller",
    topNotes: ["Jasmine", "Saffron"],
    middleNotes: ["Amberwood", "Ambergris"],
    baseNotes: ["Fir Resin", "Cedar"],
    description: "Highly concentrated pure perfume oil inspired by BR540. Captures the famous airy, sweet ambergris and woody aroma. Stays on the skin all day long.",
    vibes: ["Sweet", "Airy", "Luxurious", "Elegant"],
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p3",
    name: "Bleu de Chanel",
    brand: "Chanel",
    category: "Men",
    type: "Eau de Parfum",
    price: 145000,
    priceFormatted: "₦145,000",
    size: "100ml",
    topNotes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
    middleNotes: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
    baseNotes: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli"],
    description: "An iconic, clean, and deeply charismatic woody aromatic fragrance. Emits a timeless aura of modern freedom and sophistication.",
    vibes: ["Fresh", "Clean", "Woody", "Professional"],
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p4",
    name: "YSL Libre",
    brand: "Yves Saint Laurent",
    category: "Women",
    type: "Eau de Parfum",
    price: 135000,
    priceFormatted: "₦135,000",
    size: "90ml",
    topNotes: ["Lavender", "Mandarin Orange", "Black Currant", "Petitgrain"],
    middleNotes: ["Lavender", "Orange Blossom", "Jasmine"],
    baseNotes: ["Madagascar Vanilla", "Musk", "Cedar", "Ambergris"],
    description: "A majestic floral-lavender fragrance for the modern, free, and confident woman. Beautifully balances French lavender with warm Moroccan orange blossom.",
    vibes: ["Elegant", "Sophisticated", "Floral", "Bold"],
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p5",
    name: "Asad",
    brand: "Lattafa",
    category: "Men",
    type: "Arabian Oud",
    price: 28000,
    priceFormatted: "₦28,000",
    size: "100ml",
    topNotes: ["Black Pepper", "Pineapple", "Tobacco"],
    middleNotes: ["Patchouli", "Coffee", "Iris"],
    baseNotes: ["Vanilla", "Amber", "Dry Wood", "Benzoin", "Labdanum"],
    description: "A majestic spicy fragrance with a warm, dark background. Known for its incredible projection and resemblance to luxury premium elixirs.",
    vibes: ["Spicy", "Warm", "Bold", "Mysterious"],
    imageUrl: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p6",
    name: "Delina Exclusif (Oil)",
    brand: "Designer Scent",
    category: "Women",
    type: "Perfume Oil",
    price: 8500,
    priceFormatted: "₦8,500",
    size: "10ml Roller",
    topNotes: ["Litchi", "Pear", "Bergamot"],
    middleNotes: ["Turkish Rose", "Agarwood (Oud)", "Incense"],
    baseNotes: ["Vanilla", "Amber", "Woody Notes"],
    description: "A super-concentrated perfume oil delivering the powdery rose, sweet pear, and subtle oud of Delina Exclusif. Incredibly romantic and ultra-feminine.",
    vibes: ["Floral", "Sweet", "Romantic", "Sensual"],
    imageUrl: "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p7",
    name: "Dior Sauvage",
    brand: "Christian Dior",
    category: "Men",
    type: "Eau de Toilette",
    price: 128000,
    priceFormatted: "₦128,000",
    size: "100ml",
    topNotes: ["Calabrian Bergamot", "Pepper"],
    middleNotes: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Patchouli"],
    baseNotes: ["Ambroxan", "Cedar", "Labdanum"],
    description: "An absolute crowd-pleaser and compliment-getter. Crisp, spicy, and raw, with a powerful fresh trail anchored by rich ambergris-like Ambroxan.",
    vibes: ["Fresh", "Spicy", "Clean", "Charismatic"],
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p8",
    name: "Creed Aventus (Oil)",
    brand: "Designer Scent",
    category: "Men",
    type: "Perfume Oil",
    price: 9000,
    priceFormatted: "₦9,000",
    size: "10ml Roller",
    topNotes: ["Pineapple", "Bergamot", "Black Currant", "Apple"],
    middleNotes: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
    baseNotes: ["Musk", "Oakmoss", "Ambergris", "Vanilla"],
    description: "Concentrated luxury oil of the world-famous Creed Aventus. Combines fresh pineapple and black currant with smokey birch and rich oakmoss. Power-packed projection.",
    vibes: ["Fresh", "Fruity", "Smokey", "Professional", "Bold"],
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p9",
    name: "Coco Mademoiselle",
    brand: "Chanel",
    category: "Women",
    type: "Eau de Parfum",
    price: 148000,
    priceFormatted: "₦148,000",
    size: "100ml",
    topNotes: ["Orange", "Mandarin Orange", "Bergamot", "Orange Blossom"],
    middleNotes: ["Turkish Rose", "Jasmine", "Mimosa", "Ylang-Ylang"],
    baseNotes: ["Patchouli", "White Musk", "Vanilla", "Vetiver", "Tonka Bean", "Opoponax"],
    description: "The essence of a bold, free woman. A feminine oriental-woody scent with a strong personality, yet surprisingly fresh. Elegant and high class.",
    vibes: ["Elegant", "Classy", "Floral", "Sophisticated"],
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p10",
    name: "Oud Wood (Oil)",
    brand: "Designer Scent",
    category: "Unisex",
    type: "Perfume Oil",
    price: 9500,
    priceFormatted: "₦9,500",
    size: "10ml Roller",
    topNotes: ["Sichuan Pepper", "Cardamom"],
    middleNotes: ["Agarwood (Oud)", "Sandalwood", "Vetiver"],
    baseNotes: ["Tonka Bean", "Vanilla", "Amber"],
    description: "Rich, premium concentrated oil replicating the highly exclusive Oud Wood. Extremely smooth, smokey, and exotic blend of rare woods and warm spices.",
    vibes: ["Woody", "Oud", "Elegant", "Warm", "Mysterious"],
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p11",
    name: "Bade'e Al Oud (Oud for Glory)",
    brand: "Lattafa",
    category: "Unisex",
    type: "Arabian Oud",
    price: 32000,
    priceFormatted: "₦32,000",
    size: "100ml",
    topNotes: ["Saffron", "Nutmeg", "Lavender"],
    middleNotes: ["Agarwood (Oud)", "Patchouli"],
    baseNotes: ["Agarwood (Oud)", "Patchouli", "Musk"],
    description: "A dark, mesmerizing, and highly prestigious woody-spicy Arabian fragrance. Centered around precious agarwood (oud) and sweet saffron.",
    vibes: ["Oud", "Woody", "Bold", "Mysterious"],
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "p12",
    name: "Choco Musk (Oil)",
    brand: "Al-Rehab",
    category: "Unisex",
    type: "Perfume Oil",
    price: 4500,
    priceFormatted: "₦4,500",
    size: "6ml Roller",
    topNotes: ["Milk Chocolate", "White Musk"],
    middleNotes: ["Cinnamon", "Vanilla", "Spices"],
    baseNotes: ["Amber", "Sandalwood", "Myrrh"],
    description: "An incredibly delicious, viral, and pocket-friendly gourmand fragrance oil. Smells like rich chocolate chip cookies, sweet milk, and warm vanilla marshmallow.",
    vibes: ["Sweet", "Gourmand", "Warm", "Playful"],
    imageUrl: "https://images.unsplash.com/photo-1588405748373-122b2321bc31?auto=format&fit=crop&q=80&w=600"
  }
];
