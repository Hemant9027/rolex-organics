import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { ArrowDown, ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCTS, TESTIMONIALS } from "../../data/products";
import { BUT, MagneticButton } from "../primitives";

const ghee = PRODUCTS[0];
const honey = PRODUCTS[9];
const chia = PRODUCTS[4];
const moringa = PRODUCTS[7];
const pumpkin = PRODUCTS[6];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });

  // layered parallax depths
  const l1x = useTransform(sx, (v) => v * -26);
  const l1y = useTransform(sy, (v) => v * -18);
  const l2x = useTransform(sx, (v) => v * 18);
  const l2y = useTransform(sy, (v) => v * 14);
  const l3x = useTransform(sx, (v) => v * -42);
  const l3y = useTransform(sy, (v) => v * -30);
  const glowX = useTransform(sx, (v) => 50 + v * 26);
  const glowY = useTransform(sy, (v) => 42 + v * 26);
  const glowBg = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(640px circle at ${x}% ${y}%, rgba(207,166,77,0.16), transparent 70%)`
  );

  function onMove(e: MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  const headline = ["Pure from", "the soil."];
  const headline2 = ["Powerful", "for life."];

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ivory-100"
      aria-label="ROLEX Organics hero"
    >
      {/* ------- ambient background layers ------- */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 620px at 82% 18%, rgba(141,162,97,0.20), transparent 62%), radial-gradient(760px 560px at 8% 88%, rgba(192,95,49,0.12), transparent 60%), linear-gradient(180deg, #f7f1e3 0%, #fbf8f0 60%, #f7f1e3 100%)",
        }}
      />
      <motion.div aria-hidden className="absolute inset-0" style={{ background: glowBg }} />
      <div aria-hidden className="blob absolute -left-40 top-24 h-[30rem] w-[30rem] bg-olive-300/25 blur-3xl" />
      <div aria-hidden className="blob absolute -right-44 bottom-10 h-[32rem] w-[32rem] bg-sand-300/40 blur-3xl" />

      {/* floating particles */}
      {!reduce && (
        <div aria-hidden className="absolute inset-0">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.s,
                height: p.s,
                background: p.c,
                opacity: 0.55,
              }}
              animate={{ y: [0, -22, 0], x: [0, p.drift, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: p.t, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}
        </div>
      )}

      {/* ------- content ------- */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6 lg:pb-16 lg:pt-28 lg:px-8">
        {/* left : copy */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/45 bg-gold-300/15 px-4 py-2 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-500">
              FSSAI certified · Direct from 120+ farms
            </span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,6.4vw,4.6rem)] font-medium leading-[1.04] text-forest-950">
            {headline.map((word, i) => (
              <span key={word} className="mr-[0.24em] inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.35 + i * 0.09 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <br />
            {headline2.map((word, i) => (
              <span
                key={word}
                className="mr-[0.24em] inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  className={i === 0 ? "inline-block italic text-terra-500" : "inline-block"}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.58 + i * 0.09 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
            className="mt-6 max-w-md text-[15.5px] leading-relaxed text-ink-500"
          >
            Bilona-churned ghee, stone-ground millets, raw forest honey and Ayurvedic
            superfoods — sourced straight from Indian farmers, processed the slow,
            traditional way, and delivered fresh to your kitchen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link to="/shop">
              <MagneticButton className={BUT.terra} ariaLabel="Explore products">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Products
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
            </Link>
            <Link to="/about">
              <MagneticButton className={BUT.secondary} ariaLabel="Read our story">
                Our Story
              </MagneticButton>
            </Link>
          </motion.div>

          {/* trust row */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.15 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <div className="flex -space-x-2.5">
              {TESTIMONIALS.slice(0, 4).map((t) => (
                <img
                  key={t.name}
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-full border-2 border-ivory-100 object-cover"
                />
              ))}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ivory-100 bg-forest-900 text-[10px] font-bold text-gold-300">
                10k+
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-gold-500" fill="currentColor" strokeWidth={0} />
                ))}
                <span className="ml-1 text-xs font-bold text-forest-900">4.8/5</span>
              </div>
              <p className="mt-0.5 text-xs text-ink-500">
                Loved by 10,000+ healthy Indian homes
              </p>
            </div>
          </motion.div>
        </div>

        {/* right : layered product composition */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
          {/* rotating dashed ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
            className="absolute inset-[4%] rounded-full border border-dashed border-olive-500/35 animate-spin-slower"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
            className="absolute -inset-[3%] rounded-full bg-gradient-to-br from-olive-300/30 via-transparent to-gold-300/25 blur-sm"
          />

          {/* hero product */}
          <motion.div style={{ x: l1x, y: l1y }} className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
              className="absolute inset-[11%]"
            >
              <div className={reduce ? "" : "animate-float-y"} style={{ height: "100%" }}>
                <div className="relative h-full overflow-hidden rounded-t-full rounded-b-[42px] shadow-soft ring-1 ring-forest-900/10">
                  <img
                    src={ghee.image}
                    alt={ghee.name}
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/35 via-transparent to-ivory-50/10" />
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-ivory-50/85 px-4 py-2 text-center backdrop-blur">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-900">
                      Bilona Cow Ghee
                    </p>
                    <p className="text-[10px] font-semibold text-terra-600">Bestseller No. 1</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* floating product chips */}
          <FloatingChip
            img={honey.image}
            label="Raw Honey"
            price="₹349"
            className="left-[-4%] top-[10%] sm:left-[-8%]"
            x={l2x}
            y={l2y}
            delay={0.85}
            reduce={!!reduce}
          />
          <FloatingChip
            img={chia.image}
            label="Chia Seeds"
            price="₹299"
            className="right-[-4%] top-[32%] sm:right-[-7%]"
            x={l3x}
            y={l3y}
            delay={1}
            reduce={!!reduce}
          />
          <FloatingChip
            img={moringa.image}
            label="Moringa"
            price="₹229"
            className="bottom-[16%] left-[-6%] sm:left-[-11%]"
            x={l2x}
            y={l2y}
            delay={1.15}
            reduce={!!reduce}
            reverse
          />

          {/* floating stat glass card */}
          <motion.div style={{ x: l3x, y: l3y }} className="absolute bottom-[3%] right-[2%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.3 }}
              className={reduce ? "rounded-2xl" : "animate-float-y2 rounded-2xl"}
            >
              <div className="rounded-2xl border border-ivory-50/50 bg-ivory-50/70 px-5 py-3.5 shadow-soft backdrop-blur-xl">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-olive-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive-500 animate-pulse-dot" />
                  Fresh batch
                </p>
                <p className="mt-1 font-display text-xl font-semibold leading-none text-forest-900">
                  <img
                    src={pumpkin.image}
                    alt=""
                    className="mr-2 inline-block h-7 w-7 rounded-full object-cover align-middle ring-2 ring-ivory-50"
                  />
                  Packed 4h ago
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* leaves */}
          {!reduce && <HeroLeaves />}
        </div>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#intro"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-forest-900/60 transition-colors hover:text-forest-900 md:flex"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function FloatingChip({
  img,
  label,
  price,
  className,
  x,
  y,
  delay,
  reduce,
  reverse,
}: {
  img: string;
  label: string;
  price: string;
  className: string;
  x: ReturnType<typeof useTransform<number, number>>;
  y: ReturnType<typeof useTransform<number, number>>;
  delay: number;
  reduce: boolean;
  reverse?: boolean;
}) {
  return (
    <motion.div style={{ x, y }} className={`absolute z-20 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: reverse ? 10 : -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      >
        <div className={reduce ? "" : reverse ? "animate-float-y2" : "animate-float-y"}>
          <div
            className={`flex items-center gap-2.5 rounded-2xl border border-ivory-50/60 bg-ivory-50/80 p-2 pr-3.5 shadow-soft backdrop-blur-xl ${
              reverse ? "flex-row-reverse pl-3.5 pr-2" : ""
            }`}
          >
            <img
              src={img}
              alt={label}
              loading="lazy"
              className="h-11 w-11 rounded-xl object-cover"
            />
            <div>
              <p className="text-[11px] font-bold leading-tight text-forest-900">{label}</p>
              <p className="text-[10px] font-semibold text-terra-600">{price}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroLeaves() {
  return (
    <>
      {[
        { left: "6%", top: "44%", size: 26, rot: -30, t: 8, c: "#71874a" },
        { left: "88%", top: "12%", size: 30, rot: 40, t: 9.5, c: "#8da261" },
        { left: "76%", top: "74%", size: 22, rot: 110, t: 7.5, c: "#c05f31" },
        { left: "16%", top: "86%", size: 20, rot: 20, t: 8.8, c: "#cfa64d" },
      ].map((l, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          aria-hidden
          className="absolute"
          style={{ left: l.left, top: l.top, width: l.size, height: l.size, color: l.c }}
          initial={{ opacity: 0, rotate: l.rot }}
          animate={{
            opacity: [0, 0.9, 0.9],
            rotate: [l.rot, l.rot + 24, l.rot],
            y: [0, -14, 0],
          }}
          transition={{ duration: l.t, repeat: Infinity, ease: "easeInOut" }}
          fill="currentColor"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </motion.svg>
      ))}
    </>
  );
}

const PARTICLES = [
  { x: 12, y: 22, s: 5, t: 9, delay: 0.2, drift: 10, c: "#8da261" },
  { x: 22, y: 68, s: 4, t: 11, delay: 1.1, drift: -12, c: "#cfa64d" },
  { x: 38, y: 14, s: 3, t: 8, delay: 0.6, drift: 8, c: "#c05f31" },
  { x: 52, y: 82, s: 4, t: 10, delay: 0.9, drift: 14, c: "#71874a" },
  { x: 66, y: 20, s: 3, t: 9.5, delay: 1.6, drift: -10, c: "#8da261" },
  { x: 82, y: 60, s: 5, t: 12, delay: 0.4, drift: 12, c: "#cfa64d" },
  { x: 92, y: 34, s: 3, t: 8.5, delay: 2, drift: -8, c: "#c05f31" },
  { x: 8, y: 84, s: 4, t: 10.5, delay: 1.4, drift: 10, c: "#71874a" },
];
