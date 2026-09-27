import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FlaskConical,
  Leaf,
  Recycle,
  ShieldCheck,
  Sprout,
  Truck,
  Wheat,
} from "lucide-react";
import {
  CATEGORIES,
  productsInCategory,
  STOCK,
} from "../../data/products";
import { useStore } from "../../store/StoreContext";
import { Counter, Reveal, SectionHeading, TiltCard, BUT, MagneticButton } from "../primitives";

/* ------------------------------------------------------------------ */
/*  Marquee ribbon                                                     */
/* ------------------------------------------------------------------ */
const MARQUEE_ITEMS = [
  "FSSAI Certified",
  "100% Natural Ingredients",
  "Lab-Tested Every Batch",
  "No Artificial Additives",
  "Direct from Farmers",
  "Sustainable Packaging",
  "Bilona-Churned Ghee",
  "Stone-Ground Flours",
];

export function Marquee() {
  const content = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative z-10 overflow-hidden border-y border-forest-800 bg-forest-900 py-3.5">
      <div className="flex w-max animate-marquee items-center gap-8">
        {content.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.26em] text-ivory-100/80"
          >
            {item}
            <Leaf className="h-3.5 w-3.5 text-gold-400" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Brand introduction                                                 */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: 100, suffix: "%", label: "Natural ingredients" },
  { value: 10000, suffix: "+", label: "Happy customers" },
  { value: 120, suffix: "+", label: "Partner farms" },
  { value: 0, suffix: "", label: "Artificial additives" },
];

