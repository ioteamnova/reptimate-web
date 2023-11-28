"use client";

import Header from "@/components/Header";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Footer from "@/components/Footer";

import ReactQuery from "@/components/ReactQuery";
import Recoil from "@/components/Recoil";
import { Mobile, PC } from "@/components/ResponsiveLayout";

const sans = Open_Sans({ subsets: ["latin"] });

declare global {
  // Kakao 함수를 전역에서 사용할 수 있도록 선언
  interface Window {
    Kakao: any;
  }
}

export const metadata: Metadata = {
  title: "REPTIMATE",
  description: "파충류 분양 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body className="flex flex-col w-full mx-auto">
        <Recoil>
          <ReactQuery>
            <Header />
            <PC>
              <main className="grow white w-full mx-auto max-w-screen-xl mt-20">
                {children}
              </main>
            </PC>
            <Mobile>
              <main className="grow white w-full mx-auto max-w-screen-xl">
                {children}
              </main>
            </Mobile>
            <Footer />
          </ReactQuery>
        </Recoil>
      </body>
    </html>
  );
}
