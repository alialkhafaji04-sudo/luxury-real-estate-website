import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { neighborhoods as neighborhoodData } from '../../data/neighborhoods';

export function Neighborhoods() {
  // Use the actual neighborhood data, marking the first two as featured
  const displayNeighborhoods = neighborhoodData.map((n, index) => ({
    name: n.name,
    description: n.tagline,
    stats: n.stats.zipCodes || n.stats.highlight,
    image: n.image,
    slug: n.slug,
    featured: index < 2 // First two are featured (larger)
  }));

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#C9A961]/5 to-transparent pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-20">
          <div>
            <p className="text-[#C9A961] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[0.65rem] sm:text-xs mb-4 sm:mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>Communities We Serve</p>
            <h2
              className="text-[#F5F1E8]"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '0.01em'
              }}
            >
              Featured Neighborhoods
            </h2>
          </div>
          <div className="hidden lg:block">
            <p className="text-[#F5F1E8]/60 text-sm max-w-md" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              From the iconic hills to the Pacific coast, we specialize in LA's most prestigious addresses.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {displayNeighborhoods.map((neighborhood, index) => (
            <Link
              key={`${neighborhood.name}-${index}`}
              to={`/neighborhoods/${neighborhood.slug}`}
              className={`relative overflow-hidden group cursor-pointer ${
                neighborhood.featured
                  ? 'lg:col-span-6 aspect-[16/10]'
                  : 'lg:col-span-4 aspect-[4/3]'
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={neighborhood.image}
                  alt={neighborhood.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 transition-all duration-500" />

              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 border border-[#C9A961]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-[#C9A961]">
                <ArrowUpRight size={18} className="text-[#C9A961]" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
                <div className="border-l-2 border-[#C9A961] pl-4 sm:pl-6 mb-3 sm:mb-4">
                  <p className="text-[#C9A961]/80 text-[0.65rem] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] uppercase mb-1 sm:mb-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                    {neighborhood.stats}
                  </p>
                </div>

                <h3
                  className="text-[#F5F1E8] mb-2 sm:mb-3 group-hover:text-[#C9A961] transition-colors duration-300 text-2xl sm:text-[2.5rem]"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300 }}
                >
                  {neighborhood.name}
                </h3>

                <p className="text-[#F5F1E8]/70 mb-3 sm:mb-4 max-w-md text-sm sm:text-[0.95rem] line-clamp-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  {neighborhood.description}
                </p>

                <div className="flex items-center gap-2 text-[#C9A961] text-xs sm:text-sm tracking-wider sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                  <span>Explore Properties</span>
                  <div className="w-6 sm:w-8 h-[1px] bg-[#C9A961]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
