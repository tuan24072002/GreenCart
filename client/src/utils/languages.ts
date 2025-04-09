import { assets } from "@/assets/assets";
import enTranslation from "@/locales/en.json";
import viTranslation from "@/locales/vi.json";

export const getLanguageData = (lang: string) =>
  lang === "en" ? enTranslation : viTranslation;

export const supportedLanguages = [
  { label: "Việt Nam", code: "vi", image: assets.vnFlag },
  { label: "English", code: "en", image: assets.ukFlag },
];
