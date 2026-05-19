import React from 'react';
import { Bed, Bath, Maximize } from 'lucide-react';

function PropertyCard({ address, price, bedrooms, bathrooms, sqft }: {
  address: string;
  price: string;
  bedrooms?: number;
  bathrooms: number;
  sqft: string;
}) {
  return (
    <div className="group bg-[#0A0A0A]/90 backdrop-blur-sm overflow-hidden border border-[#C9A961]/20 hover:border-[#C9A961]/40 transition-all duration-300">
      <div className="p-3 sm:p-4 bg-gradient-to-b from-[#0A0A0A]/95 to-[#0A0A0A]">
        <h4
          className="text-[#F5F1E8] mb-1.5 sm:mb-2 uppercase leading-tight text-[0.75rem] sm:text-[0.9rem] line-clamp-1"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, letterSpacing: '0.03em' }}
        >
          {address}
        </h4>
        <p className="text-[#C9A961] text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {price}
        </p>

        <div className="space-y-1 sm:space-y-1.5 text-[0.55rem] sm:text-[0.65rem] text-[#F5F1E8]/70">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <Bed size={10} className="text-[#C9A961]" />
                <span>{bedrooms} Bed</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Bath size={10} className="text-[#C9A961]" />
              <span>{bathrooms} Bath</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={10} className="text-[#C9A961]" />
            <span>{sqft} SF</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SoldProperties() {
  const soldProperties = [
    {
      address: 'Beverly Grove',
      price: '$23,995,000',
      bedrooms: 6,
      bathrooms: 10,
      sqft: '10,485'
    },
    {
      address: '1302 Collingwood Pl',
      price: '$23,995,000',
      bedrooms: 9,
      bathrooms: 8,
      sqft: '9,467'
    },
    {
      address: '1111 Calle Vista Dr',
      price: '$38,000,000',
      bedrooms: 7,
      bathrooms: 9,
      sqft: '10,286'
    },
    {
      address: '1199 Thrasher Ave',
      price: '$38,000,000',
      bedrooms: 5,
      bathrooms: 9,
      sqft: '11,127'
    },
    {
      address: '9719 Heather Rd',
      price: '$17,000,000',
      bedrooms: 5,
      bathrooms: 8,
      sqft: '10,050'
    },
    {
      address: '729 N. Bedford Dr',
      price: '$17,100,000',
      bedrooms: 8,
      bathrooms: 11,
      sqft: '8,046'
    },
    {
      address: '712 N. Maple Dr',
      price: '$18,500,000',
      bedrooms: 5,
      bathrooms: 6,
      sqft: '8,290'
    },
    {
      address: '1814 N. Doheny Dr',
      price: '$23,950,000',
      bedrooms: 8,
      bathrooms: 7,
      sqft: '7,000'
    }
  ];

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <h3
            className="text-[#F5F1E8] uppercase"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1.75rem, 5vw, 4rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '0.05em'
            }}
          >
            RECENT SIGNIFICANT SALES
          </h3>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {soldProperties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
}
