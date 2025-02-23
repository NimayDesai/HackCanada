"use client";

import { useState } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import { ApolloWrapper } from "./ApolloWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            <Header onMenuClick={handleMenuClick} />
            <div className="flex flex-1">
              <Sidebar open={sidebarOpen} />
              <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300 pt-16">
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: { color: "white", background: "black" },
                  }}
                />
                {children}
              </main>
            </div>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
