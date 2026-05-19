/**
 * Scrapes the remaining 5 neighborhoods not yet populated, then merges
 * with the already-written Hollywood Hills + Brentwood data.
 */
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '../src/data/properties.ts');

const API_KEY = '3c8ef2bf-3213-4e66-9a77-6ac846ac99d7';
const HASDATA = 'https://api.hasdata.com';

const REMAINING = [
  {
    slug: 'bel-air-holmby-hills',
    label: 'Bel Air – Holmby Hills',
    queries: [
      'site:zillow.com/homedetails "Bel Air" "CA 90077" for sale',
      'site:zillow.com/homedetails "Bellagio Rd" "Los Angeles" CA 90077',
      'site:zillow.com/homedetails "Bel Air Rd" "Los Angeles" CA 90077',
      'site:zillow.com/homedetails "Holmby Hills" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Mapleton" OR "Carolwood" OR "Copa De Oro" "Los Angeles" CA',
    ],
    minPrice: 5000000,
  },
  {
    slug: 'century-city',
    label: 'Century City',
    queries: [
      'site:zillow.com/homedetails "CA 90067" for sale',
      'site:zillow.com/homedetails "1 Century Dr" "Los Angeles" CA',
      'site:zillow.com/homedetails "Century Hill" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Wilshire Blvd" "CA 90024" condo for sale',
      'site:zillow.com/homedetails "10724 Wilshire" OR "10580 Wilshire" OR "10727 Wilshire" "Los Angeles" CA',
    ],
    minPrice: 1500000,
  },
  {
    slug: 'santa-monica',
    label: 'Santa Monica',
    queries: [
      'site:zillow.com/homedetails "Santa Monica" "CA 90402" for sale',
      'site:zillow.com/homedetails "Santa Monica" "CA 90403" for sale',
      'site:zillow.com/homedetails "Ocean Ave" "Santa Monica" CA for sale',
      'site:zillow.com/homedetails "Santa Monica" "CA 90401" for sale',
      'site:zillow.com/homedetails "16th St" OR "22nd St" OR "24th St" "Santa Monica" CA for sale',
    ],
    minPrice: 2500000,
  },
  {
    slug: 'venice',
    label: 'Venice',
    queries: [
      'site:zillow.com/homedetails "Venice" "CA 90291" for sale',
      'site:zillow.com/homedetails "Ocean Front Walk" "Venice" CA',
      'site:zillow.com/homedetails "Abbot Kinney" "Venice" CA',
      'site:zillow.com/homedetails "Carroll Canal" OR "Grand Canal" "Venice" CA',
      'site:zillow.com/homedetails "Pacific Ave" "Venice" "CA 90291"',
    ],
    minPrice: 2000000,
  },
  {
    slug: 'mar-vista',
    label: 'Mar Vista',
    queries: [
      'site:zillow.com/homedetails "Mar Vista" "CA 90066" for sale',
      'site:zillow.com/homedetails "Grand View Blvd" "Los Angeles" CA 90066',
      'site:zillow.com/homedetails "Navy St" OR "Rose Ave" OR "Dewey St" "Los Angeles" "CA 90066"',
      'site:zillow.com/homedetails "Charnock" OR "May St" OR "Inglewood Blvd" "Los Angeles" "CA 90066"',
      'site:zillow.com/homedetails "Los Angeles" "CA 90066" luxury new construction for sale',
    ],
    minPrice: 1800000,
  },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function googleSearch(query) {
  try {
    const res = await fetch(`${HASDATA}/scrape/google/serp`, {
      method: 'POST',
      headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num: 20 }),
    });
    const data = await res.json();
    return (data.organicResults || [])
      .map(r => r.link)
      .filter(u => u?.includes('zillow.com/homedetails'));
  } catch { return []; }
}

async function scrapeProperty(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(`${HASDATA}/scrape/zillow/property`, {
        method: 'POST',
        headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const text = await res.text();
      if (!text?.trim()) { await sleep(1000); continue; }
      const d = JSON.parse(text);
      return d.property || null;
    } catch { await sleep(1000); }
  }
  return null;
}

