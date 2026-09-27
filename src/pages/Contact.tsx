import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { BUT, MagneticButton, Reveal, SectionHeading } from "../components/primitives";
import { cn } from "../utils/cn";

const FAQS = [
  {
    q: "How is your ghee different from regular ghee?",
    a: "Our ghee is made only with the bilona method — whole curd is churned with a wooden ravi and slow-cooked. Most commercial ghee is separated from cream with machines in minutes. Bilona ghee keeps more nutrition, a grainy texture and a distinctly nutty aroma.",
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Yes — COD is available across all serviceable pin codes in India at no extra charge. You can also pay by UPI at the time of delivery.",
  },
  {
    q: "How should I store the stone-ground flours?",
    a: "Our flours are milled fresh without preservatives, so keep them in an airtight container away from moisture. In humid months, refrigeration extends freshness. Best used within the shelf life printed on the pack.",
  },
  {
    q: "What if my order arrives damaged?",
    a: "Write to us within 7 days with a photo and we'll send a free replacement or full refund — no questions, no courier pickup hassles for small items.",
  },
  {
    q: "Can I return the glass jars?",
    a: "Yes! Our jar-return program runs in 12 cities. Return 5 clean jars to our delivery partner to earn a ₹60 coupon. Returned jars are sterilised and reused.",
  },
];

const INFO = [
  {
    icon: Phone,
    title: "Call us",
    lines: ["+91 98765 43210", "Mon–Sat, 9 AM – 7 PM IST"],
  },
  {
    icon: Mail,
    title: "Write to us",
    lines: ["care@rolexorganics.in", "We reply within 4 working hours"],
  },
  {
    icon: MapPin,
    title: "Visit the studio",
    lines: ["14 Orchard Lane, Koregaon Park", "Pune, Maharashtra 411001"],
  },
  {
    icon: Clock3,
    title: "Fulfilment",
    lines: ["Orders ship same day before 4 PM", "Sunday dispatches paused"],
  },
];

