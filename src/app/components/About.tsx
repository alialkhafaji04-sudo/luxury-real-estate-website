import React, { useState } from 'react';
import { ChevronDown, Phone, Mail } from 'lucide-react';

function TeamCard({ name, role, phone, email, image, dre, languages }: {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  image: string;
  dre?: string;
  languages?: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasContactInfo = phone || email || dre || languages;

  return (
    <div className="group bg-[#0A0A0A]/90 backdrop-blur-sm overflow-hidden border border-[#C9A961]/20 hover:border-[#C9A961]/40 transition-all duration-300">
      {/* Portrait Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Panel */}
      <div className="p-2.5 bg-gradient-to-b from-[#0A0A0A]/95 to-[#0A0A0A]">
        <h4
          className="text-[#F5F1E8] mb-0.5 uppercase leading-tight"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.03em' }}
        >
          {name}
        </h4>
        <p className="text-[#C9A961] text-[0.5rem] tracking-[0.1em] uppercase mb-2 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
          {role}
        </p>

        {hasContactInfo && (
          <>
            {isExpanded && (
              <div className="space-y-1 mb-2 text-[0.5rem] text-[#F5F1E8]/70">
                {phone && (
                  <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1 hover:text-[#C9A961] transition-colors">
                    <Phone size={8} className="text-[#C9A961]" />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-[#C9A961] transition-colors">
                    <Mail size={8} className="text-[#C9A961]" />
                    <span className="truncate">{email}</span>
                  </a>
                )}
                {dre && (
                  <p className="text-[#C9A961]/60 text-[0.5rem] pt-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    DRE# {dre}
                  </p>
                )}
                {languages && languages.length > 0 && (
                  <p className="text-[#C9A961]/80 text-[0.5rem] pt-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Additional Languages: {languages.join(', ')}
                  </p>
                )}
              </div>
            )}

            <div className="h-[1px] bg-[#C9A961]/20 mb-2" />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-[#F5F1E8] text-[0.5rem] tracking-[0.1em] uppercase hover:text-[#C9A961] transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
            >
              <span>CONTACT</span>
              <ChevronDown size={10} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function About() {
  const teamMembers = [
    {
      name: 'EMRE MUHSINOGLU',
      role: 'DIRECTOR OF THE ESTATE DIVISION & TEAM LEADER',
      phone: '424-566-9001',
      email: 'emre@thelouvetgroup.com',
      image: '/team/emre.png',
      dre: '02222895',
      languages: ['Turkish']
    },
    {
      name: 'EZGI FICICI',
      role: 'LUXURY AGENT',
      phone: '747-250-2160',
      email: 'ezgi@thelouvetgroup.com',
      image: '/team/ezgi.png',
      dre: '02308813',
      languages: ['Turkish']
    },
    {
      name: 'BRITNIE MOSBY',
      role: 'LUXURY AGENT',
      phone: '415-509-7871',
      email: 'britnie@thelouvetgroup.com',
      image: '/team/0fbc306c-b54d-42b8-a8c0-7964a0c501bc.png',
      dre: '02077728'
    },
    {
      name: 'EMILY MEZA',
      role: 'LUXURY AGENT',
      phone: '310-925-9852',
      email: 'kenia@thelouvetgroup.com',
      image: '/team/emily.png',
      dre: '01765914',
      languages: ['Spanish']
    },
    {
      name: 'ARA HUYETT',
      role: 'LUXURY AGENT',
      phone: '415-509-7871',
      email: 'ara@thelouvetgroup.com',
      image: '/team/ara.png',
      dre: '02188306',
      languages: ['Greek']
    },
    {
      name: 'POLINA MITIANINA',
      role: 'LUXURY AGENT',
      phone: '415-509-7871',
      email: 'polina@thelouvetgroup.com',
      image: '/team/polina.png',
      dre: '02237196',
      languages: ['Russian']
    },
    {
      name: 'ARDRA FLEMING',
      role: 'LUXURY AGENT',
      phone: '310-466-1777',
      email: 'ardra@thelouvetgroup.com',
      image: '/team/4fcce60e-9841-4267-8193-f01c8c86034d.png',
      dre: '01219779'
    },
    {
      name: 'MERRI LEE MARKS',
      role: 'LUXURY AGENT',
      phone: '310-991-0840',
      email: 'merri@thelouvetgroup.com',
      image: '/team/2.png',
      dre: '02260280'
    },
    {
      name: 'VILAYVANH SHAH',
      role: 'LUXURY AGENT',
      phone: '310-248-0923',
      email: 'vilayvanh@thelouvetgroup.com',
      image: '/team/1.png',
      dre: '01987658',
      languages: ['Thai', 'Laotian']
    },
    {
      name: 'MICHELLE SINGERMAN',
      role: 'SENIOR ESCROW OFFICER',
      phone: '310-528-0123',
      email: 'michellesingermanrealestate@gmail.com',
      image: '/team/michelle.jpg'
    },
    {
      name: 'SAAD EL GHARBAOUI',
      role: 'DIGITAL STRATEGY PARTNER',
      phone: '708-717-1574',
      email: 'saad@joinprivatus.com',
      image: '/team/Saad.png',
      languages: ['Arabic', 'French']
    },
    {
      name: 'JAMIL ALHIDIQ',
      role: 'DIGITAL STRATEGY PARTNER',
      phone: '708-653-8672',
      email: 'jamil@joinprivatus.com',
      image: '/team/Jamil-new.png',
      languages: ['Arabic']
    }
  ];

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <p className="text-[#C9A961] uppercase tracking-[0.3em] text-xs mb-6" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
            OVER 30 YEARS OF EXCELLENCE
          </p>
          <h3
            className="text-[#F5F1E8] uppercase"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '0.05em'
            }}
          >
            MEET THE TEAM
          </h3>
        </div>

        {/* Founder Bio Section */}
        <div className="mb-12 sm:mb-20 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="relative aspect-[4/5] max-w-sm mx-auto lg:mx-0 lg:max-w-md">
            <img
              src="/team/Screenshot_2026-04-28_at_8.20.42 PM.png"
              alt="Laurent Louvet"
              className="w-full h-full object-cover border border-[#C9A961]/30"
            />
          </div>
          <div>
            <p className="text-[#C9A961] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[0.65rem] sm:text-xs mb-3 sm:mb-4" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
              FOUNDER | PRINCIPAL BROKER
            </p>
            <h4
              className="text-[#F5F1E8] uppercase mb-4 sm:mb-6"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              LAURENT LOUVET
            </h4>
            <div className="space-y-3 sm:space-y-4 text-[#F5F1E8]/80 text-[0.8rem] sm:text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
              <p>
                With over 30 years of experience in luxury real estate, Laurent Louvet has established himself as one of Los Angeles' most trusted luxury real estate brokers. His distinguished career spans residential estates, architectural masterpieces, and investment properties across Beverly Hills, Bel Air, Holmby Hills, and the Westside.
              </p>
              <p>
                Laurent's expertise encompasses market analysis, strategic negotiations, and discreet representation for clients who demand absolute confidentiality. His deep understanding of the Los Angeles luxury market, combined with an extensive network of industry connections, enables him to identify exclusive off-market opportunities and achieve exceptional results.
              </p>
              <p className="hidden sm:block">
                Fluent in French and English, Laurent brings a refined international perspective to every transaction. His commitment to personalized service and unwavering integrity has earned him a reputation as the preferred broker for discerning buyers and sellers seeking extraordinary properties.
              </p>
            </div>
            <div className="mt-5 sm:mt-8 flex flex-wrap gap-4 sm:gap-6 text-[0.65rem] sm:text-xs text-[#C9A961]/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <div>
                <span className="text-[#F5F1E8]/50 uppercase tracking-wider">DRE#</span>
                <span className="ml-2">00883925</span>
              </div>
              <div>
                <span className="text-[#F5F1E8]/50 uppercase tracking-wider">Languages</span>
                <span className="ml-2">English, French</span>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="tel:3109689978" className="text-[#C9A961] text-[0.8rem] sm:text-sm hover:text-[#F5F1E8] transition-colors flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Phone size={14} />
                310-968-9978
              </a>
              <a href="mailto:laurent@thelouvetgroup.com" className="text-[#C9A961] text-[0.8rem] sm:text-sm hover:text-[#F5F1E8] transition-colors flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <Mail size={14} />
                laurent@thelouvetgroup.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A961]/30 to-transparent mb-10 sm:mb-16" />

        {/* Team Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}
