import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RIGEL | مصمّمة لتلفت بهدوء",
  description: "عبايات بحرينية تُفصّل لكِ بالمقاس والطول والقماش والتفاصيل التي تختارينها.",
  icons: { icon: "/rigel-logo.jpg", shortcut: "/rigel-logo.jpg" },
  openGraph: {
    title: "RIGEL | مصمّمة لتلفت بهدوء",
    description: "عبايات بحرينية بتفاصيل مخصّصة مستوحاة من ضوء النجم RIGEL.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Rigel Abaya House" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RIGEL | مصمّمة لتلفت بهدوء",
    description: "عبايات بحرينية بتفاصيل مخصّصة مستوحاة من ضوء النجم RIGEL.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
