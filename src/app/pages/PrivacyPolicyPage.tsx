import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { COMPANY_INFO } from '../components/Contact';

const privacySections = [
  {
    title: 'Information We Collect',
    body: [
      'When you submit a contact form, property inquiry, fair housing inquiry, or newsletter signup, we may collect your name, email address, phone number, property interest, property address, selected listing details, message content, SMS consent selection, and submission date.',
      'If you use the seller property address search, the address text you enter may be sent to OpenStreetMap Nominatim so matching address suggestions can be returned.'
    ]
  },
  {
    title: 'How We Use Information',
    body: [
      'We use submitted information to respond to inquiries, send requested listing or market updates, schedule property conversations, process fair housing questions, and maintain records of requests made through the website.',
      'We do not sell personal information submitted through this website.'
    ]
  },
  {
    title: 'Service Providers',
    body: [
      'Website forms are submitted through Web3Forms so inquiries can be delivered to our team by email.',
      'Address suggestions are provided through OpenStreetMap Nominatim. Those lookups are used only to return matching property address suggestions while you type.'
    ]
  },
  {
    title: 'Local Browser Storage',
    body: [
      'If a form submission cannot be completed through the email service, the website may store the inquiry temporarily in your browser localStorage as a fallback record.',
      'This fallback data remains on the browser and device used to submit the form unless it is cleared through browser settings or by site maintenance.'
    ]
  },
  {
    title: 'Communications',
    body: [
      'If you provide your phone number, email address, or SMS consent, we may contact you about your inquiry, requested services, property information, or listing and market updates.',
      'Message and data rates may apply to SMS communications. Reply STOP to opt out or HELP for help where SMS messaging is used.'
    ]
  },
  {
    title: 'Your Choices',
    body: [
      'You may request access, correction, or deletion of personal information you submitted through the website by contacting us.',
      'You may unsubscribe from marketing emails or ask us to stop sending non-transactional messages.'
    ]
  }
];

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      <section className="bg-[#0A0A0A] pt-32 pb-12 px-6 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Last updated June 10, 2026
          </p>
          <h1
            className="text-[#F5F1E8]"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.1
            }}
          >
            Privacy Policy
          </h1>
        </div>
      </section>

      <main className="bg-[#F7F7F5] px-6 py-12 sm:px-8 sm:py-16">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <section className="space-y-5">
            <p className="text-[#333] text-base sm:text-lg leading-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              The Louvet Group respects your privacy. This policy explains what information this website collects, how it is used, and how to contact us with privacy questions.
            </p>
            <p className="text-[#555] text-sm leading-7" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              This policy applies to information submitted through this website, including contact forms, newsletter signups, fair housing inquiries, and property inquiry forms.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {privacySections.map((section) => (
              <section key={section.title} className="border border-[#D8D3C5] bg-white p-6">
                <h2
                  className="text-[#111] mb-5"
                  style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}
                >
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[#444] text-sm leading-7" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="border-t border-[#D8D3C5] pt-8">
            <h2
              className="text-[#111] mb-4"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300 }}
            >
              Contact
            </h2>
            <p className="text-[#444] text-sm leading-7" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              For privacy questions or requests, contact us at{' '}
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#8B7340] underline underline-offset-4">
                {COMPANY_INFO.email}
              </a>
              {' '}or by phone at {COMPANY_INFO.phone}.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
