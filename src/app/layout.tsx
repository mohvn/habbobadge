import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Trophy } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HabboBadge - Explore Habbo Profiles & Badges",
  description:
    "Search and explore Habbo Hotel profiles, badges, friends, groups and rooms. View detailed information about any Habbo user.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider delayDuration={200}>
          <main className="relative flex min-h-screen flex-col">
            <Link
              href="/ranking"
              className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-border/50 bg-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Trophy className="h-4 w-4" />
              Ranking
            </Link>
            <div
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
              aria-hidden
            >
              <img
                src="/hotel2.png"
                alt=""
                width={1000}
                height={2000}
                className="h-full w-full object-contain object-left blur-xl grayscale opacity-30 left-2/3 top-50 absolute"
              />
            </div>
            {children}
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
