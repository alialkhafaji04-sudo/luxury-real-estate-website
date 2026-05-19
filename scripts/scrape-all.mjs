/**
 * Full Zillow scrape — all 7 neighborhoods, ~20 properties each.
 * Uses Hasdata Google SERP to collect URLs, then Zillow property scraper for details.
 * Saves incrementally so progress is never lost.
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/properties.ts');
const CACHE = resolve(__dirname, '../scripts/scrape-cache.json');

const KEY = '6cfd8783-e2cc-40e0-902f-6f39f90a817a';
const API = 'https://api.hasdata.com';

// ── Neighborhood config ─────────────────────────────────────────────────────
const HOODS = [
  {
    slug: 'hollywood-hills',
    minPrice: 3000000,
    queries: [
      'site:zillow.com/homedetails "Hollywood Hills" "Los Angeles" "CA 90046" for sale',
      'site:zillow.com/homedetails "Hollywood Hills" "Los Angeles" "CA 90068" for sale',
      'site:zillow.com/homedetails "Hollywood Hills" "Los Angeles" "CA 90069" for sale',
      'site:zillow.com/homedetails "Mulholland Dr" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Nichols Canyon" OR "Laurel Canyon" "Los Angeles" CA 90046 for sale',
    ],
  },
  {
    slug: 'brentwood',
    minPrice: 3000000,
    queries: [
      'site:zillow.com/homedetails "Brentwood" "Los Angeles" "CA 90049" for sale',
      'site:zillow.com/homedetails "Mandeville Canyon" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Brentwood Park" OR "Brentwood Grove" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Carmelina" OR "Saltair" OR "Westridge" "CA 90049" for sale',
      'site:zillow.com/homedetails "Rochedale" OR "La Condesa" OR "Chalon" "Los Angeles" "CA 90049"',
    ],
  },
  {
    slug: 'bel-air-holmby-hills',
    minPrice: 5000000,
    queries: [
      'site:zillow.com/homedetails "Bel Air" "Los Angeles" "CA 90077" for sale',
      'site:zillow.com/homedetails "Bellagio Rd" "Los Angeles" "CA 90077" for sale',
      'site:zillow.com/homedetails "Bel Air Rd" "Los Angeles" "CA 90077" for sale',
      'site:zillow.com/homedetails "Holmby Hills" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Mapleton" OR "Carolwood" OR "Copa De Oro" "Los Angeles" CA for sale',
    ],
  },
  {
    slug: 'century-city',
    minPrice: 1500000,
    queries: [
      'site:zillow.com/homedetails "Century City" "Los Angeles" "CA 90067" for sale',
      'site:zillow.com/homedetails "1 Century Dr" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Century Hill" "Los Angeles" "CA 90067" for sale',
      'site:zillow.com/homedetails "Wilshire Blvd" "Los Angeles" "CA 90024" condo for sale',
      'site:zillow.com/homedetails "Century Park" "Los Angeles" "CA 90067" for sale',
    ],
  },
  {
    slug: 'santa-monica',
    minPrice: 2500000,
    queries: [
      'site:zillow.com/homedetails "Santa Monica" "CA 90402" for sale',
      'site:zillow.com/homedetails "Santa Monica" "CA 90403" for sale',
      'site:zillow.com/homedetails "Ocean Ave" "Santa Monica" CA for sale',
      'site:zillow.com/homedetails "Santa Monica" "CA 90401" for sale',
      'site:zillow.com/homedetails "Adelaide" OR "Mabery" OR "24th St" "Santa Monica" CA for sale',
    ],
  },
  {
    slug: 'venice',
    minPrice: 2000000,
    queries: [
      'site:zillow.com/homedetails "Venice" "Los Angeles" "CA 90291" for sale',
      'site:zillow.com/homedetails "Ocean Front Walk" "Venice" CA for sale',
      'site:zillow.com/homedetails "Abbot Kinney" "Venice" CA for sale',
      'site:zillow.com/homedetails "Carroll Canal" OR "Grand Canal" "Venice" CA for sale',
      'site:zillow.com/homedetails "Pacific Ave" OR "Beach Ave" "Venice" "CA 90291" for sale',
    ],
  },
  {
    slug: 'mar-vista',
    minPrice: 1800000,
    queries: [
      'site:zillow.com/homedetails "Mar Vista" "Los Angeles" "CA 90066" for sale',
      'site:zillow.com/homedetails "Grand View Blvd" "Los Angeles" "CA 90066" for sale',
      'site:zillow.com/homedetails "Navy St" OR "Rose Ave" OR "Dewey St" "Los Angeles" "CA 90066"',
      'site:zillow.com/homedetails "Charnock" OR "May St" OR "Inglewood Blvd" "Los Angeles" "CA 90066"',
      'site:zillow.com/homedetails "Mar Vista" "CA 90066" luxury new construction',
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function googleSearch(query) {
  try {
    const res = await fetch(`${API}/scrape/google/serp`, {
      method: 'POST',
      headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num: 20 }),
    });
    const data = await res.json();
    if (data.status === 'error') {
      console.log(`    [SERP error] ${data.message}`);
      return [];
    }
    return (data.organicResults || [])
      .map(r => r.link)
      .filter(u => u?.includes('zillow.com/homedetails'));
  } catch (e) {
    console.log(`    [SERP exception] ${e.message}`);
    return [];
  }
}

async function scrapeZillow(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${API}/scrape/zillow/property`, {
        method: 'POST',
        headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const text = await res.text();
      if (!text?.trim()) { await sleep(1200); continue; }
      const data = JSON.parse(text);
      if (data.status === 'error') {
        console.log(`    [Zillow error] ${data.message}`);
        return null;
      }
      return data.property || null;
    } catch { await sleep(1200); }
  }
  return null;
}

// ── Cache (persist scraped zpids so re-runs don't re-scrape) ─────────────────
function loadCache() {
  try { return JSON.parse(readFileSync(CACHE, 'utf-8')); } catch { return {}; }
}
function saveCache(cache) {
  writeFileSync(CACHE, JSON.stringify(cache, null, 2));
}

// ── Build property object ────────────────────────────────────────────────────
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
  const features = new Set();
  if (reso.garageSpaces > 0) features.add(`${reso.garageSpaces}-Car Garage`);
  if (reso.poolFeatures?.length || reso.poolPrivateYN) features.add('Private Pool');
  if (reso.spaFeatures?.length || reso.spaYN) features.add('Spa');
  if (reso.fireplaceFeatures?.length || reso.fireplaceYN) features.add('Fireplace');
  if (reso.viewDescription?.length) reso.viewDescription.slice(0, 2).forEach(v => features.add(`${v} Views`));
  if (reso.appliances?.length) features.add('Gourmet Kitchen');
  if (reso.securityFeatures?.length) features.add('Security System');
  if (area.lotSizeRaw) features.add(`Lot: ${area.lotSizeRaw}`);
  if (prop.homeType === 'CONDO') features.add('Luxury High-Rise');
  if ((prop.yearBuilt || 0) >= 2019) features.add('New Construction');
  while (features.size < 4) features.add('Premium Finishes');

  const prefix = slug.split('-').map(w => w[0]).join('').slice(0, 3);
  return {
    id: `${prefix}-${String(idx + 1).padStart(3, '0')}`,
    neighborhood: slug,
    address: `${street}, ${city}, ${state} ${zip}`.trim().replace(/\s+,/, ','),
    price: prop.price || 0,
    priceFormatted: `$${(prop.price || 0).toLocaleString()}`,
    status: prop.status === 'FOR_RENT' ? 'FOR LEASE' : 'FOR SALE',
    beds: prop.beds || 0,
    baths: prop.baths || 0,
    sqft: area.livingArea || 0,
    sqftFormatted: area.livingArea ? area.livingArea.toLocaleString() : 'N/A',
    description: (prop.description || '').trim() || `Exceptional luxury residence in ${addr.city || 'Los Angeles'}.`,
    features: [...features].slice(0, 8),
    images: photos.slice(0, 12),
    yearBuilt: prop.yearBuilt || 2020,
    mlsNumber: prop.mlsId || undefined,
    zillowId: String(prop.id || ''),
  };
}

// ── Write output TS file ─────────────────────────────────────────────────────
function writeOutput(allProperties) {
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
  writeFileSync(OUT, ts, 'utf-8');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🏠 Starting full Zillow scrape — 7 neighborhoods\n');
  const cache = loadCache();
  const resultsByHood = {};

  for (const hood of HOODS) {
    console.log(`\n━━━ ${hood.slug} (min $${(hood.minPrice/1e6).toFixed(1)}M) ━━━`);

    // ── Step 1: Collect Zillow URLs ──
    const seen = new Set(Object.keys(cache[hood.slug] || {}));
    const urls = [...seen].map(zpid => `https://www.zillow.com/homedetails/${zpid}_zpid/`);
    const newUrls = [];

    for (const q of hood.queries) {
      process.stdout.write(`  google search... `);
      const found = await googleSearch(q);
      let added = 0;
      for (const u of found) {
        const zpidMatch = u.match(/(\d+)_zpid/);
        if (!zpidMatch) continue;
        const zpid = zpidMatch[1];
        if (!seen.has(zpid)) { seen.add(zpid); newUrls.push(u); added++; }
      }
      console.log(`+${added} (total ${seen.size})`);
      await sleep(2500); // respectful delay between Google calls
    }

    // ── Step 2: Scrape properties (new ones first, then cached) ──
    if (!cache[hood.slug]) cache[hood.slug] = {};
    const props = [];
    const allUrls = [...newUrls, ...Object.keys(cache[hood.slug]).filter(zpid => cache[hood.slug][zpid]).map(zpid => `https://www.zillow.com/homedetails/${zpid}_zpid/`)];

    let scraped = 0;
    for (let i = 0; i < allUrls.length; i += 5) {
      const batch = allUrls.slice(i, i + 5);
      const results = await Promise.all(batch.map(u => scrapeZillow(u)));

      for (let j = 0; j < batch.length; j++) {
        const url = batch[j];
        const zpidMatch = url.match(/(\d+)_zpid/);
        const zpid = zpidMatch?.[1];
        const p = results[j];

        if (!p) { process.stdout.write('?'); continue; }
        if (zpid) cache[hood.slug][zpid] = { price: p.price, status: p.status };

        if (!p.price) { process.stdout.write('∅'); continue; }
        if (p.price < hood.minPrice) { process.stdout.write('·'); continue; }
        if (!['FOR_SALE', 'FOR_RENT'].includes(p.status)) { process.stdout.write('✗'); continue; }
        if (!p.photos?.length && !p.image) { process.stdout.write('□'); continue; }

        props.push(p);
        scraped++;
        process.stdout.write('✓');
      }
      saveCache(cache); // save after each batch
      await sleep(500);
    }
    console.log(`\n  → ${scraped} qualifying | ${props.length} total`);

    // Sort by price desc, take top 20
    props.sort((a, b) => b.price - a.price);
    const top = props.slice(0, 20);
    top.forEach(p => console.log(`     $${p.price.toLocaleString().padStart(14)} — ${p.address?.street || ''} (${p.beds}bd/${p.baths}ba)`));

    resultsByHood[hood.slug] = top;

    // Save intermediate output after each neighborhood
    const allSoFar = HOODS.flatMap(h => (resultsByHood[h.slug] || []).map((p, i) => buildEntry(p, h.slug, i)));
    writeOutput(allSoFar);
    console.log(`  💾 Saved ${allSoFar.length} properties so far`);

    await sleep(3000); // cool-down between neighborhoods
  }

  const all = HOODS.flatMap(h => (resultsByHood[h.slug] || []).map((p, i) => buildEntry(p, h.slug, i)));
  writeOutput(all);

  console.log(`\n✅ DONE — ${all.length} total properties`);
  for (const h of HOODS) {
    console.log(`   ${h.slug}: ${(resultsByHood[h.slug] || []).length}`);
  }
}

main().catch(console.error);
