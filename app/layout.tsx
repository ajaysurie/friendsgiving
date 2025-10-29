import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Friends Giving 2025",
  description: "Share the feast, share the love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
