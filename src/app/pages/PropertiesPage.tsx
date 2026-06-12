import { useState } from 'react';
import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Newsletter } from '../components/Newsletter';
import { PropertyCard } from '../components/PropertyCard';
import { properties, Neighborhood } from '../../data/properties';
import { neighborhoods } from '../../data/neighborhoods';
import { ChevronDown } from 'lucide-react';

type FilterStatus = 'all' | 'FOR SALE' | 'FOR LEASE';
type SortOption = 'price-high' | 'price-low' | 'newest' | 'sqft';

export function PropertiesPage() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('price-high');

  const filteredProperties = properties
    .filter(p => selectedNeighborhood === 'all' || p.neighborhood === selectedNeighborhood)
    .filter(p => selectedStatus === 'all' || p.status === selectedStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'newest':
          return b.yearBuilt - a.yearBuilt;
        case 'sqft':
          return b.sqft - a.sqft;
        default:
          return 0;
      }
    });

  const neighborhoodOptions = [
    { slug: 'all' as const, name: 'All Neighborhoods' },
    ...neighborhoods.map((neighborhood) => ({
      slug: neighborhood.slug,
      name: neighborhood.name,
    })),
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Luxury Properties"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 max-w-[1600px] mx-auto px-8 text-center">
          <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
            Exclusive Listings
          </p>
          <h1
            className="text-[#F5F1E8] mb-6"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 300,
              lineHeight: 1.1
            }}
          >
            Our Properties
          </h1>
          <p className="text-[#F5F1E8]/70 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            Discover our curated collection of exceptional estates across Los Angeles' most prestigious neighborhoods.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-[#C9A961]/20">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Neighborhood Filter */}
              <div className="relative">
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value as Neighborhood | 'all')}
                  className="appearance-none bg-transparent border border-[#C9A961]/30 px-6 py-3 pr-12 text-[#F5F1E8] text-sm tracking-wider cursor-pointer hover:border-[#C9A961] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {neighborhoodOptions.map((neighborhood) => (
                    <option key={neighborhood.slug} value={neighborhood.slug} className="bg-[#0A0A0A]">
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A961] pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
                  className="appearance-none bg-transparent border border-[#C9A961]/30 px-6 py-3 pr-12 text-[#F5F1E8] text-sm tracking-wider cursor-pointer hover:border-[#C9A961] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <option value="all" className="bg-[#0A0A0A]">All Status</option>
                  <option value="FOR SALE" className="bg-[#0A0A0A]">For Sale</option>
                  <option value="FOR LEASE" className="bg-[#0A0A0A]">For Lease</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A961] pointer-events-none" />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <span className="text-[#F5F1E8]/60 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {filteredProperties.length} Properties
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-transparent border border-[#C9A961]/30 px-6 py-3 pr-12 text-[#F5F1E8] text-sm tracking-wider cursor-pointer hover:border-[#C9A961] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <option value="price-high" className="bg-[#0A0A0A]">Price: High to Low</option>
                  <option value="price-low" className="bg-[#0A0A0A]">Price: Low to High</option>
                  <option value="newest" className="bg-[#0A0A0A]">Newest</option>
                  <option value="sqft" className="bg-[#0A0A0A]">Square Feet</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C9A961] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-8">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#F5F1E8]/60 text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No properties match your current filters.
              </p>
              <button
                onClick={() => {
                  setSelectedNeighborhood('all');
                  setSelectedStatus('all');
                }}
                className="mt-6 text-[#C9A961] hover:text-[#8B7340] transition-colors text-sm tracking-wider"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-[#C9A961]/20">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <h2
            className="text-[#F5F1E8] mb-6"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 300
            }}
          >
            Looking for Something Specific?
          </h2>
          <p className="text-[#F5F1E8]/70 mb-8" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            Many of our finest properties are available exclusively off-market. Contact us to discuss your requirements.
          </p>
          <Link
            to="/#contact"
            className="inline-block px-10 py-4 border border-[#C9A961] text-[#C9A961] tracking-[0.15em] uppercase text-sm hover:bg-[#C9A961]/10 transition-all duration-300"
          >
            Contact Our Team
          </Link>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
