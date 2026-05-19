import { Link } from 'react-router';
import { Bed, Bath, Maximize } from 'lucide-react';
import { Property } from '../../data/properties';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="group cursor-pointer relative overflow-hidden border border-[#C9A961]/30 hover:border-[#C9A961] transition-all duration-500 block"
    >
      {/* Property Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.address}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status Tag */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 border border-[#C9A961] bg-black/40 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-1.5 text-[#C9A961] text-[0.55rem] sm:text-[0.65rem] tracking-[0.15em] sm:tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
          {property.status}
        </div>

        {/* Gradient fade to info panel */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
      </div>

      {/* Info Panel */}
      <div className="relative bg-gradient-to-b from-[#0A0A0A] to-[#050505] p-4 sm:p-6">
        {/* Address */}
        <div className="text-[#E8E4DC] uppercase text-[0.6rem] sm:text-[0.7rem] tracking-[0.15em] sm:tracking-[0.28em] mb-3 sm:mb-4 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
          {property.address}
        </div>

        {/* Gold Rule */}
        <div className="h-[1px] w-12 sm:w-16 bg-[#C9A961] mb-3 sm:mb-5" />

        {/* Price */}
        <div
          className="text-[#B8935A] mb-4 sm:mb-6 text-lg sm:text-[1.65rem]"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'lining-nums'
          }}
        >
          {property.priceFormatted}
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-[#C9A961]/20 mb-3 sm:mb-4" />

        {/* Specs */}
        <div className="flex items-center gap-3 sm:gap-6 text-[#E8E4DC]/80 text-[0.65rem] sm:text-xs mb-3 sm:mb-5" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
          <div className="flex items-center gap-1 sm:gap-2">
            <Bed size={12} className="text-[#B8935A]/50 sm:w-[14px] sm:h-[14px]" />
            <span className="uppercase tracking-wider">{property.beds} BD</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Bath size={12} className="text-[#B8935A]/50 sm:w-[14px] sm:h-[14px]" />
            <span className="uppercase tracking-wider">{property.baths} BA</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Maximize size={12} className="text-[#B8935A]/50 sm:w-[14px] sm:h-[14px]" />
            <span className="uppercase tracking-wider">{property.sqftFormatted} SF</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-[#C9A961] text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
          <span>View Details</span>
          <div className="w-8 h-[1px] bg-[#C9A961]" />
        </div>
      </div>
    </Link>
  );
}
