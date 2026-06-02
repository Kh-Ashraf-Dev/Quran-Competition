import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المسابقة العالمية الثانية والثلاثون للقرآن الكريم 1447هـ",
  description: "استمارة ترشح للمسابقة العالمية الثانية والثلاثون للقرآن الكريم.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
