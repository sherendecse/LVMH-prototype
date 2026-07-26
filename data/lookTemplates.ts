import type { LookKey, MakeupLook } from "@/types";

export const lookTemplates: Record<LookKey, MakeupLook> = {
  natural: {
    key: "natural",
    name: "Natural Polished Look",
    summary:
      "A light, polished look with fresh skin, soft neutral eyes, subtle cheeks, and a sheer nude lip.",
    complexion: "Light natural coverage with a skin-like finish",
    eyes: "Soft beige-brown eyes with light mascara",
    cheeks: "A gentle peach-rose flush",
    lips: "Sheer nude or rose lip",
    eyeTone: "#7a5745",
    cheekTone: "#bd756c",
    lipTone: "#8e5c5d",
    glow: 0.18,
    eyeIntensity: 0.35,
    lipIntensity: 0.55
  },
  softGlam: {
    key: "softGlam",
    name: "Polished Soft-Glam Look",
    summary:
      "A softly defined look with smooth complexion, warm neutral eyes, refined blush, and a glossy nude lip.",
    complexion: "Medium coverage with a natural satin finish",
    eyes: "Warm brown and bronze eyes with softly blended definition",
    cheeks: "Warm rose-peach blush with a gentle glow",
    lips: "Glossy warm nude lip",
    eyeTone: "#6d3f2d",
    cheekTone: "#c46f65",
    lipTone: "#9e5a55",
    glow: 0.38,
    eyeIntensity: 0.58,
    lipIntensity: 0.72
  },
  formal: {
    key: "formal",
    name: "Elegant Event Look",
    summary:
      "A refined formal look with an even base, bronze-neutral eyes, sculpted cheeks, and a polished nude-rose lip.",
    complexion: "Medium long-wear coverage with refined radiance",
    eyes: "Bronze-neutral eyes with defined lashes",
    cheeks: "Rose blush with soft contour and champagne highlight",
    lips: "Polished nude-rose satin lip",
    eyeTone: "#7b4a2d",
    cheekTone: "#b76568",
    lipTone: "#884e58",
    glow: 0.52,
    eyeIntensity: 0.68,
    lipIntensity: 0.72
  },
  evening: {
    key: "evening",
    name: "Evening Statement Look",
    summary:
      "A stronger evening look with a perfected base, smoky bronze eyes, sculpted cheeks, and a richer lip.",
    complexion: "Buildable medium-to-full coverage with a polished finish",
    eyes: "Smoky bronze-brown eyes with deeper lash-line definition",
    cheeks: "Defined cheeks with visible glow",
    lips: "Rich berry, deep nude, or rose lip",
    eyeTone: "#3f261f",
    cheekTone: "#a9545d",
    lipTone: "#6f3449",
    glow: 0.64,
    eyeIntensity: 0.9,
    lipIntensity: 0.9
  }
};
