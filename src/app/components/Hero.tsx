import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export function Hero() {
  const images = [
    '/rich-houses/908BelAirRoad.jpg',
    '/rich-houses/BLOG-1-630-Nimes-Rd.jpg',
    '/rich-houses/maxresdefault.jpg',
    '/rich-houses/las_boom_blocks_rendering.webp',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [images.length]);

  const zoomIn = currentIndex % 2 === 0;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: zoomIn ? 1.0 : 1.15 }}
            animate={{ opacity: 1, scale: zoomIn ? 1.12 : 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 7, ease: 'linear', opacity: { duration: 1.5, ease: 'easeInOut' } }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={images[currentIndex]}
              alt="LA Luxury Estate"
              className="w-full h-full object-cover object-center"
              style={{ imageRendering: 'auto', WebkitFontSmoothing: 'antialiased' }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 z-10">
        <p className="text-[#C9A961] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[0.65rem] sm:text-xs mb-4 sm:mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
          LA's Luxury Real Estate
        </p>
        <h1
          className="text-[#F5F1E8] mb-4 sm:mb-6"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(2.5rem, 9vw, 8rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.02em'
          }}
        >
          The Louvet Group
        </h1>
        <p className="text-[#F5F1E8] text-sm sm:text-lg mb-8 sm:mb-12 max-w-2xl px-4" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, letterSpacing: '0.05em' }}>
          Curating LA's Most Distinguished Estates
        </p>
        <Link
          to="/properties"
          className="px-6 sm:px-10 py-3 sm:py-4 border border-[#C9A961] text-[#C9A961] tracking-[0.1em] sm:tracking-[0.15em] uppercase text-xs sm:text-sm hover:bg-[#C9A961]/10 transition-all duration-300"
        >
          View Exclusive Listings
        </Link>
      </div>
    </section>
  );
}
