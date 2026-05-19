/**
 * Resumes scraping from Century City onward, using the cache to skip
 * already-scraped zpids. Adds per-request timeouts to prevent hangs.
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT   = resolve(__dirname, '../src/data/properties.ts');
const CACHE = resolve(__dirname, '../scripts/scrape-cache.json');

const KEY = '6cfd8783-e2cc-40e0-902f-6f39f90a817a';
const API  = 'https://api.hasdata.com';
const FETCH_TIMEOUT_MS = 25000; // 25 s per request — prevent hangs

const REMAINING_HOODS = [
  {
    slug: 'century-city',
    minPrice: 1500000,
    queries: [
      'site:zillow.com/homedetails "Century City" "Los Angeles" "CA 90067" for sale',
      'site:zillow.com/homedetails "1 Century Dr" "Los Angeles" CA for sale',
      'site:zillow.com/homedetails "Century Hill" "Los Angeles" "CA 90067" for sale',
      'site:zillow.com/homedetails "Wilshire Blvd" "Los Angeles" "CA 90024" condo for sale',
      'site:zillow.com/homedetails "Century Park E" OR "Century Park W" "Los Angeles" "CA 90067"',
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
      'site:zillow.com/homedetails "16th St" OR "22nd St" OR "24th St" "Santa Monica" CA for sale',
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
      'site:zillow.com/homedetails "Pacific Ave" OR "Beach Ave" "Venice" "CA 90291"',
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
      'site:zillow.com/homedetails "Mar Vista" "CA 90066" luxury construction',
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWithTimeout(url, opts, ms = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function googleSearch(query) {
  try {
    const res = await fetchWithTimeout(`${API}/scrape/google/serp`, {
      method: 'POST',
      headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, num: 20 }),
    });
    const data = await res.json();
    if (data.status === 'error') { console.log(`  [SERP] ${data.message}`); return []; }
    return (data.organicResults || [])
      .map(r => r.link)
      .filter(u => u?.includes('zillow.com/homedetails'));
  } catch (e) {
    console.log(`  [SERP err] ${e.message}`);
    return [];
  }
}

async function scrapeZillow(url) {
  for (let i = 0; i < 2; i++) {
    try {
      const res = await fetchWithTimeout(`${API}/scrape/zillow/property`, {
        method: 'POST',
        headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const text = await res.text();
      if (!text?.trim()) { await sleep(800); continue; }
      const d = JSON.parse(text);
      if (d.status === 'error') { return null; }
      return d.property || null;
    } catch { await sleep(800); }
  }
  return null;
}

// ── Cache ────────────────────────────────────────────────────────────────────
function loadCache() {
  try { return JSON.parse(readFileSync(CACHE, 'utf-8')); } catch { return {}; }
}
function saveCache(c) { writeFileSync(CACHE, JSON.stringify(c, null, 2)); }

// ── Build entry ──────────────────────────────────────────────────────────────
function buildEntry(prop, slug, idx) {
  const addr = prop.address || {};
  const street = (addr.addressRaw || addr.street || 'Unknown').toUpperCase();
  const city   = (addr.city || 'Los Angeles').toUpperCase();
  const state  = addr.state || 'CA';
  const zip    = addr.zipcode || '';

  const photos = [];
  if (prop.image) photos.push(prop.image);
  for (const p of (prop.photos || [])) if (!photos.includes(p)) photos.push(p);

  const area = prop.area || {};
  const reso = prop.resoData || {};
  const features = new Set();
  if (reso.garageSpaces > 0)              features.add(`${reso.garageSpaces}-Car Garage`);
  if (reso.poolFeatures?.length || reso.poolPrivateYN) features.add('Private Pool');
  if (reso.spaFeatures?.length  || reso.spaYN)  features.add('Spa');
  if (reso.fireplaceFeatures?.length || reso.fireplaceYN) features.add('Fireplace');
  if (reso.viewDescription?.length) reso.viewDescription.slice(0,2).forEach(v => features.add(`${v} Views`));
  if (reso.appliances?.length)            features.add('Gourmet Kitchen');
  if (reso.securityFeatures?.length)      features.add('Security System');
  if (area.lotSizeRaw)                    features.add(`Lot: ${area.lotSizeRaw}`);
  if (prop.homeType === 'CONDO')          features.add('Luxury High-Rise');
  if ((prop.yearBuilt || 0) >= 2019)      features.add('New Construction');
  while (features.size < 4)              features.add('Premium Finishes');

  const prefix = slug.split('-').map(w => w[0]).join('').slice(0, 3);
  return {
    id: `${prefix}-${String(idx + 1).padStart(3, '0')}`,
    neighborhood: slug,
    address: `${street}, ${city}, ${state} ${zip}`.replace(/\s+,/, ',').trim(),
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

// ── Read existing TS ─────────────────────────────────────────────────────────
function readExistingProperties() {
  const src = readFileSync(OUT, 'utf-8');
  const m = src.match(/export const properties: Property\[\] = (\[[\s\S]*?\]);\n\nexport function/);
  if (!m) return [];
  return JSON.parse(m[1]);
}

// ── Write TS ─────────────────────────────────────────────────────────────────
function writeTS(all) {
  writeFileSync(OUT, `export type Neighborhood =
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
`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const cache = loadCache();
  const existing = readExistingProperties();
  console.log(`Resuming — ${existing.length} existing properties loaded`);

  const newProps = [];

  for (const hood of REMAINING_HOODS) {
    console.log(`\n━━━ ${hood.slug} (min $${(hood.minPrice/1e6).toFixed(1)}M) ━━━`);
    if (!cache[hood.slug]) cache[hood.slug] = {};

    // Collect URLs
    const seenZpids = new Set(Object.keys(cache[hood.slug]));
    const freshUrls = [];

    for (const q of hood.queries) {
      process.stdout.write('  google... ');
      const found = await googleSearch(q);
      let added = 0;
      for (const u of found) {
        const m = u.match(/(\d+)_zpid/);
        if (!m) continue;
        if (!seenZpids.has(m[1])) { seenZpids.add(m[1]); freshUrls.push(u); added++; }
      }
      console.log(`+${added} new (${seenZpids.size} total)`);
      await sleep(2000);
    }

    // Scrape fresh URLs
    const props = [];
    for (let i = 0; i < freshUrls.length; i += 4) {
      const batch = freshUrls.slice(i, i + 4);
      const results = await Promise.all(batch.map(u => scrapeZillow(u)));

      for (let j = 0; j < batch.length; j++) {
        const m = batch[j].match(/(\d+)_zpid/);
        const zpid = m?.[1];
        const p = results[j];

        if (!p) { process.stdout.write('?'); continue; }
        if (zpid) cache[hood.slug][zpid] = { price: p.price, status: p.status };

        if (!p.price || p.price < hood.minPrice) { process.stdout.write('·'); continue; }
        if (!['FOR_SALE','FOR_RENT'].includes(p.status)) { process.stdout.write('✗'); continue; }
        if (!p.photos?.length && !p.image) { process.stdout.write('□'); continue; }

        props.push(p);
        process.stdout.write('✓');
      }
      saveCache(cache);
      await sleep(400);
    }

    console.log(`\n  → ${props.length} qualifying`);
    props.sort((a, b) => b.price - a.price);
    const top = props.slice(0, 20);
    top.forEach(p => console.log(`     $${String(p.price.toLocaleString()).padStart(14)} — ${p.address?.street || ''} (${p.beds}bd/${p.baths}ba)`));

    newProps.push(...top.map((p, i) => buildEntry(p, hood.slug, i)));

    // Incremental save
    const all = [...existing, ...newProps];
    writeTS(all);
    console.log(`  💾 Saved — total ${all.length}`);

    await sleep(2500);
  }

  const all = [...existing, ...newProps];
  writeTS(all);
  console.log(`\n✅ COMPLETE — ${all.length} total`);
  const slugs = ['hollywood-hills','brentwood','bel-air-holmby-hills','century-city','santa-monica','venice','mar-vista'];
  for (const s of slugs) console.log(`   ${s}: ${all.filter(p => p.neighborhood === s).length}`);
}

main().catch(console.error);
