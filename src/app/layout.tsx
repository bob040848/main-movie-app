import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Header from "@/components/common/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MovieHub ",
  description: "Browse and discover your next favorite movie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
