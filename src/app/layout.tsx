import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMX Content Training Assistant",
  description: "Internal training assistant for learning LMX Content CMS"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
