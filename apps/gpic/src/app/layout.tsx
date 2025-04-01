
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gpic",
  description: "generate stylish image with GPT-4o",
};

export default function RootLayout(
{
  children,
}: {
  children: React.ReactNode;
}
) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <Providers>
      <div className={'min-h-screen mx-auto bg-background'}>
        {children}
      </div>
      <Toaster />
    </Providers>

    </body>
    </html>
  );
}
