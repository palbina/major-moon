import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLang]) {
        return ui[lang][key] || ui[defaultLang][key];
    }
}

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        // Determine target path base. Assuming paths are like '/', '/about/', '/work/'
        let unlocalizedPath = path.replace(new RegExp(`^\\/${lang}`), '');
        if (!unlocalizedPath.startsWith('/')) unlocalizedPath = '/' + unlocalizedPath;

        // Default locale has no prefix when `prefixDefaultLocale: false`
        if (l === defaultLang) {
            return unlocalizedPath;
        }

        // Add prefix for non-default locales
        return `/${l}${unlocalizedPath}`;
    }
}
