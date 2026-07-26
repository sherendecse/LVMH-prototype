export type Screen =
  | "welcome"
  | "quiz"
  | "review"
  | "preview"
  | "products"
  | "saved";

export type QuizAnswers = {
  occasion: string;
  skinType: string;
  boldness: string;
  avoid: string;
};

export type LookKey = "natural" | "softGlam" | "formal" | "evening";

export type MakeupLook = {
  key: LookKey;
  name: string;
  summary: string;
  complexion: string;
  eyes: string;
  cheeks: string;
  lips: string;
  eyeTone: string;
  cheekTone: string;
  lipTone: string;
  glow: number;
  eyeIntensity: number;
  lipIntensity: number;
};

export type ProductCategory =
  | "primer"
  | "foundation"
  | "concealer"
  | "powder"
  | "bronzer"
  | "blush"
  | "highlighter"
  | "eyes"
  | "mascara"
  | "lips"
  | "setting";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  imageLabel: string;
  shadeFamily: string;
  form: string;
  usage: string;
  skinTypes: string[];
  finishTags: string[];
  ingredientTags: string[];
  colorTags: string[];
  suitableLooks: LookKey[];
  regularPrice?: number;
  currentPrice: number;
  reason: string;
};

export type SavedRecommendation = {
  answers: QuizAnswers;
  look: MakeupLook;
  productIds: string[];
  savedAt: string;
};
