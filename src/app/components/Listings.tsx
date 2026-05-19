import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { getFeaturedProperties } from '../../data/properties';

export function Listings() {
  const properties = getFeaturedProperties(6);

  return (
    <section className="relative py-16 sm:py-32 overflow-hidden">
      {/* Background with white and black */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#F5F1E8] to-[#141414]" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>Exclusive Listings</p>
          <h2
            className="text-[#F5F1E8]"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              fontVariantNumeric: 'lining-nums'
            }}
          >
            Featured Properties
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-16">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-[#C9A961] hover:text-[#8B7340] transition-colors group"
          >
            <span className="tracking-wider text-sm">View All Properties</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
