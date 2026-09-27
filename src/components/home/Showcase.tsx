import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShoppingBag,
} from "lucide-react";
import {
  inr,
  PRODUCTS,
  productBySlug,
  STOCK,
  TESTIMONIALS,
  type Product,
} from "../../data/products";
import { useStore } from "../../store/StoreContext";
import {
  BUT,
  MagneticButton,
  RatingStars,
  Reveal,
  SectionHeading,
  WishlistButton,
} from "../primitives";
import { ProductCard } from "../ProductCard";
import { cn } from "../../utils/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/*  Best sellers — horizontal carousel                                 */
/* ------------------------------------------------------------------ */
export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const items = PRODUCTS.filter((p) => p.bestseller);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section className="overflow-hidden bg-ivory-50 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Community favourites"
            title="Best sellers, restocked weekly."
            description="The jars homes reorder without thinking — rated 4.7 and above by thousands of kitchens."
          />
          <Reveal delay={0.1} className="flex items-center gap-2.5">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll products left"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-forest-900/15 text-forest-900 transition hover:bg-forest-900 hover:text-ivory-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll products right"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-forest-900 text-ivory-50 shadow-soft transition hover:bg-terra-500"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.15}>
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {items.map((p) => (
            <div key={p.id} className="w-[272px] shrink-0 snap-start sm:w-[300px]">
              <ProductCard product={p} />
            </div>
          ))}
          <Link
            to="/shop"
            className="group flex w-[272px] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-[26px] border-2 border-dashed border-forest-900/15 bg-ivory-100/60 text-forest-900 transition hover:border-terra-500 hover:bg-terra-500/5 sm:w-[300px]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-ivory-50 transition-all duration-400 group-hover:rotate-45 group-hover:bg-terra-500">
              <ArrowUpRight className="h-6 w-6" />
            </span>
            <span className="font-display text-lg font-semibold">View all products</span>
          </Link>
        </div>
        <div className="mx-auto mt-6 h-1 w-40 overflow-hidden rounded-full bg-sand-200">
          <div
            className="h-full rounded-full bg-terra-500 transition-[width] duration-200"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive product showcase                                       */
/* ------------------------------------------------------------------ */
const SHOWCASE_SLUGS = [
  "bilona-cow-ghee",
  "raw-wild-forest-honey",
  "moringa-powder",
  "chia-seeds",
];
const SHOWCASE: Product[] = SHOWCASE_SLUGS.map((s) => productBySlug(s)!).filter(Boolean);

