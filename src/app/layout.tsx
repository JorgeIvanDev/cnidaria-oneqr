import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cnidaria · One-QR Donate",
  description: "Single QR that routes to the right wallet per chain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}