"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LanguageCode, translations, languages } from '@/i18n/translations';

interface I18nContextType {
  locale: LanguageCode;
  setLocale: (code: LanguageCode) => void;
  t: (key: string) => string;
  tLoc: (field: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LanguageCode>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const savedLocale = localStorage.getItem('app-locale') as LanguageCode;
    if (savedLocale && languages[savedLocale]) {
      setLocaleState(savedLocale);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Update HTML attributes
    document.documentElement.lang = locale;
    document.documentElement.dir = languages[locale].dir;
    
    // Save to localStorage
    localStorage.setItem('app-locale', locale);
  }, [locale, mounted]);

  const setLocale = (code: LanguageCode) => {
    if (languages[code]) {
      setLocaleState(code);
    }
  };

  const t = (key: string) => {
    return translations[locale]?.[key] || `[MISSING: ${key}]`;
  };

  const tLoc = (field: Record<string, string>) => {
    if (!field) return '';
    return field[locale] || field['en'] || Object.values(field)[0] || '';
  };

  // Optional: Prevent flash of unhydrated content by not rendering or rendering default
  // But to support SEO we render default and swap on client.
  
  return (
    <I18nContext.Provider value={{ locale, setLocale, t, tLoc }}>
      <div dir={mounted ? languages[locale].dir : 'ltr'} className="contents">
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
