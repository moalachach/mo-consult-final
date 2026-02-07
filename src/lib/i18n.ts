export const supportedLangs = ["fr", "nl", "en"] as const;
export type Lang = (typeof supportedLangs)[number];

export const normalizeLang = (input?: string): Lang => {
  const isSupported = supportedLangs.includes(input as Lang);
  if (!isSupported && input && process.env.NODE_ENV !== "production") {
    // Helps catch bad routes early during dev.
    console.warn(`[i18n] Unsupported lang '${input}', falling back to 'fr'.`);
  }
  return isSupported ? (input as Lang) : "fr";
};

const dictionaries = {
  fr: {
    nav: {
      home: "Accueil",
      offers: "Offres",
      process: "Process",
      partners: "Partenaires",
      contact: "Contact",
      client: "Espace client",
      create: "Créer mon entreprise",
    },
  },
  nl: {
    nav: {
      home: "Home",
      offers: "Formules",
      process: "Proces",
      partners: "Partners",
      contact: "Contact",
      client: "Client zone",
      create: "Start mijn bedrijf",
    },
  },
  en: {
    nav: {
      home: "Home",
      offers: "Plans",
      process: "Process",
      partners: "Partners",
      contact: "Contact",
      client: "Client area",
      create: "Start my company",
    },
  },
} as const;

export const getT = (langInput?: string) => {
  const lang = normalizeLang(langInput);
  return dictionaries[lang] ?? dictionaries.fr;
};
