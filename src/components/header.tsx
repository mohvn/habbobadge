"use client";

import Link from "next/link";
import { Search, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Search className="h-4 w-4" />
          </div>
          <span>HabboBadge</span>
        </Link>
        <Link href="/ranking">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Trophy className="h-4 w-4" />
            Ranking
          </Button>
        </Link>
      </div>
    </header>
  );
}
