import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Universal Status",
    default: "Universal Status"
  },
  description: "Set your status on many platforms at once.",
};

const arimo = Arimo({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${arimo.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
