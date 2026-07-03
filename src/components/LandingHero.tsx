import { Sparkles, ArrowRight, ShieldCheck, Heart, Clock, Truck } from "lucide-react";
import { motion } from "motion/react";

interface LandingHeroProps {
  onNavigateToCatalog: () => void;
}

export default function LandingHero({ onNavigateToCatalog }: LandingHeroProps) {
  return (
    <div className="space-y-20">
      
      {/* 1. HERO BANNER - Split screen layout */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-neutral-100 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] items-center">
          
          {/* Content side */}
          <div className="lg:col-span-7 p-8 md:p-12 xl:p-16 space-y-6 flex flex-col justify-center">
            
            {/* Elegant Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 self-start bg-burgundy-50 border border-burgundy-100 px-3.5 py-1.5 rounded-full"
            >
              <span className="text-[10px] font-bold text-burgundy-800 uppercase tracking-widest font-mono">
                Debs Scent Story
              </span>
            </motion.div>

            {/* Slogan Title */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl xl:text-6xl font-serif text-neutral-950 tracking-wide font-extrabold leading-[1.12]"
              >
                Need A Perfume <br />
                <span className="text-burgundy-800 relative inline-block">
                  Plug?
                  <span className="absolute bottom-1 left-0 right-0 h-1 bg-gold-200/60 -z-1" />
                </span>
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-serif text-lg md:text-xl text-neutral-700 font-medium tracking-wide mt-2"
              >
                Smell nice with Quality Perfumes at Affordable Prices.
              </motion.h2>
            </div>

            {/* Slogan from bottom of flyer */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-400 text-xs md:text-sm max-w-md leading-relaxed italic border-l-2 border-gold-500 pl-4 font-sans"
            >
              "Smell unforgettable! Because first impressions should last."
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="pt-4 flex flex-wrap gap-4"
            >
              <button
                id="hero-browse-btn"
                onClick={onNavigateToCatalog}
                className="bg-burgundy-800 hover:bg-burgundy-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg transition duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Perfume Plug</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>

          {/* Visual side using the generated image */}
          <div className="lg:col-span-5 relative w-full h-80 lg:h-full bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-100 overflow-hidden min-h-[350px]">
            <img
              src="/src/assets/images/debs_scent_hero_1782999189003.jpg"
              alt="Luxury Perfumes Debs Scent Story"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for luxury texture */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* 2. WHY CHOOSE US - Quality Metrics */}
      <div className="space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-3xs font-mono font-bold text-burgundy-800 tracking-widest uppercase">The Scent Standards</span>
          <h3 className="text-2xl md:text-3xl font-serif text-neutral-900 font-bold tracking-wide">
            Our Commitment to Excellence
          </h3>
          <p className="text-xs text-neutral-400">
            We don't just sell perfumes; we curate memorable signature tags that stay active all day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: <Clock className="w-6 h-6 text-burgundy-800" />,
              title: "24-Hour Longevity",
              desc: "Our premium concentrated perfume oils contain zero fillers or heavy alcohols, keeping you smelling luxurious from dawn to dusk."
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-burgundy-800" />,
              title: "Authentic Arabian Oud",
              desc: "Handpicked masterpieces sourced straight from the UAE's finest perfume houses like Lattafa and Al-Rehab."
            },
            {
              icon: <Heart className="w-6 h-6 text-burgundy-800" />,
              title: "Affordable Prices",
              desc: "Smell unforgettable without denting your budget. We believe luxury is a story that should be accessible to all."
            },
            {
              icon: <Truck className="w-6 h-6 text-burgundy-800" />,
              title: "Express Local Shipping",
              desc: "Fast door-to-door shipping across Lagos, Abuja, Port Harcourt, and nationwide delivery throughout Nigeria."
            }
          ].map((feat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-xs hover:border-burgundy-100 hover:shadow-md transition-all duration-300 text-center space-y-3"
            >
              <div className="inline-flex p-3 bg-burgundy-50 rounded-xl mb-1">
                {feat.icon}
              </div>
              <h4 className="font-serif font-bold text-neutral-900 text-sm">{feat.title}</h4>
              <p className="text-2xs text-neutral-400 leading-relaxed max-w-xs mx-auto">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>



    </div>
  );
}
