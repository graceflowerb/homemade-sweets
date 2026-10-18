// app/layout.tsx
import type { Metadata } from "next";
import {
  DM_Sans,
  Mulish,
  Noto_Sans_Arabic,
  Radio_Canada,
  Source_Serif_4,
  Vollkorn,
} from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import CartDrawer from "@/components/CartDrawer";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/shop/Navbar";

// 1. Configure all fonts with CSS variables and subsets
const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mulish",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"], // Includes Arabic script support
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-arabic",
  display: "swap",
});

const radioCanada = Radio_Canada({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-radio-canada",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-serif-4",
  display: "swap",
});

const vollkorn = Vollkorn({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vollkorn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sweet Bites | Artisan Sweets & Treats",
  description: "Homemade artisan cookies, brownies, and sweets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* 2. Attach all font variables to the html tag */}
      <html
        lang="en"
        className={`${dmSans.variable} ${mulish.variable} ${notoSansArabic.variable} ${radioCanada.variable} ${sourceSerif4.variable} ${vollkorn.variable}`}
      >
        {/* 3. Apply the default font (DM Sans) to the body */}
        <body className={`${dmSans.className} antialiased`}>
          <Providers>
            <Navbar />
            <main>{children}</main>
            <CartDrawer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
