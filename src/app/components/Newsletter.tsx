import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '2bd05a18-6fa6-48dc-a5ab-697dc6a30897',
          to_email: 'support@thelouvetgroup.com',
          subject: 'New Newsletter Signup - The Louvet Group',
          email: email,
          message: `New newsletter signup request:\n\nEmail: ${email}\nDate: ${new Date().toLocaleString()}`,
        }),
      });

      if (response.ok) {
        toast.success('Welcome to our private list! You will receive exclusive updates soon.');
        setIsSubscribed(true);
        setEmail('');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }

    setIsSubmitting(false);

    // Reset subscribed state after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <section className="bg-[#0A0A0A] py-20 border-t border-[#C9A961]/10">
      <div className="max-w-[1000px] mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3
              className="text-[#F5F1E8] mb-2"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.25rem', fontWeight: 300 }}
            >
              Join Our Private List
            </h3>
            <p className="text-[#F5F1E8]/60 text-sm tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
              Exclusive access to new listings and market insights
            </p>
          </div>

          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="flex items-center border-b border-[#C9A961]/30 focus-within:border-[#C9A961] transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS"
                disabled={isSubmitting}
                className="flex-1 bg-transparent py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none text-sm tracking-wider disabled:opacity-50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-[#C9A961] hover:text-[#8B7340] transition-colors p-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isSubscribed ? (
                  <Check size={20} className="text-green-500" />
                ) : (
                  <ArrowRight size={20} />
                )}
              </button>
            </form>
            <p className="mt-4 text-[#F5F1E8]/50 text-xs leading-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              By subscribing, you agree that we may use your email to send listing and market updates. Review our{' '}
              <Link to="/privacy-policy" className="text-[#C9A961] hover:text-[#8B7340] transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
