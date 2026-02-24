import { useStore } from '@nanostores/preact';
import { currentLocale, type Locale } from '../store/languageStore';

export default function LangToggle() {
    const locale = useStore(currentLocale);

    const toggle = () => {
        const newLang: Locale = locale === 'en' ? 'es' : 'en';
        currentLocale.set(newLang);
        
        const path = window.location.pathname;
        const isSpanish = path.startsWith('/es');
        let newPath = path;
        
        if (newLang === 'es' && !isSpanish) {
            newPath = '/es' + path;
        } else if (newLang === 'en' && isSpanish) {
            newPath = path.replace(/^\/es/, '') || '/';
        }
        
        window.location.href = newPath;
    };

    return (
        <button
            onClick={toggle}
            class="lang-toggle"
            aria-label="Toggle language"
        >
            {locale === 'en' ? 'ES' : 'EN'}
        </button>
    );
}
