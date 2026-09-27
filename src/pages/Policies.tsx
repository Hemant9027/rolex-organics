import { Link } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { Reveal } from "../components/primitives";

export type PolicyKind = "privacy" | "terms" | "shipping" | "refund";

interface PolicySection {
  h: string;
  p: string[];
  list?: string[];
}

const POLICIES: Record<PolicyKind, { title: string; intro: string; updated: string; sections: PolicySection[] }> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "Your trust matters more than your data. This policy explains — in plain language — what ROLEX Organics collects, why, and how it stays protected.",
    updated: "Last updated: January 2026",
    sections: [
      {
        h: "What we collect",
        p: [
          "We collect only what is needed to fulfil your order and improve your experience:",
        ],
        list: [
          "Contact details you share while ordering (name, phone, email, address).",
          "Order history, so we can recommend refills and resolve issues quickly.",
          "Anonymous usage statistics that help us understand which pages work well.",
        ],
      },
      {
        h: "What we never do",
        p: [
          "We do not sell, rent or trade your personal information to any third party. We do not store payment credentials — payments are processed by PCI-DSS compliant gateways. We do not send promotional messages without your explicit opt-in.",
        ],
      },
      {
        h: "Cookies & local storage",
        p: [
          "We use browser storage to remember your cart, wishlist and preferences between visits. Analytics cookies, where used, are anonymised. You can clear these at any time from your browser settings — your shopping experience will simply reset.",
        ],
      },
      {
        h: "Your rights",
        p: [
          "You may request a copy of your data, ask for corrections, or ask us to delete your information entirely by writing to care@rolexorganics.in. We act on verified requests within 72 hours.",
        ],
      },
      {
        h: "Data security",
        p: [
          "All data is transmitted over TLS encryption and stored with access controls limited to the fulfilment team that needs it. Our retention period for inactive customer data is 24 months, after which it is permanently deleted.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro:
      "Welcome to ROLEX Organics. By using our website and purchasing our products, you agree to the following fair and simple terms.",
    updated: "Last updated: January 2026",
    sections: [
      {
        h: "Products & pricing",
        p: [
          "We work hard to describe every product accurately — weights, origins, shelf life and prices inclusive of GST. Natural products vary slightly between harvests; minor differences in colour, aroma or texture between batches are a sign of authenticity, not defects.",
          "Prices and offers may change without prior notice, but the price confirmed at checkout always holds for that order.",
        ],
      },
      {
        h: "Orders & acceptance",
        p: [
          "An order is confirmed once you receive the order number on screen and by email. We reserve the right to cancel orders in rare cases — for example a failed payment capture, an obvious pricing error, or stock exhaustion in a small batch — with a full and immediate refund.",
        ],
      },
      {
        h: "Acceptable use",
        p: [
          "You agree not to misuse this website: no scraping of content or images, no fraudulent orders, and no attempts to interfere with the site's operation. Our brand name, photography and copy are protected intellectual property.",
        ],
      },
      {
        h: "Limitation of liability",
        p: [
          "Our products are food items, not medicine. They are not intended to diagnose, treat or cure any condition. Please consult a physician before consuming herbal powders if you are pregnant, nursing, or on medication. To the fullest extent permitted by law, our liability is limited to the value of the order in question.",
        ],
      },
      {
        h: "Governing law",
        p: [
          "These terms are governed by the laws of India, with jurisdiction of the courts of Pune, Maharashtra.",
        ],
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    intro:
      "Small batches, fast dispatch. Here's exactly how your order travels from our Pune fulfilment studio to your doorstep.",
    updated: "Last updated: January 2026",
    sections: [
      {
        h: "Dispatch timelines",
        p: [
          "Orders placed before 4 PM IST (Monday–Saturday) are packed and dispatched the same day. Orders after 4 PM ship the next working day. We pause dispatch on Sundays and national holidays.",
        ],
      },
      {
        h: "Delivery options & charges",
        p: [],
        list: [
          "Standard Delivery — free on orders above ₹999 (₹79 below). Reaches most Indian pin codes in 3–6 working days.",
          "Express Delivery — ₹149 flat. Reaches metro and tier-1 cities in 1–2 working days.",
          "Cash on Delivery is available on both options at no extra charge.",
        ],
      },
      {
        h: "Packaging",
        p: [
          "Every order ships plastic-free: glass jars are wrapped in recycled honeycomb paper, sealed with paper tape, and boxed in corrugated cartons. If your order contains ghee in summer months, we add a breathable insulation sleeve at no cost.",
        ],
      },
      {
        h: "Tracking & issues",
        p: [
          "Tracking links are shared by SMS and email as soon as your order ships. If a shipment is stuck beyond 48 hours, write to us — we'll escalate with the courier and, if needed, ship a replacement while the investigation runs.",
        ],
      },
    ],
  },
  refund: {
    title: "Refund & Cancellation Policy",
    intro:
      "If something about your order isn't right, we'd rather fix it than argue about it. This policy is written to be used, not hidden.",
    updated: "Last updated: January 2026",
    sections: [
      {
        h: "Cancellations",
        p: [
          "You can cancel any order for free before it is dispatched — simply reply to your confirmation email or call +91 98765 43210. Once dispatched, orders cannot be cancelled but can be refused at the door for a full refund.",
        ],
      },
      {
        h: "7-day batch promise",
        p: [
          "If any product arrives damaged, leaking, short in weight, or simply doesn't meet your expectations, tell us within 7 days of delivery. We'll choose together: a free replacement shipped on priority, or a full refund to your original payment method.",
          "For quality concerns we may ask for a photo of the product and its batch number — it helps us trace and fix the root cause.",
        ],
      },
      {
        h: "What's not returnable",
        p: [
          "For food-safety reasons we can't restock opened products, so returns are limited to the batch-promise scenarios above. Natural crystallisation of raw honey, graininess of bilona ghee, and colour variation in stone-ground flours are normal and not grounds for refund.",
        ],
      },
      {
        h: "Refund timelines",
        p: [
          "Approved refunds are initiated within 24 hours. UPI refunds reflect within 1–2 working days; card refunds within 5–7 working days depending on your bank. COD orders are refunded via UPI or bank transfer.",
        ],
      },
    ],
  },
};

export default function PolicyPage({ kind }: { kind: PolicyKind }) {
  const policy = POLICIES[kind];
  return (
    <div className="pb-24">
      <div className="grain relative overflow-hidden bg-forest-950 pb-14 pt-32 text-ivory-50">
        <div aria-hidden className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-gold-400/12 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory-100/50">
            <Link to="/" className="transition hover:text-gold-300">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gold-300">{policy.title}</span>
          </nav>
          <Reveal y={20}>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-gold-300">
              <FileText className="h-4 w-4" /> {policy.updated}
            </p>
            <h1 className="font-display text-4xl font-medium sm:text-5xl">{policy.title}</h1>
            <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-ivory-100/65">
              {policy.intro}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-14 sm:px-6">
        {policy.sections.map((s, i) => (
          <Reveal key={s.h} delay={i * 0.05}>
            <section className="mb-10">
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-forest-900">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terra-500/12 text-[13px] font-bold text-terra-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.h}
              </h2>
              <div className="mt-4 space-y-3 pl-12">
                {s.p.map((para, j) => (
                  <p key={j} className="text-[14px] leading-relaxed text-ink-500">
                    {para}
                  </p>
                ))}
                {s.list && (
                  <ul className="space-y-2.5">
                    {s.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-500">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-olive-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <div className="mt-4 rounded-[24px] border border-forest-900/[0.07] bg-ivory-100/70 p-7 text-center">
            <p className="font-display text-xl font-semibold text-forest-900">
              Still have a question?
            </p>
            <p className="mt-2 text-[13.5px] text-ink-500">
              Write to <b className="text-terra-600">care@rolexorganics.in</b> — a human replies within 4 working hours.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
