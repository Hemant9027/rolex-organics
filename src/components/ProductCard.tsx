import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Eye, PackageCheck, ShoppingBag, X } from "lucide-react";
import { CATEGORIES, discountPct, inr, type Product } from "../data/products";
import { useStore } from "../store/StoreContext";
import {
  QuantitySelector,
  RatingStars,
  TiltCard,
  WishlistButton,
} from "./primitives";
import { cn } from "../utils/cn";

export function ProductCard({
  product,
  tilt = true,
  className,
}: {
  product: Product;
  tilt?: boolean;
  className?: string;
}) {
  const { addToCart } = useStore();
  const [weightIndex, setWeightIndex] = useState(0);
  const [quickOpen, setQuickOpen] = useState(false);
  const w = product.weights[weightIndex];
  const cat = CATEGORIES.find((c) => c.id === product.category);
  const lowStock = product.stock <= 10;

  const card = (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-forest-900/[0.06] bg-ivory-50 shadow-card transition-shadow duration-500 hover:shadow-soft",
        className
      )}
    >
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-sand-200/60">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
        </Link>

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <span className="rounded-full bg-terra-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory-50 shadow-glow-terra">
            {discountPct(w)}% off
          </span>
          {product.isNew && (
            <span className="rounded-full bg-forest-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-300">
              New
            </span>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          className="absolute right-3 top-3 h-9 w-9"
        />

        {/* quick view */}
        <button
          onClick={() => setQuickOpen(true)}
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-10 cursor-pointer items-center gap-1.5 rounded-full bg-ivory-50/90 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-forest-900 opacity-0 shadow-soft backdrop-blur transition-all duration-500 hover:bg-forest-900 hover:text-ivory-50 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" /> Quick view
        </button>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <Link
            to={`/shop?category=${product.category}`}
            className="text-[10px] font-bold uppercase tracking-[0.18em] text-olive-600 transition hover:text-terra-500"
          >
            {cat?.name}
          </Link>
          <span
            className={cn(
              "flex items-center gap-1 text-[10px] font-semibold",
              lowStock ? "text-terra-600" : "text-olive-600"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                lowStock ? "bg-terra-500 animate-pulse-dot" : "bg-olive-500"
              )}
            />
            {lowStock ? `Only ${product.stock} left` : "In stock"}
          </span>
        </div>

        <Link to={`/product/${product.slug}`} className="group/title">
          <h3 className="font-display text-[17px] font-semibold leading-snug text-forest-900 transition-colors group-hover/title:text-terra-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1.5">
          <RatingStars value={product.rating} size={12} />
          <span className="text-[11px] text-ink-500">
            {product.rating} ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>

        {/* weight pills */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {product.weights.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => setWeightIndex(i)}
              className={cn(
                "cursor-pointer rounded-full border px-2.5 py-1 text-[10.5px] font-semibold transition-all",
                i === weightIndex
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-sand-300 bg-transparent text-ink-500 hover:border-olive-400 hover:text-forest-900"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3.5">
          <div>
            <p className="text-lg font-bold leading-none text-forest-900">{inr(w.price)}</p>
            <p className="mt-0.5 text-[11px] text-ink-400 line-through">
              {inr(w.originalPrice)}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product.id, weightIndex, 1)}
            aria-label={`Add ${product.name} to cart`}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-forest-900 text-ivory-50 shadow-soft transition-colors duration-300 hover:bg-terra-500"
          >
            <ShoppingBag className="h-[17px] w-[17px]" />
          </motion.button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {tilt ? (
        <TiltCard intensity={5} className="h-full rounded-[26px]">
          {card}
        </TiltCard>
      ) : (
        card
      )}
      <QuickViewModal
        product={product}
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick view modal                                                   */
/* ------------------------------------------------------------------ */
function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { addToCart } = useStore();
  const [weightIndex, setWeightIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const w = product.weights[weightIndex];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    setQty(1);
  }, [weightIndex, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-forest-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-label={`Quick view of ${product.name}`}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="grain relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-ivory-50 shadow-soft sm:grid-cols-2 sm:rounded-[28px] sm:overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-ivory-50/85 text-forest-900 shadow-card backdrop-blur transition hover:bg-forest-900 hover:text-ivory-50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-square bg-sand-200/60 sm:aspect-auto sm:h-full">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-terra-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory-50">
                {discountPct(w)}% off
              </span>
            </div>

            <div className="flex flex-col p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-olive-600">
                {CATEGORIES.find((c) => c.id === product.category)?.name}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold text-forest-900">
                {product.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-2">
                <RatingStars value={product.rating} size={13} />
                <span className="text-xs text-ink-500">
                  {product.rating} · {product.reviewCount.toLocaleString("en-IN")} reviews
                </span>
              </div>

              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-500">
                {product.shortDescription}
              </p>

              <div className="mt-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
                  Pack size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.weights.map((opt, i) => (
                    <button
                      key={opt.label}
                      onClick={() => setWeightIndex(i)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                        i === weightIndex
                          ? "border-forest-900 bg-forest-900 text-ivory-50"
                          : "border-sand-300 text-ink-500 hover:border-olive-400"
                      )}
                    >
                      {opt.label} · {inr(opt.price)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <QuantitySelector qty={qty} onChange={(d) => setQty((q) => Math.max(1, Math.min(10, q + d)))} />
                <div>
                  <p className="font-display text-2xl font-semibold text-forest-900">
                    {inr(w.price * qty)}
                  </p>
                  <p className="text-[11px] text-ink-400">
                    <span className="line-through">{inr(w.originalPrice * qty)}</span>
                    <span className="ml-1.5 font-semibold text-olive-600">
                      Save {inr((w.originalPrice - w.price) * qty)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-2.5 pt-5">
                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      addToCart(product.id, weightIndex, qty);
                      onClose();
                    }}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-forest-900 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory-50 transition hover:bg-forest-700"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to cart
                  </button>
                  <span className="flex items-center gap-1.5 rounded-full bg-olive-300/25 px-3.5 text-[11px] font-semibold text-olive-700">
                    <PackageCheck className="h-3.5 w-3.5" />
                    {product.stock > 10 ? "Ships in 24h" : "Almost gone"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/product/${product.slug}`);
                  }}
                  className="group flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-forest-900/20 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-forest-900 transition hover:bg-forest-900 hover:text-ivory-50"
                >
                  Full details
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
