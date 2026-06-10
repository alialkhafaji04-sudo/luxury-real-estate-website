import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const disclosureSections = [
  {
    title: "Seller's Agent",
    body: [
      "A seller's agent under a listing agreement with the seller acts as the agent for the seller only.",
      "A seller's agent has a fiduciary duty of utmost care, integrity, honesty, and loyalty in dealings with the seller.",
      "A seller's agent also owes the buyer and seller diligent exercise of reasonable skill and care, honest and fair dealing and good faith, and disclosure of facts known to the agent that materially affect the value or desirability of the property and are not known to, or within the diligent attention and observation of, the parties."
    ]
  },
  {
    title: "Buyer's Agent",
    body: [
      "A buyer's agent may, with the buyer's consent, agree to act as agent for the buyer only, including under a buyer-broker representation agreement.",
      "A buyer's agent has a fiduciary duty of utmost care, integrity, honesty, and loyalty in dealings with the buyer.",
      "A buyer's agent also owes the buyer and seller diligent exercise of reasonable skill and care, honest and fair dealing and good faith, and disclosure of facts known to the agent that materially affect the value or desirability of the property and are not known to, or within the diligent attention and observation of, the parties."
    ]
  },
  {
    title: "Agent Representing Both Seller and Buyer",
    body: [
      "A real estate agent may legally act as agent for both the seller and buyer only with the knowledge and consent of both parties.",
      "In a dual agency situation, the agent owes fiduciary duties to both the seller and buyer, along with the duties stated for each party.",
      "A dual agent may not disclose confidential information from either party to the other without express permission, including information about financial position, motivations, bargaining position, or personal information that may affect price."
    ]
  },
  {
    title: "Seller and Buyer Responsibilities",
    body: [
      "The purchase agreement or a separate document will confirm which agent represents you and whether that agent represents you exclusively or as a dual agent.",
      "An agent's duties do not relieve a seller or buyer from protecting their own interests. Carefully read all agreements to confirm they express your understanding of the transaction.",
      "A real estate agent is qualified to advise about real estate. If legal or tax advice is desired, consult a competent professional."
    ]
  }
];

export function AgencyDisclosurePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      <section className="bg-[#0A0A0A] pt-32 pb-12 px-6 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            California Civil Code
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
            Disclosure Regarding Real Estate Agency Relationship
          </h1>
        </div>
      </section>

      <main className="bg-[#F7F7F5] px-6 py-12 sm:px-8 sm:py-16">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <section className="space-y-5">
            <p className="text-[#333] text-base sm:text-lg leading-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              When you enter into a discussion with a real estate agent regarding a real estate transaction, you should understand from the outset what type of agency relationship or representation you wish to have with the agent in the transaction.
            </p>
            <p className="text-[#555] text-sm leading-7" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              This page provides access to the agency relationship disclosure required by California Civil Code Section 2079.14 and described in Civil Code Section 2079.16. Transaction documents may include additional confirmations and disclosures.
            </p>
            <a
              href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=2079.16."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-[#8B7340] text-sm underline underline-offset-4 hover:text-[#111] transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              View the official California Civil Code Section 2079.16 text
            </a>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disclosureSections.map((section) => (
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

          <section className="border-t border-[#D8D3C5] pt-8 space-y-4">
            <p className="text-[#444] text-sm leading-7" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              Buyers should exercise reasonable care to protect themselves, including as to facts about the property that are known to them or within their diligent attention and observation.
            </p>
            <p className="text-[#444] text-sm leading-7" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              Sellers and buyers should strongly consider obtaining tax advice from a competent professional because federal and state tax consequences can be complex and subject to change.
            </p>
            <p className="text-[#444] text-sm leading-7" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
              During a real property transaction, you may receive more than one agency disclosure form depending on the number of agents assisting in the transaction. Read each disclosure carefully in light of your specific relationship with the real estate agent.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
