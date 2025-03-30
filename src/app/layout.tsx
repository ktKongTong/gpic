import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import {Toaster} from "sonner";
import {FileCtxProvider} from "@/hooks/use-file-upload";

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
    <ThemeProvider>
      <FileCtxProvider>
      <div className={'min-h-screen mx-auto bg-background'}>
        {children}
      </div>
      <Toaster />
      </FileCtxProvider>
    </ThemeProvider>
    </body>
    </html>
  );
}
