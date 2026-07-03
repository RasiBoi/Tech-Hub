import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Listens to every route change and immediately scrolls the window back to (0, 0).
 * This fixes the React Router behaviour where the browser preserves the previous
 * scroll position when navigating to a new page.
 *
 * Usage: place <ScrollToTop /> as a direct child of <Router>, before <Routes>.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use 'instant' so there is no visible scroll animation — the new page just
    // starts at the top, exactly like a traditional multi-page website.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
