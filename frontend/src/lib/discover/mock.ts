export type CompatibilityTier = "Excellent Match" | "Great Match" | "Potential Match";

export type CompatibilitySignal = {
  kind: "match" | "warn";
  label: string;
};

export type DiscoverProfile = {
  id: string;
  name: string;
  age: number;
  location: string;
  compatibility: CompatibilityTier;
  hero: string;
  gallery: string[];
  summary: string;
  lifestyle: string[];
  snapshot: CompatibilitySignal[];
  values: string[];
  facts: { label: string; value: string }[];
};

export const MOCK_PROFILES: DiscoverProfile[] = [
  {
    id: "riya-28",
    name: "Riya",
    age: 28,
    location: "Bangalore",
    compatibility: "Excellent Match",
    hero: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&q=80&auto=format&fit=crop",
    ],
    summary:
      "You both value personal growth while maintaining strong family relationships. Your views on finances, parenting, and long-term goals are highly aligned. While your social lifestyles differ slightly, your communication styles appear complementary.",
    lifestyle: ["Vegetarian", "Non-Smoker", "Social Drinker", "Active Lifestyle", "Career Focused", "Family Oriented"],
    snapshot: [
      { kind: "match", label: "Both want children" },
      { kind: "match", label: "Similar household expectations" },
      { kind: "match", label: "Open to relocation" },
      { kind: "warn", label: "Different views on interfaith marriage" },
    ],
    values: ["Equal Partnership", "Open Communication", "Personal Growth", "Family First", "Shared Responsibilities"],
    facts: [
      { label: "Education", value: "M.Des, NID" },
      { label: "Profession", value: "Senior Product Designer" },
      { label: "Languages", value: "English, Hindi, Kannada" },
      { label: "Family", value: "Nuclear · 1 sibling" },
      { label: "Intent", value: "Long-term, marriage" },
    ],
  },
  {
    id: "arjun-30",
    name: "Arjun",
    age: 30,
    location: "Mumbai",
    compatibility: "Great Match",
    hero: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=1000&q=80&auto=format&fit=crop",
    ],
    summary:
      "You share a deep alignment on ambition, financial responsibility, and how you want to raise a family. Both of you describe yourselves as introverted but socially warm — a rare and complementary pairing.",
    lifestyle: ["Eats Everything", "Non-Smoker", "Occasional Drinker", "Runner", "Career Focused", "Pet Lover"],
    snapshot: [
      { kind: "match", label: "Both want children" },
      { kind: "match", label: "Aligned on financial discipline" },
      { kind: "warn", label: "Different relocation preferences" },
      { kind: "match", label: "Similar household expectations" },
    ],
    values: ["Equal Partnership", "Honesty First", "Ambition", "Family First", "Financial Discipline"],
    facts: [
      { label: "Education", value: "B.Tech, IIT Bombay" },
      { label: "Profession", value: "Co-founder, SaaS" },
      { label: "Languages", value: "English, Hindi, Marathi" },
      { label: "Family", value: "Nuclear · Close-knit" },
      { label: "Intent", value: "Marriage in 1–2 years" },
    ],
  },
  {
    id: "ananya-27",
    name: "Ananya",
    age: 27,
    location: "Pune",
    compatibility: "Potential Match",
    hero: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485290334039-a3c69043e517?w=1000&q=80&auto=format&fit=crop",
    ],
    summary:
      "You share core values around kindness, learning, and a slower pace of life. Your career paths look quite different, which could be a source of richness — or something worth talking through early.",
    lifestyle: ["Vegetarian", "Non-Smoker", "Non-Drinker", "Yoga", "Creative", "Spiritual"],
    snapshot: [
      { kind: "match", label: "Open to interfaith marriage" },
      { kind: "warn", label: "Different household expectations" },
      { kind: "match", label: "Both want children" },
      { kind: "warn", label: "Different career intensity" },
    ],
    values: ["Open Communication", "Kindness", "Personal Growth", "Mindful Living"],
    facts: [
      { label: "Education", value: "MA, English Literature" },
      { label: "Profession", value: "Writer & Yoga Teacher" },
      { label: "Languages", value: "English, Hindi, Marathi" },
      { label: "Family", value: "Joint family" },
      { label: "Intent", value: "Long-term, marriage" },
    ],
  },
];
