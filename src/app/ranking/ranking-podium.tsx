"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getHotelByID, getAvatarUrl } from "@/lib/hotels";
import type { EmblematicEntry } from "./types";
import { RankMedal } from "./rank-medal";
import { cn } from "@/lib/utils";

const PODIUM_ORDER: [number, number, number] = [1, 0, 2];

interface RankingPodiumProps {
  topThree: [EmblematicEntry, EmblematicEntry, EmblematicEntry];
  hotelId: string;
}

export function RankingPodium({ topThree, hotelId }: RankingPodiumProps) {
  const hotel = getHotelByID(hotelId);
  const ordered = PODIUM_ORDER.map((i) => topThree[i]);

  return (
    <div
      className="grid grid-cols-3 gap-3"
      aria-label="Top 3 do ranking"
    >
      {ordered.map((entry) => {
        const href = `/habbo/${entry.hotelId}/${encodeURIComponent(entry.name)}`;
        const avatarUrl = hotel ? getAvatarUrl(hotel, entry.figureString, "l") : "";
        const isFirst = entry.rank === 1;

        return (
          <Link
            key={entry.userId}
            href={href}
            className={cn(
              "flex flex-col items-center rounded-2xl border bg-card p-5 transition-all hover:border-primary/40 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isFirst && "border-primary/40 bg-primary/5 ring-1 ring-primary/20 scale-[1.02]"
            )}
            aria-label={`Posição ${entry.rank}: ${entry.name}, ${entry.badgeCount} emblemas`}
          >
            <span className="mb-2 flex h-8 w-8 items-center justify-center">
              <RankMedal rank={entry.rank} />
            </span>
            <span className="mb-3 flex h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-border bg-muted">
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover object-top image-rendering-pixelated"
                loading="eager"
              />
            </span>
            <span className="mb-2 max-w-full truncate text-center font-semibold text-foreground">
              {entry.name}
            </span>
            <Badge variant="secondary" className="gap-1 font-mono tabular-nums">
              <Award className="h-3.5 w-3.5" aria-hidden />
              {entry.badgeCount}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
