"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getHotelByID, getAvatarUrl } from "@/lib/hotels";
import type { Hotel } from "@/lib/types";
import type { EmblematicEntry } from "./types";
import { cn } from "@/lib/utils";

interface RankingCardProps {
  entry: EmblematicEntry;
  hotel: Hotel | undefined;
}

function formatBadgeCount(n: number): string {
  return n.toLocaleString("pt-BR");
}

function getPositionClasses(rank: number): string {
  if (rank === 1) return "bg-amber-400/90 text-amber-950 border-amber-500/50 shadow-sm";
  if (rank === 2) return "bg-slate-300/90 text-slate-800 border-slate-400/50";
  if (rank === 3) return "bg-amber-600/90 text-amber-50 border-amber-700/50";
  return "bg-muted text-muted-foreground border-border";
}

export function RankingCard({ entry, hotel }: RankingCardProps) {
  const avatarUrl = hotel ? getAvatarUrl(hotel, entry.figureString, "l") : "";
  const href = `/habbo/${entry.hotelId}/${encodeURIComponent(entry.name)}`;
  const isTopThree = entry.rank <= 3;

  return (
    <article
      className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-border hover:bg-accent/30 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
      aria-label={`Posição ${entry.rank}: ${entry.name}, ${entry.badgeCount} emblemas`}
    >
      <Link href={href} className="flex flex-col flex-1 focus:outline-none">
        <div className="relative flex justify-center bg-muted/50 pt-4 pb-2">
          <span
            className={cn(
              "absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-sm font-bold tabular-nums",
              isTopThree ? getPositionClasses(entry.rank) : "bg-muted text-muted-foreground border-border"
            )}
          >
            {entry.rank}
          </span>
          <img
            src={avatarUrl}
            alt=""
            width={64}
            height={110}
            className="block h-27.5 w-auto object-contain object-top image-rendering-pixelated"
            loading="lazy"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <h2 className="text-center font-semibold text-foreground truncate" title={entry.name}>
            {entry.name}
          </h2>
          <div className="text-center font-mono text-sm tabular-nums text-muted-foreground">
            {formatBadgeCount(entry.badgeCount)} emblemas
          </div>
          <span className="mt-auto inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors group-hover:bg-accent group-hover:border-border">
            Perfil
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
