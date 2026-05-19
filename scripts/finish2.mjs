/**
 * Robust completion script — uses https.request with socket timeouts
 * (more reliable than AbortController in Node 21).
 * Saves immediately after each neighborhood.
 */
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT   = resolve(__dirname, '../src/data/properties.ts');
const CACHE = resolve(__dirname, '../scripts/scrape-cache.json');

const KEY = '07de5db8-fff5-45be-9fd9-1a31a3c45000';
const TIMEOUT = 22000; // 22s socket timeout

const sleep = ms => new Promise(r => setTimeout(r, ms));

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.hasdata.com',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-api-key': KEY,
      },
      timeout: TIMEOUT,
    }, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve(buf));
    });
    req.on('timeout', () => { req.destroy(new Error('socket timeout')); });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function googleSearch(q) {
  try {
    const txt = await post('/scrape/google/serp', { q, num: 20 });
    const d = JSON.parse(txt);
    if (d.status === 'error') { console.log(`  [serp] ${d.message}`); return []; }
    return (d.organicResults || []).map(x => x.link).filter(u => u?.includes('zillow.com/homedetails'));
  } catch(e) { console.log(`  [serp err] ${e.message}`); return []; }
}

async function scrape(url) {
  for (let i = 0; i < 2; i++) {
    try {
      const txt = await post('/scrape/zillow/property', { url });
      if (!txt?.trim()) { await sleep(600); continue; }
      const d = JSON.parse(txt);
      if (d.status === 'error') return null;
      return d.property || null;
    } catch(e) {
      console.log(`  [scrape err] ${e.message}`);
      await sleep(600);
    }
  }
  return null;
}

function buildEntry(p, slug, idx) {
  const addr = p.address || {};
  const area = p.area || {};
  const reso = p.resoData || {};
  const feats = new Set();
  if (reso.garageSpaces > 0) feats.add(`${reso.garageSpaces}-Car Garage`);
  if (reso.poolFeatures?.length || reso.poolPrivateYN) feats.add('Private Pool');
  if (reso.spaFeatures?.length  || reso.spaYN)        feats.add('Spa');
  if (reso.fireplaceFeatures?.length || reso.fireplaceYN) feats.add('Fireplace');
  (reso.viewDescription || []).slice(0,2).forEach(v => feats.add(`${v} Views`));
  if (reso.appliances?.length)           feats.add('Gourmet Kitchen');
  if (reso.securityFeatures?.length)     feats.add('Security System');
  if (area.lotSizeRaw)                   feats.add(`Lot: ${area.lotSizeRaw}`);
  if (p.homeType === 'CONDO')            feats.add('Luxury High-Rise');
  if ((p.yearBuilt||0) >= 2019)          feats.add('New Construction');
  for (const f of ['Premium Finishes', 'Smart Home Technology', 'Wine Cellar', 'Concierge Services']) {
    if (feats.size >= 4) break;
    feats.add(f);
  }

  const seen = new Set();
  const photos = [];
  if (p.image) { seen.add(p.image); photos.push(p.image); }
  for (const x of (p.photos||[])) {
    if (photos.length >= 12) break;
    if (!seen.has(x)) { seen.add(x); photos.push(x); }
  }

  const pre = slug.split('-').map(w=>w[0]).join('').slice(0,3);
  return {
    id: `${pre}-${String(idx+1).padStart(3,'0')}`,
    neighborhood: slug,
    address: `${(addr.addressRaw||addr.street||'').toUpperCase()}, ${(addr.city||'LOS ANGELES').toUpperCase()}, ${addr.state||'CA'} ${addr.zipcode||''}`.replace(/\s+,/,',').trim(),
    price: p.price||0,
    priceFormatted: `$${(p.price||0).toLocaleString()}`,
    status: p.status==='FOR_RENT' ? 'FOR LEASE' : 'FOR SALE',
    beds: p.beds||0, baths: p.baths||0,
    sqft: area.livingArea||0,
    sqftFormatted: area.livingArea ? area.livingArea.toLocaleString() : 'N/A',
    description: ((p.description||'').trim() || `Luxury residence in ${addr.city||'Los Angeles'}.`).slice(0, 1500),
    features: [...feats].slice(0,8),
    images: photos.slice(0,12),
    yearBuilt: p.yearBuilt||2020,
    mlsNumber: p.mlsId||undefined,
    zillowId: String(p.id||''),
  };
}

