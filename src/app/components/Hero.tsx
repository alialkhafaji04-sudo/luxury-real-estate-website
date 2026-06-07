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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 45% at 50% 55%, rgba(0,0,0,0.55), transparent 70%)'
          }}
        />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 z-10">
        <h1
          className="text-[#F5F1E8] mb-4 sm:mb-6"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(2.5rem, 9vw, 8rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 16px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)'
          }}
        >
          The Louvet Group
        </h1>
        <div className="mb-8 sm:mb-12 space-y-2 sm:space-y-3 px-4">
          <p className="text-[#F5F1E8] text-lg sm:text-2xl tracking-[0.08em] sm:tracking-[0.12em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            Beverly &amp; Co. Luxury Properties
          </p>
          <p className="text-[#C9A961] uppercase text-xs sm:text-sm tracking-[0.18em] sm:tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.75)' }}>
            5 Billion in Sales Volume
          </p>
        </div>

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
