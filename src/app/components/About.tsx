import React, { useState } from 'react';
import { ChevronDown, Phone, Mail } from 'lucide-react';

function TeamCard({ name, role, phone, email, image, dre }: {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  image: string;
  dre?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasContactInfo = phone || email || dre;

  return (
    <div className="group bg-[#0A0A0A]/90 backdrop-blur-sm overflow-hidden border border-[#C9A961]/20 hover:border-[#C9A961]/40 transition-all duration-500">
      {/* Portrait Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-gradient-to-b from-[#0A0A0A]/95 to-[#0A0A0A]">
        <h4
          className="text-[#F5F1E8] mb-1.5 uppercase"
          style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontWeight: 400, letterSpacing: '0.05em' }}
        >
          {name}
        </h4>
        <p className="text-[#C9A961] text-[0.65rem] tracking-[0.15em] uppercase mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
          {role}
        </p>

        {hasContactInfo && (
          <>
            {isExpanded && (
              <div className="space-y-1.5 mb-3 text-[0.65rem] text-[#F5F1E8]/70">
                {phone && (
                  <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="flex items-center gap-1.5 hover:text-[#C9A961] transition-colors">
                    <Phone size={10} className="text-[#C9A961]" />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-[#C9A961] transition-colors">
                    <Mail size={10} className="text-[#C9A961]" />
                    <span>{email}</span>
                  </a>
                )}
                {dre && (
                  <p className="text-[#C9A961]/60 text-[0.65rem] pt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    DRE# {dre}
                  </p>
                )}
              </div>
            )}

            <div className="h-[1px] bg-[#C9A961]/20 mb-3" />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-[#F5F1E8] text-[0.65rem] tracking-[0.15em] uppercase hover:text-[#C9A961] transition-colors"
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}
            >
              <span>CONTACT INFO</span>
              <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
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
      name: 'LAURENT LOUVET',
      role: 'FOUNDER | PRINCIPAL BROKER',
      phone: '310-968-9978',
      email: 'laurent@thelouvetgroup.com',
      image: '/team/Screenshot_2026-04-28_at_8.20.42 PM.png',
      dre: '00883925'
    },
    {
      name: 'EMRE MUHSINOGLU',
      role: 'ESTATE DIRECTOR | SENIOR AGENT',
      phone: '424-566-9001',
      email: 'emre@thelouvetgroup.com',
      image: '/team/2ac82cdf1235da41.jpeg',
      dre: '02222895'
    },
    {
      name: 'EZGI FICICI',
      role: 'LUXURY AGENT',
      phone: '747-250-2160',
      email: 'ezgi@thelouvetgroup.com',
      image: '/team/ezgi.png',
      dre: '02308813'
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
      name: 'KENIA CUEVAS',
      role: 'LUXURY AGENT',
      phone: '310-925-9852',
      email: 'kenia@thelouvetgroup.com',
      image: '/team/emily.png',
      dre: '01765914'
    },
    {
      name: 'ARA HUYETT',
      role: 'LUXURY AGENT',
      phone: '415-509-7871',
      email: 'ara@thelouvetgroup.com',
      image: '/team/ara.png',
      dre: '02188306'
    },
    {
      name: 'POLINA MITIANINA',
      role: 'LUXURY AGENT',
      phone: '415-509-7871',
      email: 'polina@thelouvetgroup.com',
      image: '/team/polina.png',
      dre: '02237196'
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
      dre: '01987658'
    },
    {
      name: 'MICHELLE SINGERMAN',
      role: 'SENIOR ESCROW OFFICER',
      phone: '310-528-0123',
      email: 'michellesingermanrealestate@gmail.com',
      image: '/team/michelle.jpg'
    },
    {
      name: 'SANDY KRAUSE & JULIE UGLESICH',
      role: 'TITLE OFFICERS',
      phone: '818-355-0978',
      email: 'juglesich@gmail.com',
      image: '/team/sandy-julie.png'
    }
  ];

  return (
    <section className="bg-[#0A0A0A] py-32">
      <div className="max-w-[1600px] mx-auto px-8">
        {/* Section Header */}
        <div className="mb-16">
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
}
