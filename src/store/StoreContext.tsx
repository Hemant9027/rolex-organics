import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { productById, type Product, type WeightOption } from "../data/products";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export interface CartItem {
  productId: string;
  weightIndex: number;
  qty: number;
}

export interface CartLine {
  product: Product;
  weight: WeightOption;
  weightIndex: number;
  qty: number;
  lineTotal: number;
  lineMrp: number;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  cap?: number;
  minSubtotal?: number;
  label: string;
}

export const COUPONS: Record<string, Coupon> = {
  ROLEX10: {
    code: "ROLEX10",
    type: "percent",
    value: 10,
    cap: 300,
    label: "10% off (up to ₹300)",
  },
  WELCOME100: {
    code: "WELCOME100",
    type: "flat",
    value: 100,
    minSubtotal: 999,
    label: "₹100 off above ₹999",
  },
  ORGANIC15: {
    code: "ORGANIC15",
    type: "percent",
    value: 15,
    cap: 500,
    minSubtotal: 1499,
    label: "15% off above ₹1,499 (up to ₹500)",
  },
};

export type ToastKind = "cart" | "heart" | "check" | "info";
export interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

interface StoreCtx {
  /* cart */
  cart: CartItem[];
  cartLines: CartLine[];
  cartCount: number;
  subtotal: number;
  mrpTotal: number;
  mrpSavings: number;
  coupon: Coupon | null;
  couponDiscount: number;
  payable: number;
  addToCart: (productId: string, weightIndex?: number, qty?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string, weightIndex: number) => void;
  updateQty: (productId: string, weightIndex: number, delta: number) => void;
  changeWeight: (productId: string, fromIndex: number, toIndex: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  /* wishlist */
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  /* ui */
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toasts: Toast[];
  pushToast: (message: string, kind?: ToastKind) => void;
}

/* ------------------------------------------------------------------ */
function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable */
  }
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readLS("rolex_cart_v1", []));
  const [wishlist, setWishlist] = useState<string[]>(() => readLS("rolex_wishlist_v1", []));
  const [coupon, setCoupon] = useState<Coupon | null>(() => readLS("rolex_coupon_v1", null));
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => writeLS("rolex_cart_v1", cart), [cart]);
  useEffect(() => writeLS("rolex_wishlist_v1", wishlist), [wishlist]);
  useEffect(() => writeLS("rolex_coupon_v1", coupon), [coupon]);

  const pushToast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const addToCart = useCallback(
    (productId: string, weightIndex = 0, qty = 1, openDrawer = true) => {
      const product = productById(productId);
      if (!product) return;
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.productId === productId && i.weightIndex === weightIndex
        );
        if (existing) {
          return prev.map((i) =>
            i === existing
              ? { ...i, qty: Math.min(i.qty + qty, Math.min(product.stock, 10)) }
              : i
          );
        }
        return [...prev, { productId, weightIndex, qty }];
      });
      pushToast(`${product.name} added to cart`, "cart");
      if (openDrawer) setCartOpen(true);
    },
    [pushToast]
  );

  const removeFromCart = useCallback((productId: string, weightIndex: number) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.weightIndex === weightIndex))
    );
  }, []);

  const updateQty = useCallback(
    (productId: string, weightIndex: number, delta: number) => {
      const product = productById(productId);
      if (!product) return;
      setCart((prev) =>
        prev
          .map((i) => {
            if (i.productId === productId && i.weightIndex === weightIndex) {
              const next = Math.max(1, Math.min(i.qty + delta, Math.min(product.stock, 10)));
              return { ...i, qty: next };
            }
            return i;
          })
          .filter((i) => i.qty > 0)
      );
    },
    []
  );

  const changeWeight = useCallback(
    (productId: string, fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      setCart((prev) => {
        const without = prev.filter(
          (i) => !(i.productId === productId && i.weightIndex === fromIndex)
        );
        const merge = without.find(
          (i) => i.productId === productId && i.weightIndex === toIndex
        );
        const moving = prev.find(
          (i) => i.productId === productId && i.weightIndex === fromIndex
        );
        if (!moving) return prev;
        if (merge) {
          return without.map((i) =>
            i === merge ? { ...i, qty: Math.min(10, i.qty + moving.qty) } : i
          );
        }
        return [...without, { ...moving, weightIndex: toIndex }];
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback(
    (code: string): { ok: boolean; message: string } => {
      const c = COUPONS[code.trim().toUpperCase()];
      if (!c) return { ok: false, message: "This code doesn't look right." };
      const sub = cart.reduce((sum, i) => {
        const p = productById(i.productId);
        return sum + (p ? p.weights[i.weightIndex].price * i.qty : 0);
      }, 0);
      if (c.minSubtotal && sub < c.minSubtotal) {
        return {
          ok: false,
          message: `Add items worth ₹${(c.minSubtotal - sub).toLocaleString("en-IN")} more to use ${c.code}.`,
        };
      }
      setCoupon(c);
      pushToast(`Coupon ${c.code} applied`, "check");
      return { ok: true, message: `${c.code} applied — ${c.label}` };
    },
    [cart, pushToast]
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = productById(productId);
      setWishlist((prev) => {
        const has = prev.includes(productId);
        if (product) {
          pushToast(
            has ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`,
            "heart"
          );
        }
        return has ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    },
    [pushToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  /* derived cart math */
  const cartLines = useMemo<CartLine[]>(
    () =>
      cart
        .map((i) => {
          const product = productById(i.productId);
          if (!product) return null;
          const weight = product.weights[i.weightIndex] ?? product.weights[0];
          return {
            product,
            weight,
            weightIndex: i.weightIndex,
            qty: i.qty,
            lineTotal: weight.price * i.qty,
            lineMrp: weight.originalPrice * i.qty,
          };
        })
        .filter((x): x is CartLine => x !== null),
    [cart]
  );

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const subtotal = useMemo(() => cartLines.reduce((s, l) => s + l.lineTotal, 0), [cartLines]);
  const mrpTotal = useMemo(() => cartLines.reduce((s, l) => s + l.lineMrp, 0), [cartLines]);
  const mrpSavings = mrpTotal - subtotal;

  const couponDiscount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;
    if (coupon.type === "percent") {
      const d = (subtotal * coupon.value) / 100;
      return Math.round(coupon.cap ? Math.min(d, coupon.cap) : d);
    }
    return coupon.value;
  }, [coupon, subtotal]);

  const payable = Math.max(0, subtotal - couponDiscount);

  const value: StoreCtx = {
    cart,
    cartLines,
    cartCount,
    subtotal,
    mrpTotal,
    mrpSavings,
    coupon,
    couponDiscount,
    payable,
    addToCart,
    removeFromCart,
    updateQty,
    changeWeight,
    clearCart,
    applyCoupon,
    removeCoupon,
    wishlist,
    toggleWishlist,
    isWishlisted,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    toasts,
    pushToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/* free-shipping threshold used across cart & checkout */
export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING = 79;
export const EXPRESS_SHIPPING = 149;
