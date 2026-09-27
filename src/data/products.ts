/* ------------------------------------------------------------------
   ROLEX Organics — data layer
   Structured so it can later be swapped for a real API response.
------------------------------------------------------------------- */

export interface WeightOption {
  label: string;
  price: number;
  originalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // category id
  tags: string[];
  image: string;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  benefits: string[];
  ingredients: string;
  weights: WeightOption[];
  stock: number;
  featured: boolean;
  bestseller: boolean;
  isNew: boolean;
  shelfLife: string;
  origin: string;
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string; // tailwind gradient classes
}

/* ---------------- stock photography (context / story) ---------------- */
export const STOCK = {
  farmerField:
    "https://images.pexels.com/photos/20445169/pexels-photo-20445169.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  goldenWheat:
    "https://images.pexels.com/photos/16125407/pexels-photo-16125407.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  elderFarmer:
    "https://images.pexels.com/photos/26762735/pexels-photo-26762735.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  riceHarvest:
    "https://images.pexels.com/photos/29733497/pexels-photo-29733497.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  spiceBowls:
    "https://images.pexels.com/photos/6086066/pexels-photo-6086066.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  marketStall:
    "https://images.pexels.com/photos/15741144/pexels-photo-15741144.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

const img = (file: string) => `/images/products/${file}`;

export const PRODUCTS: Product[] = [
  {
    id: "rox-001",
    name: "Bilona Cow Ghee",
    slug: "bilona-cow-ghee",
    category: "ghee",
    tags: ["a2 ghee", "bilona", "desi cow", "vitamins", "immunity", "keto"],
    image: img("bilona-ghee.jpg"),
    rating: 4.9,
    reviewCount: 2314,
    shortDescription:
      "Hand-churned with the ancient bilona method from the curd of grass-fed desi cows. Grainy, golden, and deeply aromatic.",
    description:
      "Our Bilona Cow Ghee is made the way grandmothers remember it — whole curd is churned bi-directionally with a wooden ravi, the butter is separated by hand, and slow-cooked over a low flame until it turns a deep grainy gold. No cream shortcuts, no machines, no compromise. The result is a ghee rich in CLA, butyric acid and fat-soluble vitamins, with a nutty, caramel-like aroma that transforms everything it touches.",
    benefits: [
      "Supports digestion & gut health with natural butyric acid",
      "Rich in fat-soluble vitamins A, D, E & K",
      "Traditionally churned — easier to digest than cream ghee",
      "High smoke point — perfect for sautéing and tadka",
    ],
    ingredients: "100% A2 milk from grass-fed Gir & Sahiwal desi cows",
    weights: [
      { label: "250 ml", price: 849, originalPrice: 1049 },
      { label: "500 ml", price: 1499, originalPrice: 1899 },
      { label: "1 L", price: 2799, originalPrice: 3549 },
    ],
    stock: 42,
    featured: true,
    bestseller: true,
    isNew: false,
    shelfLife: "9 months",
    origin: "Bhavnagar, Gujarat",
  },
  {
    id: "rox-002",
    name: "Jowar Flour",
    slug: "jowar-flour",
    category: "flours",
    tags: ["sorghum", "millet", "gluten free", "stone ground", "roti", "fiber"],
    image: img("jowar-flour.jpg"),
    rating: 4.7,
    reviewCount: 1186,
    shortDescription:
      "Stone-ground sorghum, milled in small weekly batches. Naturally gluten-free with a soft, slightly sweet crumb.",
    description:
      "Grown on rain-fed farms in the Deccan plateau, our jowar is cleaned, sun-dried and stone-ground at low RPM so the flour never heats above 40°C — preserving enzymes, aroma and nutrition. Naturally gluten-free and high in fibre, it makes soft, puffed rotis and earthy baked goods.",
    benefits: [
      "Naturally gluten-free ancient millet",
      "High in dietary fibre & plant protein",
      "Low glycaemic index — steady energy",
      "Stone-ground in small batches for freshness",
    ],
    ingredients: "100% stone-ground whole jowar (sorghum)",
    weights: [
      { label: "500 g", price: 119, originalPrice: 150 },
      { label: "1 kg", price: 189, originalPrice: 240 },
      { label: "2 kg", price: 359, originalPrice: 460 },
    ],
    stock: 120,
    featured: false,
    bestseller: true,
    isNew: false,
    shelfLife: "4 months",
    origin: "Solapur, Maharashtra",
  },
  {
    id: "rox-003",
    name: "Bajra Flour",
    slug: "bajra-flour",
    category: "flours",
    tags: ["pearl millet", "gluten free", "stone ground", "winter", "iron", "roti"],
    image: img("bajra-flour.jpg"),
    rating: 4.6,
    reviewCount: 934,
    shortDescription:
      "Pearl millet flour ground fresh every week. Warming, iron-rich and beloved in winter kitchens across Rajasthan.",
    description:
      "Bajra is Rajasthan's gift to winter. Our pearl millet is sourced from dry-land farms near Jodhpur and stone-ground to a soft grey flour that cooks into dense, nutty rotis with a gentle smoky sweetness. Exceptionally rich in iron, magnesium and fibre, bajra keeps you warm and satiated for hours.",
    benefits: [
      "Exceptionally high in iron & magnesium",
      "Warming grain — ideal for cooler months",
      "Gluten-free and easy on blood sugar",
      "Makes hearty rotis, khichdi and raab",
    ],
    ingredients: "100% stone-ground whole bajra (pearl millet)",
    weights: [
      { label: "500 g", price: 109, originalPrice: 135 },
      { label: "1 kg", price: 179, originalPrice: 220 },
      { label: "2 kg", price: 339, originalPrice: 425 },
    ],
    stock: 96,
    featured: false,
    bestseller: false,
    isNew: false,
    shelfLife: "3 months",
    origin: "Jodhpur, Rajasthan",
  },
  {
    id: "rox-004",
    name: "Ragi Flour",
    slug: "ragi-flour",
    category: "flours",
    tags: ["finger millet", "calcium", "gluten free", "stone ground", "porridge", "malt"],
    image: img("ragi-flour.jpg"),
    rating: 4.7,
    reviewCount: 1041,
    shortDescription:
      "Deep-hued finger millet flour — one of nature's richest plant sources of calcium. Beloved for porridges and malt.",
    description:
      "Our ragi comes from the hill farms of Karnataka where finger millet has been grown for over four thousand years. Stone-ground to preserve its deep red hue and malty aroma, it is a kitchen essential for porridges, dosas, laddus and the classic ragi malt — a nourishing drink for all ages.",
    benefits: [
      "Among the richest plant sources of calcium",
      "High in polyphenols & essential amino acids",
      "Great for kids' porridges and healthy baking",
      "Slow-release energy with a low glycaemic load",
    ],
    ingredients: "100% stone-ground whole ragi (finger millet)",
    weights: [
      { label: "500 g", price: 109, originalPrice: 139 },
      { label: "1 kg", price: 169, originalPrice: 210 },
      { label: "2 kg", price: 319, originalPrice: 400 },
    ],
    stock: 88,
    featured: true,
    bestseller: false,
    isNew: false,
    shelfLife: "4 months",
    origin: "Tumakuru, Karnataka",
  },
  {
    id: "rox-005",
    name: "Chia Seeds",
    slug: "chia-seeds",
    category: "seeds",
    tags: ["superfood", "omega 3", "fiber", "pudding", "smoothies", "hydration"],
    image: img("chia-seeds.jpg"),
    rating: 4.8,
    reviewCount: 1568,
    shortDescription:
      "Clean, plump chia seeds packed with omega-3s and fibre. Swell beautifully for puddings, smoothies and water.",
    description:
      "Tiny seeds, outsized nutrition. Our chia seeds are triple-cleaned and graded so every jar is free of dust and grit — just plump, glossy seeds that swell into a silky gel. A spoonful adds omega-3 fatty acids, fibre and plant protein to smoothies, overnight oats, puddings and infused water.",
    benefits: [
      "Excellent plant source of omega-3 (ALA)",
      "Expands 12x — keeps you full & hydrated",
      "Supports digestion with soluble fibre",
      "Neutral taste — slips into any recipe",
    ],
    ingredients: "100% raw chia seeds (Salvia hispanica)",
    weights: [
      { label: "200 g", price: 299, originalPrice: 379 },
      { label: "400 g", price: 549, originalPrice: 699 },
    ],
    stock: 64,
    featured: true,
    bestseller: true,
    isNew: false,
    shelfLife: "12 months",
    origin: "Sourced by farmer co-operatives, cleaned in India",
  },
  {
    id: "rox-006",
    name: "Flax Seeds",
    slug: "flax-seeds",
    category: "seeds",
    tags: ["alsi", "omega 3", "lignans", "heart", "mukhwas", "chutney"],
    image: img("flax-seeds.jpg"),
    rating: 4.6,
    reviewCount: 823,
    shortDescription:
      "Glossy brown flax (alsi), prized for lignans and omega-3. Roast for chutneys, mukhwas and everyday sprinkling.",
    description:
      "India's own omega-3 seed. Our glossy brown flax is sourced directly from farmer groups in Madhya Pradesh and packed within days of cleaning. Dry-roast and grind for nutty chutney podis, fold into rotis and breads, or simply chew a spoonful after meals the traditional way.",
    benefits: [
      "Rich in omega-3 & gut-friendly lignans",
      "Supports heart health and healthy cholesterol",
      "Adds nutty depth to chutneys & baked goods",
      "Traditionally used as an after-meal digestive",
    ],
    ingredients: "100% raw brown flax seeds (alsi)",
    weights: [
      { label: "300 g", price: 179, originalPrice: 230 },
      { label: "600 g", price: 319, originalPrice: 410 },
    ],
    stock: 110,
    featured: false,
    bestseller: false,
    isNew: true,
    shelfLife: "9 months",
    origin: "Neemuch, Madhya Pradesh",
  },
  {
    id: "rox-007",
    name: "Pumpkin Seeds",
    slug: "pumpkin-seeds",
    category: "seeds",
    tags: ["protein", "zinc", "magnesium", "snacking", "salads", "trail mix"],
    image: img("pumpkin-seeds.jpg"),
    rating: 4.8,
    reviewCount: 1312,
    shortDescription:
      "Plump, nutty pumpkin seeds with a deep green sheen. A zinc and protein powerhouse for snacking and salads.",
    description:
      "Sourced for size and freshness rather than price, our shelled pumpkin seeds have a soft crunch and a sweet, nutty finish. Toast them for a minute and they become irresistible — over salads, soups, granola or straight from the jar. One handful delivers meaningful zinc, magnesium and plant protein.",
    benefits: [
      "High in zinc — supports immunity & skin",
      "Rich source of plant protein & magnesium",
      "May support restful sleep (tryptophan)",
      "Perfect toasted over salads and soups",
    ],
    ingredients: "100% raw shelled pumpkin seeds",
    weights: [
      { label: "200 g", price: 379, originalPrice: 479 },
      { label: "400 g", price: 699, originalPrice: 879 },
    ],
    stock: 7,
    featured: true,
    bestseller: true,
    isNew: false,
    shelfLife: "9 months",
    origin: "Graded & packed in India",
  },
  {
    id: "rox-008",
    name: "Moringa Powder",
    slug: "moringa-powder",
    category: "superfoods",
    tags: ["drumstick", "greens", "iron", "antioxidants", "smoothies", "ayurveda"],
    image: img("moringa-powder.jpg"),
    rating: 4.7,
    reviewCount: 967,
    shortDescription:
      "Shade-dried drumstick leaves milled fine and vibrant. India's original green superfood for everyday energy.",
    description:
      "Moringa oleifera grew up in Indian backyards for centuries before the world called it a superfood. Our leaves are hand-plucked, shade-dried to protect their chlorophyll, and milled to a vivid green powder. Stir into water, smoothies, dals or roti dough for a quiet, everyday upgrade in iron, vitamin A and antioxidants.",
    benefits: [
      "Naturally rich in iron, vitamin A & calcium",
      "Supports daily energy without caffeine",
      "Shade-dried to preserve nutrients & colour",
      "Easy add-in for smoothies, dals & doughs",
    ],
    ingredients: "100% shade-dried moringa (drumstick) leaf powder",
    weights: [
      { label: "150 g", price: 229, originalPrice: 289 },
      { label: "300 g", price: 399, originalPrice: 499 },
    ],
    stock: 54,
    featured: true,
    bestseller: false,
    isNew: false,
    shelfLife: "8 months",
    origin: "Theni, Tamil Nadu",
  },
  {
    id: "rox-009",
    name: "Ashwagandha Powder",
    slug: "ashwagandha-powder",
    category: "herbal-powders",
    tags: ["adaptogen", "stress", "sleep", "strength", "ayurveda", "milk"],
    image: img("ashwagandha-powder.jpg"),
    rating: 4.8,
    reviewCount: 1089,
    shortDescription:
      "Roots from Nagori ashwagandha, ground in small batches. Ayurveda's classic adaptogen for calm, steady strength.",
    description:
      "Our ashwagandha comes from the arid soils of Rajasthan where the Nagori variety develops its famously high withanolide content. Roots are washed, sun-cured and stone-milled to a soft, fine powder. Stir half a teaspoon into warm milk with a little jaggery before bed — the way Ayurveda has recommended for three thousand years.",
    benefits: [
      "Classic adaptogen — helps the body manage stress",
      "Supports restful sleep & evening calm",
      "Traditionally used for strength & recovery",
      "Nagori variety, known for high withanolides",
    ],
    ingredients: "100% ashwagandha root powder (Withania somnifera)",
    weights: [
      { label: "150 g", price: 269, originalPrice: 339 },
      { label: "300 g", price: 449, originalPrice: 559 },
    ],
    stock: 38,
    featured: false,
    bestseller: false,
    isNew: true,
    shelfLife: "12 months",
    origin: "Nagaur, Rajasthan",
  },
  {
    id: "rox-010",
    name: "Raw Wild Forest Honey",
    slug: "raw-wild-forest-honey",
    category: "sweeteners",
    tags: ["raw honey", "unprocessed", "forest", "nmr tested", "immunity", "natural sweetener"],
    image: img("raw-honey.jpg"),
    rating: 4.9,
    reviewCount: 1754,
    shortDescription:
      "Unheated, unblended honey from wild forest apiaries. NMR-tested for purity, floral and alive with enzymes.",
    description:
      "This is honey that never met a processing plant. Collected from wild Apis cerana hives in the mixed forests of the lower Himalayas, it is strained through muslin and jar — never heated, never blended, never fine-filtered. Every batch is NMR-tested for purity, so what you taste is exactly what the bees made: floral, layered and alive with natural enzymes and pollen.",
    benefits: [
      "Never heated — enzymes & pollen intact",
      "NMR-tested for zero adulteration",
      "Soothing for throats; gentle pre-workout energy",
      "Floral, complex sweetness from wild forest flora",
    ],
    ingredients: "100% raw wild forest honey (unprocessed, unheated)",
    weights: [
      { label: "350 g", price: 349, originalPrice: 439 },
      { label: "600 g", price: 549, originalPrice: 689 },
    ],
    stock: 61,
    featured: true,
    bestseller: true,
    isNew: false,
    shelfLife: "18 months",
    origin: "Lower Himalayan forests, Uttarakhand",
  },
];

export const CATEGORIES: Category[] = [
  {
    id: "ghee",
    name: "Ghee",
    tagline: "Bilona-churned gold",
    description: "Hand-churned A2 ghee from grass-fed desi cow curd — slow-cooked, grainy, aromatic.",
    image: img("bilona-ghee.jpg"),
    accent: "from-gold-500/80",
  },
  {
    id: "flours",
    name: "Stone-Ground Flours",
    tagline: "Millets, milled slow",
    description: "Jowar, bajra & ragi ground on stone at low RPM — enzymes, aroma and nutrition intact.",
    image: img("jowar-flour.jpg"),
    accent: "from-sand-400/80",
  },
  {
    id: "seeds",
    name: "Seeds",
    tagline: "Tiny seeds, giant nutrition",
    description: "Chia, flax and pumpkin seeds — cleaned, graded and packed within days of harvest.",
    image: img("pumpkin-seeds.jpg"),
    accent: "from-olive-500/80",
  },
  {
    id: "superfoods",
    name: "Superfoods",
    tagline: "Shade-dried greens",
    description: "Moringa and more — India's original superfoods, dried in shade and milled fine.",
    image: img("moringa-powder.jpg"),
    accent: "from-forest-600/80",
  },
  {
    id: "herbal-powders",
    name: "Herbal Powders",
    tagline: "Ayurveda's quiet power",
    description: "Single-origin roots and herbs, stone-milled in small batches for everyday rituals.",
    image: img("ashwagandha-powder.jpg"),
    accent: "from-terra-500/80",
  },
  {
    id: "sweeteners",
    name: "Natural Sweeteners",
    tagline: "Sweetness, unprocessed",
    description: "Raw forest honey — unheated, unblended, NMR-tested. Sweetness the way bees made it.",
    image: img("raw-honey.jpg"),
    accent: "from-gold-400/80",
  },
];

/* ---------------- testimonials ---------------- */
export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  quote: string;
  product: string;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    quote:
      "The bilona ghee smells exactly like what my grandmother made in our village. I've stopped buying anything else — my daughter eats rotis with just this ghee and jaggery now.",
    product: "Bilona Cow Ghee",
    avatar:
      "https://images.pexels.com/photos/12299161/pexels-photo-12299161.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
  },
  {
    name: "Arjun Mehta",
    location: "Bengaluru",
    rating: 5,
    quote:
      "You can taste the freshness in the ragi flour — my morning malt has never been this smooth. Packaging is beautiful and completely plastic-free. Genuinely premium.",
    product: "Ragi Flour",
    avatar:
      "https://images.pexels.com/photos/6200777/pexels-photo-6200777.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
  },
  {
    name: "Kavitha Rao",
    location: "Hyderabad",
    rating: 4.5,
    quote:
      "I was skeptical about 'raw honey' claims everywhere, but this one crystallised naturally in winter — that's how you know it's real. The NMR report on the jar is a nice touch.",
    product: "Raw Wild Forest Honey",
    avatar:
      "https://images.pexels.com/photos/31635316/pexels-photo-31635316.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
  },
  {
    name: "Rohan Kapoor",
    location: "Pune",
    rating: 5,
    quote:
      "Chia seeds that actually gel properly, pumpkin seeds that taste roasted-nutty even raw. Ordered twice in a month. Delivery was quick and the jars came without a scratch.",
    product: "Chia Seeds",
    avatar:
      "https://images.pexels.com/photos/36342203/pexels-photo-36342203.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
  },
  {
    name: "Ananya Iyer",
    location: "Chennai",
    rating: 5,
    quote:
      "Ashwagandha in warm milk has genuinely helped my sleep routine. And the moringa powder is so green it looks like matcha — in dosa batter the kids don't even notice.",
    product: "Ashwagandha Powder",
    avatar:
      "https://images.pexels.com/photos/38982379/pexels-photo-38982379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
  },
];

