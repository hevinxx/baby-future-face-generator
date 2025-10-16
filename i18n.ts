let translations: { [key: string]: string } = {};
let fallbackTranslations: { [key: string]: string } = {};

const getLanguage = (): string => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }
  const lang = navigator.language.split('-')[0];
  // For this app, only 'en' and 'ko' are supported
  if (['en', 'ko'].includes(lang)) {
    return lang;
  }
  return 'en';
};

export const initI18n = async (): Promise<void> => {
    const lang = getLanguage();
    
    try {
        const fallbackResponse = await fetch('./locales/en.json');
        if (!fallbackResponse.ok) throw new Error('Failed to load fallback translations');
        fallbackTranslations = await fallbackResponse.json();
    } catch(e) {
        console.error("Fatal: Could not load English translations.", e);
        // Set to empty object to prevent further errors
        fallbackTranslations = {};
    }

    if (lang !== 'en') {
        try {
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) {
                console.warn(`Translations for '${lang}' not found, using English.`);
                translations = fallbackTranslations;
            } else {
                translations = await response.json();
            }
        } catch (e) {
            console.warn(`Could not load '${lang}' translations, using English.`, e);
            translations = fallbackTranslations;
        }
    } else {
        translations = fallbackTranslations;
    }
};

export const t = (key: string, replacements?: { [key: string]: string | number }): string => {
  let translation = translations[key] || fallbackTranslations[key] || key;
  
  if (replacements) {
    Object.keys(replacements).forEach((placeholder) => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      translation = translation.replace(regex, String(replacements[placeholder]));
    });
  }

  return translation;
};