export function BrandIntro() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-20, 50]);
  const reduce = useReducedMotion();

  return (
    <section id="intro" className="grain relative overflow-hidden bg-ivory-50 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* images */}
        <div ref={imgRef} className="relative">
          <motion.div
            style={reduce ? undefined : { y: y1 }}
            className="relative z-10 aspect-[4/5] overflow-hidden rounded-[36px] shadow-soft"
          >
            <img
              src={STOCK.farmerField}
              alt="Indian farmer tending a green wheat field"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 to-transparent" />
          </motion.div>
          <motion.div
            style={reduce ? undefined : { y: y2 }}
            className="absolute -bottom-10 -right-4 z-20 w-44 overflow-hidden rounded-[26px] border-4 border-ivory-50 shadow-soft sm:-right-8 sm:w-56"
          >
            <img
              src={STOCK.spiceBowls}
              alt="Assorted Indian grains in ceramic bowls"
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </motion.div>
          <Reveal delay={0.3} className="absolute -left-3 top-8 z-20 sm:-left-8">
            <div className="rounded-2xl border border-ivory-50/60 bg-ivory-50/80 px-5 py-4 shadow-soft backdrop-blur-xl">
              <p className="font-display text-2xl font-semibold text-terra-500">Since 2019</p>
              <p className="text-[11px] font-semibold text-ink-500">Rooted in Indian soil</p>
            </div>
          </Reveal>
        </div>

        {/* copy */}
        <div>
          <SectionHeading
            eyebrow="Our roots"
            title={
              <>
                Rooted in Indian tradition.
                <br />
                <span className="italic text-terra-500">Crafted for modern wellness.</span>
              </>
            }
            description="ROLEX Organics began with a simple frustration — everything on supermarket shelves felt processed, blended and distant from the farms it came from. So we went back to the source. We partner directly with 120+ farmer families across India, process ingredients the way our grandparents did, and test every single batch before it reaches your kitchen."
          />

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:gap-x-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.08}>
                <p className="font-display text-3xl font-semibold text-forest-900 sm:text-[2rem]">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[11.5px] font-semibold leading-snug text-ink-500">
                  {s.value === 0 ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-olive-400 text-ivory-50">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </span>
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-terra-500" />
                  )}
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4} className="mt-10">
            <Link to="/about">
              <MagneticButton className={BUT.primary}>
                Discover our journey
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */
export function Categories() {
  return (
    <section className="bg-ivory-100 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Shop by ritual"
            title="Every shelf of the Indian pantry, honoured."
            description="Six carefully built ranges — each one sourced from the region where it grows best."
          />
          <Reveal delay={0.15}>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded-full border border-forest-900/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-900 transition hover:bg-forest-900 hover:text-ivory-50"
            >
              View all
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.1} className="h-full">
              <TiltCard intensity={6} className="h-full rounded-[28px]">
                <Link
                  to={`/shop?category=${c.id}`}
                  className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] bg-forest-900 shadow-card transition-shadow duration-500 hover:shadow-soft sm:min-h-[340px]"
                  aria-label={`Explore ${c.name}`}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/25 to-transparent transition-opacity duration-500" />
                  <div className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t ${c.accent} to-transparent opacity-40`} />

                  <span className="absolute right-4 top-4 rounded-full border border-ivory-50/30 bg-ivory-50/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ivory-50 backdrop-blur">
                    {productsInCategory(c.id).length} products
                  </span>

                  <div className="relative z-10 p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold-300">
                      {c.tagline}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl font-semibold text-ivory-50">
                      {c.name}
                    </h3>
                    <p className="mt-2 max-h-0 overflow-hidden text-[12.5px] leading-relaxed text-ivory-100/75 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                      {c.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ivory-50">
                      Explore
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terra-500 transition-all duration-400 group-hover:w-14">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why choose ROLEX                                                   */
/* ------------------------------------------------------------------ */
const FEATURES = [
  {
    icon: Sprout,
    title: "Farm-sourced ingredients",
    text: "Single-origin lots bought directly from 120+ farmer families — no middlemen, full traceability.",
    color: "bg-olive-500/15 text-olive-600",
  },
  {
    icon: FlaskConical,
    title: "Lab-tested quality",
    text: "Every batch is NMR & heavy-metal tested. Reports are shared on the label, not hidden in fine print.",
    color: "bg-gold-400/20 text-gold-500",
  },
  {
    icon: Wheat,
    title: "Traditional processing",
    text: "Stone mills, wooden churns, shade drying — the slow methods that keep nutrition and aroma alive.",
    color: "bg-terra-500/15 text-terra-500",
  },
  {
    icon: ShieldCheck,
    title: "No harmful chemicals",
    text: "No preservatives, colours, refined oils or bleaching agents. If it isn't in the kitchen, it isn't in the jar.",
    color: "bg-forest-600/12 text-forest-700",
  },
  {
    icon: Recycle,
    title: "Sustainable packaging",
    text: "Glass jars, compostable refill pouches and paper tapes. Plastic-free since our very first dispatch.",
    color: "bg-olive-400/20 text-olive-700",
  },
  {
    icon: Truck,
    title: "Delivered fresh",
    text: "Small weekly batches mean what reaches your door was often milled or churned days — not months — ago.",
    color: "bg-sand-300/50 text-sand-400",
  },
];

export function WhyChoose() {
  return (
    <section className="grain relative overflow-hidden bg-ivory-50 py-24 lg:py-28">
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-olive-300/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="The ROLEX promise"
          title="Why homes across India choose ROLEX"
          description="Premium isn't a price tag. It's the thousand small decisions we refuse to compromise on, every single batch."
          className="mb-14"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.09}>
              <TiltCard intensity={4} className="h-full rounded-[26px]">
                <div className="group h-full rounded-[26px] border border-forest-900/[0.06] bg-ivory-50/80 p-7 shadow-card backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft">
                  <div
                    className={`mb-5 inline-flex h-13 w-13 items-center justify-center rounded-2xl ${f.color} p-3 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                  >
                    <f.icon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-forest-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{f.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Newsletter                                                         */
/* ------------------------------------------------------------------ */
export function Newsletter() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pushToast("Please enter a valid email address", "info");
      return;
    }
    setDone(true);
    pushToast("Subscribed — welcome to the family", "check");
  }

  return (
    <section className="relative overflow-hidden bg-ivory-100 py-24 lg:py-28">
      {/* floating ingredients */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img
          src={CATEGORIES[2].image}
          alt=""
          loading="lazy"
          className="animate-float-y absolute -left-10 top-16 h-28 w-28 rounded-full object-cover opacity-60 blur-[1px] sm:h-36 sm:w-36"
        />
        <img
          src={CATEGORIES[5].image}
          alt=""
          loading="lazy"
          className="animate-float-y2 absolute -right-8 bottom-14 h-32 w-32 rounded-full object-cover opacity-60 blur-[1px] sm:h-40 sm:w-40"
        />
        <div className="blob absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 bg-sand-300/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-terra-500">
            The harvest letter
          </p>
          <h2 className="font-display text-3xl font-medium leading-[1.15] text-forest-950 text-balance sm:text-5xl">
            Better choices begin with{" "}
            <span className="italic text-terra-500">better ingredients.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-ink-500">
            Join 25,000+ readers getting seasonal harvest drops, farm stories and
            members-only offers. One thoughtful email, twice a month.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-3xl border border-olive-400/30 bg-olive-500/10 px-6 py-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-olive-500 text-ivory-50">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="text-left">
                <p className="font-display text-lg font-semibold text-forest-900">
                  You're on the list.
                </p>
                <p className="text-[12.5px] text-ink-500">
                  Watch for our next harvest drop in your inbox.
                </p>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={subscribe}
              className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:rounded-full sm:border sm:border-forest-900/10 sm:bg-ivory-50 sm:p-2 sm:shadow-card"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full rounded-full border border-forest-900/10 bg-ivory-50 px-6 py-4 text-sm text-forest-900 shadow-card outline-none transition placeholder:text-ink-400 focus:ring-2 focus:ring-terra-400/50 sm:border-0 sm:bg-transparent sm:shadow-none"
              />
              <MagneticButton type="submit" className={`${BUT.terra} shrink-0 px-8 py-3.5`}>
                Subscribe
              </MagneticButton>
            </form>
          )}
          <p className="mt-4 text-[11px] text-ink-400">
            By subscribing you agree to our privacy policy. Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
