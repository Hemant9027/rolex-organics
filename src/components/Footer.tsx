import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Leaf, Mail, MapPin, Phone } from "lucide-react";

/* brand icons (lucide no longer ships brand glyphs) */
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);
import { CATEGORIES } from "../data/products";
import { useStore } from "../store/StoreContext";
import { Logo } from "./Navbar";

const SHOP_LINKS = [
  { label: "All Products", to: "/shop" },
  { label: "Best Sellers", to: "/shop?sort=featured" },
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Biggest Discounts", to: "/shop?sort=discount" },
  { label: "Wishlist", to: "/wishlist" },
];

const SUPPORT_LINKS = [
  { label: "Contact Us", to: "/contact" },
  { label: "Shipping Policy", to: "/shipping-policy" },
  { label: "Refunds & Cancellations", to: "/refund-policy" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

export function Footer() {
  const { pushToast } = useStore();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      pushToast("Please enter a valid email address", "info");
      return;
    }
    try {
      const list = JSON.parse(localStorage.getItem("rolex_newsletter") ?? "[]");
      localStorage.setItem(
        "rolex_newsletter",
        JSON.stringify([...list, email]),
      );
    } catch {
      /* noop */
    }
    setDone(true);
    pushToast("Welcome to the ROLEX family", "check");
  }

  return (
    <footer className="grain relative overflow-hidden bg-forest-950 text-ivory-100">
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-olive-500/15 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        {/* top row */}
        <div className="grid gap-12 border-b border-ivory-50/10 pb-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* brand */}
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-ivory-100/60">
              Premium Indian organic food, sourced directly from farmer partners
              and processed the traditional way. Pure from the soil, powerful
              for life.
            </p>
            <div className="mt-6 flex gap-2.5">
              {[
                { icon: InstagramIcon, label: "Instagram" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: XIcon, label: "X (Twitter)" },
                { icon: YoutubeIcon, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-ivory-50/15 transition-all duration-300 hover:-translate-y-1 hover:bg-gold-400 hover:text-forest-950 hover:ring-gold-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* shop */}
          <FooterCol title="Shop">
            {SHOP_LINKS.map((l) => (
              <FooterLink key={l.label} to={l.to} label={l.label} />
            ))}
          </FooterCol>

          {/* support */}
          <FooterCol title="Support">
            {SUPPORT_LINKS.map((l) => (
              <FooterLink key={l.label} to={l.to} label={l.label} />
            ))}
          </FooterCol>

          {/* newsletter + contact */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.26em] text-gold-300">
              Stay rooted
            </h4>
            <p className="mb-4 text-[13px] leading-relaxed text-ivory-100/60">
              Seasonal harvest drops, recipes and member-only offers — once a
              fortnight, never spammy.
            </p>
            {done ? (
              <div className="flex items-center gap-2.5 rounded-2xl bg-olive-500/20 px-4 py-3.5 text-[13px] font-semibold text-olive-300 ring-1 ring-olive-400/30">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-olive-400 text-forest-950">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                You're on the list. Welcome!
              </div>
            ) : (
              <form
                onSubmit={subscribe}
                className="flex overflow-hidden rounded-full bg-ivory-50/[0.07] ring-1 ring-ivory-50/15 transition focus-within:ring-gold-400/60"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="w-full bg-transparent px-5 py-3.5 text-sm text-ivory-50 outline-none placeholder:text-ivory-100/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="m-1 flex h-10 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-terra-500 text-ivory-50 transition hover:bg-terra-400"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            <ul className="mt-6 space-y-2.5 text-[13px] text-ivory-100/60">
              <li className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-gold-300" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-gold-300" />{" "}
                care@rolexorganics.in
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" />
                14 Orchard Lane, Koregaon Park,
                <br />
                Pune, Maharashtra 411001
              </li>
            </ul>
          </div>
        </div>

        {/* categories strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-ivory-50/10 py-6">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-ivory-100/40">
            <Leaf className="h-3 w-3" /> Categories
          </span>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.id}`}
              className="text-[12.5px] font-medium text-ivory-100/60 transition hover:text-gold-300"
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* bottom */}
        <div className="flex flex-col items-center justify-between gap-5 pt-7 sm:flex-row">
          <p className="text-[12px] text-ivory-100/45">
            © 2026 ROLEX Organics. All rights reserved. FSSAI Lic. No.
            11523998000247
            <br />
            <a
              href="https://www.infycrestsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold-300"
            >
              Designed and developed by Infycrest Solutions
            </a>
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            aria-label="Accepted payment methods"
          >
            {["UPI", "Visa", "Mastercard", "RuPay", "Net Banking", "COD"].map(
              (p) => (
                <span
                  key={p}
                  className="rounded-lg bg-ivory-50/[0.07] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ivory-100/55 ring-1 ring-ivory-50/10"
                >
                  {p}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.26em] text-gold-300">
        {title}
      </h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link
        to={to}
        className="group inline-flex items-center gap-1.5 text-[13.5px] text-ivory-100/60 transition-colors hover:text-ivory-50"
      >
        <span className="h-px w-0 bg-gold-300 transition-all duration-300 group-hover:w-3.5" />
        {label}
      </Link>
    </li>
  );
}
