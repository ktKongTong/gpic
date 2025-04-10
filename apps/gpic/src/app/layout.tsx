
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import Providers from "@/components/providers";
import React from "react";

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
      <div className={'mx-auto bg-ghibli-background'}>
        <div className="h-full min-h-screen flex flex-col w-full max-w-4xl mx-auto grow">
          {children}
        </div>
      </div>
      <Toaster />
    </Providers>

    </body>
    </html>
  );
}
