import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Makeup Look Advisor",
  description: "A clickable makeup-look recommendation prototype.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
