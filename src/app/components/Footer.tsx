import { Link, useLocation, useNavigate } from 'react-router';
import { Instagram, Facebook, Linkedin, Phone } from 'lucide-react';
import { COMPANY_INFO } from './Contact';

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#C9A961]/20">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        {/* Phone and Home Search moved from header */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 pb-12 border-b border-[#C9A961]/20">
          <a href={`tel:${COMPANY_INFO.phone.replace(/-/g, '')}`} className="flex items-center gap-2 text-[#F5F1E8] hover:text-[#C9A961] transition-colors">
            <Phone size={16} className="text-[#C9A961]" />
            <span className="text-sm tracking-wider">{COMPANY_INFO.phone}</span>
          </a>
          <Link
            to="/properties"
            className="px-8 py-3 border border-[#C9A961] text-[#C9A961] text-sm tracking-wider uppercase hover:bg-[#C9A961] hover:text-[#0A0A0A] transition-all duration-300"
          >
            Home Search
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/">
              <img
                src="/logo.png"
                alt="The Louvet Group"
                className="h-12 w-auto mb-6"
              />
            </Link>
            <p className="text-[#F5F1E8]/60 text-sm leading-relaxed">
              LA's luxury real estate specialists with over 30 years of experience serving discerning clients since {COMPANY_INFO.yearFounded}.
            </p>
            <div className="mt-6 text-[#F5F1E8]/50 text-xs">
              DRE #{COMPANY_INFO.dre}
            </div>
          </div>

          <div>
            <h4 className="text-[#F5F1E8] uppercase tracking-widest text-xs mb-6">Listings</h4>
            <ul className="space-y-3 text-[#F5F1E8]/60 text-sm">
              <li>
                <Link to="/properties" className="hover:text-[#C9A961] transition-colors">
                  For Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F5F1E8] uppercase tracking-widest text-xs mb-6">Neighborhoods</h4>
            <ul className="space-y-3 text-[#F5F1E8]/60 text-sm">
              <li>
                <Link to="/neighborhoods/marina-del-rey" className="hover:text-[#C9A961] transition-colors">
                  Marina Del Rey
                </Link>
              </li>
              <li>
                <Link to="/neighborhoods/beverly-hills" className="hover:text-[#C9A961] transition-colors">
                  Beverly Hills
                </Link>
              </li>
              <li>
                <Link to="/neighborhoods/bel-air" className="hover:text-[#C9A961] transition-colors">
                  Bel Air
                </Link>
              </li>
              <li>
                <Link to="/neighborhoods/malibu" className="hover:text-[#C9A961] transition-colors">
                  Malibu
                </Link>
              </li>
              <li>
                <Link to="/neighborhoods/west-hollywood" className="hover:text-[#C9A961] transition-colors">
                  West Hollywood
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F5F1E8] uppercase tracking-widest text-xs mb-6">About</h4>
            <ul className="space-y-3 text-[#F5F1E8]/60 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-[#C9A961] transition-colors cursor-pointer"
                >
                  Our Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#C9A961] transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="hover:text-[#C9A961] transition-colors cursor-pointer"
                >
                  Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-[#C9A961] transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#C9A961]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[#F5F1E8]/50 text-xs">
            © 2026 The Louvet Group. All rights reserved. | Equal Housing Opportunity
          </div>

          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/thelouvetgroup_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A961] hover:text-[#8B7340] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/Louvet.Group/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A961] hover:text-[#8B7340] transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.linkedin.com/company/the-louvet-group/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A961] hover:text-[#8B7340] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
