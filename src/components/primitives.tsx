import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { Heart, ShoppingBag, Check, Info, Star, StarHalf, Minus, Plus, Leaf } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { inr } from "../data/products";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
/*  Scroll reveal wrapper                                              */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em]",
          align === "center" && "justify-center",
          tone === "dark" ? "text-terra-500" : "text-gold-300"
        )}
      >
        <Leaf className="h-3.5 w-3.5" strokeWidth={2.2} />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "font-display text-3xl leading-[1.12] font-medium text-balance sm:text-4xl lg:text-[2.75rem]",
          tone === "dark" ? "text-forest-900" : "text-ivory-50"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-[15px] leading-relaxed",
            tone === "dark" ? "text-ink-500" : "text-ivory-100/70"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Magnetic button                                                    */
/* ------------------------------------------------------------------ */
export function MagneticButton({
  children,
  className,
  onClick,
  type = "button",
  strength = 0.35,
  ariaLabel,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  strength?: number;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.4 });

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-semibold tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant button styles                                              */
/* ------------------------------------------------------------------ */
export const BUT = {
  primary:
    "bg-forest-900 text-ivory-50 px-7 py-3.5 hover:bg-forest-700 shadow-soft",
  secondary:
    "bg-transparent text-forest-900 px-7 py-3.5 ring-1.5 ring-forest-900/25 hover:ring-forest-900 hover:bg-forest-900 hover:text-ivory-50",
  terra:
    "bg-terra-500 text-ivory-50 px-7 py-3.5 hover:bg-terra-600 shadow-glow-terra",
  light:
    "bg-ivory-50 text-forest-900 px-7 py-3.5 hover:bg-ivory-200 shadow-soft",
  ghost:
    "bg-transparent text-ivory-50 px-7 py-3.5 ring-1.5 ring-ivory-50/30 hover:bg-ivory-50 hover:text-forest-900",
};

/* ------------------------------------------------------------------ */
/*  Rating stars                                                       */
/* ------------------------------------------------------------------ */
export function RatingStars({
  value,
  size = 14,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.4;
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 text-gold-500", className)}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full)
          return <Star key={i} fill="currentColor" strokeWidth={0} style={{ width: size, height: size }} />;
        if (i === full && half)
          return (
            <span key={i} className="relative" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-sand-300" fill="currentColor" strokeWidth={0} style={{ width: size, height: size }} />
              <StarHalf className="absolute inset-0" fill="currentColor" strokeWidth={0} style={{ width: size, height: size }} />
            </span>
          );
        return <Star key={i} className="text-sand-300" fill="currentColor" strokeWidth={0} style={{ width: size, height: size }} />;
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Quantity selector                                                  */
/* ------------------------------------------------------------------ */
export function QuantitySelector({
  qty,
  onChange,
  size = "md",
}: {
  qty: number;
  onChange: (delta: number) => void;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-sand-300 bg-ivory-50",
        size === "sm" ? "h-8" : "h-11"
      )}
    >
      <button
        onClick={() => onChange(-1)}
        aria-label="Decrease quantity"
        className={cn(
          "flex h-full cursor-pointer items-center justify-center rounded-l-full text-ink-700 transition-colors hover:bg-sand-200 hover:text-forest-900 disabled:opacity-40",
          size === "sm" ? "w-8" : "w-11"
        )}
        disabled={qty <= 1}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={cn(
          "min-w-8 text-center font-semibold text-forest-900 tabular-nums",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {qty}
      </span>
      <button
        onClick={() => onChange(1)}
        aria-label="Increase quantity"
        className={cn(
          "flex h-full cursor-pointer items-center justify-center rounded-r-full text-ink-700 transition-colors hover:bg-sand-200 hover:text-forest-900",
          size === "sm" ? "w-8" : "w-11"
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wishlist heart button                                              */
/* ------------------------------------------------------------------ */
export function WishlistButton({
  productId,
  className,
  iconSize = 16,
}: {
  productId: string;
  className?: string;
  iconSize?: number;
}) {
  const { toggleWishlist, isWishlisted } = useStore();
  const active = isWishlisted(productId);
  return (
    <motion.button
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      whileTap={{ scale: 0.78 }}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-colors duration-300",
        active
          ? "bg-terra-500 text-ivory-50 shadow-glow-terra"
          : "bg-ivory-50/85 text-forest-900 ring-1 ring-forest-900/10 hover:bg-forest-900 hover:text-ivory-50",
        className
      )}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Heart
          style={{ width: iconSize, height: iconSize }}
          fill={active ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </motion.span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Price block                                                        */
/* ------------------------------------------------------------------ */
export function Price({
  price,
  original,
  size = "md",
  className,
}: {
  price: number;
  original?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl sm:text-3xl",
  };
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-display font-semibold text-forest-900", sizes[size])}>
        {inr(price)}
      </span>
      {!!original && original > price && (
        <span
          className={cn(
            "text-ink-400 line-through",
            size === "lg" ? "text-base" : "text-xs"
          )}
        >
          {inr(original)}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */
export function Counter({
  to,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          if (reduce) {
            setDisplay(to);
            return;
          }
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(to * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString("en-IN", {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  3D tilt card                                                       */
/* ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useTransform(
    [glowX, glowY],
    ([a, b]) =>
      `radial-gradient(420px circle at ${a}% ${b}%, rgba(255,255,255,0.14), transparent 65%)`
  );

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set((0.5 - py) * intensity * 2);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: "preserve-3d",
        perspective: 900,
      }}
      className={cn("group/tilt relative", className)}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        style={{ background: glow }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast notifications                                                */
/* ------------------------------------------------------------------ */
const TOAST_ICON: Record<string, ReactNode> = {
  cart: <ShoppingBag className="h-4 w-4" />,
  heart: <Heart className="h-4 w-4" fill="currentColor" />,
  check: <Check className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[120] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col items-stretch gap-2 sm:left-auto sm:right-6 sm:translate-x-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-forest-950/95 px-4 py-3.5 text-ivory-50 shadow-soft ring-1 ring-ivory-50/10 backdrop-blur-md"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-300">
              {TOAST_ICON[t.kind]}
            </span>
            <p className="text-[13px] font-medium leading-snug">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Leaf divider                                                       */
/* ------------------------------------------------------------------ */
export function LeafMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)} aria-hidden>
      <span className="h-px w-10 bg-current opacity-40" />
      <Leaf className="h-4 w-4" strokeWidth={1.8} />
      <span className="h-px w-10 bg-current opacity-40" />
    </span>
  );
}
