const products = {
  zilal: { id: "zilal", name: "عباية ظلال", price: 45, image: "./images/abaya-zilal.jpg" },
  najma: { id: "najma", name: "عباية نجمة", price: 55, image: "./images/abaya-najma.jpg" },
  masar: { id: "masar", name: "عباية مسار", price: 52, image: "./images/abaya-masar.jpg" },
};

let selectedProduct = products.zilal;
let orderDraft = {};
let showingGuide = false;

const storeView = document.querySelector("#storeView");
const checkoutView = document.querySelector("#checkoutView");
const overlay = document.querySelector("#orderOverlay");
const orderVisual = document.querySelector("#orderVisual");
const orderImage = document.querySelector("#orderImage");
const orderName = document.querySelector("#orderProductName");
const orderPrice = document.querySelector("#orderPrice");
const orderForm = document.querySelector("#orderForm");
const checkoutForm = document.querySelector("#checkoutForm");

function openOrder(productId) {
  selectedProduct = products[productId] || products.zilal;
  showingGuide = false;
  orderVisual.classList.remove("is-guide");
  orderImage.src = selectedProduct.image;
  orderImage.alt = selectedProduct.name;
  orderName.textContent = selectedProduct.name;
  orderPrice.textContent = `${selectedProduct.price} د.ب`;
  overlay.hidden = false;
  document.body.classList.add("locked");
}

function closeOrder() {
  overlay.hidden = true;
  document.body.classList.remove("locked");
}

function showCheckout() {
  const delivery = selectedProduct.price >= 50 ? 0 : 2;
  const total = selectedProduct.price + delivery;
  document.querySelector("#summaryImage").src = selectedProduct.image;
  document.querySelector("#summaryName").textContent = selectedProduct.name;
  document.querySelector("#summaryPrice").textContent = `${selectedProduct.price.toFixed(3)} د.ب`;
  document.querySelector("#summarySubtotal").textContent = `${selectedProduct.price.toFixed(3)} د.ب`;
  document.querySelector("#summaryDelivery").textContent = delivery === 0 ? "مجاني" : `${delivery.toFixed(3)} د.ب`;
  document.querySelector("#summaryTotal").textContent = `${total.toFixed(3)} د.ب`;
  document.querySelector("#summaryMeasurements").innerHTML = `
    <div><dt>طول العباية</dt><dd>${orderDraft.abayaLength} إنش</dd></div>
    <div><dt>العرض من جهة واحدة</dt><dd>${orderDraft.abayaWidth} إنش</dd></div>
    <div><dt>طول الكم</dt><dd>${orderDraft.sleeveLength} إنش</dd></div>
    <div><dt>تفاصيل العباية</dt><dd>${orderDraft.abayaType}</dd></div>
    <div><dt>الإغلاق</dt><dd>${orderDraft.closure}</dd></div>`;
  checkoutForm.elements.name.value = orderDraft.name;
  checkoutForm.elements.phone.value = orderDraft.phone;
  closeOrder();
  storeView.hidden = true;
  checkoutView.hidden = false;
  window.scrollTo({ top: 0 });
}

function returnToStore(edit = false) {
  checkoutView.hidden = true;
  storeView.hidden = false;
  window.scrollTo({ top: document.querySelector("#collection").offsetTop });
  if (edit) openOrder(selectedProduct.id);
}

document.querySelectorAll(".js-order").forEach((button) => {
  button.addEventListener("click", () => openOrder(button.dataset.product));
});
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", closeOrder));

document.querySelector("#guideButton").addEventListener("click", () => {
  showingGuide = !showingGuide;
  orderVisual.classList.toggle("is-guide", showingGuide);
  orderImage.src = showingGuide ? "./images/rigel-measurement-guide-detailed.png" : selectedProduct.image;
  orderImage.alt = showingGuide ? "دليل قياس العباية" : selectedProduct.name;
  document.querySelector("#guideButton").textContent = showingGuide ? "العودة للتصميم" : "دليل أخذ المقاسات";
});

document.querySelector("#menuButton").addEventListener("click", (event) => {
  const nav = document.querySelector("#navLinks");
  nav.classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
});
document.querySelectorAll("#navLinks a").forEach((link) => link.addEventListener("click", () => document.querySelector("#navLinks").classList.remove("is-open")));

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  orderDraft = Object.fromEntries(new FormData(orderForm).entries());
  showCheckout();
});

document.querySelector("#checkoutBack").addEventListener("click", () => returnToStore(false));
document.querySelector("#editOrder").addEventListener("click", () => returnToStore(true));

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const checkout = Object.fromEntries(new FormData(checkoutForm).entries());
  const delivery = selectedProduct.price >= 50 ? 0 : 2;
  const total = selectedProduct.price + delivery;
  const orderId = `RGL-${String(Date.now()).slice(-8)}`;
  const message = [
    `طلب جديد من موقع RIGEL — ${orderId}`,
    "",
    `التصميم: ${selectedProduct.name}`,
    `السعر: ${selectedProduct.price.toFixed(3)} د.ب`,
    `طول العباية: ${orderDraft.abayaLength} إنش`,
    `عرض العباية من جهة واحدة: ${orderDraft.abayaWidth} إنش`,
    `طول الكم من نصف الرقبة: ${orderDraft.sleeveLength} إنش`,
    `تفاصيل العباية: ${orderDraft.abayaType}`,
    `إغلاق العباية: ${orderDraft.closure}`,
    `ملاحظات التفصيل: ${orderDraft.notes || "لا توجد"}`,
    "",
    `الاسم: ${checkout.name}`,
    `الهاتف: ${checkout.phone}`,
    `البريد: ${checkout.email || "غير مضاف"}`,
    `العنوان: ${checkout.area}، مجمع ${checkout.block}، طريق ${checkout.road}، مبنى ${checkout.building}`,
    `الشقة: ${checkout.apartment || "لا توجد"}`,
    `علامة مميزة: ${checkout.landmark || "لا توجد"}`,
    `ملاحظات التوصيل: ${checkout.deliveryNotes || "لا توجد"}`,
    `طريقة الدفع: ${checkout.paymentMethod}`,
    `الإجمالي: ${total.toFixed(3)} د.ب`,
  ].join("\n");
  window.location.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
});
