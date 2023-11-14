import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import i18n, { LOCALE_KEY } from '@/lib/i18n';

const LocaleContext = React.createContext();

export const useLocaleContext = () => useContext(LocaleContext);

export const LocaleContextProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.language);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    const newLocale = searchParams.get(LOCALE_KEY);

    if (newLocale && newLocale !== locale) {
      const decodedLocale = decodeURIComponent(newLocale);
      setLocale(decodedLocale);
    }
  }, [locale, searchParams]);

  const changeLocale = useCallback(
    (newLocale) => {
      setSearchParams((urlSearch) => {
        urlSearch.set(LOCALE_KEY, encodeURIComponent(newLocale));
        return urlSearch;
      });
    },
    [setSearchParams],
  );

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
