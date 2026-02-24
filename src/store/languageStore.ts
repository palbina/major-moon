import { atom } from 'nanostores';

export type Locale = 'en' | 'es';

export function getInitialLocale(): Locale {
    if (typeof window === 'undefined') return 'en';
    const path = window.location.pathname;
    if (path.startsWith('/es')) return 'es';
    return 'en';
}

export const currentLocale = atom<Locale>(getInitialLocale());

export const dictionary = {
    en: {
        title: 'Interactive Preact Island',
        currentCount: 'Current count:',
    },
    es: {
        title: 'Isla Interactiva de Preact',
        currentCount: 'Conteo actual:',
    },
};

export function getTranslations(locale: Locale) {
    return dictionary[locale];
}
