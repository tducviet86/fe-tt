export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export function isLocale(value: string): value is Locale { return locales.includes(value as Locale); }
export const paths = { apartments: { vi: "can-ho", en: "apartments" }, search: { vi: "tim-kiem", en: "search" }, property: { vi: "du-an", en: "properties" }, booking: { vi: "dat-phong", en: "booking" } } as const;
