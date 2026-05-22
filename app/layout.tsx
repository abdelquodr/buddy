import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Register | Buddy",
  description: "Create a new account",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={mulish.variable}>
      <body
        className={`min-h-screen bg-[#f7f8fc] ${mulish.className} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
