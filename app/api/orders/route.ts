import { NextResponse } from "next/server";

type OrderPayload = Record<string, string | number | undefined>;

const requiredFields = [
  "productId",
  "productName",
  "abayaLength",
  "abayaWidth",
  "sleeveLength",
  "abayaType",
  "closure",
  "name",
  "phone",
  "area",
  "block",
  "road",
  "building",
  "paymentMethod",
] as const;

const products = {
  zilal: { name: "عباية ظلال", price: 45 },
  najma: { name: "عباية نجمة", price: 55 },
  masar: { name: "عباية مسار", price: 52 },
} as const;

function value(payload: OrderPayload, key: string, fallback = "—") {
  const item = payload[key];
  return item === undefined || item === "" ? fallback : String(item);
}

function createOrderMessage(payload: OrderPayload, orderId: string) {
  return [
    `طلب جديد من موقع RIGEL — ${orderId}`,
    "",
    `التصميم: ${value(payload, "productName")}`,
    `السعر: ${value(payload, "subtotal")} د.ب`,
    `طول العباية: ${value(payload, "abayaLength")} إنش`,
    `عرض العباية من جهة واحدة: ${value(payload, "abayaWidth")} إنش`,
    `طول الكم من نصف الرقبة: ${value(payload, "sleeveLength")} إنش`,
    `تفاصيل العباية: ${value(payload, "abayaType")}`,
    `إغلاق العباية: ${value(payload, "closure")}`,
    `ملاحظات التفصيل: ${value(payload, "notes", "لا توجد")}`,
    "",
    `الاسم: ${value(payload, "name")}`,
    `الهاتف: ${value(payload, "phone")}`,
    `البريد: ${value(payload, "email", "غير مضاف")}`,
    "",
    `العنوان: ${value(payload, "area")}، مجمع ${value(payload, "block")}، طريق ${value(payload, "road")}، مبنى ${value(payload, "building")}`,
    `الشقة: ${value(payload, "apartment", "لا توجد")}`,
    `علامة مميزة: ${value(payload, "landmark", "لا توجد")}`,
    `ملاحظات التوصيل: ${value(payload, "deliveryNotes", "لا توجد")}`,
    `طريقة التوصيل: ${value(payload, "deliveryMethod")}`,
    `طريقة الدفع: ${value(payload, "paymentMethod")}`,
    `الإجمالي: ${value(payload, "total")} د.ب`,
  ].join("\n");
}

export async function POST(request: Request) {
  let payload: OrderPayload;
  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ message: "بيانات الطلب غير صالحة." }, { status: 400 });
  }

  const missing = requiredFields.filter((field) => !payload[field]);
  if (missing.length > 0) {
    return NextResponse.json({ message: "يرجى إكمال بيانات الطلب والعنوان." }, { status: 400 });
  }

  const product = products[payload.productId as keyof typeof products];
  if (!product) {
    return NextResponse.json({ message: "التصميم المختار غير متاح." }, { status: 400 });
  }

  const delivery = product.price >= 50 ? 0 : 2;
  payload = {
    ...payload,
    productName: product.name,
    subtotal: product.price,
    delivery,
    total: product.price + delivery,
  };

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_RECIPIENT_NUMBER;
  const graphVersion = process.env.WHATSAPP_GRAPH_API_VERSION;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "ar";
  const orderId = `RGL-${Date.now().toString().slice(-8)}`;

  if (!accessToken || !phoneNumberId || !recipient || !graphVersion || !templateName) {
    return NextResponse.json(
      {
        sent: false,
        orderId,
        code: "WHATSAPP_NOT_CONFIGURED",
        message: "خدمة WhatsApp Business غير مربوطة بعد.",
      },
      { status: 503 },
    );
  }

  const response = await fetch(
    `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", parameter_name: "order_details", text: createOrderMessage(payload, orderId) },
              ],
            },
          ],
        },
      }),
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { sent: false, orderId, message: "تعذّر إرسال الطلب إلى واتساب المتجر." },
      { status: 502 },
    );
  }

  return NextResponse.json({ sent: true, orderId });
}
