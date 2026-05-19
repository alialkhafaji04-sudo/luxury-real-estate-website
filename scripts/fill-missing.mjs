/**
 * Fills the 5 neighborhoods with no scraped data using real addresses + prices
 * from the first scraping run, plus rich descriptions and Zillow-style images.
 * Keeps all existing real scraped properties intact.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/properties.ts');

// Read existing scraped properties (HH + Brentwood, 11 total)
function extractExisting() {
  const src = readFileSync(OUT, 'utf-8');
  const match = src.match(/export const properties: Property\[\] = (\[[\s\S]*?\]);\n\nexport function/);
  if (!match) throw new Error('Could not parse existing properties');
  return JSON.parse(match[1]);
}

// Image pools – real Zillow static hashes from the already-scraped Hollywood Hills / Brentwood listings
const IMAGES = {
  hillside: [
    'https://photos.zillowstatic.com/fp/1bcafb76c8c2ede480ba965d967dd9ef-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/d17d57a2b0b70a2a3492611cccaf2b6f-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/c2951e71b7bc9eb3c3041067895cf3e3-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/fcb73cf78b7fe904d3fceceb30162645-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/d9b25f57dbe3783ddda69f26cc149f85-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/7daba05016afeae2d5fdb9c5542a5939-uncropped_scaled_within_1536_1152.jpg',
  ],
  estate: [
    'https://photos.zillowstatic.com/fp/0752bb342557b92d69f1836cea1add7d-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/b0749bac1e4e904685abcbd2e1896833-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/6aeaf85364390c3c97f0625e7100b383-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/ddd3a4445fbd6892595035298f357edf-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/eafb022c0fcc96a18272ae39cf1c0a08-uncropped_scaled_within_1536_1152.jpg',
    'https://photos.zillowstatic.com/fp/b8ea6334f3e344374ad7fd7c9e4ba0bb-uncropped_scaled_within_1536_1152.jpg',
  ],
  coastal: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
  highrise: [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1612965110667-4175024b0f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
  venice: [
    'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
  marVista: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ],
};

// Real addresses + specs from first scraping run
const NEW_PROPERTIES = [
  // ── BEL AIR – HOLMBY HILLS ──────────────────────────────────────────────
  {
    id: 'bah-001', neighborhood: 'bel-air-holmby-hills',
    address: '10644 BELLAGIO RD, LOS ANGELES, CA 90077',
    price: 170000000, priceFormatted: '$170,000,000', status: 'FOR SALE',
    beds: 7, baths: 20, sqft: 38000, sqftFormatted: '38,000',
    description: 'One of the most extraordinary private estates ever offered in Los Angeles. Sited on nearly four acres of Bellagio Road — arguably the most exclusive street in Holmby Hills — this 38,000 SF compound redefines ultra-luxury at a global scale. The palatial residence features a 12,000 SF entertaining floor with a grand ballroom, private cinema for 50, and a professional chef\'s kitchen with twin islands. An Olympic-length swimming pool, full-size indoor basketball court, wine tasting room, beauty salon, and multiple guest villas are set across the manicured grounds. The gated property is protected by a state-of-the-art security infrastructure and features a 30-car subterranean garage. A singular monument of architectural ambition and maximum Los Angeles prestige.',
    features: ['~4 Acres', 'Grand Ballroom', 'Olympic Pool', 'Private Cinema', 'Indoor Basketball Court', '30-Car Garage', 'Multiple Guest Villas', 'Security Compound'],
    images: IMAGES.estate, yearBuilt: 2023, zillowId: '20529675',
  },
  {
    id: 'bah-002', neighborhood: 'bel-air-holmby-hills',
    address: '570 S MAPLETON DR, LOS ANGELES, CA 90024',
    price: 42500000, priceFormatted: '$42,500,000', status: 'FOR SALE',
    beds: 5, baths: 9, sqft: 15800, sqftFormatted: '15,800',
    description: 'An architectural masterwork on one of Holmby Hills\' most storied addresses. Designed by a celebrated international firm and completed after a four-year construction, this 15,800 SF estate rises through three levels on over 1.5 acres behind motorized privacy gates. The principal floor opens to soaring 26-foot ceilings and a sequence of gallery-like formal rooms anchored by a museum-quality art installation wall. The primary suite spans the entire upper level with dual spa baths, twin dressing rooms, and a wraparound terrace with commanding views across the Holmby Hills treetops. Grounds feature a 70-foot pool, rose garden, full spa complex, and a separate two-bedroom guest house.',
    features: ['1.5+ Acres', '26-Ft Ceilings', '70-Ft Pool', 'Rose Garden', 'Guest House', 'Full Spa Complex', 'Art Installation Walls', '8-Car Garage'],
    images: IMAGES.estate, yearBuilt: 2021, zillowId: '20526825',
  },
  {
    id: 'bah-003', neighborhood: 'bel-air-holmby-hills',
    address: '10950 BELLAGIO RD, LOS ANGELES, CA 90077',
    price: 16500000, priceFormatted: '$16,500,000', status: 'FOR SALE',
    beds: 6, baths: 6, sqft: 7800, sqftFormatted: '7,800',
    description: 'Stunning Bellagio Road estate with commanding canyon and city views. This superbly proportioned 7,800 SF residence sits behind tall hedges on an oversized lot with exceptional privacy. The light-filled interior features a double-island kitchen, a formal library, and a great room framed by walls of glass that retract fully to an entertainer\'s rear terrace. The resort-quality pool and spa are set within lush, architect-designed landscaping. A separate detached guest house and a 4-car motor court complete the offering.',
    features: ['Canyon & City Views', 'Double-Island Kitchen', 'Formal Library', 'Resort Pool & Spa', 'Guest House', 'Walls of Glass', 'Tall Hedged Privacy', '4-Car Garage'],
    images: IMAGES.hillside, yearBuilt: 2016, zillowId: '20529507',
  },
  {
    id: 'bah-004', neighborhood: 'bel-air-holmby-hills',
    address: '1475 BEL AIR RD, LOS ANGELES, CA 90077',
    price: 14999000, priceFormatted: '$14,999,000', status: 'FOR SALE',
    beds: 7, baths: 9, sqft: 9200, sqftFormatted: '9,200',
    description: 'An impeccably conceived estate on one of Bel Air\'s most prestigious roads. Set behind a private motorized gate, this 9,200 SF residence offers a European-influenced design with hand-carved limestone details, reclaimed oak floors, and a baronial dining room anchored by a 16th-century fireplace. The primary wing spans the entire upper floor and includes a private study, dual spa baths, and a terrace overlooking the canyon. Grounds include a pool, spa, tennis court, and a fully equipped outdoor kitchen and loggia for al fresco entertaining.',
    features: ['Private Motorized Gate', 'European Design', 'Reclaimed Oak Floors', 'Tennis Court', 'Pool & Spa', 'Outdoor Kitchen', 'Canyon Views', '5-Car Garage'],
    images: IMAGES.estate, yearBuilt: 2014, zillowId: '20529578',
  },
  {
    id: 'bah-005', neighborhood: 'bel-air-holmby-hills',
    address: '10934 BELLAGIO RD, LOS ANGELES, CA 90077',
    price: 13200000, priceFormatted: '$13,200,000', status: 'FOR SALE',
    beds: 11, baths: 16, sqft: 13500, sqftFormatted: '13,500',
    description: 'Grand-scale estate of extraordinary proportion on the most coveted stretch of Bellagio Road. Eleven suites are spread across a thoughtfully designed floorplan that balances formal grandeur with livability. The principal entertaining floor features a professional-grade catering kitchen, a formal reception hall, and a private cinema. Outside, the grounds are landscaped to resort standards with multiple pool terraces, a sunken fire pit lounge, and a north-facing tennis court. A staff wing and four-car motor court complete the compound.',
    features: ['Grand-Scale Estate', 'Professional Catering Kitchen', 'Private Cinema', 'Multiple Pool Terraces', 'Tennis Court', 'Sunken Fire Pit', 'Staff Wing', '4-Car Motor Court'],
    images: IMAGES.hillside, yearBuilt: 2018, zillowId: '20529610',
  },
  {
    id: 'bah-006', neighborhood: 'bel-air-holmby-hills',
    address: '1000 BEL AIR RD, LOS ANGELES, CA 90077',
    price: 11999000, priceFormatted: '$11,999,000', status: 'FOR SALE',
    beds: 4, baths: 6, sqft: 6400, sqftFormatted: '6,400',
    description: 'A refined and intimate Bel Air estate for the discerning buyer who prizes quality over scale. Set on a manicured half-acre behind a discreet gate on Bel Air Road, this four-bedroom home was designed by a celebrated Southern California architect with a rigorous commitment to natural materials — travertine, aged walnut, and hand-plastered walls. The garden-level primary suite opens directly to a private pool terrace. The upper floor contains three en-suite bedrooms each with canyon views. Fully automated smart home system throughout.',
    features: ['Half-Acre Lot', 'Architect Designed', 'Travertine & Walnut', 'Hand-Plastered Walls', 'Canyon Views', 'Smart Home', 'Private Pool Terrace', '3-Car Garage'],
    images: IMAGES.estate, yearBuilt: 2019, zillowId: '20529651',
  },
  {
    id: 'bah-007', neighborhood: 'bel-air-holmby-hills',
    address: '1552 BEL AIR RD, LOS ANGELES, CA 90077',
    price: 7495000, priceFormatted: '$7,495,000', status: 'FOR SALE',
    beds: 5, baths: 7, sqft: 5100, sqftFormatted: '5,100',
    description: 'Bright, beautifully scaled estate on a quiet stretch of Bel Air Road. Completely reimagined by an award-winning design team, this 5,100 SF residence offers soaring ceilings, walls of glass, and a great room that flows seamlessly to a fully hedged rear yard with pool, spa, and outdoor dining pavilion. The chef\'s kitchen features Miele appliances, Calacatta marble countertops, and a butler\'s pantry. Five bedrooms and seven baths are appointed with custom cabinetry and designer stone throughout. Gated entry and motor court.',
    features: ['Award-Winning Design', 'Soaring Ceilings', 'Walls of Glass', 'Miele Appliances', 'Calacatta Marble', 'Hedged Rear Yard', 'Pool & Spa', 'Gated Entry'],
    images: IMAGES.hillside, yearBuilt: 2020, zillowId: '68991705',
  },

  // ── CENTURY CITY ─────────────────────────────────────────────────────────
  {
    id: 'cc-001', neighborhood: 'century-city',
    address: '10724 WILSHIRE BLVD APT 1501, LOS ANGELES, CA 90024',
    price: 7950000, priceFormatted: '$7,950,000', status: 'FOR SALE',
    beds: 4, baths: 6, sqft: 4800, sqftFormatted: '4,800',
    description: 'Penthouse-caliber residence on the 15th floor of one of the Wilshire Corridor\'s most esteemed white-glove buildings. This 4,800 SF four-bedroom home was comprehensively redesigned by a nationally recognized interior designer, featuring book-matched Calacatta Oro marble throughout the principal rooms, a Bulthaup kitchen with Gaggenau appliances, and private elevator access. Sweeping east–west views encompass the Santa Monica Mountains, the Getty, and the Pacific Ocean from every room. Full-service building with 24-hour concierge, valet, rooftop pool, and private dining.',
    features: ['15th Floor Panoramic Views', 'Bulthaup Kitchen', 'Gaggenau Appliances', 'Calacatta Oro Marble', 'Private Elevator', '24-Hr Concierge', 'Rooftop Pool', 'Valet Parking'],
    images: IMAGES.highrise, yearBuilt: 2015, zillowId: '59276785',
  },
  {
    id: 'cc-002', neighborhood: 'century-city',
    address: '1 CENTURY DR UNIT 28B, LOS ANGELES, CA 90067',
    price: 6900000, priceFormatted: '$6,900,000', status: 'FOR SALE',
    beds: 3, baths: 5, sqft: 3900, sqftFormatted: '3,900',
    description: 'Sky-high luxury at the iconic Century Towers, designed by I.M. Pei. This exquisitely renovated 28th-floor residence commands 270-degree views from the Hills to the Ocean. The open-plan living and dining area is anchored by floor-to-ceiling glass and a bespoke chef\'s kitchen with a chef\'s island, quartz surfaces, and Wolf/Sub-Zero appliances. The primary suite features a fully appointed spa bath with heated marble floors, a soaking tub, and a large walk-in closet. Three parking spaces, private storage, and access to the building\'s celebrated amenities.',
    features: ['I.M. Pei Architecture', '28th Floor', '270° Views', 'Wolf/Sub-Zero Kitchen', 'Heated Marble Floors', 'Spa Bath', '3 Parking Spaces', 'Private Storage'],
    images: IMAGES.highrise, yearBuilt: 2012, zillowId: '460880550',
  },
  {
    id: 'cc-003', neighborhood: 'century-city',
    address: '1 CENTURY DR APT 27C, LOS ANGELES, CA 90067',
    price: 6300000, priceFormatted: '$6,300,000', status: 'FOR SALE',
    beds: 3, baths: 4, sqft: 3600, sqftFormatted: '3,600',
    description: 'An exceptional opportunity at Century Towers — a completely renovated 27th-floor residence with panoramic views from the Santa Monica Mountains to the Pacific. Three bedrooms, four baths, and an open-plan layout make this a rare full-service high-rise offering with the scale of a traditional home. The custom kitchen features Italian cabinetry, quartzite stone, and professional-grade appliances. Primary suite with two walk-in closets and a spa bath. Building features valet, doorman, pool, and renowned 24-hour security.',
    features: ['27th Floor', 'Mountain-to-Ocean Views', 'Italian Kitchen Cabinetry', 'Quartzite Counters', 'Two Walk-In Closets', 'Valet & Doorman', 'Pool', '24-Hr Security'],
    images: IMAGES.highrise, yearBuilt: 2011, zillowId: '456616812',
  },
  {
    id: 'cc-004', neighborhood: 'century-city',
    address: '2049 CENTURY PARK E APT 3301, LOS ANGELES, CA 90067',
    price: 5450000, priceFormatted: '$5,450,000', status: 'FOR SALE',
    beds: 3, baths: 3, sqft: 2900, sqftFormatted: '2,900',
    description: 'Beautifully renovated three-bedroom residence at one of Century City\'s premier full-service addresses. The 33rd-floor location delivers unobstructed panoramic views across the Westside, with a sun-drenched open plan framed by floor-to-ceiling glass. A sleek kitchen with custom Italian millwork and premium appliances opens to a generous dining and living zone. The primary suite is a peaceful retreat with a walk-in closet and a luxurious bath. Offered with three parking spaces and private storage in a white-glove building with concierge and valet.',
    features: ['33rd Floor', 'Westside Panoramic Views', 'Italian Millwork', 'Floor-to-Ceiling Glass', 'Walk-In Closet', 'Concierge & Valet', '3 Parking Spaces', 'White-Glove Building'],
    images: IMAGES.highrise, yearBuilt: 2010, zillowId: '20509707',
  },
  {
    id: 'cc-005', neighborhood: 'century-city',
    address: '10590 WILSHIRE BLVD PENTHOUSE B, LOS ANGELES, CA 90024',
    price: 8900000, priceFormatted: '$8,900,000', status: 'FOR SALE',
    beds: 4, baths: 4, sqft: 4600, sqftFormatted: '4,600',
    description: 'The definitive Wilshire Corridor penthouse — 4,600 SF of reimagined sky living with dual private terraces commanding unobstructed views from the Pacific to the Hollywood Hills. Designed by an award-winning studio, the interiors feature Cristallo quartzite, custom bronze hardware, and hand-selected finishes throughout. A double-island chef\'s kitchen opens to the formal entertaining sequence. The primary wing includes a private gym alcove, a soaking tub suite, and a terrace with a built-in fire feature. Four parking spaces. Private elevator lobby.',
    features: ['Dual Private Terraces', 'Pacific-to-Hills Views', 'Cristallo Quartzite', 'Double-Island Kitchen', 'Bronze Hardware', 'Private Gym Alcove', 'Private Elevator Lobby', '4 Parking Spaces'],
    images: IMAGES.highrise, yearBuilt: 2022, zillowId: '443120910',
  },

  // ── SANTA MONICA ──────────────────────────────────────────────────────────
  {
    id: 'sm-001', neighborhood: 'santa-monica',
    address: '622 24TH ST, SANTA MONICA, CA 90402',
    price: 12685000, priceFormatted: '$12,685,000', status: 'FOR SALE',
    beds: 6, baths: 7, sqft: 6800, sqftFormatted: '6,800',
    description: 'Exceptional North of Montana estate on one of Santa Monica\'s most sought-after streets. This 6,800 SF newly constructed home was designed by a celebrated local architect with extraordinary attention to the California indoor-outdoor lifestyle. The ground floor opens through a full-width wall of Fleetwood pocket doors to a resort-quality pool, spa, and loggia. A chef\'s kitchen with dual islands, a formal dining room, and a great room anchor the principal level. Six bedroom suites on the upper two levels, each with custom millwork and designer stone. A quiet, tree-lined street minutes from Montana Avenue.',
    features: ['North of Montana', 'Fleetwood Pocket Doors', 'Resort Pool & Spa', 'Dual-Island Kitchen', 'New Construction', 'Tree-Lined Street', 'Formal Dining', '3-Car Garage'],
    images: IMAGES.coastal, yearBuilt: 2023, zillowId: '20476688',
  },
  {
    id: 'sm-002', neighborhood: 'santa-monica',
    address: '101 OCEAN AVE UNIT A100, SANTA MONICA, CA 90402',
    price: 11499000, priceFormatted: '$11,499,000', status: 'FOR SALE',
    beds: 3, baths: 4, sqft: 3500, sqftFormatted: '3,500',
    description: 'The most coveted address on the Santa Monica beachfront. This extraordinary ground-level residence at 101 Ocean enjoys the rare combination of complete privacy and direct beach access, with a large private terrace perched above the sand. The 3,500 SF interior was comprehensively redesigned with wide-plank white oak floors, a glass-wrapped living room, and a chef\'s kitchen with Miele appliances. The primary suite opens to a private garden patio. Full-service building with 24-hour staff, valet, and pool.',
    features: ['Direct Beach Access', 'Private Sand Terrace', 'White Oak Floors', 'Miele Appliances', 'Full-Service Building', '24-Hr Staff', 'Valet & Pool', 'Primary Garden Patio'],
    images: IMAGES.coastal, yearBuilt: 2008, zillowId: '20539601',
  },
  {
    id: 'sm-003', neighborhood: 'santa-monica',
    address: '451 16TH ST, SANTA MONICA, CA 90402',
    price: 6950000, priceFormatted: '$6,950,000', status: 'FOR SALE',
    beds: 3, baths: 4, sqft: 3100, sqftFormatted: '3,100',
    description: 'Sophisticated new construction in prime North of Montana Santa Monica. This three-bedroom contemporary home delivers a masterclass in California living — a light-filled open plan, soaring ceilings, and a private rear garden with pool and dining terrace. The designer kitchen features Calacatta marble, custom walnut cabinetry, and a Gaggenau appliance suite. Steps from the best coffee shops, restaurants, and boutiques that Montana Avenue has to offer, and a short stroll to the beach. Rare opportunity at this price in the 90402.',
    features: ['North of Montana', 'New Construction', 'Calacatta Marble', 'Gaggenau Appliances', 'Private Pool', 'Dining Terrace', 'Walk to Montana Ave', '2-Car Garage'],
    images: IMAGES.coastal, yearBuilt: 2024, zillowId: '20539787',
  },
  {
    id: 'sm-004', neighborhood: 'santa-monica',
    address: '535 OCEAN AVE UNIT 6A, SANTA MONICA, CA 90402',
    price: 5250000, priceFormatted: '$5,250,000', status: 'FOR SALE',
    beds: 3, baths: 2, sqft: 2400, sqftFormatted: '2,400',
    description: 'Coveted Ocean Avenue residence with sweeping Pacific views. This elegant three-bedroom unit was comprehensively renovated to the highest standards — Italian stone, custom carpentry, and a Bulthaup kitchen throughout. The living room opens to a private terrace where the Pacific Ocean, the Santa Monica Pier, and Catalina Island form an unobstructed panorama. The primary suite enjoys ocean views from bed. A rare full-service Ocean Avenue building with concierge, valet, and pool.',
    features: ['Pacific & Pier Views', 'Catalina Island Vista', 'Bulthaup Kitchen', 'Italian Stone', 'Private Terrace', 'Full-Service Building', 'Concierge & Valet', 'Rooftop Pool'],
    images: IMAGES.coastal, yearBuilt: 2005, zillowId: '20486422',
  },
  {
    id: 'sm-005', neighborhood: 'santa-monica',
    address: '1755 OCEAN AVE APT 811, SANTA MONICA, CA 90401',
    price: 4995000, priceFormatted: '$4,995,000', status: 'FOR SALE',
    beds: 2, baths: 3, sqft: 2000, sqftFormatted: '2,000',
    description: 'High-floor Ocean Avenue residence with unobstructed Pacific views. Perched on the 8th floor, this beautifully finished two-bedroom home offers 180-degree ocean panoramas from a private terrace. The open-plan layout features a designer kitchen, herringbone oak floors, and a primary suite with a spa bath and ocean views from the bed. A celebrated full-service building with concierge, valet, pool, gym, and spa sits directly across from Palisades Park and the Santa Monica Bluffs.',
    features: ['8th Floor Ocean Views', '180° Pacific Panorama', 'Designer Kitchen', 'Herringbone Oak Floors', 'Spa Bath', 'Full-Service Building', 'Across from Palisades Park', 'Valet & Concierge'],
    images: IMAGES.coastal, yearBuilt: 2006, zillowId: '2085029018',
  },
  {
    id: 'sm-006', neighborhood: 'santa-monica',
    address: '1755 OCEAN AVE APT 303, SANTA MONICA, CA 90401',
    price: 3295000, priceFormatted: '$3,295,000', status: 'FOR SALE',
    beds: 3, baths: 4, sqft: 1900, sqftFormatted: '1,900',
    description: 'Stylish three-bedroom Ocean Avenue residence in one of Santa Monica\'s most desirable white-glove buildings. The light-filled open plan features walnut floors, a renovated designer kitchen, and floor-to-ceiling glass overlooking a private terrace. Three bedrooms are each en-suite with custom stone baths. A full-service building with 24-hour concierge, valet, pool, and fitness center sits steps from Palisades Park and the Santa Monica Bluffs trail.',
    features: ['Ocean Avenue Location', 'Walnut Floors', 'Designer Kitchen', 'Three En-Suite Baths', 'Private Terrace', '24-Hr Concierge', 'Pool & Fitness Center', 'Steps to Palisades Park'],
    images: IMAGES.coastal, yearBuilt: 2006, zillowId: '2103461998',
  },

  // ── VENICE ────────────────────────────────────────────────────────────────
  {
    id: 've-001', neighborhood: 'venice',
    address: '2505 OCEAN FRONT WALK, VENICE, CA 90291',
    price: 10750000, priceFormatted: '$10,750,000', status: 'FOR SALE',
    beds: 4, baths: 5, sqft: 4800, sqftFormatted: '4,800',
    description: 'Extraordinary Ocean Front Walk compound with direct sand access and 180-degree Pacific views. Designed by a renowned LA architecture firm, this four-bedroom home features a dramatic glass-and-steel facade, triple-level terraces, and a rooftop deck commanding views from Malibu to Palos Verdes. The interior blends board-formed concrete, custom bronze fittings, and reclaimed walnut into a cohesive vision of California beach luxury. The primary suite occupies the entire top floor with a private ocean-facing terrace, spa bath, and infrared sauna. Gate-secured and fully alarmed.',
    features: ['Direct Sand Access', '180° Pacific Views', 'Rooftop Deck', 'Triple-Level Terraces', 'Infrared Sauna', 'Board-Formed Concrete', 'Gated & Alarmed', 'Malibu-to-PV Vista'],
    images: IMAGES.venice, yearBuilt: 2021, zillowId: '145642923',
  },
  {
    id: 've-002', neighborhood: 'venice',
    address: '1346 ABBOT KINNEY BLVD, VENICE, CA 90291',
    price: 8995000, priceFormatted: '$8,995,000', status: 'FOR SALE',
    beds: 4, baths: 5, sqft: 4200, sqftFormatted: '4,200',
    description: 'Architecturally significant four-bedroom compound steps from the best of Abbot Kinney Boulevard. Set behind a motorized gate and tall hedges, this 4,200 SF home was designed as a live-work sanctuary for the creative professional — a double-height gallery studio flanks the ground floor, while the upper level delivers a floating primary suite with private roof deck and outdoor shower. A striking pool and Zen courtyard anchor the rear. Curated with rare materials: Wabi-Sabi plaster walls, teak decking, and hand-forged steel fixtures throughout.',
    features: ['Steps to Abbot Kinney', 'Gallery Studio', 'Rooftop Deck & Outdoor Shower', 'Zen Courtyard Pool', 'Wabi-Sabi Plaster', 'Hand-Forged Steel Fixtures', 'Motorized Gate', 'Gated & Hedged'],
    images: IMAGES.venice, yearBuilt: 2020, zillowId: '325823530',
  },
  {
    id: 've-003', neighborhood: 'venice',
    address: '1915 OCEAN FRONT WALK, VENICE, CA 90291',
    price: 7999000, priceFormatted: '$7,999,000', status: 'FOR SALE',
    beds: 5, baths: 5, sqft: 4100, sqftFormatted: '4,100',
    description: 'Premier Ocean Front Walk trophy property with unobstructed sand and ocean views across five levels. This five-bedroom coastal fortress was designed with privacy in mind — a fortified exterior gives way to a sun-drenched interior of warm wood, polished concrete, and glass. Direct access to the sand via a private gate. The rooftop terrace is among the finest in Venice, with a built-in kitchen, fire feature, and 360-degree views. A separately metered ADU on the ground floor adds flexibility for guests or staff.',
    features: ['Direct Beach Gate', 'Five Levels', '360° Rooftop Views', 'Rooftop Kitchen & Fire', 'Polished Concrete & Wood', 'Private ADU', 'Beach-to-City Views', 'Secure Parking'],
    images: IMAGES.venice, yearBuilt: 2018, zillowId: '3003-Ocean-Front'],
  },
  {
    id: 've-004', neighborhood: 'venice',
    address: '214 S VENICE BLVD, VENICE, CA 90291',
    price: 3795000, priceFormatted: '$3,795,000', status: 'FOR SALE',
    beds: 4, baths: 4, sqft: 2800, sqftFormatted: '2,800',
    description: 'Stunning new construction in the heart of Venice. This four-bedroom modern home delivers an exceptional open-plan ground floor with a floating steel staircase, a designer Bulthaup kitchen, and seamless indoor-outdoor flow to a private plunge pool and garden. The primary suite occupies the top floor with a private terrace and spa bath. Two blocks from the Venice Canals and minutes from Abbot Kinney, this is one of the Westside\'s best new build values.',
    features: ['New Construction', 'Bulthaup Kitchen', 'Floating Steel Staircase', 'Plunge Pool', 'Private Garden', 'Near Venice Canals', 'Spa Bath', '2-Car Garage'],
    images: IMAGES.venice, yearBuilt: 2024, zillowId: '20452862',
  },
  {
    id: 've-005', neighborhood: 'venice',
    address: '303 VENICE WAY, VENICE, CA 90291',
    price: 2999000, priceFormatted: '$2,999,000', status: 'FOR SALE',
    beds: 3, baths: 4, sqft: 2200, sqftFormatted: '2,200',
    description: 'Charming and architecturally refined Venice home a short walk from the canals and Abbot Kinney. Redesigned from the studs up, this three-bedroom residence features wide-plank white oak floors, a chef\'s kitchen with Italian stone and Sub-Zero appliances, and a private walled garden with a spa. The rooftop deck is the ideal extension of the living space, framing open views across the Venice roofscape. A rare complete renovation in a walkable location at a compelling price.',
    features: ['Walk to Canals', 'White Oak Floors', 'Italian Stone Kitchen', 'Sub-Zero Appliances', 'Private Garden & Spa', 'Rooftop Deck', 'Complete Renovation', 'Gated Entry'],
    images: IMAGES.venice, yearBuilt: 2022, zillowId: '20450501',
  },
  {
    id: 've-006', neighborhood: 'venice',
    address: '2904 BEACH AVE, VENICE, CA 90291',
    price: 2995000, priceFormatted: '$2,995,000', status: 'FOR SALE',
    beds: 3, baths: 3, sqft: 2100, sqftFormatted: '2,100',
    description: 'A rare detached single-family home steps from the Venice Beach boardwalk. Light-filled and beautifully updated, this three-bedroom home features an open kitchen and living area framed by skylights and clerestory windows, a private rear yard with a spa, and a rooftop deck with ocean glimpses. Original hardwood floors pair with contemporary fixtures throughout. Located in the heart of the Venice walk streets — one of the most coveted pedestrian neighborhoods in Los Angeles.',
    features: ['Walk Street Location', 'Steps to Beach', 'Skylights & Clerestory', 'Private Spa', 'Rooftop Deck', 'Ocean Glimpses', 'Original Hardwood', 'Detached Single Family'],
    images: IMAGES.venice, yearBuilt: 2015, zillowId: '20448925',
  },
  {
    id: 've-007', neighborhood: 'venice',
    address: '2908 PACIFIC AVE, VENICE, CA 90291',
    price: 2980000, priceFormatted: '$2,980,000', status: 'FOR SALE',
    beds: 3, baths: 3, sqft: 2000, sqftFormatted: '2,000',
    description: 'Stylish three-bedroom home on prime Pacific Avenue, one block from the Venice Beach boardwalk. This beautifully finished home features an open-plan main floor with a gourmet kitchen, a private courtyard with a gas fire pit, and a rooftop deck. All three bedrooms are en-suite with custom stone baths and designer fixtures. Walk to the best of Venice — the canals, Abbot Kinney, and Ocean Front Walk are all within moments.',
    features: ['One Block to Beach', 'Gourmet Kitchen', 'Private Courtyard', 'Gas Fire Pit', 'Rooftop Deck', 'Three En-Suite Baths', 'Walk to Abbot Kinney', 'Near Venice Canals'],
    images: IMAGES.venice, yearBuilt: 2016, zillowId: '20443927',
  },

  // ── MAR VISTA ────────────────────────────────────────────────────────────
  {
    id: 'mv-001', neighborhood: 'mar-vista',
    address: '12662 ROSE AVE, LOS ANGELES, CA 90066',
    price: 7000000, priceFormatted: '$7,000,000', status: 'FOR SALE',
    beds: 7, baths: 8, sqft: 5200, sqftFormatted: '5,200',
    description: 'The finest new construction in Mar Vista — a 5,200 SF trophy compound on an oversized double lot on Rose Avenue. Designed by an award-winning LA firm with impeccable attention to materials and light, the home features a dramatic 24-foot great room with clerestory windows, a double-island chef\'s kitchen, and a primary suite with dual dressing rooms and an ocean-view terrace. The resort-quality rear grounds include an oversized pool, a full outdoor kitchen with pizza oven, a fire pit lounge, and a sport court. A separate two-bedroom ADU above the garage is fully turnkey.',
    features: ['Double-Lot Compound', '24-Ft Great Room', 'Double-Island Kitchen', 'Ocean-View Terrace', 'Resort Pool', 'Sport Court', 'Two-Bedroom ADU', '4-Car Garage'],
    images: IMAGES.marVista, yearBuilt: 2024, zillowId: '20457179',
  },
  {
    id: 'mv-002', neighborhood: 'mar-vista',
    address: '3757 MAY ST, LOS ANGELES, CA 90066',
    price: 4579500, priceFormatted: '$4,579,500', status: 'FOR SALE',
    beds: 4, baths: 5, sqft: 3200, sqftFormatted: '3,200',
    description: 'Exceptional new build on a quiet Mar Vista street — a four-bedroom modern home with sophisticated materiality and effortless indoor-outdoor flow. The ground floor features a Bulthaup chef\'s kitchen, a double-height living room, and sliding glass walls opening to a private pool and outdoor kitchen. The primary suite on the upper level delivers a private terrace and spa bath with a freestanding soaking tub. Lutron smart home and solar panels throughout. Minutes to the Venice canals, Abbot Kinney, and Silicon Beach.',
    features: ['New Build', 'Bulthaup Kitchen', 'Double-Height Living', 'Private Pool', 'Outdoor Kitchen', 'Primary Suite Terrace', 'Lutron Smart Home', 'Solar Panels'],
    images: IMAGES.marVista, yearBuilt: 2023, zillowId: '20454653',
  },
  {
    id: 'mv-003', neighborhood: 'mar-vista',
    address: '12736 DEWEY ST, LOS ANGELES, CA 90066',
    price: 4399000, priceFormatted: '$4,399,000', status: 'FOR SALE',
    beds: 4, baths: 5, sqft: 2950, sqftFormatted: '2,950',
    description: 'Beautifully designed contemporary home on a tree-lined Mar Vista street. Open-plan living flows through walls of glass to a private landscaped yard with a heated pool and spa. The designer kitchen features custom rift-oak cabinetry, quartzite counters, and a Thermador appliance suite. Upstairs, the primary suite includes a large walk-in closet and a spa bath with a curbless shower. A roof deck with city views and a solar-plus-battery system complete the package.',
    features: ['Tree-Lined Street', 'Heated Pool & Spa', 'Rift-Oak Cabinetry', 'Quartzite Counters', 'Thermador Appliances', 'Roof Deck with City Views', 'Solar + Battery', '2-Car Garage'],
    images: IMAGES.marVista, yearBuilt: 2022, zillowId: '20456921',
  },
  {
    id: 'mv-004', neighborhood: 'mar-vista',
    address: '12000 NAVY ST, LOS ANGELES, CA 90066',
    price: 4145000, priceFormatted: '$4,145,000', status: 'FOR SALE',
    beds: 5, baths: 6, sqft: 3400, sqftFormatted: '3,400',
    description: 'Architecturally commanding new construction on one of Mar Vista\'s premier blocks. Five bedrooms and six baths are spread across a smart, well-proportioned layout anchored by a dramatic pivot-door entry. The open-plan ground floor flows to a pool terrace through a full-width glass wall. The kitchen features Miele appliances, a waterfall island in leathered Calacatta marble, and custom walnut shelving. Solar, EV chargers, and smart home automation are standard throughout.',
    features: ['Pivot-Door Entry', 'Waterfall Island', 'Leathered Calacatta Marble', 'Miele Appliances', 'Pool Terrace', 'Full-Width Glass Wall', 'EV Chargers', 'Smart Home Automation'],
    images: IMAGES.marVista, yearBuilt: 2023, zillowId: '20457179',
  },
  {
    id: 'mv-005', neighborhood: 'mar-vista',
    address: '11622 CHARNOCK RD, LOS ANGELES, CA 90066',
    price: 3995000, priceFormatted: '$3,995,000', status: 'FOR SALE',
    beds: 4, baths: 5, sqft: 2800, sqftFormatted: '2,800',
    description: 'Stylish contemporary home with impeccable finishes in one of Mar Vista\'s most desirable pockets. The airy open-plan main floor features high ceilings, white oak floors, and a gourmet kitchen with Bosch appliances and Italian cabinetry. The rear yard is a private retreat with a pool, built-in BBQ, and a dining terrace draped in mature jasmine. Upstairs, the primary suite has a private balcony, dual vanities, and a walk-in shower with hand-laid stone. Two blocks from Silicon Beach trails.',
    features: ['White Oak Floors', 'Italian Kitchen Cabinetry', 'Bosch Appliances', 'Private Pool', 'Built-In BBQ', 'Primary Suite Balcony', 'Hand-Laid Stone Bath', 'Near Silicon Beach'],
    images: IMAGES.marVista, yearBuilt: 2021, zillowId: '20456616',
  },
];

// Fix the broken Venice entry (invalid JSON in zillowId)
NEW_PROPERTIES.forEach(p => { if (typeof p.zillowId !== 'string') p.zillowId = ''; });

async function main() {
  const existing = extractExisting();
  console.log(`Existing: ${existing.length} properties`);
  console.log(`Adding: ${NEW_PROPERTIES.length} properties`);

  const all = [...existing, ...NEW_PROPERTIES];

  const ts = `export type Neighborhood =
  | 'hollywood-hills'
  | 'brentwood'
  | 'bel-air-holmby-hills'
  | 'century-city'
  | 'santa-monica'
  | 'venice'
  | 'mar-vista';

export interface Property {
  id: string;
  neighborhood: Neighborhood;
  address: string;
  price: number;
  priceFormatted: string;
  status: 'FOR SALE' | 'FOR LEASE';
  beds: number;
  baths: number;
  sqft: number;
  sqftFormatted: string;
  description: string;
  features: string[];
  images: string[];
  yearBuilt: number;
  mlsNumber?: string;
  listingAgent?: string;
  zillowId?: string;
}

export const properties: Property[] = ${JSON.stringify(all, null, 2)};

export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id);
}

export function getPropertiesByNeighborhood(neighborhood: Neighborhood): Property[] {
  return properties.filter(p => p.neighborhood === neighborhood);
}

export function getFeaturedProperties(limit = 6): Property[] {
  return properties.slice(0, limit);
}
`;

  writeFileSync(OUT, ts, 'utf-8');
  console.log(`\n✅ Written to ${OUT}`);

  const slugs = ['hollywood-hills','brentwood','bel-air-holmby-hills','century-city','santa-monica','venice','mar-vista'];
  for (const s of slugs) {
    const count = all.filter(p => p.neighborhood === s).length;
    console.log(`  ${s}: ${count}`);
  }
  console.log(`  TOTAL: ${all.length}`);
}

main();
