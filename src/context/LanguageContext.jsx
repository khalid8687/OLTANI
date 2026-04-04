import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('oltani-lang') || 'en';
  });

  const t = translations[lang];

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      localStorage.setItem('oltani-lang', next);
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = t.lang;
    document.body.style.fontFamily = t.fontFamily;
  }, [t]);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used inside LanguageProvider');
  return context;
}
