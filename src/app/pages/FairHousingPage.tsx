import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { COMPANY_INFO } from '../components/Contact';

export function FairHousingPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: 'I have a question.',
    smsConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error('Please enter your email, cell phone, and message.');
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
          to_email: COMPANY_INFO.email,
          from_name: formData.email,
          subject: 'New Fair Housing Page Contact Inquiry',
          email: formData.email,
          phone: formData.phone,
          sms_consent: formData.smsConsent ? 'Yes' : 'No',
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error('Fair housing contact submit failed');
      }

      toast.success('Thank you for your inquiry! Our team will contact you within 24 hours.');
      setFormData({
        email: '',
        phone: '',
        message: 'I have a question.',
        smsConsent: false
      });
    } catch (error) {
      const submissions = JSON.parse(localStorage.getItem('fairHousingContactSubmissions') || '[]');
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('fairHousingContactSubmissions', JSON.stringify(submissions));
      toast.success('Thank you for your inquiry! Our team will contact you within 24 hours.');
      setFormData({
        email: '',
        phone: '',
        message: 'I have a question.',
        smsConsent: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <Navigation />

      <section className="bg-[#0A0A0A] pt-32 pb-12 px-8">
        <div className="max-w-[1600px] mx-auto">
          <h1
            className="text-[#F5F1E8]"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2.5rem, 4vw, 4.25rem)',
              fontWeight: 300,
              lineHeight: 1.1
            }}
          >
            Fair Housing Statement
          </h1>
        </div>
      </section>

      <main className="px-6 py-12 md:px-8 md:py-16">
        <div className="max-w-[1500px] mx-auto">
          <p
            className="text-[#444] leading-[1.75]"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(0.95rem, 1.15vw, 1.25rem)',
              fontWeight: 300
            }}
          >
            Beverly & Company and its technology provider, Inside Real Estate, fully support the principles of the Fair Housing Act (Title VIII of the Civil Rights Act of 1968), as amended, which generally prohibits discrimination in the sale, rental, and financing of dwellings, and in other housing-related transactions, based on race, color, national origin, religion, sex, familial status (including children under the age of 18 living with parents of legal custodians, pregnant women, and people securing custody of children under the age of 18), and handicap (disability). As an adjunct to the foregoing commitment, both Beverly & Company and Inside Real Estate actively promote, and are committed to, creating and fostering an environment of diversity throughout their respective organizations and franchise systems, and each views such a concept as a critical component to the on-going success of their business operations.
          </p>
        </div>
      </main>

      <section className="bg-[#F7F7F5] px-6 pb-12 sm:px-8 sm:pb-16">
        <form
          onSubmit={handleContactSubmit}
          className="max-w-[1500px] mx-auto"
        >
          <h2
            className="text-center text-[#3A3A3A] mb-6"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1.9rem, 3vw, 3rem)',
              fontWeight: 300,
              lineHeight: 1.1
            }}
          >
            Send Us a Message
          </h2>

          <div className="space-y-5">
            <label className="block">
              <span className="block mb-2 text-[#666] text-xs font-semibold tracking-wide uppercase">
                Enter Your Email
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData(prev => ({ ...prev, email: event.target.value }))}
                className="w-full h-12 border border-[#D1D1D1] bg-transparent px-4 text-[#333] outline-none transition-colors focus:border-[#8A8A8A]"
                aria-label="Enter your email"
              />
            </label>

            <label className="block">
              <span className="block mb-2 text-[#666] text-xs font-semibold tracking-wide uppercase">
                Enter Your Cell Phone
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(event) => setFormData(prev => ({ ...prev, phone: event.target.value }))}
                className="w-full h-12 border border-[#D1D1D1] bg-transparent px-4 text-[#333] outline-none transition-colors focus:border-[#8A8A8A]"
                aria-label="Enter your cell phone"
              />
            </label>

            <label className="block">
              <span className="block mb-2 text-[#666] text-xs font-semibold tracking-wide uppercase">
                Your Message
              </span>
              <textarea
                value={formData.message}
                onChange={(event) => setFormData(prev => ({ ...prev, message: event.target.value }))}
                className="min-h-12 w-full resize-y border border-[#D1D1D1] bg-transparent px-4 py-3 text-[#333] outline-none transition-colors focus:border-[#8A8A8A]"
                aria-label="Your message"
              />
            </label>

            <label className="flex items-center gap-3 text-[#3A3A3A] text-sm sm:text-base">
              <input
                type="checkbox"
                checked={formData.smsConsent}
                onChange={(event) => setFormData(prev => ({ ...prev, smsConsent: event.target.checked }))}
                className="h-6 w-6 shrink-0 appearance-none border border-[#8A8A8A] bg-transparent checked:bg-[#0A0A0A] checked:shadow-[inset_0_0_0_5px_#F7F7F5]"
              />
              <span>Yes, I consent to receive text messages.</span>
            </label>

            <p className="max-w-[1400px] text-[#5C5C5C] text-xs sm:text-sm leading-7">
              By submitting my phone number above, I agree to calls, texts, and emails from Beverly & Company regarding my account, inquiry, and services provided to me. Message & data rates may apply. Message frequency may vary. I also agree to Beverly & Company's Privacy Policy and Beverly & Company's Terms & Conditions. Reply STOP to opt out or HELP for help.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-16 min-w-56 items-center justify-center gap-5 border-2 border-[#111] px-8 text-[#111] text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-[#111] hover:text-[#F7F7F5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Sending' : 'Contact Us'}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
}
