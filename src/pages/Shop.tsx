import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Leaf,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  PRODUCTS,
  inr,
  searchProducts,
  sortProducts,
  type SortKey,
  SORT_OPTIONS,
} from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { RatingStars, Reveal } from "../components/primitives";
import { cn } from "../utils/cn";

const PRICE_MIN = 100;
const PRICE_MAX = 1500;

const WEIGHT_BUCKETS = [
  { id: "small", label: "Small (≤300 g/ml)", match: (l: string) => parseSize(l) <= 300 },
  { id: "medium", label: "Medium (300–600 g/ml)", match: (l: string) => parseSize(l) > 300 && parseSize(l) <= 600 },
  { id: "large", label: "Large (600+ g/ml)", match: (l: string) => parseSize(l) > 600 },
];

function parseSize(label: string): number {
  const m = label.match(/[\d.]+/);
  if (!m) return 0;
  let v = parseFloat(m[0]);
  if (label.toLowerCase().includes("kg")) v *= 1000;
  if (label.toLowerCase().includes(" l")) v *= 1000;
  return v;
}

interface Filters {
  cats: string[];
  maxPrice: number;
  minRating: number;
  inStock: boolean;
  sizes: string[];
  sort: SortKey;
  q: string;
}

const DEFAULT_FILTERS: Filters = {
  cats: [],
  maxPrice: PRICE_MAX,
  minRating: 0,
  inStock: false,
  sizes: [],
  sort: "featured",
  q: "",
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    cats: params.get("category") ? [params.get("category")!] : [],
    q: params.get("q") ?? "",
    sort: (params.get("sort") as SortKey) || "featured",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /* sync from URL (navbar links, search overlay) */
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      cats: params.get("category") ? [params.get("category")!] : [],
      q: params.get("q") ?? "",
      sort: (params.get("sort") as SortKey) || f.sort,
    }));
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [params]);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    let list = filters.q.trim()
      ? searchProducts(filters.q, 50)
      : [...PRODUCTS];

    if (filters.cats.length)
      list = list.filter((p) => filters.cats.includes(p.category));
    list = list.filter((p) => p.weights[0].price <= filters.maxPrice);
    if (filters.minRating > 0) list = list.filter((p) => p.rating >= filters.minRating);
    if (filters.inStock) list = list.filter((p) => p.stock > 0);
    if (filters.sizes.length) {
      const buckets = WEIGHT_BUCKETS.filter((b) => filters.sizes.includes(b.id));
      list = list.filter((p) =>
        p.weights.some((w) => buckets.some((b) => b.match(w.label)))
      );
    }
    return sortProducts(list, filters.sort);
  }, [filters]);

  const activeFilterCount =
    filters.cats.length +
    filters.sizes.length +
    (filters.maxPrice < PRICE_MAX ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setParams({});
  };

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  return (
    <>
      {/* page header */}
      <div className="grain relative overflow-hidden bg-forest-950 pb-14 pt-32 text-ivory-50">
        <div
          aria-hidden
          className="absolute -right-32 -top-24 h-80 w-80 rounded-full bg-olive-500/20 blur-[100px]"
        />
        <div
          aria-hidden
          className="absolute -left-24 bottom-0 h-60 w-60 rounded-full bg-terra-500/12 blur-[90px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory-100/50">
            <Link to="/" className="transition hover:text-gold-300">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gold-300">Shop</span>
          </nav>
          <Reveal y={20}>
            <h1 className="font-display text-4xl font-medium sm:text-5xl">
              The ROLEX pantry
            </h1>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ivory-100/65">
              Every product below is one harvest, one region, one honest process.
              Filter by ritual, rating or pack size — your kitchen will thank you.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[264px_1fr]">
          {/* sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel filters={filters} set={set} clearAll={clearAll} activeCount={activeFilterCount} />
            </div>
          </aside>

          {/* results */}
          <div>
            {/* toolbar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-forest-900/10 bg-ivory-50 px-4.5 py-2.5 shadow-card transition focus-within:ring-2 focus:ring-olive-400/50 sm:max-w-xs">
                <Search className="h-4 w-4 shrink-0 text-ink-400" />
                <input
                  value={filters.q}
                  onChange={(e) => set("q", e.target.value)}
                  placeholder="Search within shop..."
                  aria-label="Search products"
                  className="w-full bg-transparent text-sm text-forest-900 outline-none placeholder:text-ink-400"
                />
                {filters.q && (
                  <button onClick={() => set("q", "")} aria-label="Clear search" className="cursor-pointer text-ink-400 hover:text-forest-900">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>

              <span className="hidden text-[13px] font-semibold text-ink-500 sm:block">
                {loading ? "…" : `${results.length} of ${PRODUCTS.length}`} products
              </span>

              <div className="ml-auto flex items-center gap-2.5">
                <select
                  value={filters.sort}
                  onChange={(e) => set("sort", e.target.value as SortKey)}
                  aria-label="Sort products"
                  className="cursor-pointer rounded-full border border-forest-900/10 bg-ivory-50 px-4 py-2.5 text-[13px] font-semibold text-forest-900 shadow-card outline-none transition hover:border-olive-400"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-forest-900 px-4.5 py-2.5 text-[13px] font-bold text-ivory-50 shadow-soft transition hover:bg-forest-700 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-terra-500 text-[10px]">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {results.map((p, i) => (
                    <motion.div
                      layout
                      key={p.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProductCard product={p} tilt={false} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[90] bg-forest-950/55 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="grain fixed inset-x-0 bottom-0 z-[95] max-h-[85vh] overflow-hidden rounded-t-[28px] bg-ivory-50 lg:hidden"
              role="dialog"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-forest-900">
                  <SlidersHorizontal className="h-4.5 w-4.5" /> Filters
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-forest-900 hover:bg-forest-900/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[calc(85vh-140px)] overflow-y-auto px-5 py-5">
                <FilterPanel filters={filters} set={set} clearAll={clearAll} activeCount={activeFilterCount} hideHeader />
              </div>
              <div className="flex gap-3 border-t border-forest-900/10 bg-ivory-100/80 px-5 py-4 backdrop-blur">
                <button
                  onClick={clearAll}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-forest-900/20 py-3 text-[12px] font-bold uppercase tracking-widest text-forest-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Clear
                </button>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex-[1.6] cursor-pointer rounded-full bg-forest-900 py-3 text-[12px] font-bold uppercase tracking-widest text-ivory-50"
                >
                  Show {results.length} products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
function FilterPanel({
  filters,
  set,
  clearAll,
  activeCount,
  hideHeader,
}: {
  filters: Filters;
  set: <K extends keyof Filters>(k: K, v: Filters[K]) => void;
  clearAll: () => void;
  activeCount: number;
  hideHeader?: boolean;
}) {
  const toggleList = (key: "cats" | "sizes", value: string) =>
    set(
      key,
      filters[key].includes(value)
        ? filters[key].filter((v) => v !== value)
        : [...filters[key], value]
    );

  return (
    <div className="space-y-7">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-forest-900">
            <SlidersHorizontal className="h-4.5 w-4.5" /> Filters
          </h2>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex cursor-pointer items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-terra-600 transition hover:text-terra-500"
            >
              <RotateCcw className="h-3 w-3" /> Clear all ({activeCount})
            </button>
          )}
        </div>
      )}

      {/* categories */}
      <FilterGroup title="Categories">
        <div className="space-y-1">
          {CATEGORIES.map((c) => {
            const active = filters.cats.includes(c.id);
            const count = PRODUCTS.filter((p) => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => toggleList("cats", c.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition",
                  active
                    ? "bg-forest-900 text-ivory-50"
                    : "text-ink-700 hover:bg-ivory-200"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition",
                      active ? "border-gold-300 bg-gold-400 text-forest-950" : "border-sand-300"
                    )}
                  >
                    {active && <X className="h-2.5 w-2.5 rotate-45" strokeWidth={4} />}
                  </span>
                  {c.name}
                </span>
                <span className={cn("text-[11px]", active ? "text-ivory-100/60" : "text-ink-400")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* price */}
      <FilterGroup title="Price up to">
        <div className="px-1">
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={50}
            value={filters.maxPrice}
            onChange={(e) => set("maxPrice", Number(e.target.value))}
            aria-label="Maximum price"
            className="w-full accent-terra-500"
          />
          <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-ink-500">
            <span>{inr(PRICE_MIN)}</span>
            <span className="rounded-full bg-sand-200/70 px-2.5 py-0.5 font-bold text-forest-900">
              up to {inr(filters.maxPrice)}
            </span>
          </div>
        </div>
      </FilterGroup>

      {/* rating */}
      <FilterGroup title="Minimum rating">
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.7].map((r) => (
            <button
              key={r}
              onClick={() => set("minRating", r)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition",
                filters.minRating === r
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-sand-300 text-ink-500 hover:border-olive-400"
              )}
            >
              {r === 0 ? "Any" : (
                <>
                  <RatingStars value={r} size={10} /> {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* availability */}
      <FilterGroup title="Availability">
        <button
          onClick={() => set("inStock", !filters.inStock)}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 text-[13px] font-semibold transition",
            filters.inStock
              ? "border-olive-500/50 bg-olive-500/10 text-olive-700"
              : "border-sand-300 text-ink-500 hover:border-olive-400"
          )}
        >
          In stock only
          <span
            className={cn(
              "relative h-5.5 w-10 rounded-full transition",
              filters.inStock ? "bg-olive-500" : "bg-sand-300"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4.5 w-4.5 rounded-full bg-ivory-50 shadow transition-all",
                filters.inStock ? "left-5" : "left-0.5"
              )}
            />
          </span>
        </button>
      </FilterGroup>

      {/* sizes */}
      <FilterGroup title="Pack size">
        <div className="space-y-1">
          {WEIGHT_BUCKETS.map((b) => {
            const active = filters.sizes.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => toggleList("sizes", b.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition",
                  active ? "bg-forest-900 text-ivory-50" : "text-ink-700 hover:bg-ivory-200"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition",
                    active ? "border-gold-300 bg-gold-400 text-forest-950" : "border-sand-300"
                  )}
                >
                  {active && <X className="h-2.5 w-2.5 rotate-45" strokeWidth={4} />}
                </span>
                {b.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {activeCount > 0 && hideHeader && (
        <button
          onClick={clearAll}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-terra-500/40 py-3 text-[12px] font-bold uppercase tracking-wider text-terra-600"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-ink-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-forest-900/[0.05] bg-ivory-50 shadow-card">
      <div className="aspect-square animate-pulse bg-sand-200/80" />
      <div className="space-y-2.5 p-4">
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-sand-200" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-sand-200" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-sand-200" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-16 animate-pulse rounded bg-sand-200" />
          <div className="h-9 w-9 animate-pulse rounded-full bg-sand-200" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center rounded-[28px] border border-dashed border-forest-900/15 bg-ivory-100/60 px-6 py-20 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-200/70">
        <Leaf className="h-7 w-7 text-olive-500" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold text-forest-900">
        Nothing matches those filters
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
        Try loosening a filter or two — good things are grown, not rushed.
      </p>
      <button
        onClick={onClear}
        className="mt-6 cursor-pointer rounded-full bg-forest-900 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory-50 transition hover:bg-terra-500"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}
