
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import Providers from "@/components/providers";
import React from "react";
import Header from "./header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
// Pacifico
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
    modal,
  }: {
    children: React.ReactNode;
    modal: React.ReactNode;
  }
) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-ghibli-background`}
    >
    <Providers>
      <div className={'mx-auto h-full min-h-screen flex flex-col w-full items-center backdrop-blur-xl relative'}>
        <div className={'w-full h-full absolute blur-sm -z-10'}>
        </div>
        <Header/>
        <div className=" grow w-full h-full mx-auto  max-w-4xl z-10">
          {children}
        </div>
      </div>
      {modal}
      <Toaster />
    </Providers>

    </body>
    </html>
  );
}
