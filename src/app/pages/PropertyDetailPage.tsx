import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Newsletter } from '../components/Newsletter';
import { PropertyCard } from '../components/PropertyCard';
import { getPropertyById, getPropertiesByNeighborhood, Property } from '../../data/properties';
import { getNeighborhoodBySlug } from '../../data/neighborhoods';
import { COMPANY_INFO } from '../components/Contact';
import { ArrowLeft, Bed, Bath, Maximize, Calendar, MapPin, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = getPropertyById(id || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${property?.address || 'this property'}. Please contact me with more information.`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navigation />
        <div className="pt-40 pb-20 text-center">
          <h1 className="text-[#F5F1E8] text-3xl mb-6" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
            Property Not Found
          </h1>
          <Link
            to="/properties"
            className="text-[#C9A961] hover:text-[#8B7340] transition-colors"
          >
            View All Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const neighborhoodInfo = getNeighborhoodBySlug(property.neighborhood);
  const similarProperties = getPropertiesByNeighborhood(property.neighborhood)
    .filter(p => p.id !== property.id)
    .slice(0, 3);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try to send email via Web3Forms
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '2bd05a18-6fa6-48dc-a5ab-697dc6a30897',
          to_email: COMPANY_INFO.email,
          from_name: formData.name,
          subject: `Property Inquiry: ${property.address}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          property_address: property.address,
          property_id: property.id,
          property_price: property.priceFormatted,
          message: formData.message,
        }),
      });
      // If email fails, store locally as backup
      if (!response.ok) throw new Error('Email failed');
    } catch {
      // Store inquiry in localStorage as backup
      const inquiries = JSON.parse(localStorage.getItem('propertyInquiries') || '[]');
      inquiries.push({
        ...formData,
        propertyId: property.id,
        propertyAddress: property.address,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('propertyInquiries', JSON.stringify(inquiries));
    }

    toast.success('Thank you for your inquiry! Our team will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: `I'm interested in ${property.address}. Please contact me with more information.`
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Back Button */}
      <div className="pt-28 pb-4 max-w-[1600px] mx-auto px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#C9A961] hover:text-[#8B7340] transition-colors text-sm tracking-wider"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Listings</span>
        </button>
      </div>

      {/* Image Gallery */}
      <section className="pb-12">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="relative aspect-[16/9] overflow-hidden cursor-pointer bg-black" onClick={() => setIsGalleryOpen(true)}>
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.address} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-[#C9A961]/60 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-[#C9A961] hover:bg-black/60 transition-all duration-300"
            >
              <ChevronLeft size={24} className="text-[#C9A961]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-[#C9A961]/60 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-[#C9A961] hover:bg-black/60 transition-all duration-300"
            >
              <ChevronRight size={24} className="text-[#C9A961]" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm text-[#F5F1E8] text-sm tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {currentImageIndex + 1} / {property.images.length}
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 border border-[#C9A961] bg-black/60 backdrop-blur-sm px-4 py-2 text-[#C9A961] text-xs tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
              {property.status}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-24 h-16 overflow-hidden border-2 transition-all duration-300 ${
                  index === currentImageIndex ? 'border-[#C9A961]' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Info */}
      <section className="py-12">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-[#C9A961] text-sm tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <MapPin size={16} />
                  <Link to={`/neighborhoods/${property.neighborhood}`} className="hover:text-[#8B7340] transition-colors">
                    {neighborhoodInfo?.name || property.neighborhood}
                  </Link>
                </div>
                <h1
                  className="text-[#F5F1E8] mb-4"
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 300,
                    lineHeight: 1.1
                  }}
                >
                  {property.address}
                </h1>
                <div
                  className="text-[#C9A961] mb-8"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                    fontWeight: 500
                  }}
                >
                  {property.priceFormatted}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-8 py-6 border-y border-[#C9A961]/20">
                  <div className="flex items-center gap-3 text-[#F5F1E8]">
                    <Bed size={20} className="text-[#C9A961]" />
                    <span className="text-lg">{property.beds} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F5F1E8]">
                    <Bath size={20} className="text-[#C9A961]" />
                    <span className="text-lg">{property.baths} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F5F1E8]">
                    <Maximize size={20} className="text-[#C9A961]" />
                    <span className="text-lg">{property.sqftFormatted} SF</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#F5F1E8]">
                    <Calendar size={20} className="text-[#C9A961]" />
                    <span className="text-lg">Built {property.yearBuilt}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2
                  className="text-[#F5F1E8] mb-6"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}
                >
                  About This Property
                </h2>
                <p className="text-[#F5F1E8]/80 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h2
                  className="text-[#F5F1E8] mb-6"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}
                >
                  Property Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-[#F5F1E8]/80">
                      <Check size={16} className="text-[#C9A961] flex-shrink-0" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neighborhood */}
              {neighborhoodInfo && (
                <div className="p-8 border border-[#C9A961]/20 bg-[#141414]">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[#C9A961] text-xs tracking-[0.2em] uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Neighborhood
                      </p>
                      <h3
                        className="text-[#F5F1E8] mb-3"
                        style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.75rem', fontWeight: 300 }}
                      >
                        {neighborhoodInfo.name}
                      </h3>
                      <p className="text-[#F5F1E8]/70 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                        {neighborhoodInfo.tagline}
                      </p>
                      <Link
                        to={`/neighborhoods/${property.neighborhood}`}
                        className="inline-flex items-center gap-2 text-[#C9A961] hover:text-[#8B7340] transition-colors text-sm tracking-wider"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <span>Explore {neighborhoodInfo.name}</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                    <div className="hidden md:block w-32 h-32 flex-shrink-0 overflow-hidden">
                      <img
                        src={neighborhoodInfo.image}
                        alt={neighborhoodInfo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-8 border border-[#C9A961]/20 bg-[#141414]">
                <h3
                  className="text-[#F5F1E8] mb-2"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.75rem', fontWeight: 300 }}
                >
                  Schedule a Viewing
                </h3>
                <p className="text-[#F5F1E8]/60 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Contact us for a private showing of this exceptional property.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="NAME *"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-transparent border-b border-[#C9A961]/30 py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none focus:border-[#C9A961] transition-colors text-sm tracking-wider"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <input
                    type="email"
                    placeholder="EMAIL *"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent border-b border-[#C9A961]/30 py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none focus:border-[#C9A961] transition-colors text-sm tracking-wider"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <input
                    type="tel"
                    placeholder="PHONE *"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-transparent border-b border-[#C9A961]/30 py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none focus:border-[#C9A961] transition-colors text-sm tracking-wider"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <textarea
                    placeholder="MESSAGE"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full bg-transparent border-b border-[#C9A961]/30 py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none focus:border-[#C9A961] transition-colors text-sm tracking-wider resize-none"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <p className="text-[#F5F1E8]/50 text-xs leading-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                    By submitting this inquiry, you agree that we may use your information to respond about this property. Review our{' '}
                    <Link to="/privacy-policy" className="text-[#C9A961] hover:text-[#8B7340] transition-colors">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link to="/agency-disclosure" className="text-[#C9A961] hover:text-[#8B7340] transition-colors">
                      Agency Disclosure
                    </Link>.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C9A961] text-[#0A0A0A] py-4 tracking-[0.15em] uppercase text-sm hover:bg-[#8B7340] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Request Information'}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#C9A961]/20 text-center">
                  <p className="text-[#F5F1E8]/60 text-xs mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Or call us directly
                  </p>
                  <a
                    href={`tel:${COMPANY_INFO.phone.replace(/-/g, '')}`}
                    className="text-[#C9A961] text-lg hover:text-[#8B7340] transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {COMPANY_INFO.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-20 border-t border-[#C9A961]/20">
          <div className="max-w-[1600px] mx-auto px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  More in {neighborhoodInfo?.name}
                </p>
                <h2
                  className="text-[#F5F1E8]"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 300 }}
                >
                  Similar Properties
                </h2>
              </div>
              <Link
                to={`/neighborhoods/${property.neighborhood}`}
                className="hidden md:flex items-center gap-2 text-[#C9A961] hover:text-[#8B7340] transition-colors text-sm tracking-wider"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span>View All</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 border border-[#C9A961]/60 flex items-center justify-center hover:border-[#C9A961] hover:bg-white/5 transition-all duration-300"
          >
            <X size={24} className="text-[#C9A961]" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-[#C9A961]/60 flex items-center justify-center hover:border-[#C9A961] hover:bg-white/5 transition-all duration-300"
          >
            <ChevronLeft size={24} className="text-[#C9A961]" />
          </button>

          <img
            src={property.images[currentImageIndex]}
            alt={`${property.address} - Image ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 border border-[#C9A961]/60 flex items-center justify-center hover:border-[#C9A961] hover:bg-white/5 transition-all duration-300"
          >
            <ChevronRight size={24} className="text-[#C9A961]" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#F5F1E8] text-sm tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>
      )}

      <Newsletter />
      <Footer />
    </div>
  );
}
