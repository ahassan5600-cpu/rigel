"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  HouseLine,
  LockKey,
  MapPin,
  Package,
  Phone,
  Truck,
  WarningCircle,
} from "@phosphor-icons/react";

type CheckoutDraft = {
  productId: string;
  productName: string;
  productImage: string;
  price: string;
  abayaLength: string;
  abayaWidth: string;
  sleeveLength: string;
  abayaType: string;
  closure: string;
  name: string;
  phone: string;
  notes: string;
};

const emptyDraft: CheckoutDraft = {
  productId: "custom",
  productName: "عباية مخصّصة",
  productImage: "/images/abaya-zilal.jpg",
  price: "0",
  abayaLength: "",
  abayaWidth: "",
  sleeveLength: "",
  abayaType: "",
  closure: "",
  name: "",
  phone: "",
  notes: "",
};

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; orderId: string }
  | { kind: "configuration"; message: string }
  | { kind: "error"; message: string };

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="checkout-page checkout-loading">جارٍ تجهيز طلبكِ...</main>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const draft = useMemo<CheckoutDraft>(() => ({
    productId: searchParams.get("productId") ?? emptyDraft.productId,
    productName: searchParams.get("productName") ?? emptyDraft.productName,
    productImage: searchParams.get("productImage") ?? emptyDraft.productImage,
    price: searchParams.get("price") ?? emptyDraft.price,
    abayaLength: searchParams.get("abayaLength") ?? emptyDraft.abayaLength,
    abayaWidth: searchParams.get("abayaWidth") ?? emptyDraft.abayaWidth,
    sleeveLength: searchParams.get("sleeveLength") ?? emptyDraft.sleeveLength,
    abayaType: searchParams.get("abayaType") ?? emptyDraft.abayaType,
    closure: searchParams.get("closure") ?? emptyDraft.closure,
    name: searchParams.get("name") ?? emptyDraft.name,
    phone: searchParams.get("phone") ?? emptyDraft.phone,
    notes: searchParams.get("notes") ?? emptyDraft.notes,
  }), [searchParams]);
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });

  const subtotal = Number(draft.price) || 0;
  const delivery = subtotal >= 50 ? 0 : 2;
  const total = useMemo(() => subtotal + delivery, [subtotal, delivery]);

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState({ kind: "sending" });

    const form = new FormData(event.currentTarget);
    const checkout = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          ...checkout,
          subtotal,
          delivery,
          total,
        }),
      });
      const result = (await response.json()) as {
        sent?: boolean;
        orderId?: string;
        code?: string;
        message?: string;
      };

      if (response.ok && result.sent && result.orderId) {
        setSubmitState({ kind: "success", orderId: result.orderId });
      } else if (result.code === "WHATSAPP_NOT_CONFIGURED") {
        setSubmitState({
          kind: "configuration",
          message: "صفحة الطلب جاهزة، ويحتاج الإرسال التلقائي إلى ربط حساب WhatsApp Business الخاص بـ RIGEL.",
        });
      } else {
        setSubmitState({ kind: "error", message: result.message || "تعذّر إرسال الطلب الآن. يرجى المحاولة مرة أخرى." });
      }
    } catch {
      setSubmitState({ kind: "error", message: "تعذّر الاتصال بخدمة الطلبات. يرجى المحاولة مرة أخرى." });
    }
  };

  if (submitState.kind === "success") {
    return (
      <main className="checkout-page checkout-result-page">
        <section className="checkout-result">
          <CheckCircle weight="fill" aria-hidden="true" />
          <p className="section-kicker">تم تأكيد الطلب</p>
          <h1>شكرًا لاختياركِ RIGEL</h1>
          <p>وصلت تفاصيل الطلب إلى فريقنا، وسنتواصل معكِ لتأكيد المقاسات والدفع وموعد التوصيل.</p>
          <div><span>رقم الطلب</span><strong>{submitState.orderId}</strong></div>
          <Link href="/">العودة إلى المتجر <ArrowLeft aria-hidden="true" /></Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link href="/" aria-label="RIGEL — العودة إلى المتجر">
          <img src="/rigel-logo-ultra-hd.png" alt="RIGEL" />
        </Link>
        <div className="checkout-progress" aria-label="مراحل إتمام الطلب">
          <span className="is-complete"><CheckCircle weight="fill" />التفصيل</span>
          <i />
          <span className="is-current"><span>2</span>العنوان والدفع</span>
          <i />
          <span><span>3</span>التأكيد</span>
        </div>
        <div className="secure-checkout"><LockKey aria-hidden="true" />طلب آمن</div>
      </header>

      <div className="checkout-shell">
        <form className="checkout-form" onSubmit={submitCheckout}>
          <div className="checkout-title">
            <p className="section-kicker">الخطوة الأخيرة</p>
            <h1>العنوان والدفع</h1>
            <p>راجعي معلوماتكِ وحددي عنوان التوصيل وطريقة الدفع المناسبة.</p>
          </div>

          <section className="checkout-card">
            <div className="checkout-card-heading"><Phone aria-hidden="true" /><div><span>01</span><h2>بيانات التواصل</h2></div></div>
            <div className="checkout-fields two-columns">
              <label>الاسم الكامل<input name="name" type="text" defaultValue={draft.name} required /></label>
              <label>رقم الهاتف<input className="phone-input" name="phone" type="tel" dir="ltr" defaultValue={draft.phone} placeholder="+973 3XXX XXXX" required /></label>
              <label className="full-field">البريد الإلكتروني <small>اختياري</small><input name="email" type="email" dir="ltr" placeholder="name@example.com" /></label>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-heading"><MapPin aria-hidden="true" /><div><span>02</span><h2>عنوان التوصيل</h2></div></div>
            <div className="checkout-fields two-columns">
              <label>المنطقة<input name="area" type="text" placeholder="مثال: الرفاع" required /></label>
              <label>المجمع<input name="block" type="text" inputMode="numeric" placeholder="رقم المجمع" required /></label>
              <label>الطريق<input name="road" type="text" inputMode="numeric" placeholder="رقم الطريق" required /></label>
              <label>المبنى / المنزل<input name="building" type="text" placeholder="رقم المبنى" required /></label>
              <label>الشقة <small>اختياري</small><input name="apartment" type="text" placeholder="رقم الشقة" /></label>
              <label>علامة مميزة <small>اختياري</small><input name="landmark" type="text" placeholder="بالقرب من..." /></label>
              <label className="full-field">ملاحظات التوصيل <small>اختياري</small><textarea name="deliveryNotes" rows={3} placeholder="الوقت المفضّل أو أي تعليمات للمندوب" /></label>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-heading"><Truck aria-hidden="true" /><div><span>03</span><h2>طريقة التوصيل</h2></div></div>
            <label className="checkout-option">
              <input name="deliveryMethod" type="radio" value="توصيل داخل البحرين" defaultChecked required />
              <span className="option-check" />
              <Truck aria-hidden="true" />
              <span><strong>توصيل داخل البحرين</strong><small>خلال 2–4 أيام بعد اكتمال التفصيل</small></span>
              <b>{delivery === 0 ? "مجاني" : `${delivery.toFixed(3)} د.ب`}</b>
            </label>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-heading"><CreditCard aria-hidden="true" /><div><span>04</span><h2>طريقة الدفع</h2></div></div>
            <div className="payment-options">
              <label className="checkout-option">
                <input name="paymentMethod" type="radio" value="BenefitPay" defaultChecked required />
                <span className="option-check" />
                <CreditCard aria-hidden="true" />
                <span><strong>BenefitPay</strong><small>يُرسل رابط الدفع بعد مراجعة الطلب</small></span>
              </label>
              <label className="checkout-option">
                <input name="paymentMethod" type="radio" value="الدفع عند الاستلام" required />
                <span className="option-check" />
                <Package aria-hidden="true" />
                <span><strong>الدفع عند الاستلام</strong><small>متاح حسب منطقة التوصيل</small></span>
              </label>
            </div>
          </section>

          {submitState.kind === "configuration" && (
            <div className="checkout-alert configuration-alert"><WarningCircle aria-hidden="true" /><span>{submitState.message}</span></div>
          )}
          {submitState.kind === "error" && (
            <div className="checkout-alert"><WarningCircle aria-hidden="true" /><span>{submitState.message}</span></div>
          )}

          <button className="checkout-submit" type="submit" disabled={submitState.kind === "sending"}>
            {submitState.kind === "sending" ? "جارٍ تأكيد الطلب..." : "تأكيد الطلب وإرساله"}
            <ArrowLeft aria-hidden="true" />
          </button>
          <p className="checkout-consent"><LockKey aria-hidden="true" />لن يبدأ التفصيل أو الدفع قبل مراجعة الطلب وتأكيده معكِ.</p>
        </form>

        <aside className="checkout-summary">
          <div className="summary-heading"><span>ملخص الطلب</span><Link href="/">تعديل</Link></div>
          <div className="summary-product">
            <img src={draft.productImage} alt={draft.productName} />
            <div><strong>{draft.productName}</strong><small>تفصيل حسب الطلب</small><b>{subtotal.toFixed(3)} د.ب</b></div>
          </div>
          <dl className="summary-measurements">
            <div><dt>طول العباية</dt><dd>{draft.abayaLength || "—"} إنش</dd></div>
            <div><dt>العرض من جهة واحدة</dt><dd>{draft.abayaWidth || "—"} إنش</dd></div>
            <div><dt>طول الكم</dt><dd>{draft.sleeveLength || "—"} إنش</dd></div>
            <div><dt>تفاصيل العباية</dt><dd>{draft.abayaType || "—"}</dd></div>
            <div><dt>الإغلاق</dt><dd>{draft.closure || "—"}</dd></div>
          </dl>
          {draft.notes && <div className="summary-notes"><span>الملاحظات</span><p>{draft.notes}</p></div>}
          <div className="summary-costs">
            <div><span>المجموع الفرعي</span><b>{subtotal.toFixed(3)} د.ب</b></div>
            <div><span>التوصيل</span><b>{delivery === 0 ? "مجاني" : `${delivery.toFixed(3)} د.ب`}</b></div>
            <div className="summary-total"><span>الإجمالي</span><strong>{total.toFixed(3)} د.ب</strong></div>
          </div>
          <div className="summary-support"><HouseLine aria-hidden="true" /><span><strong>تحتاجين مساعدة؟</strong><small>فريق RIGEL يراجع كل طلب قبل التفصيل.</small></span></div>
        </aside>
      </div>
    </main>
  );
}
