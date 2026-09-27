import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  HandHeart,
  Hourglass,
  Recycle,
} from "lucide-react";
import { STOCK } from "../data/products";
import {
  BUT,
  Counter,
  LeafMark,
  MagneticButton,
  Reveal,
  SectionHeading,
  TiltCard,
} from "../components/primitives";

const VALUES = [
  {
    icon: HandHeart,
    title: "Farmer-first, always",
    text: "We pay above-market prices, sign yearly procurement commitments, and reinvest 2% of revenue in farm-school programs across our partner villages.",
  },
  {
    icon: Hourglass,
    title: "Slow is the point",
    text: "Stone mills turn slower than steel ones. Bilona churning takes a day more than cream separation. We choose the method that keeps food alive, not the one that scales fastest.",
  },
  {
    icon: Eye,
    title: "Radical transparency",
    text: "Every jar carries its batch number, lab report QR and the district it came from. If we can't trace it to a field, it doesn't carry our name.",
  },
  {
    icon: Recycle,
    title: "Planet-kind by default",
    text: "Glass jars, compostable refills, paper tape, and a jar-return program in 12 cities. Sustainability isn't our campaign — it's our packaging.",
  },
];

const MILESTONES = [
  { year: "2019", text: "Founded in a two-room Pune studio with 40 jars of ghee." },
  { year: "2020", text: "First millet partnerships in Solapur and Tumakuru." },
  { year: "2022", text: "In-house lab begins NMR and heavy-metal testing for every batch." },
  { year: "2024", text: "10,000th home served; jar-return program crosses 30,000 returns." },
  { year: "2026", text: "120+ farmer families, 400+ cities, still small-batch." },
];

export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const reduce = useReducedMotion();

  return (
    <>
      {/* hero */}
      <div ref={heroRef} className="grain relative flex min-h-[78svh] items-end overflow-hidden bg-forest-950 pb-16 pt-32 text-ivory-50">
        <motion.div aria-hidden style={reduce ? undefined : { y: bgY }} className="absolute -inset-y-10 inset-x-0">
          <img src={STOCK.farmerField} alt="" className="h-full w-full object-cover opacity-40" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/35 to-forest-950" />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal y={24}>
            <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300">
              <LeafMark className="text-gold-300" />
            </p>
            <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.08] text-balance sm:text-6xl">
              A brand that was <span className="italic text-gold-300">grown,</span> not built.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory-100/70">
              ROLEX Organics started in 2019 with one question: why is it so hard to buy
              food in India that still tastes like India? This is the story of how a jar
              of ghee became a movement of 120 farmer families and 10,000 homes.
            </p>
          </Reveal>
        </div>
      </div>

      {/* mission */}
      <section className="bg-ivory-50 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <LeafMark className="justify-center text-terra-500" />
            <p className="mt-8 font-display text-2xl font-medium leading-relaxed text-forest-900 text-balance sm:text-[2rem]">
              “We believe the future of Indian wellness is hiding in its past — in
              bilona churns, stone mills and forest apiaries. Our work is simply to
              carry that past to your table, <span className="italic text-terra-500">without letting a single
              shortcut touch it.</span>”
            </p>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-ink-400">
              Aarav &amp; Meher — Founders, ROLEX Organics
            </p>
          </Reveal>
        </div>
      </section>

      {/* values */}
      <section className="bg-ivory-100 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What we refuse to compromise"
            title="Four promises, carved in stone."
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.1}>
                <TiltCard intensity={4} className="h-full rounded-[26px]">
                  <div className="group flex h-full gap-5 rounded-[26px] border border-forest-900/[0.06] bg-ivory-50 p-7 shadow-card transition-shadow duration-500 hover:shadow-soft">
                    <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-forest-900 text-gold-300 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                      <v.icon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-forest-900">{v.title}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{v.text}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* stats band */}
      <section className="grain relative overflow-hidden bg-forest-950 py-20 text-ivory-50">
        <div aria-hidden className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-olive-500/15 blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { v: 120, s: "+", l: "Farmer families" },
            { v: 400, s: "+", l: "Cities served" },
            { v: 50000, s: "+", l: "Jars delivered" },
            { v: 98, s: "%", l: "Repeat rate" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl font-semibold text-gold-300 sm:text-5xl">
                <Counter to={s.v} suffix={s.s} />
              </p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-ivory-100/50">
                {s.l}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* timeline + image */}
      <section className="bg-ivory-50 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading eyebrow="The journey" title="Milestones along the way." className="mb-10" />
            <div className="space-y-0">
              {MILESTONES.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.08}>
                  <div className="relative flex gap-6 pb-8 last:pb-0">
                    {i < MILESTONES.length - 1 && (
                      <span aria-hidden className="absolute left-[26px] top-13 h-[calc(100%-52px)] w-px bg-sand-300" />
                    )}
                    <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-terra-500/40 bg-ivory-100 font-display text-[13px] font-semibold text-terra-600">
                      {m.year}
                    </div>
                    <p className="pt-3 text-[14px] leading-relaxed text-ink-700">{m.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.15}>
            <div className="relative">
              <div className="overflow-hidden rounded-[34px] shadow-soft">
                <img src={STOCK.marketStall} alt="Spice and grain market in Delhi" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-4 rounded-2xl border border-ivory-50/60 bg-ivory-50/90 px-5 py-4 shadow-soft backdrop-blur-xl sm:-left-8">
                <p className="font-display text-lg font-semibold text-forest-900">Single origin, always</p>
                <p className="text-[11.5px] text-ink-500">Traceable from field to fulfilment.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ivory-100 pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grain relative overflow-hidden rounded-[36px] bg-gradient-to-br from-forest-900 to-forest-950 px-8 py-16 text-center text-ivory-50 sm:px-16">
              <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/15 blur-[80px]" />
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium text-balance sm:text-4xl">
                Taste the difference a farmer's name makes.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-ivory-100/65">
                Start with our bestseller — the bilona ghee that began it all.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/shop">
                  <MagneticButton className={BUT.terra}>
                    Shop the pantry <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </Link>
                <Link to="/contact">
                  <MagneticButton className={BUT.ghost}>Talk to us</MagneticButton>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
