import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "DevSearch — Search everywhere, type once",
  description:
    "A unified developer search hub. Type your query once and search across YouTube, GitHub, Stack Overflow, MDN, and more.",
  verification: {
    google: "uD7GUaij55aU_Ls-nhD9swWtLt-aKv3cQ-g-97_3jkg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
