'use client';
import { JSX, useCallback, useEffect, useState } from 'react';

import CustomizeSection from './sections/CustomizeSection';
import InforSection from './sections/InforSection';
import LandingSection from './sections/LandingSection';
import ThanksSection from './sections/ThanksSection';

interface FnChangePage {
  (type: 'next' | 'home'): void;
}

const Home = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Dark mode
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // Set default
    setIsDarkMode(darkModeMediaQuery.matches);
    // Event
    const darkModeChange = (e: MediaQueryListEvent): void => {
      setIsDarkMode(e.matches);
    };
    darkModeMediaQuery.addEventListener('change', darkModeChange);
    return (): void => {
      darkModeMediaQuery.removeEventListener('change', darkModeChange);
    };
  }, []);

  // Next page
  const onChangePage = useCallback<FnChangePage>((type) => {
    switch (type) {
      case 'next':
        setPage((prev) => {
          if (prev === 4) return 1;
          return prev + 1;
        });
        break;
      default:
        setPage(1);
        break;
    }
  }, []);

  // Render page
  const renderPage = useCallback(() => {
    switch (page) {
      case 2:
        return <CustomizeSection onChangePage={onChangePage} />;
      case 3:
        return <InforSection onChangePage={onChangePage} />;
      case 4:
        return <ThanksSection onChangePage={onChangePage} />;
      default:
        return <LandingSection onChangePage={onChangePage} />;
    }
  }, [page, onChangePage]);

  return (
    <div className={`page-container ${isDarkMode && page === 4 ? 'dark' : ''}`}>{renderPage()}</div>
  );
};

export default Home;