export default function Contact() {
  const { pushToast } = useStore();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (form.name.trim().length < 3) err.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email.";
    if (form.message.trim().length < 10) err.message = "A little more detail helps us help you.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSent(true);
    pushToast("Message sent — we'll be in touch soon", "check");
  };

  return (
    <div className="pb-24">
      {/* header */}
      <div className="grain relative overflow-hidden bg-forest-950 pb-14 pt-32 text-ivory-50">
        <div aria-hidden className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-olive-500/20 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory-100/50">
            <Link to="/" className="transition hover:text-gold-300">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gold-300">Contact</span>
          </nav>
          <Reveal y={20}>
            <h1 className="max-w-2xl font-display text-4xl font-medium leading-tight text-balance sm:text-5xl">
              Talk to a human who has tasted the ghee.
            </h1>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-ivory-100/65">
              Questions about a batch, a bulk order, an allergy, or a recipe? Our small
              Pune team answers everything personally.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          {/* info side */}
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {INFO.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.07}>
                  <div className="h-full rounded-[24px] border border-forest-900/[0.06] bg-ivory-50 p-6 shadow-card transition-shadow hover:shadow-soft">
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900 text-gold-300">
                      <c.icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <h3 className="text-sm font-bold text-forest-900">{c.title}</h3>
                    {c.lines.map((l, k) => (
                      <p key={k} className={cn("mt-1 text-[13px]", k === 0 ? "font-semibold text-ink-700" : "text-ink-400")}>
                        {l}
                      </p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* map-ish card */}
            <Reveal delay={0.25}>
              <div className="relative mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-olive-700 to-forest-900 p-7 text-ivory-50 shadow-card">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 30%, transparent 24px, rgba(251,248,240,0.35) 25px, transparent 26px), radial-gradient(circle at 70% 60%, transparent 24px, rgba(251,248,240,0.28) 25px, transparent 26px), radial-gradient(circle at 45% 80%, transparent 24px, rgba(251,248,240,0.2) 25px, transparent 26px)",
                  }}
                />
                <div className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-terra-500 shadow-glow-terra">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">The ROLEX Studio</h3>
                  <p className="mt-1 max-w-xs text-[13px] text-ivory-100/70">
                    Drop by for a tasting — ghee on warm rotis is on the house every
                    Saturday, 11 AM onwards.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* form side */}
          <Reveal delay={0.1}>
            <div className="grain relative overflow-hidden rounded-[28px] border border-forest-900/[0.07] bg-ivory-50 p-7 shadow-soft sm:p-9">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[380px] flex-col items-center justify-center text-center"
                >
                  <span className="flex h-18 w-18 items-center justify-center rounded-full bg-olive-500/15 p-5">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-500 text-ivory-50">
                      <Check className="h-7 w-7" strokeWidth={2.6} />
                    </span>
                  </span>
                  <h2 className="mt-6 font-display text-3xl font-medium text-forest-900">
                    Message received.
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
                    Thank you, {form.name.split(" ")[0]}. Someone from our Pune studio
                    will write back within 4 working hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="mt-7 cursor-pointer rounded-full border border-forest-900/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-forest-900 transition hover:bg-forest-900 hover:text-ivory-50"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-terra-500">
                    <MessageSquare className="h-3.5 w-3.5" /> Write to us
                  </p>
                  <h2 className="mb-6 font-display text-2xl font-semibold text-forest-900">
                    We usually reply the same day.
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CField label="Your name" error={errors.name}>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ananya Iyer"
                        className={inputCls(!!errors.name)}
                        aria-invalid={!!errors.name}
                      />
                    </CField>
                    <CField label="Email address" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className={inputCls(!!errors.email)}
                        aria-invalid={!!errors.email}
                      />
                    </CField>
                    <div className="sm:col-span-2">
                      <CField label="Subject (optional)">
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className={cn(inputCls(false), "cursor-pointer appearance-none")}
                        >
                          <option value="">Choose a topic</option>
                          <option>Order support</option>
                          <option>Product question</option>
                          <option>Bulk / B2B enquiry</option>
                          <option>Jar return program</option>
                          <option>Something else</option>
                        </select>
                      </CField>
                    </div>
                    <div className="sm:col-span-2">
                      <CField label="Your message" error={errors.message}>
                        <textarea
                          rows={5}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="Tell us what's on your mind..."
                          className={cn(inputCls(!!errors.message), "resize-none")}
                          aria-invalid={!!errors.message}
                        />
                      </CField>
                    </div>
                  </div>
                  <MagneticButton type="submit" className={`${BUT.terra} mt-6 w-full py-4`}>
                    Send message <Send className="h-4 w-4" />
                  </MagneticButton>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        {/* FAQ */}
        <section className="mx-auto mt-24 max-w-3xl">
          <SectionHeading
            align="center"
            eyebrow="Good questions"
            title="Asked often, answered honestly."
            className="mb-10"
          />
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={f.q} delay={i * 0.05}>
                  <div
                    className={cn(
                      "overflow-hidden rounded-[22px] border transition-colors duration-300",
                      open
                        ? "border-forest-900/15 bg-ivory-50 shadow-card"
                        : "border-forest-900/[0.06] bg-ivory-100/60 hover:bg-ivory-50"
                    )}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-[15px] font-bold text-forest-900">{f.q}</span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition",
                          open ? "bg-forest-900 text-gold-300" : "bg-sand-200/70 text-ink-500"
                        )}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 text-[13.5px] leading-relaxed text-ink-500">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function CField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold text-ink-700">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-[11.5px] font-semibold text-terra-600">{error}</p>}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    "w-full rounded-2xl border bg-ivory-50 px-4.5 py-3.5 text-sm text-forest-900 outline-none transition placeholder:text-ink-400",
    hasError
      ? "border-terra-500 focus:ring-2 focus:ring-terra-400/30"
      : "border-sand-300 focus:border-olive-400 focus:ring-2 focus:ring-olive-400/30"
  );
