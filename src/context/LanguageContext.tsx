import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'annur_tea_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'uz' || saved === 'ru' || saved === 'en') {
      return saved;
    }
    return 'uz'; // Uzbek is the required default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations.uz;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const uzDict = translations.uz;
    if (uzDict && uzDict[key]) {
      return uzDict[key];
    }
    return fallback || key;
  };

  const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
      { maximumFractionDigits: 0 }
    ).format(amount);

    if (language === 'uz') {
      return `${formatted} so'm`;
    } else if (language === 'ru') {
      return `${formatted} сум`;
    }
    return `${formatted} UZS`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(
        language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      ).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatCurrency, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
