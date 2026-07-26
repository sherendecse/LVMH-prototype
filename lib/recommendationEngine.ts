import { lookTemplates } from "@/data/lookTemplates";
import { products } from "@/data/products";
import type {
  LookKey,
  MakeupLook,
  Product,
  ProductCategory,
  QuizAnswers
} from "@/types";

const occasionScores: Record<LookKey, string[]> = {
  natural: [
    "work",
    "office",
    "school",
    "class",
    "everyday",
    "daily",
    "casual",
    "interview",
    "meeting",
    "daytime",
    "lunch"
  ],
  softGlam: [
    "date",
    "brunch",
    "birthday",
    "dinner",
    "graduation",
    "photo",
    "photoshoot",
    "family gathering"
  ],
  formal: [
    "wedding",
    "formal",
    "ceremony",
    "gala",
    "prom",
    "reception",
    "engagement",
    "banquet"
  ],
  evening: [
    "night out",
    "night",
    "party",
    "club",
    "concert",
    "festival",
    "evening",
    "dance"
  ]
};

const boldnessScores: Record<LookKey, string[]> = {
  natural: [
    "natural",
    "light",
    "subtle",
    "minimal",
    "simple",
    "soft"
  ],
  softGlam: [
    "soft glam",
    "medium",
    "polished",
    "balanced",
    "not too bold"
  ],
  formal: [
    "elegant",
    "refined",
    "formal",
    "classic glam"
  ],
  evening: [
    "bold",
    "dramatic",
    "strong",
    "smoky",
    "statement",
    "intense",
    "full glam"
  ]
};

const routineOrder: ProductCategory[] = [
  "primer",
  "foundation",
  "concealer",
  "powder",
  "bronzer",
  "blush",
  "highlighter",
  "eyes",
  "mascara",
  "lips",
  "setting"
];

function matchesAny(text: string, words: string[]): number {
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

export function normalizeSkinType(value: string): string {
  const text = value.toLowerCase();

  if (text.includes("combination")) return "combination";
  if (text.includes("oily")) return "oily";
  if (text.includes("dry")) return "dry";
  if (text.includes("sensitive")) return "sensitive";
  if (text.includes("normal") || text.includes("balanced")) return "balanced";

  return "balanced";
}

export function generateLook(answers: QuizAnswers): MakeupLook {
  const occasion = answers.occasion.toLowerCase();
  const boldness = answers.boldness.toLowerCase();
  const avoid = answers.avoid.toLowerCase();
  const skin = normalizeSkinType(answers.skinType);

  const scores: Record<LookKey, number> = {
    natural: 0,
    softGlam: 0,
    formal: 0,
    evening: 0
  };

  (Object.keys(scores) as LookKey[]).forEach((key) => {
    scores[key] += matchesAny(occasion, occasionScores[key]) * 75;
    scores[key] += matchesAny(boldness, boldnessScores[key]) * 25;
  });

  if (Object.values(scores).every((score) => score === 0)) {
    if (
      boldness.includes("natural") ||
      boldness.includes("light") ||
      boldness.includes("subtle")
    ) {
      scores.natural = 1;
    } else if (
      boldness.includes("bold") ||
      boldness.includes("dramatic") ||
      boldness.includes("strong")
    ) {
      scores.evening = 1;
    } else {
      scores.softGlam = 1;
    }
  }

  const selectedKey = (Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  )[0][0] ?? "softGlam") as LookKey;

  const base = { ...lookTemplates[selectedKey] };

  if (skin === "oily") {
    base.complexion =
      selectedKey === "natural"
        ? "Light soft-matte coverage with controlled shine"
        : "Buildable soft-matte coverage focused on shine control";
  } else if (skin === "dry") {
    base.complexion =
      selectedKey === "evening"
        ? "Hydrating medium-to-full coverage with refined radiance"
        : "Hydrating coverage with a comfortable luminous finish";
  } else if (skin === "combination") {
    base.complexion =
      "Natural coverage with targeted shine control through the center of the face";
  } else if (skin === "sensitive") {
    base.complexion =
      "Lightweight coverage using products checked against the avoidance answer";
  }

  if (avoid.includes("shimmer") || avoid.includes("glitter")) {
    base.eyes = base.eyes.replace(/bronze|smoky bronze|warm brown and bronze/gi, "matte neutral");
    base.cheeks = base.cheeks.replace(/champagne highlight|visible glow|gentle glow/gi, "soft-matte definition");
    base.glow = 0.08;
  }

  if (avoid.includes("red")) {
    base.lips = "Nude, beige-rose, or berry lip without strong red tones";
    base.lipTone = "#76545c";
  }

  if (avoid.includes("berry")) {
    base.lips = "Warm nude or nude-rose lip";
    base.lipTone = "#915e58";
  }

  if (avoid.includes("matte")) {
    base.complexion = base.complexion.replace(/soft-matte|matte/gi, "natural satin");
  }

  return base;
}

function isAvoided(product: Product, avoid: string): boolean {
  const text = avoid.toLowerCase();
  const tags = [
    ...product.finishTags,
    ...product.ingredientTags,
    ...product.colorTags,
    product.form
  ].map((tag) => tag.toLowerCase());

  return tags.some((tag) => tag.length > 2 && text.includes(tag));
}

function productScore(
  product: Product,
  look: MakeupLook,
  skinType: string,
  avoid: string
): number {
  let score = 0;

  if (product.suitableLooks.includes(look.key)) score += 50;
  if (product.skinTypes.includes(skinType)) score += 35;
  if (product.skinTypes.includes("balanced")) score += 5;
  if (isAvoided(product, avoid)) score -= 100;

  if (look.glow > 0.4 && product.finishTags.includes("luminous")) score += 10;
  if (look.glow < 0.2 && product.finishTags.includes("matte")) score += 10;

  return score;
}

export function recommendProducts(
  answers: QuizAnswers,
  look: MakeupLook
): Product[] {
  const skinType = normalizeSkinType(answers.skinType);
  const avoid = answers.avoid.toLowerCase();

  return routineOrder.flatMap((category) => {
    const candidates = products
      .filter((product) => product.category === category)
      .map((product) => ({
        product,
        score: productScore(product, look, skinType, avoid)
      }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score);

    const best = candidates[0]?.product;

    if (!best) return [];

    if (
      category === "highlighter" &&
      (avoid.includes("shimmer") || avoid.includes("glitter"))
    ) {
      return [];
    }

    if (category === "powder" && skinType === "dry" && look.key === "natural") {
      return [];
    }

    return [best];
  });
}