function writeTS(props) {
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

export const properties: Property[] = ${JSON.stringify(props, null, 2)};

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

function readExisting() {
  const src = readFileSync(OUT, 'utf-8');
  const m = src.match(/export const properties: Property\[\] = (\[[\s\S]*\]);\n\nexport function/);
  return m ? JSON.parse(m[1]) : [];
}

async function scrapeZpids(zpids, minPrice, label) {
  const results = [];
  for (const zpid of zpids) {
    const url = `https://www.zillow.com/homedetails/${zpid}_zpid/`;
    const p = await scrape(url);
    if (!p?.price) { process.stdout.write('?'); continue; }
    if (p.price < minPrice) { process.stdout.write('·'); continue; }
    if (!['FOR_SALE','FOR_RENT'].includes(p.status)) { process.stdout.write('✗'); continue; }
    if (!p.photos?.length && !p.image) { process.stdout.write('□'); continue; }
    results.push(p);
    process.stdout.write('✓');
    if (results.length >= 20) break;
  }
  console.log(`\n  ${label}: ${results.length} qualifying`);
  results.sort((a,b) => b.price - a.price);
  results.slice(0,5).forEach(p => console.log(`     $${String((p.price||0).toLocaleString()).padStart(14)} — ${p.address?.street||p.address?.addressRaw||''} (${p.beds}bd/${p.baths}ba)`));
  return results.slice(0,20);
}

async function searchAndScrape(hood, cache) {
  console.log(`\n━━━ ${hood.slug} ━━━`);
  if (!cache[hood.slug]) cache[hood.slug] = {};

  const seen = new Set(Object.keys(cache[hood.slug]));
  const urls = [];

  for (const q of hood.queries) {
    process.stdout.write('  google... ');
    const found = await googleSearch(q);
    let added = 0;
    for (const u of found) {
      const m = u.match(/(\d+)_zpid/);
      if (!m || seen.has(m[1])) continue;
      seen.add(m[1]); urls.push(u); added++;
    }
    console.log(`+${added}`);
    await sleep(2000);
  }

  const results = [];
  for (const url of urls) {
    const m = url.match(/(\d+)_zpid/);
    const p = await scrape(url);
    if (m && p) cache[hood.slug][m[1]] = { price: p.price, status: p.status };

    if (!p?.price || p.price < hood.minPrice) { process.stdout.write('·'); continue; }
    if (!['FOR_SALE','FOR_RENT'].includes(p.status)) { process.stdout.write('✗'); continue; }
    if (!p.photos?.length && !p.image) { process.stdout.write('□'); continue; }
    results.push(p);
    process.stdout.write('✓');
    if (results.length >= 20) break;
  }
  writeFileSync(CACHE, JSON.stringify(cache, null, 2));
  console.log(`\n  ${results.length} qualifying`);
  results.sort((a,b) => b.price - a.price);
  results.slice(0,5).forEach(p => console.log(`     $${String((p.price||0).toLocaleString()).padStart(14)} — ${p.address?.street||p.address?.addressRaw||''} (${p.beds}bd/${p.baths}ba)`));
  return results.slice(0,20);
}

async function main() {
  const cache = JSON.parse(readFileSync(CACHE, 'utf-8'));
  const existing = readExisting();

  const bySlug = {};
  for (const p of existing) {
    if (!bySlug[p.neighborhood]) bySlug[p.neighborhood] = [];
    bySlug[p.neighborhood].push(p);
  }

  console.log(`Current: ${existing.length} properties`);
  ['hollywood-hills','brentwood','bel-air-holmby-hills','century-city','santa-monica','venice','mar-vista']
    .forEach(s => console.log(`  ${s}: ${(bySlug[s]||[]).length}`));

  // ── Bel Air ──────────────────────────────────────────────────────────────
  if (!bySlug['bel-air-holmby-hills']?.length) {
    console.log('\n━━━ RECOVER: bel-air-holmby-hills ━━━');
    const zpids = Object.keys(cache['bel-air-holmby-hills'] || {});
    console.log(`  ${zpids.length} cached zpids`);
    const raw = await scrapeZpids(zpids, 5000000, 'bel-air-holmby-hills');
    bySlug['bel-air-holmby-hills'] = raw.map((p,i) => buildEntry(p,'bel-air-holmby-hills',i));
    writeTS(Object.values(bySlug).flat());
    console.log(`💾 Saved after bel-air — ${Object.values(bySlug).flat().length} total`);
  } else {
    console.log(`\n✓ bel-air already has ${bySlug['bel-air-holmby-hills'].length}`);
  }

  // ── Santa Monica ─────────────────────────────────────────────────────────
  if (!bySlug['santa-monica']?.length) {
    console.log('\n━━━ RECOVER: santa-monica ━━━');
    const zpids = Object.keys(cache['santa-monica'] || {});
    console.log(`  ${zpids.length} cached zpids`);
    const raw = await scrapeZpids(zpids, 2500000, 'santa-monica');
    bySlug['santa-monica'] = raw.map((p,i) => buildEntry(p,'santa-monica',i));
    writeTS(Object.values(bySlug).flat());
    console.log(`💾 Saved after santa-monica — ${Object.values(bySlug).flat().length} total`);
  } else {
    console.log(`\n✓ santa-monica already has ${bySlug['santa-monica'].length}`);
  }

  // ── Venice ───────────────────────────────────────────────────────────────
  if (!bySlug['venice']?.length) {
    const raw = await searchAndScrape({
      slug: 'venice', minPrice: 2000000,
      queries: [
        'site:zillow.com/homedetails "Venice" "Los Angeles" "CA 90291" for sale',
        'site:zillow.com/homedetails "Ocean Front Walk" "Venice" CA for sale',
        'site:zillow.com/homedetails "Abbot Kinney" "Venice" CA for sale',
        'site:zillow.com/homedetails "Carroll Canal" OR "Grand Canal" "Venice" CA',
        'site:zillow.com/homedetails "Pacific Ave" OR "Beach Ave" "Venice" "CA 90291"',
      ],
    }, cache);
    bySlug['venice'] = raw.map((p,i) => buildEntry(p,'venice',i));
    writeTS(Object.values(bySlug).flat());
    console.log(`💾 Saved after venice — ${Object.values(bySlug).flat().length} total`);
  } else {
    console.log(`\n✓ venice already has ${bySlug['venice'].length}`);
  }

  // ── Mar Vista ────────────────────────────────────────────────────────────
  if (!bySlug['mar-vista']?.length) {
    const raw = await searchAndScrape({
      slug: 'mar-vista', minPrice: 1800000,
      queries: [
        'site:zillow.com/homedetails "Mar Vista" "Los Angeles" "CA 90066" for sale',
        'site:zillow.com/homedetails "Grand View Blvd" "Los Angeles" "CA 90066"',
        'site:zillow.com/homedetails "Navy St" OR "Rose Ave" OR "Dewey St" "Los Angeles" "CA 90066"',
        'site:zillow.com/homedetails "Charnock" OR "May St" OR "Inglewood" "Los Angeles" "CA 90066"',
        'site:zillow.com/homedetails "Mar Vista" "CA 90066" luxury new construction',
      ],
    }, cache);
    bySlug['mar-vista'] = raw.map((p,i) => buildEntry(p,'mar-vista',i));
    writeTS(Object.values(bySlug).flat());
    console.log(`💾 Saved after mar-vista — ${Object.values(bySlug).flat().length} total`);
  } else {
    console.log(`\n✓ mar-vista already has ${bySlug['mar-vista'].length}`);
  }

  const final = Object.values(bySlug).flat();
  console.log(`\n✅ DONE — ${final.length} total`);
  ['hollywood-hills','brentwood','bel-air-holmby-hills','century-city','santa-monica','venice','mar-vista']
    .forEach(s => console.log(`   ${s}: ${(bySlug[s]||[]).length}`));
}

main().catch(console.error);