export function InteractiveShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { addToCart } = useStore();
  const product = SHOWCASE[index];

  useEffect(() => {
    if (reduce || paused) return;
    const t = window.setInterval(
      () => setIndex((i) => (i + 1) % SHOWCASE.length),
      5200
    );
    return () => window.clearInterval(t);
  }, [reduce, paused]);

  const accents = ["bg-gold-300/35", "bg-terra-300/35", "bg-olive-300/40", "bg-sand-300/45"];

  return (
    <section
      className="grain relative overflow-hidden bg-forest-950 py-24 text-ivory-50 lg:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-olive-500/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-terra-500/10 blur-[110px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* info panel */}
        <div className="order-2 lg:order-1">
          <SectionHeading
            tone="light"
            eyebrow="The ritual shelf"
            title="Four icons of the ROLEX pantry."
            className="mb-9"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-gold-300">
                {index + 1} / {SHOWCASE.length}
              </p>
              <h3 className="mt-2 font-display text-4xl font-medium text-ivory-50 sm:text-5xl">
                {product.name}
              </h3>
              <div className="mt-3 flex items-center gap-2.5">
                <RatingStars value={product.rating} size={14} />
                <span className="text-xs text-ivory-100/60">
                  {product.rating} · {product.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ivory-100/70">
                {product.shortDescription}
              </p>

              {/* benefit list */}
              <ul className="mt-5 space-y-2.5">
                {product.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[13px] text-ivory-100/80">
                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-olive-500/25 text-olive-300">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              {/* ingredient tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.slice(0, 4).map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="rounded-full border border-ivory-50/15 bg-ivory-50/[0.06] px-3 py-1.5 text-[11px] font-semibold capitalize text-ivory-100/70"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-5">
                <MagneticButton
                  onClick={() => addToCart(product.id, 0, 1)}
                  className={BUT.light}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to cart — {inr(product.weights[0].price)}
                </MagneticButton>
                <Link
                  to={`/product/${product.slug}`}
                  className="group inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ivory-100/70 transition hover:text-gold-300"
                >
                  Full details
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* progress selectors */}
          <div className="mt-10 flex gap-3">
            {SHOWCASE.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                aria-label={`Show ${p.name}`}
                className={cn(
                  "group relative flex-1 cursor-pointer overflow-hidden rounded-2xl border p-2 text-left transition-all duration-400",
                  i === index
                    ? "border-gold-400/50 bg-ivory-50/[0.08]"
                    : "border-ivory-50/10 bg-transparent hover:bg-ivory-50/[0.04]"
                )}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={p.image}
                    alt=""
                    className="h-9 w-9 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <span className="hidden truncate text-[11px] font-semibold text-ivory-100/80 sm:block">
                    {p.name.split(" ")[0]}
                  </span>
                </div>
                {i === index &&
                  (reduce || paused ? (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gold-400" />
                  ) : (
                    <motion.div
                      key={`bar-${index}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5.2, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gold-400"
                    />
                  ))}
              </button>
            ))}
          </div>
        </div>

        {/* circular stage */}
        <div className="relative order-1 mx-auto aspect-square w-full max-w-[480px] lg:order-2">
          <motion.div
            className={cn("blob absolute inset-4 blur-2xl transition-colors duration-700", accents[index])}
          />
          <div
            aria-hidden
            className="absolute inset-0 rounded-full border border-dashed border-ivory-50/20 animate-spin-slower"
          />
          <div
            aria-hidden
            className="absolute inset-8 rounded-full border border-ivory-50/10"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.82, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.06, rotate: 4 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="absolute inset-[13%]"
            >
              <div className={reduce ? "h-full" : "animate-float-y h-full"}>
                <div className="h-full overflow-hidden rounded-full shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-ivory-50/20">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* orbiting tags */}
          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              {product.tags.slice(0, 3).map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.12, type: "spring", stiffness: 220, damping: 16 }}
                  className={cn(
                    "absolute rounded-full border border-ivory-50/25 bg-forest-900/70 px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-gold-300 backdrop-blur-md",
                    i === 0 && "-left-2 top-[22%] sm:left-0",
                    i === 1 && "-right-2 top-[48%] sm:right-[-2%]",
                    i === 2 && "bottom-[12%] left-[14%]"
                  )}
                  style={reduce ? undefined : { animation: `floatY ${7 + i * 1.4}s ease-in-out ${i * 0.8}s infinite` }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>

          <WishlistButton
            productId={product.id}
            className="absolute right-4 top-4 h-11 w-11"
            iconSize={18}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand story — from farm to family                                  */
/* ------------------------------------------------------------------ */
const TIMELINE = [
  {
    year: "2019",
    title: "The first churn",
    text: "It started with one Gir cow farm in Gujarat and a wooden bilona. 40 jars, sold to neighbours.",
  },
  {
    year: "2021",
    title: "120 farmer families",
    text: "Word spread. Millet growers from Solapur and beekeepers from Uttarakhand joined the circle.",
  },
  {
    year: "2024",
    title: "10,000 homes",
    text: "Today our jars sit in kitchens across 400+ Indian cities — still small-batch, still slow-made.",
  },
];

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const card1Y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const card2Y = useTransform(scrollYProgress, [0, 1], [90, -70]);
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-forest-950 py-24 text-ivory-50 lg:py-32">
      {/* parallax bg */}
      <motion.div aria-hidden style={reduce ? undefined : { y: bgY }} className="absolute -inset-y-16 inset-x-0 opacity-25">
        <img
          src={STOCK.goldenWheat}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/55 to-forest-950/90" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              tone="light"
              eyebrow="From farm to family"
              title={
                <>
                  We shorten the distance
                  <br />
                  between <span className="italic text-gold-300">soil and spoon.</span>
                </>
              }
              description="Most food travels through five warehouses before it reaches you. Ours travels through one pair of hands. We buy at above-market prices from farmers we know by name, process within kilometres of the field, and ship to you the same week."
            />

            <div className="mt-12 space-y-0">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.12}>
                  <div className="group relative flex gap-6 pb-10 last:pb-0">
                    {i < TIMELINE.length - 1 && (
                      <span aria-hidden className="absolute left-[26px] top-14 h-[calc(100%-42px)] w-px bg-gradient-to-b from-gold-400/60 to-ivory-50/10" />
                    )}
                    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-forest-900 font-display text-sm font-semibold text-gold-300 transition-colors duration-300 group-hover:bg-gold-400 group-hover:text-forest-950">
                      {t.year}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-ivory-50">
                        {t.title}
                      </h3>
                      <p className="mt-1.5 max-w-md text-[13.5px] leading-relaxed text-ivory-100/60">
                        {t.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3} className="mt-10">
              <Link to="/about">
                <MagneticButton className={BUT.ghost}>
                  Meet our farmers
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
            </Reveal>
          </div>

          {/* layered images */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <motion.div
              style={reduce ? undefined : { y: card1Y }}
              className="relative z-10 overflow-hidden rounded-[34px] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)] ring-1 ring-ivory-50/15"
            >
              <img
                src={STOCK.elderFarmer}
                alt="Elderly Indian farmer spreading seeds in a green field"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 to-transparent" />
              <p className="absolute bottom-5 left-6 right-6 font-display text-lg italic text-ivory-50">
                “The soil gives exactly what you give it.”
                <span className="mt-1 block font-sans text-[11px] font-bold uppercase not-italic tracking-[0.2em] text-gold-300">
                  Rameshbhai, partner farmer · Bhavnagar
                </span>
              </p>
            </motion.div>
            <motion.div
              style={reduce ? undefined : { y: card2Y }}
              className="absolute -bottom-12 -left-6 z-0 w-48 overflow-hidden rounded-[24px] border-4 border-forest-950 shadow-soft sm:-left-12 sm:w-60"
            >
              <img
                src={STOCK.riceHarvest}
                alt="Farmer gathering harvest in a rural field"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </motion.div>
            <div
              aria-hidden
              className="blob absolute -right-8 -top-10 h-40 w-40 bg-olive-500/25 blur-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || paused) return;
    const t = window.setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => window.clearInterval(t);
  }, [reduce, paused]);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[index];

  return (
    <section
      className="grain relative overflow-hidden bg-ivory-100 py-24 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        aria-hidden
        className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold-300/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="Kitchen conversations"
          title="Loved, tasted, and re-ordered."
          className="mb-12"
        />

        <div className="relative">
          <Quote
            aria-hidden
            className="absolute -top-6 left-1/2 h-16 w-16 -translate-x-1/2 text-terra-500/20"
            fill="currentColor"
            strokeWidth={0}
          />
          <div className="relative min-h-[300px] sm:min-h-[260px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.figure
                key={index}
                custom={dir}
                initial={{ opacity: 0, x: reduce ? 0 : dir * 70 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : dir * -70 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-0"
              >
                <div className="grain-light relative mx-auto flex h-full max-w-2xl flex-col items-center justify-center rounded-[32px] border border-forest-900/[0.06] bg-ivory-50 px-6 py-10 text-center shadow-card sm:px-14">
                  <RatingStars value={t.rating} size={16} className="mb-5" />
                  <blockquote className="font-display text-lg leading-relaxed text-forest-900 sm:text-[1.35rem]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-sand-300"
                    />
                    <span className="text-left">
                      <span className="block text-sm font-bold text-forest-900">{t.name}</span>
                      <span className="block text-[11px] text-ink-500">
                        {t.location} · bought {t.product}
                      </span>
                    </span>
                  </figcaption>
                </div>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-forest-900/15 text-forest-900 transition hover:bg-forest-900 hover:text-ivory-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-400",
                    i === index ? "w-8 bg-terra-500" : "w-2 bg-sand-300 hover:bg-olive-400"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-forest-900 text-ivory-50 shadow-soft transition hover:bg-terra-500"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
