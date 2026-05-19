import { useParams, Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Newsletter } from '../components/Newsletter';
import { PropertyCard } from '../components/PropertyCard';
import { getNeighborhoodBySlug, neighborhoods } from '../../data/neighborhoods';
import { getPropertiesByNeighborhood, Neighborhood } from '../../data/properties';
import { MapPin, Home, TrendingUp, Check, ArrowRight } from 'lucide-react';

export function NeighborhoodPage() {
  const { slug } = useParams<{ slug: string }>();
  const neighborhood = getNeighborhoodBySlug(slug || '');
  const properties = getPropertiesByNeighborhood(slug as Neighborhood);

  if (!neighborhood) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navigation />
        <div className="pt-40 pb-20 text-center">
          <h1 className="text-[#F5F1E8] text-3xl mb-6" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Neighborhood Not Found
          </h1>
          <Link
            to="/"
            className="text-[#C9A961] hover:text-[#8B7340] transition-colors"
          >
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const forSaleCount = properties.filter(p => p.status === 'FOR SALE').length;
  const forLeaseCount = properties.filter(p => p.status === 'FOR LEASE').length;
  const otherNeighborhoods = neighborhoods.filter(n => n.slug !== slug);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={neighborhood.heroImage}
            alt={neighborhood.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/30" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-16 max-w-[1600px] mx-auto px-8">
          <div className="flex items-center gap-2 text-[#C9A961] text-sm tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <MapPin size={16} />
            <span>Los Angeles, California</span>
          </div>
          <h1
            className="text-[#F5F1E8] mb-4"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 300,
              lineHeight: 1
            }}
          >
            {neighborhood.name}
          </h1>
          <p
            className="text-[#C9A961] text-xl md:text-2xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300 }}
          >
            {neighborhood.tagline}
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-b border-[#C9A961]/20 bg-[#141414]">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-8 md:gap-12">
              <div className="flex items-center gap-3">
                <TrendingUp size={20} className="text-[#C9A961]" />
                <div>
                  <p className="text-[#F5F1E8]/60 text-xs tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Avg. Price
                  </p>
                  <p className="text-[#F5F1E8] text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {neighborhood.stats.avgPrice}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Home size={20} className="text-[#C9A961]" />
                <div>
                  <p className="text-[#F5F1E8]/60 text-xs tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Active Listings
                  </p>
                  <p className="text-[#F5F1E8] text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {properties.length} Properties
                  </p>
                </div>
              </div>
              {neighborhood.stats.zipCodes && (
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-[#C9A961]" />
                  <div>
                    <p className="text-[#F5F1E8]/60 text-xs tracking-wider uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Zip Codes
                    </p>
                    <p className="text-[#F5F1E8] text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                      {neighborhood.stats.zipCodes}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 py-2 border border-[#C9A961]/40 text-[#C9A961] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {neighborhood.stats.highlight}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                About the Area
              </p>
              <h2
                className="text-[#F5F1E8] mb-8"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 300,
                  lineHeight: 1.2
                }}
              >
                Discover {neighborhood.name}
              </h2>
              <p className="text-[#F5F1E8]/80 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                {neighborhood.description}
              </p>
            </div>

            <div>
              <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Neighborhood Highlights
              </p>
              <div className="space-y-4">
                {neighborhood.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border-l-2 border-[#C9A961]/30 hover:border-[#C9A961] transition-colors">
                    <Check size={18} className="text-[#C9A961] flex-shrink-0 mt-0.5" />
                    <span className="text-[#F5F1E8]/80" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Available Properties
              </p>
              <h2
                className="text-[#F5F1E8]"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 300
                }}
              >
                {neighborhood.name} Listings
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-[#F5F1E8]/60">{forSaleCount} For Sale</span>
              <span className="text-[#C9A961]">|</span>
              <span className="text-[#F5F1E8]/60">{forLeaseCount} For Lease</span>
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-[#C9A961]/20">
              <p className="text-[#F5F1E8]/60 text-lg mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No active listings at this time.
              </p>
              <Link
                to="/#contact"
                className="text-[#C9A961] hover:text-[#8B7340] transition-colors text-sm tracking-wider"
              >
                Contact us for off-market opportunities
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-[#C9A961] hover:text-[#8B7340] transition-colors text-sm tracking-wider group"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span>View All Properties</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Work With Us
          </p>
          <h2
            className="text-[#F5F1E8] mb-6"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300
            }}
          >
            Your {neighborhood.name} Experts
          </h2>
          <p className="text-[#F5F1E8]/70 mb-8 text-lg" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            With deep expertise in {neighborhood.name} real estate, our team provides unparalleled access to the finest properties, including exclusive off-market opportunities.
          </p>
          <Link
            to="/#contact"
            className="inline-block px-10 py-4 border border-[#C9A961] text-[#C9A961] tracking-[0.15em] uppercase text-sm hover:bg-[#C9A961]/10 transition-all duration-300"
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>

      {/* Other Neighborhoods */}
      <section className="py-20 border-t border-[#C9A961]/20">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="text-center mb-12">
            <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Explore More
            </p>
            <h2
              className="text-[#F5F1E8]"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300
              }}
            >
              Other Communities We Serve
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherNeighborhoods.map((n) => (
              <Link
                key={n.slug}
                to={`/neighborhoods/${n.slug}`}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={n.image}
                  alt={n.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3
                    className="text-[#F5F1E8] mb-2 group-hover:text-[#C9A961] transition-colors duration-300"
                    style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}
                  >
                    {n.name}
                  </h3>
                  <p className="text-[#F5F1E8]/70 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                    {n.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
