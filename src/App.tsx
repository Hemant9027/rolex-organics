import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import { StoreProvider, useStore } from "./store/StoreContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { SearchOverlay } from "./components/SearchOverlay";
import { Toasts } from "./components/primitives";
import Home from "./pages/Home";

const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PolicyPage = lazy(() => import("./pages/Policies"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ------------------------------------------------------------------ */
/*  Brand loader                                                       */
/* ------------------------------------------------------------------ */
function BrandLoader({ done }: { done: () => void }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const t = window.setTimeout(done, reduce ? 300 : 1750);
    return () => window.clearTimeout(t);
  }, [done, reduce]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-forest-950 text-ivory-50"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-forest-700 to-forest-900 ring-1 ring-gold-400/40"
      >
        <Leaf className="h-7 w-7 text-gold-300" strokeWidth={1.8} />
      </motion.div>
      <div className="mt-5 overflow-hidden">
        <motion.p
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-2xl font-semibold tracking-[0.08em]"
        >
          ROLEX <span className="text-gold-300">Organics</span>
        </motion.p>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-ivory-100/50"
      >
        Pure from the soil
      </motion.p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
        className="mt-6 h-px w-28 origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent"
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll + overlay management                                        */
/* ------------------------------------------------------------------ */
function RouteEffects() {
  const { pathname, search } = useLocation();
  const { setSearchOpen } = useStore();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    setSearchOpen(false);
  }, [pathname, search, setSearchOpen]);
  return null;
}

/* ------------------------------------------------------------------ */
/*  Route persistence (remount guard for search params on same page)   */
/* ------------------------------------------------------------------ */
function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: reduce ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PolicyPage kind="privacy" />} />
            <Route path="/terms" element={<PolicyPage kind="terms" />} />
            <Route path="/shipping-policy" element={<PolicyPage kind="shipping" />} />
            <Route path="/refund-policy" element={<PolicyPage kind="refund" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-24">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-sand-300 border-t-terra-500"
      >
        <Leaf className="h-5 w-5 text-olive-600" />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */
function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <Toasts />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <StoreProvider>
      <HashRouter>
        <RouteEffects />
        <AnimatePresence>
          {loading && <BrandLoader done={() => setLoading(false)} />}
        </AnimatePresence>
        <Shell>
          <AnimatedRoutes />
        </Shell>
      </HashRouter>
    </StoreProvider>
  );
}
