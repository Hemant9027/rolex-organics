import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Leaf,
  Menu,
  Search,
  ShoppingBag,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import { CATEGORIES, productsInCategory } from "../data/products";
import { cn } from "../utils/cn";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="ROLEX Organics — home">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-forest-800 to-forest-950 text-gold-300 shadow-soft ring-1 ring-gold-400/30">
        <Leaf className="h-[18px] w-[18px]" strokeWidth={1.8} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-terra-500" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-xl font-semibold tracking-[0.06em]",
            tone === "dark" ? "text-forest-900" : "text-ivory-50"
          )}
        >
          ROLEX
        </span>
        <span
          className={cn(
            "block text-[9px] font-bold uppercase tracking-[0.42em]",
            tone === "dark" ? "text-terra-500" : "text-gold-300"
          )}
        >
          Organics
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const { cartCount, wishlist, setCartOpen, setSearchOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* pages whose top-of-page background is light (hero / ivory) */
  const lightTop =
    pathname === "/" ||
    pathname.startsWith("/product") ||
    pathname === "/wishlist" ||
    pathname === "/checkout";
  const lightText = !scrolled && !lightTop;
  const navColor = lightText
    ? "text-ivory-100/85 hover:text-ivory-50"
    : "text-ink-700 hover:text-forest-900";
  const navActive = lightText ? "active text-ivory-50" : "active text-forest-900";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-forest-900/[0.07] bg-ivory-50/85 shadow-[0_10px_40px_-20px_rgba(18,39,27,0.25)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo tone={lightText ? "light" : "dark"} />

          {/* desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {LINKS.slice(0, 2).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "nav-link text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    navColor,
                    isActive && navActive
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}

            {/* categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button
                className={cn(
                  "nav-link flex cursor-pointer items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors",
                  navColor,
                  catOpen && navActive
                )}
                aria-haspopup="true"
                aria-expanded={catOpen}
                onClick={() => navigate("/shop")}
                onFocus={() => setCatOpen(true)}
                onBlur={() => setCatOpen(false)}
              >
                Categories
                <motion.span animate={{ rotate: catOpen ? 180 : 0 }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-4"
                  >
                    <div className="grain relative overflow-hidden rounded-3xl border border-forest-900/[0.07] bg-ivory-50/95 p-4 shadow-soft backdrop-blur-2xl">
                      <div className="grid grid-cols-3 gap-2">
                        {CATEGORIES.map((c) => (
                          <Link
                            key={c.id}
                            to={`/shop?category=${c.id}`}
                            onClick={() => setCatOpen(false)}
                            className="group rounded-2xl p-2.5 transition-colors hover:bg-ivory-200"
                          >
                            <div className="mb-2 h-20 overflow-hidden rounded-xl">
                              <img
                                src={c.image}
                                alt={c.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <p className="text-[13px] font-bold text-forest-900">{c.name}</p>
                            <p className="text-[11px] text-ink-500">
                              {productsInCategory(c.id).length} products
                            </p>
                          </Link>
                        ))}
                      </div>
                      <Link
                        to="/shop"
                        onClick={() => setCatOpen(false)}
                        className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl bg-forest-900 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ivory-50 transition-colors hover:bg-forest-700"
                      >
                        View all products <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {LINKS.slice(2).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "nav-link text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors",
                    navColor,
                    isActive && navActive
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <IconAction label="Search" onClick={() => setSearchOpen(true)} light={lightText}>
              <Search className="h-[18px] w-[18px]" strokeWidth={2} />
            </IconAction>
            <IconAction label="Wishlist" onClick={() => navigate("/wishlist")} badge={wishlist.length} light={lightText}>
              <Heart className="h-[18px] w-[18px]" strokeWidth={2} />
            </IconAction>
            <IconAction label="Open cart" onClick={() => setCartOpen(true)} badge={cartCount} highlight light={lightText}>
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2} />
            </IconAction>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={cn(
                "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition lg:hidden",
                lightText ? "text-ivory-50 hover:bg-ivory-50/10" : "text-forest-900 hover:bg-forest-900/5"
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function IconAction({
  children,
  label,
  onClick,
  badge,
  highlight,
  light,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: number;
  highlight?: boolean;
  light?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
        highlight
          ? "bg-forest-900 text-ivory-50 shadow-soft hover:bg-forest-700"
          : light
            ? "text-ivory-50 hover:bg-ivory-50/10"
            : "text-forest-900 hover:bg-forest-900/5",
        highlight && light && "ring-1 ring-ivory-50/20"
      )}
    >
      {children}
      <AnimatePresence>
        {!!badge && (
          <motion.span
            key={badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-terra-500 px-1 text-[10px] font-bold text-ivory-50 ring-2 ring-ivory-50"
          >
            {badge > 9 ? "9+" : badge}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-forest-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 32 }}
            className="grain fixed bottom-0 right-0 top-0 z-[95] flex w-full max-w-sm flex-col bg-forest-950 text-ivory-50"
            role="dialog"
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between border-b border-ivory-50/10 p-5">
              <Logo tone="light" />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ring-1 ring-ivory-50/20 transition hover:bg-ivory-50/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-5" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  <NavLink
                    to={l.to}
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-2xl px-4 py-4 font-display text-2xl font-medium transition-colors hover:bg-ivory-50/[0.06]"
                  >
                    {l.label}
                    <ArrowUpRight className="h-5 w-5 text-gold-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  </NavLink>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => {
                  onClose();
                  navigate("/wishlist");
                }}
                className="flex cursor-pointer items-center justify-between rounded-2xl px-4 py-4 text-left font-display text-2xl font-medium transition-colors hover:bg-ivory-50/[0.06]"
              >
                Wishlist
                <Heart className="h-5 w-5 text-gold-300" />
              </motion.button>
            </nav>

            <div className="mt-auto p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-ivory-100/50">
                Shop by category
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c, i) => (
                  <motion.span
                    key={c.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <Link
                      to={`/shop?category=${c.id}`}
                      onClick={onClose}
                      className="rounded-full bg-ivory-50/[0.08] px-3.5 py-2 text-xs font-semibold text-ivory-100 ring-1 ring-ivory-50/10 transition hover:bg-gold-400 hover:text-forest-950"
                    >
                      {c.name}
                    </Link>
                  </motion.span>
                ))}
              </div>
              <p className="mt-6 text-center text-[11px] text-ivory-100/40">
                Pure from the soil. Powerful for life.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
