import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMX Content Support Assistant",
  description: "Internal Level 1 support assistant for LMX Content CMS"
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
