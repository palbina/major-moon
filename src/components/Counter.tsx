import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { currentLocale, getTranslations } from '../store/languageStore';

export default function Counter() {
    const [count, setCount] = useState(0);
    const locale = useStore(currentLocale);
    const t = getTranslations(locale);

    return (
        <div style={{ padding: '1.5rem', border: '1px solid var(--gray-800)', borderRadius: '1.5rem', textAlign: 'center', marginTop: '2rem', background: 'var(--gradient-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: 'var(--text-xl)', color: 'var(--gray-100)' }}>{t.title}</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--gray-300)' }}>{t.currentCount} <strong>{count}</strong></p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={() => setCount(count - 1)}
                    style={{ padding: '0.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--gray-100)', borderRadius: '999rem', border: '1px solid var(--gray-800)', cursor: 'pointer', fontSize: 'var(--text-lg)', transition: 'background 0.2s ease' }}
                >
                    -
                </button>
                <button
                    onClick={() => setCount(count + 1)}
                    style={{ padding: '0.5rem 1.5rem', background: 'var(--accent-regular)', color: 'white', borderRadius: '999rem', border: 'none', cursor: 'pointer', fontSize: 'var(--text-lg)', transition: 'background 0.2s ease', boxShadow: 'var(--shadow-md)' }}
                >
                    +
                </button>
            </div>
        </div>
    );
}
