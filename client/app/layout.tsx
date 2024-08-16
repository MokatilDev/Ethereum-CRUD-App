import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ethereum CRUD App",
  description: "Ethereum CRUD App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // if you want use the light mode change className from dark to light
    <html lang="en" className="dark"> 
      <body className={inter.className}>{children}</body> 
    </html>
  );
}
