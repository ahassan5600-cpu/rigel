"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  Bag,
  Check,
  InstagramLogo,
  List,
  MagnifyingGlass,
  Ruler,
  Scissors,
  Sparkle,
  X,
} from "@phosphor-icons/react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: "zilal",
    name: "عباية ظلال",
    description: "قصة واسعة من الكريب الياباني",
    price: 45,
    image: "/images/abaya-zilal.jpg",
  },
  {
    id: "najma",
    name: "عباية نجمة",
    description: "تفاصيل مطرزة مستوحاة من ضوء Rigel",
    price: 55,
    image: "/images/abaya-najma.jpg",
  },
  {
    id: "masar",
    name: "عباية مسار",
    description: "طيات طولية وأكمام محددة",
    price: 52,
    image: "/images/abaya-masar.jpg",
  },
];

const contactMessage = encodeURIComponent(
  "مرحبًا RIGEL، أرغب في معرفة المزيد عن مجموعة العبايات.",
);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [query, setQuery] = useState("");
  const orderPanelRef = useRef<HTMLElement>(null);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return products;
    return products.filter((product) =>
      `${product.name} ${product.description}`.includes(normalized),
    );
  }, [query]);

  const openOrder = (product: Product) => {
    setSelectedProduct(product);
    setGuideOpen(false);
    setOrderOpen(true);
  };

  const showMeasurementGuide = () => {
    setGuideOpen(true);
    requestAnimationFrame(() => {
      orderPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const checkout = new URLSearchParams({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      price: String(selectedProduct.price),
      abayaLength: String(form.get("abayaLength") || ""),
      abayaWidth: String(form.get("abayaWidth") || ""),
      sleeveLength: String(form.get("sleeveLength") || ""),
      abayaType: String(form.get("abayaType") || ""),
      closure: String(form.get("closure") || ""),
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      notes: String(form.get("notes") || ""),
    });

    window.location.href = `/checkout?${checkout.toString()}`;
  };

  return (
    <main>
      <section className="hero" id="home">
        <img
          className="hero-image"
          src="/images/rigel-hero.jpg"
          alt="امرأة ترتدي عباية سوداء من RIGEL داخل رواق معماري ليلي"
        />
        <div className="announcement">
          <Sparkle aria-hidden="true" weight="fill" />
          <span>توصيل مجاني داخل البحرين للطلبات فوق 50 د.ب</span>
        </div>

        <header className="site-header" aria-label="التنقل الرئيسي">
          <div className="header-tools">
            <button type="button" aria-label="فتح حقيبة الطلب" onClick={() => { setGuideOpen(false); setOrderOpen(true); }}>
              <Bag aria-hidden="true" />
            </button>
            <button type="button" aria-label="البحث" onClick={() => setSearchOpen(true)}>
              <MagnifyingGlass aria-hidden="true" />
            </button>
            <button
              className="menu-button"
              type="button"
              aria-label="فتح القائمة"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <List aria-hidden="true" />}
            </button>
          </div>

          <a className="brand" href="#home" aria-label="RIGEL — الصفحة الرئيسية">
            <img src="/rigel-logo-ultra-hd.png" alt="RIGEL" />
          </a>

          <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="أقسام الموقع">
            <a href="#collection" onClick={() => setMenuOpen(false)}>المجموعة</a>
            <a href="#custom" onClick={() => setMenuOpen(false)}>حسب المناسبة</a>
            <a href="#story" onClick={() => setMenuOpen(false)}>قصتنا</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>تواصل معنا</a>
          </nav>
        </header>

        <div className="hero-copy">
          <p>مجموعة 2026</p>
          <h1>مصمّمة لتلفت بهدوء</h1>
          <span>تفاصيل دقيقة، حضور لا يُنسى</span>
          <a className="outline-button" href="#collection">
            اكتشفي الجديد <ArrowLeft aria-hidden="true" />
          </a>
        </div>

        <a className="scroll-cue" href="#collection" aria-label="انتقلي إلى المجموعة">
          <ArrowDown aria-hidden="true" />
          <span>اكتشفي المزيد</span>
        </a>
      </section>

      <section className="collection" id="collection">
        <div className="collection-stage">
          <div className="collection-heading">
            <div>
              <p className="section-kicker">مختارات الموسم</p>
              <h2>وصل حديثًا</h2>
            </div>
            <p>عبايات عصرية بتفاصيل هادئة، تُفصّل لكِ وترافق حضورك من الصباح إلى المساء.</p>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <button className="product-image-button" type="button" onClick={() => openOrder(product)}>
                  <img src={product.image} alt={product.name} />
                  <span>خصّصي طلبك</span>
                </button>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <strong>{product.price} د.ب</strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button className="text-button" type="button" onClick={() => setSearchOpen(true)}>
          عرض المجموعة كاملة <ArrowLeft aria-hidden="true" />
        </button>
      </section>

      <section className="custom-section" id="custom">
        <div className="custom-intro">
          <p className="section-kicker">صُنعت لكِ</p>
          <h2>كل عباءة تبدأ بتفاصيلك</h2>
          <p>
            اختاري التصميم، ثم أدخلي طول العباية وعرضها من جهة واحدة وطول الكم من نصف الرقبة. نراجع كل قياس معكِ قبل البدء بالتفصيل.
          </p>
          <button className="light-button" type="button" onClick={() => openOrder(products[0])}>
            ابدئي طلبك <ArrowLeft aria-hidden="true" />
          </button>
        </div>
        <div className="custom-steps" aria-label="خطوات الطلب المخصّص">
          <div><span>01</span><Ruler aria-hidden="true" /><strong>القياسات الثلاثة</strong><small>الطول والعرض وطول الكم</small></div>
          <div><span>02</span><Scissors aria-hidden="true" /><strong>التفاصيل والإغلاق</strong><small>كلوش أو بشت أو عادية</small></div>
          <div><span>03</span><Check aria-hidden="true" /><strong>العنوان والدفع</strong><small>راجعي الطلب وأكملي بيانات التوصيل</small></div>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-title">
          <p className="section-kicker">قصة RIGEL</p>
          <h2>اسمٌ من السماء،<br />وحضورٌ لكِ</h2>
        </div>
        <div className="story-copy">
          <p>
            RIGEL هو نجم عملاق أزرق‑أبيض شديد اللمعان في كوكبة الجبار. ومن ضوئه استلهمنا عبايات تجمع بين البساطة الدقيقة والحضور الذي لا يحتاج إلى مبالغة.
          </p>
          <a href="https://www.instagram.com/rigel.bh/" target="_blank" rel="noreferrer">
            تابعي قصتنا على إنستغرام <InstagramLogo aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer id="contact">
        <a className="footer-brand" href="#home"><img src="/rigel-logo-ultra-hd.png" alt="RIGEL" /></a>
        <p>عبايات مصمّمة لكِ، بتفاصيل تختارينها.</p>
        <div className="footer-links">
          <a href="https://www.instagram.com/rigel.bh/" target="_blank" rel="noreferrer">@Rigel.bh</a>
          <a href={`https://wa.me/?text=${contactMessage}`} target="_blank" rel="noreferrer">واتساب</a>
        </div>
        <small>© 2026 RIGEL Abaya House · Bahrain</small>
      </footer>

      {searchOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="البحث في مجموعة RIGEL">
          <button className="overlay-backdrop" type="button" aria-label="إغلاق البحث" onClick={() => setSearchOpen(false)} />
          <section className="search-panel">
            <div className="panel-heading">
              <div><p>مجموعة RIGEL</p><h2>عمّ تبحثين؟</h2></div>
              <button type="button" aria-label="إغلاق" onClick={() => setSearchOpen(false)}><X aria-hidden="true" /></button>
            </div>
            <label className="search-field">
              <MagnifyingGlass aria-hidden="true" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحثي باسم التصميم أو التفاصيل" />
            </label>
            <div className="search-results">
              {filteredProducts.map((product) => (
                <button key={product.id} type="button" onClick={() => { setSearchOpen(false); openOrder(product); }}>
                  <img src={product.image} alt="" />
                  <span><strong>{product.name}</strong><small>{product.price} د.ب</small></span>
                  <ArrowLeft aria-hidden="true" />
                </button>
              ))}
              {filteredProducts.length === 0 && <p className="empty-state">لا توجد نتائج مطابقة، جرّبي كلمة أخرى.</p>}
            </div>
          </section>
        </div>
      )}

      {orderOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="تخصيص طلب العباءة">
          <button className="overlay-backdrop" type="button" aria-label="إغلاق الطلب" onClick={() => setOrderOpen(false)} />
          <section ref={orderPanelRef} className={guideOpen ? "order-panel guide-visible" : "order-panel"}>
            <div className={guideOpen ? "order-image is-guide" : "order-image"}>
              {guideOpen ? (
                <>
                  <img src="/images/rigel-measurement-guide-detailed.png" alt="دليل قياس طول العباية وعرضها من جهة واحدة وطول الكم من نصف الرقبة مع إرشادات القياس" />
                  <button className="guide-toggle guide-back" type="button" onClick={() => setGuideOpen(false)}>
                    <X aria-hidden="true" /> العودة للتصميم
                  </button>
                </>
              ) : (
                <>
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                  <button className="guide-toggle" type="button" onClick={showMeasurementGuide}>
                    <Ruler aria-hidden="true" /> دليل أخذ المقاسات
                  </button>
                  <div><span>التصميم المختار</span><strong>{selectedProduct.name}</strong><small>{selectedProduct.price} د.ب</small></div>
                </>
              )}
            </div>
            <div className="order-content">
              <div className="panel-heading">
                <div><p>تفصيل حسب الطلب</p><h2>اختاري تفاصيلك</h2></div>
                <button type="button" aria-label="إغلاق" onClick={() => setOrderOpen(false)}><X aria-hidden="true" /></button>
              </div>

              <form onSubmit={submitOrder}>
                  <button className="inline-guide-button" type="button" onClick={showMeasurementGuide}>
                    <Ruler aria-hidden="true" />
                    <span><strong>كيف آخذ المقاسات؟</strong><small>شاهدي الدليل المصوّر قبل إدخال القياسات</small></span>
                    <ArrowLeft aria-hidden="true" />
                  </button>
                  <div className="form-row">
                    <label>طول العباية (إنش)<input name="abayaLength" type="number" min="1" step="0.5" inputMode="decimal" placeholder="مثال: 56" required /></label>
                    <label>عرض العباية من جهة واحدة (إنش)<input name="abayaWidth" type="number" min="1" step="0.5" inputMode="decimal" placeholder="مثال: 28" required /></label>
                  </div>
                  <label>طول الكم من نصف الرقبة (إنش)<input name="sleeveLength" type="number" min="1" step="0.5" inputMode="decimal" placeholder="مثال: 30" required /></label>
                  <fieldset className="choice-fieldset">
                    <legend>تفاصيل العباية</legend>
                    <div className="choice-grid three-options">
                      <label><input name="abayaType" type="radio" value="كلوش" required /><span>كلوش</span></label>
                      <label><input name="abayaType" type="radio" value="بشت" /><span>بشت</span></label>
                      <label><input name="abayaType" type="radio" value="عادية" /><span>عادية</span></label>
                    </div>
                  </fieldset>
                  <fieldset className="choice-fieldset">
                    <legend>إغلاق العباية</legend>
                    <div className="choice-grid">
                      <label><input name="closure" type="radio" value="مفتوحة" required /><span>مفتوحة</span></label>
                      <label><input name="closure" type="radio" value="طقطاق" /><span>طقطاق</span></label>
                    </div>
                  </fieldset>
                  <label>الاسم<input name="name" type="text" placeholder="اسمك الكريم" required /></label>
                  <label>رقم الهاتف<input className="phone-input" name="phone" type="tel" inputMode="tel" dir="ltr" placeholder="+973 3XXX XXXX" required /></label>
                  <label>الملاحظات<textarea name="notes" rows={3} placeholder="أي تعديل أو تفصيل إضافي ترغبين به" /></label>
                  <button className="submit-order" type="submit">متابعة إلى العنوان والدفع <ArrowLeft aria-hidden="true" /></button>
                  <small className="form-note">ستراجعين العنوان والتوصيل والدفع في الصفحة التالية.</small>
              </form>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
