interface SoldProperty {
  address: string;
  price: string;
}

const parsePrice = (price: string) => Number(price.replace(/[$,]/g, ''));

export function SoldProperties() {
  const soldProperties: SoldProperty[] = [
    {
      address: 'Beverly Grove, Los Angeles, CA 90048',
      price: '$23,995,000'
    },
    {
      address: '1302 Collingwood Pl, Los Angeles, CA 90069',
      price: '$23,995,000'
    },
    {
      address: '1111 Calle Vista Dr, Beverly Hills, CA 90210',
      price: '$38,000,000'
    },
    {
      address: '1199 Thrasher Ave, Los Angeles, CA 90069',
      price: '$38,000,000'
    },
    {
      address: '9719 Heather Rd, Beverly Hills, CA 90210',
      price: '$17,000,000'
    },
    {
      address: '729 N. Bedford Dr, Beverly Hills, CA 90210',
      price: '$17,100,000'
    },
    {
      address: '712 N. Maple Dr, Beverly Hills, CA 90210',
      price: '$18,500,000'
    },
    {
      address: '1814 N. Doheny Dr, Los Angeles, CA 90069',
      price: '$23,950,000'
    },
    {
      address: '3170 Corinth Ave, Los Angeles, CA 90066',
      price: '$2,400,000'
    },
    {
      address: '11750 W Sunset Blvd #302, Los Angeles, CA 90049',
      price: '$579,000'
    },
    {
      address: '5120 Etiwanda Ave, Tarzana, CA 91356',
      price: '$1,675,000'
    },
    {
      address: '4305 Saltillo St, Woodland Hills, CA 91364',
      price: '$1,195,000'
    },
    {
      address: '10246 Muroc St, Bellflower, CA 90706',
      price: '$900,000'
    },
    {
      address: '7777 Cherrystone Ave, Panorama City, CA 91402',
      price: '$799,000'
    },
    {
      address: '3972 McLaughlin Ave, Los Angeles, CA 90066',
      price: '$1,450,000'
    },
    {
      address: '10011 Westwanda Dr, Beverly Hills, CA 90210',
      price: '$1,075,000'
    },
    {
      address: '1530 S. Centinela Ave. #101, West L.A., CA 90025',
      price: '$888,000'
    },
    {
      address: '3005 N. Beverly Glen Cir, Bel-Air, CA 90077',
      price: '$3,345,000'
    },
    {
      address: '15958 High Knoll Rd, Encino, CA 91436',
      price: '$3,099,000'
    },
    {
      address: '13134 Vista View Circle, Sylmar, CA 91342',
      price: '$739,000'
    },
    {
      address: '15239 Rayneta Dr, Sherman Oaks, CA 91403',
      price: '$1,285,000'
    },
    {
      address: '834 Calle La Primavera, Glendale, CA 91208',
      price: '$1,049,000'
    },
    {
      address: '953 Acacia Ln, Montebello, CA 90640',
      price: '$529,000'
    },
    {
      address: '9007 Norma Pl, West Hollywood, CA 90069',
      price: '$1,949,000'
    },
    {
      address: '1902 Parnell Ave, Westwood, CA 90025',
      price: '$1,875,000'
    },
    {
      address: '582 Bronson Ave, Hancock Park, CA 90004',
      price: '$1,250,000'
    },
    {
      address: '4378 Park Monte Nord, Calabasas, CA 91302',
      price: '$1,475,000'
    },
    {
      address: '1490 El Mirador Dr, Pasadena, CA 91103',
      price: '$2,750,000'
    },
    {
      address: '834 Calle La Primavera, Glendale, CA 91208',
      price: '$828,500'
    },
    {
      address: '5345 Encino Ave, Encino, CA 91316',
      price: '$795,000'
    },
    {
      address: '19218 Wells Dr, Tarzana, CA 91356',
      price: '$1,195,000'
    },
    {
      address: '10315 Missouri Ave. #103, Westwood, CA 90025',
      price: '$549,000'
    },
    {
      address: '15055 Del Gado Dr, Sherman Oaks, CA 91403',
      price: '$379,000'
    },
    {
      address: '1064 Shenandoah St. #305, Miracle Mile, CA 90035',
      price: '$169,500'
    },
    {
      address: '3938 Dixie Canyon Ave, Sherman Oaks, CA 91423',
      price: '$595,000'
    },
    {
      address: '15960 Valley Meadow Pl, Encino, CA 91436',
      price: '$1,695,000'
    },
    {
      address: '16110 Meadow View Dr, Encino, CA 91436',
      price: '$1,295,000'
    },
    {
      address: '4401 Haskell Ave, Encino, CA 91436',
      price: '$2,995,000'
    },
    {
      address: '3759 Royal Woods Dr, Sherman Oaks, CA 91403',
      price: '$799,000'
    },
    {
      address: '740 N. Kings Rd. #104, West Hollywood, CA 90069',
      price: '$130,000'
    },
    {
      address: '11612 Kling, Valley Village, CA 91607',
      price: '$849,000'
    },
    {
      address: '1237 S. Orange Dr, Miracle Mile, CA 90019',
      price: '$829,000'
    },
    {
      address: '3201 Estara Ave, Glassell Park, CA 90065',
      price: '$462,900'
    },
    {
      address: '3897 Hollysprings Dr, Corona, CA 92882',
      price: '$643,000'
    },
    {
      address: '11763 Canton Pl, Studio City, CA 91604',
      price: '$847,000'
    },
    {
      address: '2020 Holly Dr. #5, Hollywood, CA 90068',
      price: '$465,000'
    },
    {
      address: '4784 Park Encino Ln, Encino, CA 91436',
      price: '$349,000'
    },
    {
      address: '2233 Summitridge Dr, Beverly Hills, CA 90210',
      price: '$895,000'
    },
    {
      address: '2206 Roscomare Rd, Bel-Air, CA 90077',
      price: '$595,000'
    },
    {
      address: '7201 Woodrow Wilson Dr, Hollywood, CA 90068',
      price: '$679,000'
    },
    {
      address: '10747 Wilshire Blvd. #1003, Westwood, CA 90024',
      price: '$219,000'
    },
    {
      address: '1210 Crescent Heights Blvd, Beverlywood, CA 90035',
      price: '$425,000'
    },
    {
      address: '1155 La Cienega Blvd. #1214, West Hollywood, CA 90069',
      price: '$249,000'
    },
    {
      address: '5100 Avenida Hacienda, Tarzana, CA 91356',
      price: '$1,195,000'
    },
    {
      address: '14723 Addison St, Sherman Oaks, CA 91403',
      price: '$595,000'
    },
    {
      address: '7235 Woodrow Wilson Dr, Hollywood Hills, CA 90068',
      price: '$459,000'
    },
    {
      address: '12601 Promontory Rd, Brentwood, CA 90049',
      price: '$1,449,000'
    },
    {
      address: '733 Malcolm Ave, Westwood, CA 90024',
      price: '$1,629,000'
    },
    {
      address: '17748 Alonzo Pl, Encino, CA 91316',
      price: '$539,900'
    },
    {
      address: '3809 Cody Rd, Sherman Oaks, CA 91403',
      price: '$499,000'
    },
    {
      address: '266 S Cliffwood, Los Angeles, CA 90049',
      price: '$10,750,000'
    },
    {
      address: '917 Loma Vista Dr, Beverly Hills, CA 90210',
      price: '$8,850,000'
    },
    {
      address: '1401 Bel Air Road, Los Angeles, CA 90077',
      price: '$6,900,000'
    },
    {
      address: '4580 Tara Dr, Encino, CA 91436',
      price: '$5,300,000'
    },
    {
      address: '601 Lido Park Dr. #5E, West Newport, CA 92663',
      price: '$2,995,000'
    },
    {
      address: '13211 Mulholland Dr, Beverly Hills, CA 90210',
      price: '$2,950,000'
    },
    {
      address: '3457 White Rose Way, Encino, CA 91436',
      price: '$2,800,000'
    },
    {
      address: '3430 Wrightwood Dr, Studio City, CA 91604',
      price: '$2,695,000'
    },
    {
      address: '866 Hilldale Ave, West Hollywood, CA 90069',
      price: '$2,600,000'
    },
    {
      address: '8430 Willoughby Ave, West Hollywood, CA 90069',
      price: '$2,520,000'
    },
    {
      address: '1850 N Stanley Ave, Los Angeles, CA 90046',
      price: '$2,200,000'
    },
    {
      address: '1270 S Burnside Ave, Los Angeles, CA 90019',
      price: '$2,110,000'
    },
    {
      address: '3055 Elvido Dr, Los Angeles, CA 90049',
      price: '$2,000,000'
    },
    {
      address: '1086 Armada Dr, Pasadena, CA 91106',
      price: '$1,801,000'
    },
    {
      address: '605 N Windsor Blvd, Los Angeles, CA 90004',
      price: '$1,760,000'
    },
    {
      address: '800 N Kilkea Dr, Los Angeles, CA 90046',
      price: '$1,725,000'
    },
    {
      address: '1835 Pandora Ave #402, Los Angeles, CA 90025',
      price: '$1,695,000'
    },
    {
      address: '624 Milwood Ave, Venice, CA 90291',
      price: '$1,677,000'
    },
    {
      address: '9116 Cordell Dr, Los Angeles, CA 90069',
      price: '$1,660,000'
    },
    {
      address: '842 Marco Pl, Venice, CA 90291',
      price: '$1,605,000'
    },
    {
      address: '459 El Camino Dr, Beverly Hills, CA 90210',
      price: '$1,549,000'
    },
    {
      address: '17345 Magnolia Blvd, Encino, CA 91316',
      price: '$1,545,000'
    },
    {
      address: '6385 W 80TH Pl, Los Angeles, CA 90045',
      price: '$1,516,580'
    },
    {
      address: '643 N Gower St, Los Angeles, CA 90038',
      price: '$1,515,000'
    },
    {
      address: '332 N Norton Ave, Los Angeles, CA 90004',
      price: '$1,510,000'
    },
    {
      address: '7535 Norton Ave, West Hollywood, CA 90046',
      price: '$1,385,000'
    },
    {
      address: '120 S Clark Dr, Beverly Hills, CA 90211',
      price: '$1,330,000'
    },
    {
      address: '1030 S Burnside Ave, Los Angeles, CA 90019',
      price: '$1,330,000'
    },
    {
      address: '590 N Plymouth, Hancock Park, CA 90004',
      price: '$1,300,000'
    },
    {
      address: '656 N West Knoll Dr. #304, West Hollywood, CA 90069',
      price: '$950,000'
    },
    {
      address: '800 N Melrose Hill St, Hollywood, CA 90038',
      price: '$949,000'
    },
    {
      address: '317 N Gower St, Hancock Park, CA 90004',
      price: '$899,000'
    },
    {
      address: '1011 N Orange Grove Ave. #2, West Hollywood, CA 90046',
      price: '$875,000'
    },
    {
      address: '1413 N Occidental Blvd, Silver Lake, CA 90026',
      price: '$830,000'
    },
    {
      address: '2175 S Beverly Glen Blvd. #410, Westwood, CA 90064',
      price: '$725,000'
    },
    {
      address: '12020 Guerin St #105, Studio City, CA 91604',
      price: '$699,000'
    },
    {
      address: '618 Wilcox Ave, Hancock Park, CA 90004',
      price: '$695,000'
    },
    {
      address: '585 N Rossmore Ave. #308, Hancock Park, CA 90004',
      price: '$675,000'
    },
    {
      address: '10402 Tiara St, North Hollywood, CA 91606',
      price: '$415,000'
    },
    {
      address: '12938 Montford St, Pacoima, CA 91331',
      price: '$334,900'
    }
  ];
  const sortedSoldProperties = [...soldProperties].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-32">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16 text-center">
          <h3
            className="text-[#F5F1E8] uppercase"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(1.75rem, 5vw, 4rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '0.05em'
            }}
          >
            RECENT SIGNIFICANT SALES
          </h3>
        </div>

        <ol className="mx-auto max-w-[1100px] space-y-4 sm:space-y-5">
          {sortedSoldProperties.map((property) => (
            <li
              key={`${property.address}-${property.price}`}
              className="flex flex-col items-center gap-1 text-center uppercase leading-snug text-sm sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-baseline sm:gap-4 sm:text-lg"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400, letterSpacing: '0.04em' }}
            >
              <span className="text-[#C9A961] sm:text-left">{property.address}</span>
              <span className="hidden text-[#F5F1E8]/45 sm:inline">-</span>
              <span className="text-[#F5F1E8] sm:text-left">{property.price}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