function buildEntry(prop, slug, idx) {
  const addr = prop.address || {};
  const street = (addr.addressRaw || addr.street || 'Unknown').toUpperCase();
  const city = (addr.city || 'Los Angeles').toUpperCase();
  const state = addr.state || 'CA';
  const zip = addr.zipcode || '';

  const photos = [];
  if (prop.image) photos.push(prop.image);
  for (const p of (prop.photos || [])) if (!photos.includes(p)) photos.push(p);

  const area = prop.area || {};
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
  if ((prop.yearBuilt || 0) >= 2018) features.push('New Construction');
  while (features.length < 3) features.push('Premium Location');

  const prefix = slug.split('-').map(w => w[0]).join('').slice(0, 3);
  return {
    id: `${prefix}-${String(idx + 1).padStart(3, '0')}`,
    neighborhood: slug,
    address: `${street}, ${city}, ${state} ${zip}`.trim(),
    price: prop.price || 0,
    priceFormatted: `$${(prop.price || 0).toLocaleString()}`,
    status: prop.status === 'FOR_RENT' ? 'FOR LEASE' : 'FOR SALE',
    beds: prop.beds || 0,
    baths: prop.baths || 0,
    sqft: area.livingArea || 0,
    sqftFormatted: area.livingArea ? area.livingArea.toLocaleString() : 'N/A',
    description: (prop.description || '').trim() || `Exceptional residence in ${addr.city || 'Los Angeles'}.`,
    features: [...new Set(features)].slice(0, 8),
    images: photos.slice(0, 12),
    yearBuilt: prop.yearBuilt || 2020,
    mlsNumber: prop.mlsId || undefined,
    zillowId: String(prop.id || ''),
  };
}

async function scrapeNeighborhood(hood) {
  console.log(`\n=== ${hood.label} ===`);
  await sleep(3000); // cool-down before each neighborhood

  const seen = new Set();
  const urls = [];
  for (const q of hood.queries) {
    console.log(`  Searching...`);
    const found = await googleSearch(q);
    for (const u of found) if (!seen.has(u)) { seen.add(u); urls.push(u); }
    await sleep(2000); // longer delay between Google calls
  }
  console.log(`  Found ${urls.length} unique URLs`);

  const raw = [];
  const seenIds = new Set();
  for (let i = 0; i < urls.length; i += 4) {
    const batch = urls.slice(i, i + 4);
    const results = await Promise.all(batch.map(u => scrapeProperty(u)));
    for (const p of results) {
      if (!p?.price || !p.id) continue;
      if (seenIds.has(p.id)) continue;
      seenIds.add(p.id);
      if (p.price < hood.minPrice) { process.stdout.write('·'); continue; }
      if (!['FOR_SALE', 'FOR_RENT'].includes(p.status)) { process.stdout.write('✗'); continue; }
      if (!p.photos?.length && !p.image) { process.stdout.write('□'); continue; }
      raw.push(p);
      process.stdout.write('✓');
    }
    await sleep(600);
  }
  console.log(`\n  => ${raw.length} qualifying`);

  raw.sort((a, b) => b.price - a.price);
  const top = raw.slice(0, 20);
  top.forEach(p => console.log(`     $${p.price.toLocaleString()} — ${p.address?.street || ''} (${p.beds}bd/${p.baths}ba)`));
  return top.map((p, i) => buildEntry(p, hood.slug, i));
}

// ── Read existing properties (Hollywood Hills + Brentwood already scraped) ──
function extractExistingProperties() {
  try {
    const src = readFileSync(OUT_PATH, 'utf-8');
    // Quick JSON extraction between the array brackets
    const match = src.match(/export const properties: Property\[\] = (\[[\s\S]*?\]);/);
    if (!match) return [];
    return JSON.parse(match[1]);
  } catch { return []; }
}

async function main() {
  const existing = extractExistingProperties();
  console.log(`Loaded ${existing.length} existing properties (HH + Brentwood)`);

  const newProps = [];
  for (const hood of REMAINING) {
    const props = await scrapeNeighborhood(hood);
    newProps.push(...props);
  }

  const all = [...existing, ...newProps];
  console.log(`\n✅ Grand total: ${all.length} properties`);

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

  writeFileSync(OUT_PATH, ts, 'utf-8');
  console.log(`📄 Written to ${OUT_PATH}\n`);

  const slugs = ['hollywood-hills','brentwood','bel-air-holmby-hills','century-city','santa-monica','venice','mar-vista'];
  for (const s of slugs) {
    const count = all.filter(p => p.neighborhood === s).length;
    console.log(`  ${s}: ${count}`);
  }
}

main().catch(console.error);
