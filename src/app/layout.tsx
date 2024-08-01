import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from '@/utils/tailwind.utils';
import React from 'react';
import JotaiProvider from '@/components/JotaiProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Random user generator",
  description: "Generate random user data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-slate-50")}>
        <JotaiProvider>
          {children}
        </JotaiProvider>
     </body>
    </html>
  );
}
