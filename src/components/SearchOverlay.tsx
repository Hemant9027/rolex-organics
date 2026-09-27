import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock3, Search, TrendingUp, X } from "lucide-react";
import { useStore } from "../store/StoreContext";
import {
  inr,
  POPULAR_SEARCHES,
  searchProducts,
} from "../data/products";
import { RatingStars } from "./primitives";

const RECENT_KEY = "rolex_recent_searches";

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}
function saveRecent(term: string) {
  const next = [term, ...getRecent().filter((t) => t !== term)].slice(0, 5);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchProducts(query, 6), [query]);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      setRecent(getRecent());
      setQuery("");
      const t = window.setTimeout(() => inputRef.current?.focus(), 250);
      return () => {
        document.body.style.overflow = "";
        window.clearTimeout(t);
      };
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  const commit = (term: string, path: string) => {
    if (term.trim()) saveRecent(term.trim());
    setSearchOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-forest-950/70 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-label="Search products"
        >
          <motion.div
            initial={{ y: -36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="grain relative mx-auto mt-20 w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl bg-ivory-50 shadow-soft ring-1 ring-ivory-100/20 sm:mt-28"
          >
            {/* input row */}
            <div className="flex items-center gap-3 border-b border-forest-900/10 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-terra-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim().length) {
                    commit(query, `/shop?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                placeholder="Search ghee, millets, honey, ashwagandha..."
                aria-label="Search products"
                className="w-full bg-transparent text-base text-forest-900 outline-none placeholder:text-ink-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="cursor-pointer rounded-full p-1.5 text-ink-400 transition hover:bg-sand-200 hover:text-forest-900"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="hidden cursor-pointer rounded-full bg-forest-900/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-500 transition hover:bg-forest-900/10 sm:block"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              {/* live results */}
              {query.trim().length >= 2 ? (
                results.length ? (
                  <div>
                    <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-400">
                      {results.length} result{results.length > 1 ? "s" : ""}
                    </p>
                    <div className="flex flex-col gap-1">
                      {results.map((p, i) => (
                        <motion.button
                          key={p.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => commit(query, `/product/${p.slug}`)}
                          className="group flex cursor-pointer items-center gap-3.5 rounded-2xl p-2.5 text-left transition-colors hover:bg-ivory-200"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                            <img
                              src={p.image}
                              alt={p.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-forest-900">
                              {p.name}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2">
                              <RatingStars value={p.rating} size={11} />
                              <span className="text-[11px] text-ink-500">
                                ({p.reviewCount.toLocaleString("en-IN")})
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-forest-900">
                              {inr(p.weights[0].price)}
                            </p>
                            <p className="text-[10px] text-ink-400 line-through">
                              {inr(p.weights[0].originalPrice)}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 -translate-x-1 text-terra-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </motion.button>
                      ))}
                    </div>
                    <button
                      onClick={() => commit(query, `/shop?q=${encodeURIComponent(query.trim())}`)}
                      className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-forest-900 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory-50 transition hover:bg-forest-700"
                    >
                      View all results <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="px-2 py-10 text-center">
                    <p className="font-display text-xl text-forest-900">
                      Nothing found for “{query}”
                    </p>
                    <p className="mt-2 text-sm text-ink-500">
                      Try “ghee”, “millet”, “honey” or browse the full shop.
                    </p>
                    <button
                      onClick={() => commit("", "/shop")}
                      className="mt-5 cursor-pointer rounded-full bg-forest-900 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory-50 transition hover:bg-forest-700"
                    >
                      Browse shop
                    </button>
                  </div>
                )
              ) : (
                <div className="grid gap-5 p-1 sm:grid-cols-2">
                  {recent.length > 0 && (
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-400">
                        <Clock3 className="h-3.5 w-3.5" /> Recent searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQuery(r)}
                            className="cursor-pointer rounded-full bg-sand-200/70 px-3.5 py-2 text-xs font-semibold text-ink-700 transition hover:bg-forest-900 hover:text-ivory-50"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-400">
                      <TrendingUp className="h-3.5 w-3.5" /> Popular right now
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="cursor-pointer rounded-full border border-gold-400/40 bg-gold-300/15 px-3.5 py-2 text-xs font-semibold text-gold-500 transition hover:bg-gold-400 hover:text-forest-950"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
