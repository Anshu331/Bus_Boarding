import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bus Boarding Sequence Generator",
  description: "Generate optimal boarding sequence for bus passengers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

