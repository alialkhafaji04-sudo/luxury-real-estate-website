/**
 * Scrapes ~20 real Zillow listings per neighborhood via Hasdata API.
 * Writes the result to src/data/properties.ts
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../src/data/properties.ts');

const API_KEY = '3c8ef2bf-3213-4e66-9a77-6ac846ac99d7';
const HASDATA_BASE = 'https://api.hasdata.com';

const NEIGHBORHOODS = [
  {
    slug: 'hollywood-hills',
    label: 'Hollywood Hills',
    queries: [
      'site:zillow.com/homedetails "Hollywood Hills" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Mulholland" OR "Laurel Canyon" OR "Nichols Canyon" "Los Angeles" CA 90046',
      'site:zillow.com/homedetails "Los Angeles" "CA 90069" for sale',
      'site:zillow.com/homedetails "Hollywood Hills" "CA 90068" for sale',
      'site:zillow.com/homedetails "Outpost" OR "Woodrow Wilson" OR "Rising Glen" "Los Angeles" CA for sale',
    ],
    minPrice: 3000000,
  },
  {
    slug: 'brentwood',
    label: 'Brentwood',
    queries: [
      'site:zillow.com/homedetails "Brentwood" "Los Angeles" "CA 90049" for sale',
      'site:zillow.com/homedetails "Mandeville Canyon" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Carmelina" OR "Saltair" OR "Westridge" "Los Angeles" "90049" for sale',
      'site:zillow.com/homedetails "Brentwood Park" OR "Brentwood Grove" "Los Angeles" CA',
      'site:zillow.com/homedetails "Rochedale" OR "La Condesa" OR "Chalon" "Los Angeles" CA for sale',
    ],
    minPrice: 3000000,
  },
  {
    slug: 'bel-air-holmby-hills',
    label: 'Bel Air Holmby Hills',
    queries: [
      'site:zillow.com/homedetails "Bel Air" "Los Angeles" "CA 90077" for sale',
      'site:zillow.com/homedetails "Holmby Hills" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Bellagio Rd" OR "Bel Air Rd" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Copa De Oro" OR "Mapleton" OR "Carolwood" "Los Angeles" CA',
      'site:zillow.com/homedetails "Bel Air" "CA 90077" mansion estate',
    ],
    minPrice: 5000000,
  },
  {
    slug: 'century-city',
    label: 'Century City',
    queries: [
      'site:zillow.com/homedetails "Century City" "Los Angeles" "CA 90067" for sale',
      'site:zillow.com/homedetails "1 Century Dr" OR "2049 Century Park" "Los Angeles" CA',
      'site:zillow.com/homedetails "Wilshire Blvd" "Los Angeles" "CA 90024" condo for sale',
      'site:zillow.com/homedetails "Wilshire" "Los Angeles" "90024" luxury penthouse',
      'site:zillow.com/homedetails "Century Hill" OR "Century Park" "Los Angeles" "CA 90067"',
    ],
    minPrice: 1500000,
  },
  {
    slug: 'santa-monica',
    label: 'Santa Monica',
    queries: [
      'site:zillow.com/homedetails "Santa Monica" "CA 90402" for sale',
      'site:zillow.com/homedetails "Santa Monica" "CA 90403" for sale luxury',
      'site:zillow.com/homedetails "Ocean Ave" "Santa Monica" CA for sale',
      'site:zillow.com/homedetails "Santa Monica" "CA 90401" for sale',
      'site:zillow.com/homedetails "Adelaide" OR "Mabery" OR "Entrada" "Santa Monica" CA for sale',
    ],
    minPrice: 2500000,
  },
  {
    slug: 'venice',
    label: 'Venice',
    queries: [
      'site:zillow.com/homedetails "Venice" "CA 90291" for sale',
      'site:zillow.com/homedetails "Ocean Front Walk" "Venice" CA for sale',
      'site:zillow.com/homedetails "Abbot Kinney" "Venice" CA for sale',
      'site:zillow.com/homedetails "Carroll Canal" OR "Grand Canal" OR "Sherman Canal" "Venice" CA',
      'site:zillow.com/homedetails "Pacific Ave" OR "Beach Ave" OR "Venice Way" "Venice" "CA 90291"',
    ],
    minPrice: 2000000,
  },
  {
    slug: 'mar-vista',
    label: 'Mar Vista',
    queries: [
      'site:zillow.com/homedetails "Mar Vista" "Los Angeles" "CA 90066" for sale',
      'site:zillow.com/homedetails "Grand View Blvd" OR "Navy St" OR "Rose Ave" "Los Angeles" "CA 90066"',
      'site:zillow.com/homedetails "Dewey St" OR "Charnock" OR "May St" "Los Angeles" "CA 90066"',
      'site:zillow.com/homedetails "Mar Vista" "90066" luxury new home',
      'site:zillow.com/homedetails "Palms Blvd" OR "Inglewood Blvd" "Los Angeles" "CA 90066"',
    ],
    minPrice: 1800000,
  },
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function googleSearch(query, start = 0) {
  try {
    const res = await fetch(`${HASDATA_BASE}/scrape/google/serp`, {
      method: 'POST',
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num: 20, start }),
    });
    const data = await res.json();
    return (data.organicResults || [])
      .map(r => r.link)
      .filter(url => url && url.includes('zillow.com/homedetails'));
  } catch (e) {
    console.error('  Google search error:', e.message);
    return [];
  }
}

async function scrapeProperty(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${HASDATA_BASE}/scrape/zillow/property`, {
        method: 'POST',
        headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const text = await res.text();
      if (!text || text.trim() === '') {
        if (attempt < retries) { await sleep(800); continue; }
        return null;
      }
      const data = JSON.parse(text);
      return data.property || null;
    } catch (e) {
      if (attempt < retries) { await sleep(800); continue; }
      return null;
    }
  }
  return null;
}

function buildPropertyEntry(prop, neighborhood, idx) {
  const addr = prop.address || {};
  const street = (addr.addressRaw || addr.street || 'Unknown Address').toUpperCase();
  const city = addr.city || 'Los Angeles';
  const state = addr.state || 'CA';
  const zip = addr.zipcode || '';
  const fullAddress = `${street}, ${city.toUpperCase()}, ${state} ${zip}`.trim();

  const photos = [];
  if (prop.image) photos.push(prop.image);
  for (const p of (prop.photos || [])) {
    if (!photos.includes(p)) photos.push(p);
  }

  const area = prop.area || {};
  const sqft = area.livingArea || 0;
  const sqftFormatted = sqft > 0 ? sqft.toLocaleString() : 'N/A';

  const price = prop.price || 0;
  const priceFormatted = `$${price.toLocaleString()}`;

  const beds = prop.beds || 0;
  const baths = prop.baths || 0;

  const reso = prop.resoData || {};
  const features = [];
  if (reso.garageSpaces > 0) features.push(`${reso.garageSpaces}-Car Garage`);
  if (reso.poolFeatures?.length || reso.poolPrivateYN) features.push('Private Pool');
  if (reso.spaFeatures?.length || reso.spaYN) features.push('Spa');
  if (reso.fireplaceFeatures?.length || reso.fireplaceYN) features.push('Fireplace');
  if (reso.viewDescription?.length) features.push(...reso.viewDescription.slice(0, 2).map(v => `${v} Views`));
  if (reso.appliances?.length) features.push('Gourmet Kitchen');
  if (reso.securityFeatures?.length) features.push('Security System');
  if (area.lotSizeRaw) features.push(`Lot: ${area.lotSizeRaw}`);
  if (prop.homeType === 'CONDO') features.push('Luxury High-Rise');
  if (prop.yearBuilt >= 2018) features.push('New Construction');
  if (features.length < 3) {
    features.push('Premium Finishes', 'Prestigious Location', 'Smart Home');
  }

  const description = (prop.description || `Exceptional ${beds > 0 ? beds + '-bedroom' : ''} residence offering an unparalleled lifestyle in ${city}.`).trim();

  const prefix = neighborhood.slug.split('-').map(w => w[0]).join('').slice(0, 3);
  const id = `${prefix}-${String(idx + 1).padStart(3, '0')}`;

  return {
    id,
    neighborhood: neighborhood.slug,
    address: fullAddress,
    price,
    priceFormatted,
    status: prop.status === 'FOR_RENT' ? 'FOR LEASE' : 'FOR SALE',
    beds,
    baths,
    sqft,
    sqftFormatted,
    description,
    features: [...new Set(features)].slice(0, 8),
    images: photos.slice(0, 12),
    yearBuilt: prop.yearBuilt || 2020,
    mlsNumber: prop.mlsId || undefined,
    zillowId: String(prop.id || ''),
  };
}

async function scrapeNeighborhood(neighborhood) {
  console.log(`\n=== ${neighborhood.label} ===`);

  // Collect URLs via multiple Google searches + page 2
  const seen = new Set();
  const urls = [];
  for (const query of neighborhood.queries) {
    const found = await googleSearch(query, 0);
    const found2 = found.length < 10 ? await googleSearch(query, 10) : [];
    for (const url of [...found, ...found2]) {
      if (!seen.has(url)) { seen.add(url); urls.push(url); }
    }
    await sleep(400);
  }
  console.log(`  Found ${urls.length} unique URLs`);

  // Scrape in batches of 5
  const raw = [];
  const seenZpids = new Set();
  for (let i = 0; i < urls.length; i += 5) {
    const batch = urls.slice(i, i + 5);
    const results = await Promise.all(batch.map(u => scrapeProperty(u)));
    for (const prop of results) {
      if (!prop || !prop.price || !prop.id) continue;
      if (seenZpids.has(prop.id)) continue;
      seenZpids.add(prop.id);
      if (prop.price < neighborhood.minPrice) {
        process.stdout.write('·');
        continue;
      }
      if (!['FOR_SALE', 'FOR_RENT'].includes(prop.status)) {
        process.stdout.write('✗');
        continue;
      }
      const photos = prop.photos || [];
      if (photos.length === 0 && !prop.image) {
        process.stdout.write('□');
        continue;
      }
      raw.push(prop);
      process.stdout.write('✓');
    }
    await sleep(300);
  }
  console.log(`\n  Scraped: ${raw.length} qualifying properties`);

  raw.sort((a, b) => b.price - a.price);
  const top = raw.slice(0, 20);
  console.log(`  => Keeping ${top.length} (top ${top.length} by price)`);
  top.forEach(p => console.log(`     $${p.price.toLocaleString()} — ${p.address?.street || ''} (${p.beds}bd/${p.baths}ba)`));
  return top.map((p, i) => buildPropertyEntry(p, neighborhood, i));
}

async function main() {
  console.log('Starting Zillow scrape for all 7 neighborhoods...\n');
  const allProperties = [];

  for (const hood of NEIGHBORHOODS) {
    const props = await scrapeNeighborhood(hood);
    allProperties.push(...props);
    await sleep(1200);
  }

  console.log(`\n✅ Total properties collected: ${allProperties.length}`);

  const tsContent = `export type Neighborhood =
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

export const properties: Property[] = ${JSON.stringify(allProperties, null, 2)};

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

  writeFileSync(OUT_PATH, tsContent, 'utf-8');
  console.log(`\n📄 Written to ${OUT_PATH}`);

  console.log('\nBreakdown:');
  for (const hood of NEIGHBORHOODS) {
    const count = allProperties.filter(p => p.neighborhood === hood.slug).length;
    console.log(`  ${hood.label}: ${count} properties`);
  }
}

main().catch(console.error);
