import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { useStore } from "../store/StoreContext";
import { ProductCard } from "../components/ProductCard";
import { BUT, MagneticButton, Reveal } from "../components/primitives";

export default function Wishlist() {
  const { wishlist, addToCart } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <Reveal y={18}>
        <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-terra-500">
          <Heart className="h-3.5 w-3.5" fill="currentColor" /> Saved for later
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-medium text-forest-950 sm:text-5xl">
            Your wishlist
            <span className="ml-3 align-middle font-sans text-sm font-bold text-ink-400">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </h1>
          {items.length > 0 && (
            <button
              onClick={() => {
                items.forEach((p) => addToCart(p.id, 0, 1, false));
              }}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-forest-900 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory-50 shadow-soft transition hover:bg-terra-500"
            >
              <ShoppingBag className="h-4 w-4" /> Add all to cart
            </button>
          )}
        </div>
      </Reveal>

      {items.length === 0 ? (
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center rounded-[32px] border border-dashed border-forest-900/15 bg-ivory-100/60 px-6 py-24 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-sand-200/70">
              <Heart className="h-10 w-10 text-sand-400" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-terra-500/30 animate-pulse-dot" />
            </div>
            <h2 className="mt-6 font-display text-3xl font-medium text-forest-900">
              Nothing saved yet
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
              Tap the heart on any product to keep it here — perfect for gifts,
              future reorders and harvest-season planning.
            </p>
            <Link to="/shop" className="mt-8">
              <MagneticButton className={BUT.primary}>
                Discover products <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} tilt={false} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
