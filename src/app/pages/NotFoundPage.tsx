import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      <section className="min-h-[80vh] flex items-center justify-center px-8">
        <div className="text-center max-w-lg">
          <div className="text-[#C9A961] mb-6" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '8rem', fontWeight: 300, lineHeight: 1 }}>
            404
          </div>
          <h1
            className="text-[#F5F1E8] mb-4"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '2.5rem',
              fontWeight: 300
            }}
          >
            Page Not Found
          </h1>
          <p className="text-[#F5F1E8]/60 mb-8" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#C9A961] text-[#C9A961] tracking-[0.15em] uppercase text-sm hover:bg-[#C9A961]/10 transition-all duration-300"
            >
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A961] text-[#0A0A0A] tracking-[0.15em] uppercase text-sm hover:bg-[#8B7340] transition-all duration-300"
            >
              <span>View Properties</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
