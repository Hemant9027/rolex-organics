import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Banknote,
  Check,
  ChevronRight,
  CreditCard,
  Leaf,
  Loader2,
  Lock,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import { inr } from "../data/products";
import {
  EXPRESS_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  useStore,
} from "../store/StoreContext";
import { BUT, MagneticButton, Reveal } from "../components/primitives";
import { cn } from "../utils/cn";

/* ------------------------------------------------------------------ */
interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  delivery: "standard" | "express";
  payment: "upi" | "card" | "cod";
  upiId: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pin: "",
  delivery: "standard",
  payment: "upi",
  upiId: "",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvv: "",
};

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

interface Order {
  id: string;
  total: number;
  items: number;
  name: string;
  email: string;
  address: string;
  delivery: string;
  payment: string;
}

export default function Checkout() {
  const {
    cartLines,
    cartCount,
    subtotal,
    mrpSavings,
    coupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    clearCart,
    pushToast,
  } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const shipping = useMemo(() => {
    if (form.delivery === "express") return EXPRESS_SHIPPING;
    return subtotal - couponDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  }, [form.delivery, subtotal, couponDiscount]);

  const total = Math.max(0, subtotal - couponDiscount + shipping);

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) e.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit mobile number.";
    if (form.address.trim().length < 10) e.address = "Please enter your complete address.";
    if (!form.city.trim()) e.city = "Required.";
    if (!form.state) e.state = "Select a state.";
    if (!/^\d{6}$/.test(form.pin)) e.pin = "Enter a 6-digit PIN.";
    if (form.payment === "upi" && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(form.upiId.trim()))
      e.upiId = "Enter a valid UPI ID (e.g. name@okhdfc).";
    if (form.payment === "card") {
      if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, "")))
        e.cardNumber = "Enter the 16-digit card number.";
      if (!form.cardName.trim()) e.cardName = "Required.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry))
        e.cardExpiry = "Use MM/YY.";
      if (!/^\d{3,4}$/.test(form.cardCvv)) e.cardCvv = "Invalid CVV.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function applyCouponCode() {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res.message);
    if (res.ok) setCouponInput("");
  }

  function placeOrder() {
    if (!validate()) {
      pushToast("Please review the highlighted fields", "info");
      return;
    }
    setPlacing(true);
    window.setTimeout(() => {
      const id = `ROX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id,
        total,
        items: cartCount,
        name: form.name,
        email: form.email,
        address: `${form.address}, ${form.city}, ${form.state} — ${form.pin}`,
        delivery: form.delivery === "express" ? "Express (1–2 days)" : "Standard (3–6 days)",
        payment:
          form.payment === "upi"
            ? `UPI (${form.upiId})`
            : form.payment === "card"
              ? `Card •••• ${form.cardNumber.slice(-4)}`
              : "Cash on Delivery",
      };
      try {
        const existing = JSON.parse(localStorage.getItem("rolex_orders") ?? "[]");
        localStorage.setItem("rolex_orders", JSON.stringify([...existing, { ...newOrder, date: new Date().toISOString(), lines: cartLines }]));
      } catch {
        /* noop */
      }
      clearCart();
      setPlacing(false);
      setOrder(newOrder);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1600);
  }

  /* ---------------- success screen ---------------- */
  if (order) return <OrderSuccess order={order} />;

  /* ---------------- empty cart ---------------- */
  if (cartLines.length === 0) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-5 px-6 pt-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand-200/70">
          <ShoppingBag className="h-9 w-9 text-sand-400" />
        </span>
        <h1 className="font-display text-3xl text-forest-900">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-ink-500">
          Add a few jars of goodness before heading to checkout.
        </p>
        <MagneticButton onClick={() => navigate("/shop")} className={BUT.primary}>
          Browse the pantry
        </MagneticButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <Reveal y={16}>
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">
          <Link to="/" className="transition hover:text-terra-500">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-forest-900">Checkout</span>
        </nav>
        <h1 className="font-display text-4xl font-medium text-forest-950 sm:text-5xl">
          Almost home.
        </h1>
        <p className="mt-2 flex items-center gap-2 text-[13.5px] text-ink-500">
          <Lock className="h-4 w-4 text-olive-600" />
          Secure checkout · your details are never shared
        </p>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* ---------------- form ---------------- */}
        <div className="space-y-6">
          {/* customer */}
          <FormCard step={1} title="Contact details" icon={<User className="h-4.5 w-4.5" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) => set("name", v)}
                error={errors.name}
                placeholder="Ananya Iyer"
                autoComplete="name"
              />
              <Field
                label="Phone number"
                value={form.phone}
                onChange={(v) => set("phone", v.replace(/[^\d\s]/g, "").slice(0, 11))}
                error={errors.phone}
                placeholder="98765 43210"
                inputMode="tel"
                autoComplete="tel"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Email address"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </div>
            </div>
          </FormCard>

          {/* address */}
          <FormCard step={2} title="Delivery address" icon={<MapPin className="h-4.5 w-4.5" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Full address"
                  value={form.address}
                  onChange={(v) => set("address", v)}
                  error={errors.address}
                  placeholder="Flat, street, landmark"
                  autoComplete="street-address"
                />
              </div>
              <Field
                label="City"
                value={form.city}
                onChange={(v) => set("city", v)}
                error={errors.city}
                placeholder="Pune"
                autoComplete="address-level2"
              />
              <Field
                label="PIN code"
                value={form.pin}
                onChange={(v) => set("pin", v.replace(/\D/g, "").slice(0, 6))}
                error={errors.pin}
                placeholder="411001"
                inputMode="numeric"
                autoComplete="postal-code"
              />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-bold text-ink-700">State</label>
                <select
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={cn(
                    "w-full cursor-pointer appearance-none rounded-2xl border bg-ivory-50 px-4.5 py-3.5 text-sm outline-none transition focus:border-olive-400 focus:ring-2 focus:ring-olive-400/30",
                    errors.state ? "border-terra-500" : "border-sand-300"
                  )}
                  aria-invalid={!!errors.state}
                >
                  <option value="">Select state</option>
                  {STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <ErrorMsg msg={errors.state} />}
              </div>
            </div>
          </FormCard>

          {/* delivery */}
          <FormCard step={3} title="Delivery speed" icon={<Truck className="h-4.5 w-4.5" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <RadioCard
                active={form.delivery === "standard"}
                onClick={() => set("delivery", "standard")}
                icon={<Truck className="h-5 w-5" />}
                title="Standard Delivery"
                note={
                  subtotal - couponDiscount >= FREE_SHIPPING_THRESHOLD
                    ? "Free · 3–6 days"
                    : `${inr(STANDARD_SHIPPING)} · 3–6 days`
                }
              />
              <RadioCard
                active={form.delivery === "express"}
                onClick={() => set("delivery", "express")}
                icon={<Zap className="h-5 w-5" />}
                title="Express Delivery"
                note={`${inr(EXPRESS_SHIPPING)} · 1–2 days`}
              />
            </div>
          </FormCard>

          {/* payment */}
          <FormCard step={4} title="Payment method" icon={<CreditCard className="h-4.5 w-4.5" />}>
            <div className="grid gap-3 sm:grid-cols-3">
              <RadioCard
                active={form.payment === "upi"}
                onClick={() => set("payment", "upi")}
                icon={<Smartphone className="h-5 w-5" />}
                title="UPI"
                note="GPay, PhonePe, Paytm"
                compact
              />
              <RadioCard
                active={form.payment === "card"}
                onClick={() => set("payment", "card")}
                icon={<CreditCard className="h-5 w-5" />}
                title="Card"
                note="Credit / Debit"
                compact
              />
              <RadioCard
                active={form.payment === "cod"}
                onClick={() => set("payment", "cod")}
                icon={<Banknote className="h-5 w-5" />}
                title="COD"
                note="Pay on delivery"
                compact
              />
            </div>

            <AnimatePresence mode="wait">
              {form.payment === "upi" && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <Field
                      label="UPI ID"
                      value={form.upiId}
                      onChange={(v) => set("upiId", v)}
                      error={errors.upiId}
                      placeholder="name@okhdfc"
                    />
                  </div>
                </motion.div>
              )}
              {form.payment === "card" && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field
                        label="Card number"
                        value={form.cardNumber}
                        onChange={(v) =>
                          set("cardNumber", v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "))
                        }
                        error={errors.cardNumber}
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                      />
                    </div>
                    <Field
                      label="Name on card"
                      value={form.cardName}
                      onChange={(v) => set("cardName", v)}
                      error={errors.cardName}
                      placeholder="ANANYA IYER"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Expiry"
                        value={form.cardExpiry}
                        onChange={(v) => {
                          let val = v.replace(/[^\d]/g, "").slice(0, 4);
                          if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                          set("cardExpiry", val);
                        }}
                        error={errors.cardExpiry}
                        placeholder="MM/YY"
                        inputMode="numeric"
                      />
                      <Field
                        label="CVV"
                        value={form.cardCvv}
                        onChange={(v) => set("cardCvv", v.replace(/\D/g, "").slice(0, 4))}
                        error={errors.cardCvv}
                        placeholder="•••"
                        inputMode="numeric"
                        type="password"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              {form.payment === "cod" && (
                <motion.p
                  key="cod"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-4 text-[13px] leading-relaxed text-ink-500"
                >
                  Pay in cash or UPI when your order arrives. Please keep exact change handy —
                  our delivery partners carry limited cash.
                </motion.p>
              )}
            </AnimatePresence>
          </FormCard>
        </div>

        {/* ---------------- summary ---------------- */}
        <div>
          <div className="lg:sticky lg:top-24">
            <Reveal y={20} delay={0.1}>
              <div className="grain relative overflow-hidden rounded-[28px] border border-forest-900/[0.07] bg-ivory-50 shadow-soft">
                <div className="border-b border-forest-900/10 bg-forest-900 px-6 py-4 text-ivory-50">
                  <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold">
                    <PackageCheck className="h-5 w-5 text-gold-300" />
                    Order summary
                  </h2>
                  <p className="mt-0.5 text-[11.5px] text-ivory-100/60">
                    {cartCount} {cartCount === 1 ? "item" : "items"} · packed plastic-free
                  </p>
                </div>

                <div className="max-h-56 space-y-3 overflow-y-auto px-6 py-5">
                  {cartLines.map((l) => (
                    <div key={`${l.product.id}-${l.weightIndex}`} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sand-200">
                        <img src={l.product.image} alt={l.product.name} className="h-full w-full object-cover" />
                        <span className="absolute right-0.5 top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-forest-950/85 text-[9px] font-bold text-ivory-50">
                          {l.qty}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-forest-900">{l.product.name}</p>
                        <p className="text-[11px] text-ink-400">{l.weight.label}</p>
                      </div>
                      <p className="text-[13px] font-bold text-forest-900">{inr(l.lineTotal)}</p>
                    </div>
                  ))}
                </div>

                {/* coupon */}
                <div className="border-t border-dashed border-forest-900/15 px-6 py-4">
                  {coupon ? (
                    <div className="flex items-center justify-between rounded-2xl bg-olive-500/12 px-4 py-3">
                      <span className="flex items-center gap-2 text-[12.5px] font-bold text-olive-700">
                        <BadgeCheck className="h-4 w-4" /> {coupon.code}
                        <span className="font-normal text-olive-600">· {coupon.label}</span>
                      </span>
                      <button
                        onClick={removeCoupon}
                        aria-label="Remove coupon"
                        className="cursor-pointer rounded-full p-1 text-olive-700 transition hover:bg-olive-500/20"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponMsg(null);
                          }}
                          onKeyDown={(e) => e.key === "Enter" && applyCouponCode()}
                          placeholder="Coupon code — try ROLEX10"
                          aria-label="Coupon code"
                          className="w-full rounded-full border border-sand-300 bg-ivory-50 px-4.5 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-forest-900 outline-none transition placeholder:normal-case placeholder:font-normal placeholder:tracking-normal focus:border-olive-400"
                        />
                        <button
                          onClick={applyCouponCode}
                          className="shrink-0 cursor-pointer rounded-full bg-forest-900 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-ivory-50 transition hover:bg-terra-500"
                        >
                          Apply
                        </button>
                      </div>
                      {couponMsg && (
                        <p className="mt-2 text-[12px] font-semibold text-terra-600">{couponMsg}</p>
                      )}
                    </>
                  )}
                </div>

                {/* totals */}
                <div className="space-y-2 px-6 pb-5 text-[13.5px]">
                  <Row label="Subtotal" value={inr(subtotal)} />
                  {mrpSavings > 0 && (
                    <Row label="MRP savings" value={`− ${inr(mrpSavings)}`} tone="text-olive-600" />
                  )}
                  {couponDiscount > 0 && (
                    <Row label={`Coupon (${coupon?.code})`} value={`− ${inr(couponDiscount)}`} tone="text-terra-600" />
                  )}
                  <Row
                    label="Shipping"
                    value={shipping === 0 ? "Free" : inr(shipping)}
                    tone={shipping === 0 ? "text-olive-600" : undefined}
                  />
                  <div className="!mt-3.5 flex items-baseline justify-between border-t border-forest-900/10 pt-3.5">
                    <span className="font-display text-lg font-semibold text-forest-900">Total</span>
                    <span className="font-display text-[1.7rem] font-semibold text-forest-900">
                      {inr(total)}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <MagneticButton
                    onClick={placeOrder}
                    disabled={placing}
                    className={`${BUT.terra} w-full py-4 text-[13px] uppercase tracking-[0.14em]`}
                  >
                    {placing ? (
                      <span className="flex items-center gap-2.5">
                        <Loader2 className="h-4.5 w-4.5 animate-spin" /> Placing your order...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2.5">
                        <Lock className="h-4 w-4" /> Place order · {inr(total)}
                      </span>
                    )}
                  </MagneticButton>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-olive-600" />
                    Demo checkout — no real payment is processed
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <p className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={cn("font-semibold text-ink-900", tone)}>{value}</span>
    </p>
  );
}

function FormCard({
  step,
  title,
  icon,
  children,
}: {
  step: number;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Reveal y={18} delay={step * 0.05}>
      <section className="rounded-[26px] border border-forest-900/[0.07] bg-ivory-50 p-6 shadow-card sm:p-7">
        <h2 className="mb-5 flex items-center gap-3 font-display text-xl font-semibold text-forest-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-[13px] font-bold text-gold-300">
            {step}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-olive-500/12 text-olive-600">
            {icon}
          </span>
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "email";
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold text-ink-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-2xl border bg-ivory-50 px-4.5 py-3.5 text-sm text-forest-900 outline-none transition placeholder:text-ink-400",
          error
            ? "border-terra-500 focus:ring-2 focus:ring-terra-400/30"
            : "border-sand-300 focus:border-olive-400 focus:ring-2 focus:ring-olive-400/30"
        )}
      />
      {error && <ErrorMsg msg={error} />}
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1.5 text-[11.5px] font-semibold text-terra-600"
    >
      {msg}
    </motion.p>
  );
}

function RadioCard({
  active,
  onClick,
  icon,
  title,
  note,
  compact,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  note: string;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition-all duration-300",
        compact && "flex-col items-start gap-2",
        active
          ? "border-forest-900 bg-forest-900/[0.04] shadow-card"
          : "border-sand-300 hover:border-olive-400"
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
          active ? "bg-forest-900 text-gold-300" : "bg-sand-200/70 text-ink-500"
        )}
      >
        {icon}
      </span>
      <span>
        <span className="block text-[13.5px] font-bold text-forest-900">{title}</span>
        <span className={cn("block text-[11.5px] font-semibold", active ? "text-olive-600" : "text-ink-400")}>
          {note}
        </span>
      </span>
      {!compact && (
        <span
          className={cn(
            "ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
            active ? "border-forest-900 bg-forest-900" : "border-sand-300"
          )}
        >
          {active && <Check className="h-3 w-3 text-ivory-50" strokeWidth={3.5} />}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Order success screen                                               */
/* ------------------------------------------------------------------ */
function OrderSuccess({ order }: { order: Order }) {
  const navigate = useNavigate();
  return (
    <div className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-forest-950 px-4 py-24 text-ivory-50">
      <div aria-hidden className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-olive-500/20 blur-[120px]" />
      <div aria-hidden className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-gold-400/15 blur-[110px]" />

      {/* floating leaves */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: [0, 0.7, 0], y: [-40, -160], rotate: [0, 40 + i * 20] }}
          transition={{ duration: 5 + i, delay: 0.6 + i * 0.5, repeat: Infinity, repeatDelay: 4 }}
          className="absolute"
          style={{ left: `${10 + i * 15}%`, bottom: "20%" }}
        >
          <Leaf className={cn("h-5 w-5", i % 2 ? "text-gold-400" : "text-olive-400")} />
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg rounded-[32px] border border-ivory-50/12 bg-ivory-50/[0.05] p-8 text-center shadow-soft backdrop-blur-xl sm:p-10"
      >
        {/* check burst */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 16 }}
          className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-olive-400 to-forest-600 shadow-[0_0_60px_-10px_rgba(141,162,97,0.7)]"
        >
          <Check className="h-9 w-9 text-ivory-50" strokeWidth={3} />
          <motion.span
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.4, delay: 0.5, repeat: Infinity, repeatDelay: 1.2 }}
            className="absolute inset-0 rounded-full border-2 border-olive-400"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300">
            Order placed successfully
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            Thank you, {order.name.split(" ")[0]}.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed text-ivory-100/65">
            Your order is confirmed and already being hand-packed. A confirmation has
            been sent to <b className="text-ivory-50">{order.email}</b>.
          </p>

          <div className="mt-6 rounded-2xl border border-dashed border-gold-400/40 bg-gold-400/10 px-6 py-4">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-300">
              Order number
            </p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-wide text-ivory-50">
              {order.id}
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-left text-[12.5px]">
            <div className="rounded-xl bg-ivory-50/[0.06] p-3.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-ivory-100/45">Items</dt>
              <dd className="mt-1 font-semibold">{order.items} products</dd>
            </div>
            <div className="rounded-xl bg-ivory-50/[0.06] p-3.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-ivory-100/45">Total paid</dt>
              <dd className="mt-1 font-semibold text-gold-300">{inr(order.total)}</dd>
            </div>
            <div className="rounded-xl bg-ivory-50/[0.06] p-3.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-ivory-100/45">Delivery</dt>
              <dd className="mt-1 font-semibold">{order.delivery}</dd>
            </div>
            <div className="rounded-xl bg-ivory-50/[0.06] p-3.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-ivory-100/45">Payment</dt>
              <dd className="mt-1 truncate font-semibold">{order.payment}</dd>
            </div>
          </dl>

          <p className="mt-5 flex items-start gap-2 text-left text-[11.5px] leading-relaxed text-ivory-100/50">
            <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Shipping to: {order.address}. Track updates will arrive by SMS and email.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <MagneticButton onClick={() => navigate("/shop")} className={`${BUT.terra} flex-1`}>
              Continue shopping
            </MagneticButton>
            <MagneticButton onClick={() => navigate("/")} className={`${BUT.ghost} flex-1`}>
              Back to home
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
