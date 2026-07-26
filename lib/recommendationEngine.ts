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
    "everyday",
    "work",
    "school",
    "interview",
    "meeting"
  ],
  softGlam: [
    "brunch",
    "date",
    "birthday",
    "graduation",
    "dinner"
  ],
  formal: [
    "wedding",
    "formal event"
  ],
  evening: [
    "night out",
    "party",
    "concert"
  ]
};

const boldnessScores: Record<LookKey, string[]> = {
  natural: [
    "very natural",
    "subtle",
    "minimal"
  ],
  softGlam: [
    "polished",
    "soft glam"
  ],
  formal: [
    "elegant",
    "classic"
  ],
  evening: [
    "bold",
    "dramatic",
    "smoky",
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
  return words.reduce((score, word) => {
    return score + (text.includes(word.toLowerCase()) ? 1 : 0);
  }, 0);
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
    const occasionMatches = matchesAny(
      occasion,
      occasionScores[key]
    );

    const boldnessMatches = matchesAny(
      boldness,
      boldnessScores[key]
    );

    scores[key] += occasionMatches * 75;
    scores[key] += boldnessMatches * 25;
  });

  if (Object.values(scores).every((score) => score === 0)) {
    scores.softGlam = 1;
  }

  const selectedKey = (
    Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "softGlam"
  ) as LookKey;

  const base = {
    ...lookTemplates[selectedKey]
  };

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
