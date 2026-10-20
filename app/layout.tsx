import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { SITE } from "@/lib/site-content";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} min-h-screen bg-mwb-page font-sans text-mwb-text antialiased`}>
        {children}
      </body>
    </html>
  );
}
