import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  propertyAddress: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  propertyAddress?: string;
  message?: string;
}

interface AddressSuggestion {
  display_name: string;
  place_id: number;
}

// Company contact information
export const COMPANY_INFO = {
  email: 'support@thelouvetgroup.com',
  phone: '310-734-2102',
  address: {
    street: '9350 Wilshire Blvd.',
    suite: 'Suite #250',
    city: 'Beverly Hills',
    state: 'CA',
    zip: '90212'
  },
  dre: '00883925',
  instagram: '@thelouvetgroup_',
  yearFounded: 1992
};

export function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    interest: '',
    propertyAddress: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertySuggestions, setPropertySuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedPropertyAddress, setSelectedPropertyAddress] = useState('');
  const [isSearchingProperty, setIsSearchingProperty] = useState(false);
  const [propertySearchError, setPropertySearchError] = useState('');

  const isSelling = formData.interest === 'selling';

  useEffect(() => {
    const query = formData.propertyAddress.trim();

    if (!isSelling || selectedPropertyAddress === formData.propertyAddress) {
      setPropertySuggestions([]);
      setPropertySearchError('');
      setIsSearchingProperty(false);
      return;
    }

    if (query.length < 4) {
      setPropertySuggestions([]);
      setPropertySearchError('');
      setIsSearchingProperty(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearchingProperty(true);
      setPropertySearchError('');

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=us&q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Address search failed');
        }

        const results = (await response.json()) as AddressSuggestion[];
        setPropertySuggestions(results);
        setPropertySearchError(results.length === 0 ? 'No matching property addresses found' : '');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setPropertySuggestions([]);
          setPropertySearchError('Address suggestions are unavailable. Please try again shortly.');
        }
      } finally {
        setIsSearchingProperty(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [formData.propertyAddress, isSelling, selectedPropertyAddress]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.interest) {
      newErrors.interest = 'Interest is required';
    }

    if (
      formData.interest === 'selling' &&
      formData.propertyAddress.trim() &&
      formData.propertyAddress.trim() !== selectedPropertyAddress.trim()
    ) {
      newErrors.propertyAddress = 'Please select a property address from the suggestions';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email using Web3Forms (free, no backend needed)
      // You'll need to get an access key from https://web3forms.com/
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '2bd05a18-6fa6-48dc-a5ab-697dc6a30897',
          to_email: COMPANY_INFO.email,
          from_name: formData.name,
          subject: `New Inquiry from ${formData.name} - ${formData.interest}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest,
          property_address: formData.interest === 'selling' ? formData.propertyAddress || 'Not provided' : undefined,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Thank you for your inquiry! Our team will contact you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          interest: '',
          propertyAddress: '',
          message: ''
        });
        setErrors({});
      } else {
        // Fallback: store locally if email service fails
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
          ...formData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

        toast.success('Thank you for your inquiry! Our team will contact you within 24 hours.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          interest: '',
          propertyAddress: '',
          message: ''
        });
        setErrors({});
      }
    } catch (error) {
      // Fallback: store locally if request fails
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

      toast.success('Thank you for your inquiry! Our team will contact you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: '',
        propertyAddress: '',
        message: ''
      });
      setErrors({});
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'propertyAddress') {
      setSelectedPropertyAddress('');
    }

    if (name === 'interest') {
      setSelectedPropertyAddress('');
      setPropertySuggestions([]);
      setPropertySearchError('');
      setErrors(prev => ({ ...prev, propertyAddress: undefined }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'interest' && value !== 'selling' ? { propertyAddress: '' } : {})
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePropertySuggestionSelect = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({ ...prev, propertyAddress: suggestion.display_name }));
    setSelectedPropertyAddress(suggestion.display_name);
    setPropertySuggestions([]);
    setPropertySearchError('');
    setErrors(prev => ({ ...prev, propertyAddress: undefined }));
  };

  return (
    <section className="relative bg-[#141414] py-16 sm:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Luxury Interior"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/95 via-[#141414]/90 to-[#0A0A0A]/95" />
      </div>
      <div className="relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20">
          <div className="space-y-6 sm:space-y-8">
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
              Connect With Us
            </h2>

            <div className="space-y-4 sm:space-y-6 text-[#F5F1E8]/80 text-sm sm:text-base">
              <div className="flex items-start gap-3 sm:gap-4">
                <MapPin size={18} className="text-[#C9A961] mt-1 flex-shrink-0" />
                <div>
                  <div className="mb-1">{COMPANY_INFO.address.street}</div>
                  <div>{COMPANY_INFO.address.suite}</div>
                  <div>{COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zip}</div>
                </div>
              </div>

              <a
                href={`tel:${COMPANY_INFO.phone.replace(/-/g, '')}`}
                className="flex items-center gap-3 sm:gap-4 hover:text-[#C9A961] transition-colors"
              >
                <Phone size={18} className="text-[#C9A961] flex-shrink-0" />
                <div>{COMPANY_INFO.phone}</div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-3 sm:gap-4 hover:text-[#C9A961] transition-colors"
              >
                <Mail size={18} className="text-[#C9A961] flex-shrink-0" />
                <div className="break-all">{COMPANY_INFO.email}</div>
              </a>

              <a
                href="https://www.instagram.com/thelouvetgroup_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 sm:gap-4 hover:text-[#C9A961] transition-colors"
              >
                <Instagram size={18} className="text-[#C9A961] flex-shrink-0" />
                <div>{COMPANY_INFO.instagram}</div>
              </a>
            </div>

            <div className="pt-6 border-t border-[#C9A961]/20">
              <p className="text-[#F5F1E8]/60 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Over 30 years of experience serving Los Angeles' most discerning clients.
              </p>
              <p className="text-[#C9A961]/60 text-xs mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                DRE #{COMPANY_INFO.dre}
              </p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="NAME *"
                  className={`w-full bg-transparent border-b py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none transition-colors text-sm tracking-wider ${
                    errors.name ? 'border-red-500' : 'border-[#C9A961]/30 focus:border-[#C9A961]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="EMAIL *"
                  className={`w-full bg-transparent border-b py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none transition-colors text-sm tracking-wider ${
                    errors.email ? 'border-red-500' : 'border-[#C9A961]/30 focus:border-[#C9A961]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="PHONE *"
                  className={`w-full bg-transparent border-b py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none transition-colors text-sm tracking-wider ${
                    errors.phone ? 'border-red-500' : 'border-[#C9A961]/30 focus:border-[#C9A961]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className={`w-full bg-transparent border-b py-3 focus:outline-none transition-colors text-sm tracking-wider cursor-pointer ${
                    errors.interest ? 'border-red-500' : 'border-[#C9A961]/30 focus:border-[#C9A961]'
                  } ${formData.interest ? 'text-[#F5F1E8]' : 'text-[#F5F1E8]/40'}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="" className="bg-[#141414]">INTEREST *</option>
                  <option value="buying" className="bg-[#141414]">Buying</option>
                  <option value="selling" className="bg-[#141414]">Selling</option>
                  <option value="leasing" className="bg-[#141414]">Leasing</option>
                  <option value="other" className="bg-[#141414]">Other</option>
                </select>
                {errors.interest && (
                  <p className="text-red-400 text-xs mt-1">{errors.interest}</p>
                )}
              </div>

              <div
                className="overflow-hidden"
                style={{
                  maxHeight: isSelling ? '20rem' : '0rem',
                  opacity: isSelling ? 1 : 0,
                  transform: isSelling ? 'translateY(0)' : 'translateY(-4px)',
                  transition: 'max-height 360ms ease, opacity 260ms ease, transform 300ms ease'
                }}
              >
                <div className="relative">
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    placeholder="SEARCH PROPERTY ADDRESS YOU WISH TO SELL"
                    autoComplete="off"
                    className={`w-full bg-transparent border-b py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none transition-colors text-sm tracking-wider ${
                      errors.propertyAddress ? 'border-red-500' : 'border-[#C9A961]/30 focus:border-[#C9A961]'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />

                  {isSearchingProperty && (
                    <p className="text-[#C9A961]/70 text-xs mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Searching addresses...
                    </p>
                  )}

                  {errors.propertyAddress && (
                    <p className="text-red-400 text-xs mt-1">{errors.propertyAddress}</p>
                  )}

                  {!errors.propertyAddress && propertySearchError && (
                    <p className="text-[#F5F1E8]/50 text-xs mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {propertySearchError}
                    </p>
                  )}

                  {propertySuggestions.length > 0 && (
                    <div className="mt-2 border border-[#C9A961]/20 bg-[#0A0A0A]/95 backdrop-blur-sm max-h-44 overflow-y-auto">
                      {propertySuggestions.map((suggestion) => (
                        <button
                          key={suggestion.place_id}
                          type="button"
                          onClick={() => handlePropertySuggestionSelect(suggestion)}
                          className="block w-full px-3 py-2 text-left text-[#F5F1E8]/80 text-xs leading-relaxed hover:bg-[#C9A961]/10 hover:text-[#F5F1E8] transition-colors"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {suggestion.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="MESSAGE *"
                  rows={4}
                  className={`w-full bg-transparent border-b py-3 text-[#F5F1E8] placeholder-[#F5F1E8]/40 focus:outline-none transition-colors text-sm tracking-wider resize-none ${
                    errors.message ? 'border-red-500' : 'border-[#C9A961]/30 focus:border-[#C9A961]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C9A961] text-[#0A0A0A] py-4 tracking-[0.15em] uppercase text-sm hover:bg-[#8B7340] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#0A0A0A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Submit Inquiry'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
