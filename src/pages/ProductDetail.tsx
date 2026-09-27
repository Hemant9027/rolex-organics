import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  Leaf,
  MapPin,
  Minus,
  Package,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import {
  CATEGORIES,
  discountPct,
  inr,
  productBySlug,
  relatedProducts,
  STOCK,
  TESTIMONIALS,
} from "../data/products";
import { useStore } from "../store/StoreContext";
import {
  BUT,
  MagneticButton,
  RatingStars,
  Reveal,
  SectionHeading,
  WishlistButton,
} from "../components/primitives";
import { ProductCard } from "../components/ProductCard";
import { cn } from "../utils/cn";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = slug ? productBySlug(slug) : undefined;
  const navigate = useNavigate();
  const { addToCart } = useStore();

  const [weightIndex, setWeightIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setWeightIndex(0);
    setQty(1);
    setImgIndex(0);
  }, [slug]);

  const gallery = useMemo(
    () =>
      product
        ? [product.image, STOCK.spiceBowls, STOCK.farmerField]
        : [],
    [product]
  );

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 pt-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-200/70">
          <Leaf className="h-7 w-7 text-olive-500" />
        </span>
        <h1 className="font-display text-3xl text-forest-900">Product not found</h1>
        <p className="max-w-sm text-sm text-ink-500">
          The product you're looking for may have been moved or is out of season.
        </p>
        <MagneticButton onClick={() => navigate("/shop")} className={BUT.primary}>
          Back to shop
        </MagneticButton>
      </div>
    );
  }

  const w = product.weights[weightIndex];
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const related = relatedProducts(product);
  const lowStock = product.stock <= 10;
  const buyNow = () => {
    addToCart(product.id, weightIndex, qty, false);
    navigate("/checkout");
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
          <Link to="/" className="transition hover:text-terra-500">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="transition hover:text-terra-500">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/shop?category=${product.category}`} className="transition hover:text-terra-500">
            {cat?.name}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-forest-900">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* ------------ gallery ------------ */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal y={20}>
              <ZoomImage src={gallery[imgIndex]} alt={product.name} badge={`${discountPct(w)}% off`} />
              <div className="mt-4 flex gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    aria-label={`View image ${i + 1}`}
                    className={cn(
                      "h-20 w-20 cursor-pointer overflow-hidden rounded-2xl ring-2 transition-all sm:h-24 sm:w-24",
                      i === imgIndex
                        ? "ring-terra-500 ring-offset-2 ring-offset-ivory-50"
                        : "ring-transparent hover:ring-olive-400"
                    )}
                  >
                    <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ------------ info ------------ */}
          <Reveal y={24} delay={0.1}>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/shop?category=${product.category}`}
                className="rounded-full bg-olive-500/12 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-olive-700 transition hover:bg-olive-500 hover:text-ivory-50"
              >
                {cat?.name}
              </Link>
              {product.isNew && (
                <span className="flex items-center gap-1 rounded-full bg-forest-900 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-gold-300">
                  <Sparkles className="h-3 w-3" /> New harvest
                </span>
              )}
              {product.bestseller && (
                <span className="rounded-full bg-terra-500/12 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-terra-600">
                  Bestseller
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-forest-950 sm:text-[2.9rem]">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <RatingStars value={product.rating} size={15} />
              <a href="#reviews" className="text-[13px] font-semibold text-ink-500 underline-offset-4 transition hover:text-terra-500 hover:underline">
                {product.rating} · {product.reviewCount.toLocaleString("en-IN")} reviews
              </a>
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-olive-600">
                <BadgeCheck className="h-4 w-4" /> Lab-tested batch
              </span>
            </div>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-500">
              {product.shortDescription}
            </p>

            {/* price */}
            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
              <p className="font-display text-4xl font-semibold text-forest-900">{inr(w.price)}</p>
              <p className="pb-1 text-lg text-ink-400 line-through">{inr(w.originalPrice)}</p>
              <span className="mb-1.5 rounded-full bg-terra-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ivory-50 shadow-glow-terra">
                Save {inr(w.originalPrice - w.price)}
              </span>
            </div>
            <p className="mt-1.5 text-[11.5px] text-ink-400">
              Inclusive of all taxes · MRP {inr(w.originalPrice)} per {w.label}
            </p>

            {/* weight selector */}
            <div className="mt-7">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-400">
                Select pack size
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.weights.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => setWeightIndex(i)}
                    className={cn(
                      "group cursor-pointer rounded-2xl border-2 px-5 py-3 text-left transition-all duration-300",
                      i === weightIndex
                        ? "border-forest-900 bg-forest-900 text-ivory-50 shadow-soft"
                        : "border-sand-300 bg-ivory-50 hover:border-olive-400"
                    )}
                  >
                    <span className={cn("block text-[13px] font-bold", i === weightIndex ? "text-ivory-50" : "text-forest-900")}>
                      {opt.label}
                    </span>
                    <span className={cn("mt-0.5 flex items-baseline gap-1.5 text-[12px]", i === weightIndex ? "text-ivory-100/80" : "text-ink-500")}>
                      <b>{inr(opt.price)}</b>
                      <s className="opacity-60">{inr(opt.originalPrice)}</s>
                      <span className={cn("text-[10px] font-bold", i === weightIndex ? "text-gold-300" : "text-terra-600")}>
                        {discountPct(opt)}% off
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* qty + stock */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="inline-flex h-13 items-center rounded-full border border-sand-300 bg-ivory-50">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-full w-12 cursor-pointer items-center justify-center rounded-l-full transition hover:bg-sand-200 disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center font-display text-lg font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(Math.min(product.stock, 10), q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-full w-12 cursor-pointer items-center justify-center rounded-r-full transition hover:bg-sand-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className={cn("flex items-center gap-2 text-[12.5px] font-semibold", lowStock ? "text-terra-600" : "text-olive-600")}>
                <span className={cn("h-2 w-2 rounded-full", lowStock ? "bg-terra-500 animate-pulse-dot" : "bg-olive-500")} />
                {lowStock
                  ? `Hurry — only ${product.stock} jars left in this batch`
                  : "In stock — ships within 24 hours"}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <MagneticButton
                onClick={() => addToCart(product.id, weightIndex, qty)}
                className={`${BUT.primary} flex-1 py-4`}
                ariaLabel="Add to cart"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                Add to cart · {inr(w.price * qty)}
              </MagneticButton>
              <MagneticButton onClick={buyNow} className={`${BUT.terra} flex-1 py-4`} ariaLabel="Buy now">
                <Zap className="h-4.5 w-4.5" /> Buy now
              </MagneticButton>
              <WishlistButton
                productId={product.id}
                className="h-[52px] w-[52px] shrink-0 self-center !ring-sand-300"
                iconSize={19}
              />
            </div>

            {/* trust chips */}
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { icon: Truck, label: "Free ship over ₹999" },
                { icon: ShieldCheck, label: "NMR tested" },
                { icon: RefreshCcw, label: "7-day returns" },
                { icon: Package, label: "Plastic-free pack" },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2 rounded-2xl border border-forest-900/[0.07] bg-ivory-100/70 px-3 py-2.5 text-[11px] font-semibold text-ink-700"
                >
                  <chip.icon className="h-4 w-4 shrink-0 text-olive-600" />
                  {chip.label}
                </div>
              ))}
            </div>

            {/* delivery */}
            <DeliveryChecker />

            {/* accordions */}
            <div className="mt-8">
              <Accordion icon={<Leaf className="h-4 w-4" />} title="About this product" defaultOpen>
                <p>{product.description}</p>
                <p className="mt-3 text-[13px]">
                  <b className="text-forest-900">Origin:</b> {product.origin} ·{" "}
                  <b className="text-forest-900">Shelf life:</b> {product.shelfLife}
                </p>
              </Accordion>
              <Accordion icon={<Sparkles className="h-4 w-4" />} title="Benefits & ingredients">
                <ul className="space-y-2">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terra-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 rounded-xl bg-olive-500/10 px-3.5 py-2.5 text-[13px] text-olive-700">
                  <b>Ingredients:</b> {product.ingredients}
                </p>
              </Accordion>
              <Accordion icon={<Truck className="h-4 w-4" />} title="Shipping & returns">
                <p>
                  Orders placed before 4 PM ship the same day from our Pune fulfilment centre.
                  Standard delivery (free over ₹999) reaches most Indian pin codes in 3–6 days;
                  express arrives in 1–2 days.
                </p>
                <p className="mt-2">
                  Unhappy with a batch? Tell us within 7 days of delivery for a no-questions
                  replacement or refund.
                </p>
              </Accordion>
            </div>
          </Reveal>
        </div>

        {/* ------------ reviews ------------ */}
        <section id="reviews" className="scroll-mt-28 py-20">
          <SectionHeading
            eyebrow="Reviews"
            title="From their kitchens to ours."
            className="mb-10"
          />
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* breakdown */}
            <Reveal>
              <div className="rounded-[26px] border border-forest-900/[0.06] bg-ivory-50 p-7 shadow-card">
                <p className="font-display text-5xl font-semibold text-forest-900">{product.rating}</p>
                <RatingStars value={product.rating} size={17} className="mt-2" />
                <p className="mt-2 text-[12.5px] text-ink-500">
                  {product.reviewCount.toLocaleString("en-IN")} verified reviews
                </p>
                <div className="mt-5 space-y-2.5">
                  {[72, 19, 6, 2, 1].map((pct, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[11px] font-semibold text-ink-500">
                      <span className="w-6 text-right">{5 - i}★</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand-200">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-gold-400"
                        />
                      </div>
                      <span className="w-8">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* review cards */}
            <div className="space-y-4">
              {TESTIMONIALS.slice(0, 3).map((t, i) => (
                <Reveal key={t.name} delay={i * 0.1}>
                  <article className="rounded-[26px] border border-forest-900/[0.06] bg-ivory-50 p-6 shadow-card">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.name} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-bold text-forest-900">{t.name}</p>
                          <p className="flex items-center gap-1 text-[11px] text-ink-500">
                            <MapPin className="h-3 w-3" /> {t.location} · Verified buyer
                          </p>
                        </div>
                      </div>
                      <RatingStars value={t.rating} size={13} />
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed text-ink-700">“{t.quote}”</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------ related ------------ */}
        <section className="border-t border-forest-900/[0.07] py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Pairs well with" title="You may also love" />
            <Link
              to="/shop"
              className="hidden shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-900 transition hover:text-terra-500 sm:flex"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} tilt={false} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* sticky mobile purchase bar */}
      <motion.div
        initial={{ y: 90 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 26 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-900/10 bg-ivory-50/95 px-4 py-3 shadow-[0_-10px_30px_-15px_rgba(18,39,27,0.3)] backdrop-blur-xl lg:hidden"
      >
        <div className="flex items-center gap-3">
          <img src={product.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-forest-900">{product.name}</p>
            <p className="text-[13px] font-bold text-terra-600">
              {inr(w.price)} <s className="text-[10px] font-normal text-ink-400">{inr(w.originalPrice)}</s>
              <span className="ml-1 text-[10px] font-semibold text-ink-400">· {w.label}</span>
            </p>
          </div>
          <button
            onClick={() => addToCart(product.id, weightIndex, qty)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-forest-900 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-ivory-50 shadow-soft transition active:bg-terra-500"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Zoom image                                                         */
/* ------------------------------------------------------------------ */
function ZoomImage({ src, alt, badge }: { src: string; alt: string; badge: string }) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function onMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={onMove}
      className="relative aspect-square cursor-zoom-in overflow-hidden rounded-[34px] bg-sand-200/60 shadow-soft"
      role="img"
      aria-label={alt}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: zoom ? 1.65 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: origin }}
          className="h-full w-full object-cover"
        />
      </AnimatePresence>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-terra-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ivory-50 shadow-glow-terra">
        {badge}
      </span>
      <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-forest-950/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ivory-100/90 backdrop-blur">
        Hover to zoom
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Delivery checker                                                   */
/* ------------------------------------------------------------------ */
function DeliveryChecker() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; msg: string }>(null);

  const check = () => {
    if (!/^\d{6}$/.test(pin)) {
      setResult({ ok: false, msg: "Please enter a valid 6-digit PIN code." });
      return;
    }
    const metros = ["11", "12", "40", "41", "56", "60", "70", "50"];
    const metro = metros.some((m) => pin.startsWith(m));
    setResult({
      ok: true,
      msg: metro
        ? `Great news — express delivery in 1–2 days to ${pin}.`
        : `Delivers to ${pin} in 3–6 days. COD available.`,
    });
  };

  return (
    <div className="mt-7 rounded-2xl border border-forest-900/[0.07] bg-ivory-100/70 p-4">
      <p className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-ink-700">
        <Truck className="h-4 w-4 text-olive-600" /> Check delivery
      </p>
      <div className="flex gap-2">
        <input
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
            setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          inputMode="numeric"
          placeholder="Enter PIN code"
          aria-label="Enter PIN code"
          className="w-full rounded-full border border-sand-300 bg-ivory-50 px-4.5 py-2.5 text-sm text-forest-900 outline-none transition focus:border-olive-400 focus:ring-2 focus:ring-olive-400/30"
        />
        <button
          onClick={check}
          className="shrink-0 cursor-pointer rounded-full bg-forest-900 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-ivory-50 transition hover:bg-terra-500"
        >
          Check
        </button>
      </div>
      <AnimatePresence>
        {result && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn("mt-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold", result.ok ? "text-olive-600" : "text-terra-600")}
          >
            <BadgeCheck className="h-4 w-4 shrink-0" />
            {result.msg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Accordion                                                          */
/* ------------------------------------------------------------------ */
function Accordion({
  title,
  children,
  icon,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-forest-900/10">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 py-5 text-left"
      >
        <span className="flex items-center gap-3 text-[15px] font-bold text-forest-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-500/12 text-olive-600">
            {icon}
          </span>
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-ink-400">
          <ChevronDown className="h-4.5 w-4.5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-11 pr-2 text-[13.5px] leading-relaxed text-ink-500">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
