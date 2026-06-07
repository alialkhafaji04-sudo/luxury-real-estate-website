import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { NeighborhoodPage } from './pages/NeighborhoodPage';
import { FairHousingPage } from './pages/FairHousingPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top on route change (unless hash is present)
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/neighborhoods/:slug" element={<NeighborhoodPage />} />
        <Route path="/fair-housing-statement" element={<FairHousingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141414',
            border: '1px solid rgba(201, 169, 97, 0.3)',
            color: '#F5F1E8',
            fontFamily: 'Montserrat, sans-serif',
          },
        }}
      />
    </>
  );
}
