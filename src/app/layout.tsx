import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import FirebaseScript from "@/components/FirebaseScript";

export const metadata: Metadata = {
  title: {
    default: "Virtuoso Academy — Excelencia en Educación Musical",
    template: "%s | Virtuoso Academy",
  },
  description: "Academia de música de clase mundial. Aprende piano, guitarra, canto, cello y más con instructores internacionales. Clases para todos los niveles.",
  keywords: ["academia de música", "clases de piano", "clases de guitarra", "educación musical", "virtuoso academy"],
  openGraph: {
    title: "Virtuoso Academy — Excelencia en Educación Musical",
    description: "Aprende música con instructores de clase mundial. Piano, guitarra, canto y más.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased h-full scroll-smooth"
    >
      <body className="min-h-full flex flex-col bg-[#F9F8F6] text-[#111111] selection:bg-[#9B804E]/30" suppressHydrationWarning>
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <WhatsAppButton />
          <FirebaseScript />
        </LanguageProvider>
      </body>
    </html>
  );
}

