import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/general/footer";
import Navbar from "@/components/general/nav-bar";
import Providers from "@/providers/query-provider";
import AuthProvider from "@/providers/AuthProvider";
import ProtectedRoute from "@/providers/protectedRoute";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Top Tutor",
  description: "An engaging and intuitive way to learn online.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <ProtectedRoute>
            <Providers>
              {/* Navbar */}
              <Navbar />

              {/* Main content */}
              <main className="flex-1">{children}</main>

              {/* Footer */}
              <Footer />
            </Providers>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
