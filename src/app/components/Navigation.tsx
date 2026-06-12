import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ChevronDown, Menu, X } from 'lucide-react';
import { neighborhoods } from '../../data/neighborhoods';

function LogoMonogram({ className }: { className: string }) {
  return (
    <img
      src="/tlg-lettermark.png"
      alt="TLG"
      className={`${className} object-contain`}
    />
  );
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const propertiesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (propertiesRef.current && !propertiesRef.current.contains(event.target as Node)) {
        setPropertiesDropdownOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setPropertiesDropdownOpen(false);
    setAboutDropdownOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle hash navigation after page load
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-sm' : 'bg-transparent'
        } ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-8 py-6">
          <div className="hidden lg:flex items-center justify-between">
            {/* Left Navigation */}
            <div className="flex-1 flex items-center gap-12">
              {/* Properties Dropdown */}
              <div className="relative" ref={propertiesRef}>
                <div
                  className="flex items-center gap-2 text-[#F5F1E8] uppercase tracking-[0.2em] text-xs cursor-pointer hover:text-[#C9A961] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
                  onClick={() => setPropertiesDropdownOpen(!propertiesDropdownOpen)}
                >
                  <span>Properties</span>
                  <ChevronDown size={14} className={`transition-transform ${propertiesDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {propertiesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-4 w-56 bg-[#0A0A0A]/95 backdrop-blur-sm border border-[#C9A961]/20 py-2">
                    <Link
                      to="/properties"
                      className="block px-6 py-3 text-[#F5F1E8] text-xs tracking-wider hover:text-[#C9A961] hover:bg-[#C9A961]/5 transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      All Properties
                    </Link>
                    <div className="h-[1px] bg-[#C9A961]/10 my-2" />
                    <p className="px-6 py-2 text-[#C9A961] text-[0.65rem] tracking-[0.2em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      By Neighborhood
                    </p>
                    {neighborhoods.map((n) => (
                      <Link
                        key={n.slug}
                        to={`/neighborhoods/${n.slug}`}
                        className="block px-6 py-3 text-[#F5F1E8] text-xs tracking-wider hover:text-[#C9A961] hover:bg-[#C9A961]/5 transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {n.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollToSection('services')}
                className="flex items-center gap-2 text-[#F5F1E8] uppercase tracking-[0.2em] text-xs cursor-pointer hover:text-[#C9A961] transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              >
                Services
              </button>
            </div>

            {/* Center Logo Lockup */}
            <Link to="/" className="flex flex-col items-center">
              <LogoMonogram className="w-[5rem] h-[2.5rem] mb-1" />
              <div className="text-[#F5F1E8] tracking-[0.25em] text-xs mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                THE LOUVET GROUP
              </div>
              <div className="text-[#C9A961] uppercase tracking-[0.22em] text-[0.62rem]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                LA's Luxury Real Estate
              </div>
            </Link>

            {/* Right Navigation */}
            <div className="flex-1 flex items-center justify-end gap-12">
              {/* About Dropdown */}
              <div className="relative" ref={aboutRef}>
                <div
                  className="flex items-center gap-2 text-[#C9A961] uppercase tracking-[0.2em] text-xs cursor-pointer hover:text-[#8B7340] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                >
                  <span>About</span>
                  <ChevronDown size={14} className={`transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {aboutDropdownOpen && (
                  <div className="absolute top-full right-0 mt-4 w-48 bg-[#0A0A0A]/95 backdrop-blur-sm border border-[#C9A961]/20 py-2">
                    <button
                      onClick={() => { scrollToSection('about'); setAboutDropdownOpen(false); }}
                      className="block w-full text-left px-6 py-3 text-[#F5F1E8] text-xs tracking-wider hover:text-[#C9A961] hover:bg-[#C9A961]/5 transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Our Team
                    </button>
                    <button
                      onClick={() => { scrollToSection('sold-properties'); setAboutDropdownOpen(false); }}
                      className="block w-full text-left px-6 py-3 text-[#F5F1E8] text-xs tracking-wider hover:text-[#C9A961] hover:bg-[#C9A961]/5 transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Recent Significant Sales
                    </button>
                    <button
                      onClick={() => { scrollToSection('services'); setAboutDropdownOpen(false); }}
                      className="block w-full text-left px-6 py-3 text-[#F5F1E8] text-xs tracking-wider hover:text-[#C9A961] hover:bg-[#C9A961]/5 transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Our Services
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollToSection('neighborhoods')}
                className="text-[#F5F1E8] uppercase tracking-[0.2em] text-xs cursor-pointer hover:text-[#C9A961] transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              >
                Communities
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="text-[#F5F1E8] uppercase tracking-[0.2em] text-xs cursor-pointer hover:text-[#C9A961] transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between">
            <Link to="/" className="flex flex-col">
              <LogoMonogram className="w-[3.8rem] h-[1.9rem]" />
              <div className="text-[#F5F1E8] tracking-[0.2em] text-[0.65rem]" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                THE LOUVET GROUP
              </div>
              <div className="text-[#C9A961] uppercase tracking-[0.14em] text-[0.48rem] mt-1" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                LA's Luxury Real Estate
              </div>
            </Link>
            <button
              className="text-[#C9A961]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] pt-24 lg:hidden overflow-y-auto">
          <div className="flex flex-col items-center space-y-8 px-8 pb-12">
            <ul className="flex flex-col items-center gap-8 uppercase tracking-[0.2em] text-sm text-[#F5F1E8]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <li>
                <Link
                  to="/properties"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#C9A961] transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="hover:text-[#C9A961] transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="text-[#C9A961]">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('neighborhoods')} className="hover:text-[#C9A961] transition-colors">
                  Communities
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="hover:text-[#C9A961] transition-colors">
                  Contact
                </button>
              </li>
            </ul>

            {/* Neighborhoods in mobile */}
            <div className="w-full border-t border-[#C9A961]/20 pt-8">
              <p className="text-[#C9A961] text-[0.65rem] tracking-[0.2em] uppercase text-center mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Neighborhoods
              </p>
              <div className="grid grid-cols-2 gap-4">
                {neighborhoods.map((n) => (
                  <Link
                    key={n.slug}
                    to={`/neighborhoods/${n.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center text-[#F5F1E8]/80 text-sm hover:text-[#C9A961] transition-colors py-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
