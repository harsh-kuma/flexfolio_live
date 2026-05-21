import { AuthProvider } from "@/components/providers/AuthProvider";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Flexfolio - Portfolio Builder",
  description:"Create stunning developer portfolios instantly with Flexfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextAuthProvider>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
