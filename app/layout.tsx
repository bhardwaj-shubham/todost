import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const defaultFont = Noto_Sans_Georgian({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todost",
  description: "Todost AI Task Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={defaultFont.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
