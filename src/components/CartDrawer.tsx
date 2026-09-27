import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, ShoppingBag, Trash2, Truck, X, ChevronDown } from "lucide-react";
import {
  FREE_SHIPPING_THRESHOLD,
  useStore,
} from "../store/StoreContext";
import { inr } from "../data/products";
import { QuantitySelector, MagneticButton, BUT } from "./primitives";

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cartLines,
    cartCount,
    subtotal,
    mrpSavings,
    couponDiscount,
    coupon,
    updateQty,
    removeFromCart,
    changeWeight,
  } = useStore();
  const reduce = useReducedMotion();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [cartOpen]);

  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shipProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const goCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };
  const goShop = () => {
    setCartOpen(false);
    navigate("/shop");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-forest-950/55 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={reduce ? { duration: 0.12 } : { type: "spring", stiffness: 300, damping: 34 }}
            className="grain fixed bottom-0 right-0 top-0 z-[95] flex w-full max-w-md flex-col bg-ivory-50 shadow-soft"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
              <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold text-forest-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-ivory-50">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                Your Cart
                <span className="text-sm font-sans font-semibold text-ink-400">
                  ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-forest-900 transition hover:bg-forest-900/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cartLines.length === 0 ? (
              /* ------- empty state ------- */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative flex h-24 w-24 items-center justify-center rounded-full bg-sand-200/70"
                >
                  <ShoppingBag className="h-10 w-10 text-sand-400" />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-olive-400 text-ivory-50">
                    <Leaf className="h-3.5 w-3.5" />
                  </span>
                </motion.div>
                <p className="font-display text-2xl text-forest-900">Your cart is empty</p>
                <p className="max-w-55 text-sm leading-relaxed text-ink-500">
                  Fill it with the good stuff — ghee, millets, raw honey and more, straight from Indian farms.
                </p>
                <MagneticButton onClick={goShop} className={BUT.primary}>
                  Start shopping <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </div>
            ) : (
              <>
                {/* free shipping meter */}
                <div className="border-b border-forest-900/10 bg-ivory-100/70 px-5 py-3.5">
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-ink-700">
                    <Truck className="h-4 w-4 text-olive-600" />
                    {remainingForFreeShip > 0 ? (
                      <span>
                        Add <b className="text-terra-600">{inr(remainingForFreeShip)}</b> more for{" "}
                        <b className="text-forest-900">free shipping</b>
                      </span>
                    ) : (
                      <span className="text-forest-700">
                        You've unlocked <b>free standard shipping</b>
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-sand-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-olive-500 to-forest-600"
                      animate={{ width: `${shipProgress}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>

                {/* items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {cartLines.map((line) => (
                      <motion.div
                        key={`${line.product.id}-${line.weightIndex}`}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                        className="mb-3.5 flex gap-3.5 rounded-2xl border border-forest-900/[0.06] bg-ivory-50 p-3 shadow-[0_4px_16px_-8px_rgba(18,39,27,0.12)]"
                      >
                        <button
                          onClick={() => {
                            setCartOpen(false);
                            navigate(`/product/${line.product.slug}`);
                          }}
                          className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-sand-200"
                          aria-label={`View ${line.product.name}`}
                        >
                          <img
                            src={line.product.image}
                            alt={line.product.name}
                            className="h-full w-full object-cover"
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-[13.5px] font-bold text-forest-900">
                              {line.product.name}
                            </p>
                            <button
                              onClick={() =>
                                removeFromCart(line.product.id, line.weightIndex)
                              }
                              aria-label={`Remove ${line.product.name}`}
                              className="cursor-pointer rounded-full p-1 text-ink-400 transition hover:bg-terra-500/10 hover:text-terra-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* weight selector */}
                          <div className="relative mt-1 inline-block">
                            <select
                              value={line.weightIndex}
                              onChange={(e) =>
                                changeWeight(
                                  line.product.id,
                                  line.weightIndex,
                                  Number(e.target.value)
                                )
                              }
                              aria-label="Select pack size"
                              className="cursor-pointer appearance-none rounded-full border border-sand-300 bg-ivory-100 py-1 pl-3 pr-7 text-[11px] font-semibold text-ink-700 outline-none transition hover:border-olive-400"
                            >
                              {line.product.weights.map((w, wi) => (
                                <option key={w.label} value={wi}>
                                  {w.label} — {inr(w.price)}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-500" />
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <QuantitySelector
                              qty={line.qty}
                              size="sm"
                              onChange={(d) =>
                                updateQty(line.product.id, line.weightIndex, d)
                              }
                            />
                            <div className="text-right">
                              <p className="text-sm font-bold text-forest-900">
                                {inr(line.lineTotal)}
                              </p>
                              {line.lineMrp > line.lineTotal && (
                                <p className="text-[10px] text-ink-400 line-through">
                                  {inr(line.lineMrp)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* footer */}
                <div className="border-t border-forest-900/10 bg-ivory-100/60 px-5 py-4 backdrop-blur">
                  <div className="space-y-1.5 text-[13px]">
                    <div className="flex justify-between text-ink-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-ink-900">{inr(subtotal)}</span>
                    </div>
                    {mrpSavings > 0 && (
                      <div className="flex justify-between text-olive-600">
                        <span>You save vs MRP</span>
                        <span className="font-semibold">− {inr(mrpSavings)}</span>
                      </div>
                    )}
                    {coupon && couponDiscount > 0 && (
                      <div className="flex justify-between text-terra-600">
                        <span>Coupon ({coupon.code})</span>
                        <span className="font-semibold">− {inr(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between pt-1.5">
                      <span className="font-display text-lg font-semibold text-forest-900">
                        Total
                      </span>
                      <span className="font-display text-2xl font-semibold text-forest-900">
                        {inr(subtotal - couponDiscount)}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-ink-400">
                      Shipping calculated at checkout · Taxes included
                    </p>
                  </div>
                  <div className="mt-3.5 flex gap-2.5">
                    <MagneticButton onClick={goShop} className={`${BUT.secondary} flex-1 !px-4 py-3`}>
                      Continue
                    </MagneticButton>
                    <MagneticButton onClick={goCheckout} className={`${BUT.terra} flex-[1.4] !px-4 py-3`}>
                      Checkout <ArrowRight className="h-4 w-4" />
                    </MagneticButton>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
