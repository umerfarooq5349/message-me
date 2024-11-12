import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/context/authprovider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import BikeAnimation from "@/components/bikeAnimiation";

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

export const metadata: Metadata = {
  title: "Be Anonymouse",
  description: "Welcome to a world where anonymity reigns.",
  applicationName: "Be Anonymouse",
  creator: "Umer Farooq",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Primary Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Umer Farooq" />

        {/* Open Graph / Social Media Preview */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Be Anonymous - Stay Hidden, Stay Secure"
        />
        <meta
          property="og:description"
          content="Welcome to a world where anonymity reigns."
        />
        <meta property="og:image" content="/static/Feedback.gif" />
        <meta
          property="og:image:alt"
          content="Animated hero of hidden identity"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen  bg-gradient-to-br from-[#1F4663] to-[#387478]">
          <AuthProvider>
            <Suspense
              fallback={
                <div className="w-full px-4 py-4 text-center flex flex-col justify-center items-center">
                  <BikeAnimation
                    text={"Loading"}
                    textColor="text-[#3B1E54]"
                    tireColor="#3B1E54"
                    pedalColor="#ecb365"
                    bodyColor="stroke-[#3B1E54]"
                  />
                </div>
              }
            >
              {children}
            </Suspense>
            <Toaster />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