/* ---------------- helpers ---------------- */
export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const discountPct = (w: WeightOption) =>
  Math.round(((w.originalPrice - w.price) / w.originalPrice) * 100);

export const productBySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

export const relatedProducts = (product: Product, count = 4) => {
  const sameCat = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const others = PRODUCTS.filter(
    (p) => p.category !== product.category && p.featured
  );
  return [...sameCat, ...others].slice(0, count);
};

export const productsInCategory = (categoryId: string) =>
  PRODUCTS.filter((p) => p.category === categoryId);

export const searchProducts = (query: string, limit = 6): Product[] => {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const catName = (id: string) =>
    CATEGORIES.find((c) => c.id === id)?.name.toLowerCase() ?? "";
  const scored = PRODUCTS.map((p) => {
    let score = 0;
    if (p.name.toLowerCase().includes(q)) score += 5;
    if (p.name.toLowerCase().startsWith(q)) score += 3;
    if (catName(p.category).includes(q)) score += 3;
    if (p.tags.some((t) => t.includes(q))) score += 2;
    if (p.benefits.some((b) => b.toLowerCase().includes(q))) score += 1;
    if (p.description.toLowerCase().includes(q)) score += 1;
    return { p, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
};

export const POPULAR_SEARCHES = [
  "ghee",
  "gluten free",
  "honey",
  "omega 3",
  "millet",
  "ashwagandha",
];

export type SortKey =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Highest Rated" },
  { key: "discount", label: "Biggest Discount" },
];

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const arr = [...list];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.weights[0].price - b.weights[0].price);
    case "price-desc":
      return arr.sort((a, b) => b.weights[0].price - a.weights[0].price);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "discount":
      return arr.sort(
        (a, b) => discountPct(b.weights[0]) - discountPct(a.weights[0])
      );
    case "newest":
      return arr.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || b.reviewCount - a.reviewCount
      );
    case "featured":
    default:
      return arr.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating
      );
  }
}
