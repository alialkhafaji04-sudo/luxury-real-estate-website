import { Neighborhood } from './properties';

export interface NeighborhoodInfo {
  slug: Neighborhood;
  name: string;
  tagline: string;
  description: string;
  stats: {
    avgPrice: string;
    zipCodes?: string;
    highlight: string;
  };
  highlights: string[];
  image: string;
  heroImage: string;
}

export const neighborhoods: NeighborhoodInfo[] = [
  {
    slug: 'hollywood-hills',
    name: 'Hollywood Hills',
    tagline: 'Above the City, Beyond Expectation',
    description: 'The Hollywood Hills are Los Angeles at its most dramatic — a series of canyon ridges where world-class architecture clings to hillsides above a sparkling city grid. From the iconic curves of Mulholland Drive to the lush seclusion of Nichols Canyon, this is where celebrities, architects, and tastemakers have always staked their claims. Infinity pools hover above the basin, views stretch from downtown to the Pacific, and the canyon air carries a sense of remove that no other neighborhood in LA can replicate.',
    stats: {
      avgPrice: '$8.5M+',
      zipCodes: '90046 & 90068',
      highlight: 'Canyon & City View Estates'
    },
    highlights: [
      'Iconic Mulholland Drive ridgeline estates',
      'Panoramic views from downtown to the Pacific',
      'Privacy-focused hillside compounds',
      'Architectural landmark residences',
      'Minutes to the Sunset Strip and Studio City',
      'Coveted celebrity enclave since the Golden Age'
    ],
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    heroImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  },
  {
    slug: 'brentwood',
    name: 'Brentwood',
    tagline: 'Refined Westside Living',
    description: 'Brentwood is the Westside\'s gold standard for understated elegance. Tree-lined streets, elite private schools, and a walkable village of world-class restaurants and boutiques define this coveted enclave. Mandeville Canyon offers sweeping canyon estates, while the flats of Brentwood Park host some of the most impeccably maintained homes on the Westside. Discreet, sophisticated, and consistently among LA\'s most sought-after zip codes.',
    stats: {
      avgPrice: '$6.5M+',
      zipCodes: '90049',
      highlight: 'Elite Westside Enclave'
    },
    highlights: [
      'Top-ranked private and public schools',
      'Brentwood Village — premier dining and boutiques',
      'Mandeville Canyon and Brentwood Park estates',
      'Walkable, tree-lined residential streets',
      'Minutes to UCLA and the Getty Center',
      'Consistently one of LA\'s most stable luxury markets'
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    heroImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  },
  {
    slug: 'bel-air-holmby-hills',
    name: 'Bel Air–Holmby Hills',
    tagline: 'The Platinum Triangle\'s Crown Jewel',
    description: 'Together, Bel Air and Holmby Hills form the most exclusive residential corridor in the Western world. Anchored by the legendary East and West Gates of Bel Air and home to streets like Carolwood Drive and Mapleton Drive, this is where estates are measured in acres and prices routinely enter nine figures. The area attracts the world\'s most affluent buyers — heads of state, tech founders, entertainment icons — who value absolute privacy, exceptional scale, and proximity to the best of Los Angeles.',
    stats: {
      avgPrice: '$22M+',
      highlight: 'Ultra-Prime Trophy Estates'
    },
    highlights: [
      'Holmby Hills — home to LA\'s most iconic addresses',
      'Multi-acre gated compounds with total privacy',
      'City and ocean views from commanding ridge sites',
      '24-hour Bel Air Patrol security',
      'Minutes to Rodeo Drive and UCLA',
      'Global benchmark for ultra-luxury real estate'
    ],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  },
  {
    slug: 'century-city',
    name: 'Century City',
    tagline: 'Sky-High Luxury in the Heart of the Westside',
    description: 'Century City offers the Westside\'s most prestigious high-rise living — a collection of iconic towers rising above Constellation Boulevard with views spanning from the Santa Monica Mountains to the Pacific. The Wilshire Corridor is LA\'s answer to Fifth Avenue, home to full-service luxury buildings with white-glove concierge, rooftop pools, and private dining. For those who desire urban sophistication without sacrificing the Westside\'s convenience, Century City is unrivaled.',
    stats: {
      avgPrice: '$5.9M+',
      zipCodes: '90067',
      highlight: 'Premier High-Rise Residences'
    },
    highlights: [
      'Iconic Wilshire Corridor luxury towers',
      'Panoramic views of mountains and Pacific',
      'White-glove concierge and valet service',
      'Westfield Century City — world-class retail',
      'Walking distance to Beverly Hills and Brentwood',
      'LA\'s most coveted urban residential address'
    ],
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    heroImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  },
  {
    slug: 'santa-monica',
    name: 'Santa Monica',
    tagline: 'Coastal Prestige on the Pacific',
    description: 'Santa Monica is the apex of California coastal living — a world-class city perched at the edge of the continent. North of Montana Avenue is an elite residential enclave of wide lots and leafy streets, while the Ocean Avenue corridor commands the most spectacular unobstructed Pacific views in Los Angeles. With Palisades Park at your doorstep, Third Street Promenade minutes away, and direct beach access, Santa Monica delivers the coastal life at its most refined.',
    stats: {
      avgPrice: '$8.9M+',
      zipCodes: '90402 & 90403',
      highlight: 'Premier Coastal Luxury'
    },
    highlights: [
      'North of Montana — LA\'s finest residential streets',
      'Unobstructed ocean views from Ocean Avenue',
      'Palisades Park and direct beach access',
      'World-class dining on Montana and Main Street',
      'Santa Monica Pier and Third Street Promenade',
      'Top-ranked Santa Monica–Malibu school district'
    ],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    heroImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  },
  {
    slug: 'venice',
    name: 'Venice',
    tagline: 'Creative Luxury by the Sea',
    description: 'Venice is Los Angeles\'s most singular neighborhood — a collision of bohemian soul and cutting-edge luxury. The iconic canals, lined with architecturally ambitious homes, flow toward the Pacific. Abbot Kinney Boulevard pulses with design studios, galleries, and destination restaurants, while the Venice Beach boardwalk offers one of the world\'s great people-watching stages. Architects, tech entrepreneurs, and creative visionaries have transformed this neighborhood into one of the most coveted on the Westside.',
    stats: {
      avgPrice: '$6.5M+',
      zipCodes: '90291',
      highlight: 'Canal Homes & Oceanfront Estates'
    },
    highlights: [
      'Iconic Venice Canals — ultra-rare canal-front homes',
      'Direct sand access on Ocean Front Walk',
      'Abbot Kinney — national destination for design and dining',
      'Thriving creative and tech community',
      'Architecturally exceptional new construction',
      'Minutes to Playa del Rey and Marina del Rey'
    ],
    image: 'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    heroImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  },
  {
    slug: 'mar-vista',
    name: 'Mar Vista',
    tagline: 'Modern Westside Living, Elevated',
    description: 'Mar Vista has quietly become one of the Westside\'s most compelling residential stories. Bordered by Venice, Culver City, and the technology campuses of Silicon Beach, this neighborhood attracts a generation of buyers seeking design-forward new construction, oversized lots, and exceptional value relative to its coastal neighbors. New builds by sought-after architects are reshaping the streetscape, and the neighborhood\'s proximity to the best of the Westside makes it among LA\'s most strategic luxury purchases.',
    stats: {
      avgPrice: '$4.9M+',
      zipCodes: '90066',
      highlight: 'Design-Forward New Construction'
    },
    highlights: [
      'Rapid appreciation in LA\'s hottest emerging luxury market',
      'Architect-designed new construction on oversize lots',
      'Steps from Venice canals and beach',
      'Heart of Silicon Beach tech corridor',
      'Culver City arts and entertainment district nearby',
      'Outstanding value per square foot vs. coastal peers'
    ],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    heroImage: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920'
  }
];

export function getNeighborhoodBySlug(slug: string): NeighborhoodInfo | undefined {
  return neighborhoods.find(n => n.slug === slug);
}
