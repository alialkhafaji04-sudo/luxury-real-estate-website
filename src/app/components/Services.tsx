import { Search, Home, Shield } from 'lucide-react';
import { useState } from 'react';

export function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      icon: Search,
      number: '01',
      title: 'Buyer Representation',
      description: 'With 30+ years navigating the market, we leverage deep relationships with top agents and property owners to find estates before they hit the market. From initial search to closing, our team handles negotiations, inspections, and every detail in between.',
      highlight: 'White-Glove Service',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'
    },
    {
      icon: Home,
      number: '02',
      title: 'Seller Representation',
      description: 'We position your property to attract qualified buyers through professional staging, architectural photography, cinematic video tours, and targeted marketing to our network of high-net-worth clients and international investors. Discretion guaranteed for private listings.',
      highlight: 'Premium Marketing',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'
    },
    {
      icon: Shield,
      number: '03',
      title: 'Identity Protection',
      description: 'AI-driven privacy platform that erases your data from public brokers hackers rely on, monitors the dark web for threats, and masks your personal information. With LLC formation for asset protection and continuous security monitoring, it protects you and your family from doxxing, stalking, and digital threats long after closing.',
      highlight: 'Digital Privacy',
      image: '/privatus-dashboard.png',
      partnerLogo: '/privatus-logo.png'
    }
  ];

  return (
    <section className="bg-[#141414] py-16 sm:py-32 border-t border-[#C9A961]/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#141414] to-[#0A0A0A]" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-16">
          <div>
            <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>What We Offer</p>
            <h2
              className="text-[#F5F1E8] mb-4"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: '0.01em'
              }}
            >
              Comprehensive Luxury Services
            </h2>
            <p className="text-[#F5F1E8]/60 max-w-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              From acquisition to protection, we provide end-to-end service tailored to the unique needs of our clients.
            </p>
          </div>

        </div>

        {/* Service Tabs Navigation */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-10">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border transition-all duration-300 ${
                index === currentIndex
                  ? 'border-[#C9A961] bg-[#C9A961]/10'
                  : 'border-[#C9A961]/20 hover:border-[#C9A961]/60 hover:bg-[#C9A961]/5'
              }`}
            >
              <service.icon
                size={18}
                className={`transition-colors duration-300 flex-shrink-0 ${
                  index === currentIndex ? 'text-[#C9A961]' : 'text-[#C9A961]/50 group-hover:text-[#C9A961]'
                }`}
              />
              <span
                className={`text-xs sm:text-sm uppercase tracking-wider transition-colors duration-300 ${
                  index === currentIndex ? 'text-[#F5F1E8]' : 'text-[#F5F1E8]/50 group-hover:text-[#F5F1E8]'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              >
                {service.title}
              </span>
              <span
                className={`text-xs transition-colors duration-300 hidden sm:inline ${
                  index === currentIndex ? 'text-[#C9A961]' : 'text-[#C9A961]/30'
                }`}
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                {service.number}
              </span>
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-0 sm:px-2"
              >
                <div className="group relative bg-[#0A0A0A] border border-[#C9A961]/20 hover:border-[#C9A961] transition-all duration-500 overflow-hidden flex flex-col sm:flex-row">

                  {/* Left Content */}
                  <div className="relative z-10 w-full sm:w-[60%] p-5 sm:p-9">
                    <div className="flex items-start mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border border-[#C9A961]/40 flex items-center justify-center group-hover:border-[#C9A961] group-hover:bg-[#C9A961]/5 transition-all duration-300">
                        <service.icon size={24} className="text-[#C9A961]" />
                      </div>
                    </div>

                    <div className="mb-4 sm:mb-5">
                      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div className="h-[1px] w-10 sm:w-16 bg-[#C9A961]" />
                        <span className="text-[#C9A961] text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                          {service.highlight}
                        </span>
                      </div>
                      <h3
                        className="text-[#F5F1E8] mb-3 sm:mb-4 text-xl sm:text-[2.5rem]"
                        style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300 }}
                      >
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-[#F5F1E8]/70 leading-relaxed text-sm sm:text-lg mb-4 sm:mb-5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                      {service.description}
                    </p>

                    {service.partnerLogo && (
                      <div className="flex items-center gap-3 mt-4 sm:mt-6">
                        <span className="text-[#F5F1E8]/50 text-xs uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Powered by
                        </span>
                        <a
                          href="https://joinprivatus.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C9A961] text-sm tracking-wider hover:text-[#F5F1E8] transition-colors"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          joinprivatus.com
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Image Panel - Hidden on mobile */}
                  <div className={`relative w-full h-48 sm:h-auto sm:w-[40%] overflow-hidden ${service.partnerLogo ? 'bg-[#0A0A0A]' : ''}`}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className={service.partnerLogo
                        ? "absolute inset-0 w-full h-full object-cover object-left"
                        : "absolute inset-0 w-full h-full object-cover"}
                    />
                    {/* Black-to-transparent gradient on left edge */}
                    {!service.partnerLogo && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent w-32 hidden sm:block" />
                    )}

                    {/* Faded numeral over image */}
                    <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
                      <span
                        className="text-[#C9A961]/20 group-hover:text-[#C9A961]/40 transition-colors duration-300 text-4xl sm:text-[5rem]"
                        style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, lineHeight: 1 }}
                      >
                        {service.number}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
