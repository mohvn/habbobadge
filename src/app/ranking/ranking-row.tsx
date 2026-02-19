"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getHotelByID, getAvatarUrl } from "@/lib/hotels";
import type { Hotel } from "@/lib/types";
import type { EmblematicEntry } from "./types";
import { RankMedal } from "./rank-medal";
import { cn } from "@/lib/utils";

const ROW_HEIGHT = 72;

export { ROW_HEIGHT };

interface RankingRowProps {
  entry: EmblematicEntry;
  hotel: Hotel | undefined;
  style?: React.CSSProperties;
  variant?: "default" | "podium";
}

export function RankingRow({ entry, hotel, style, variant = "default" }: RankingRowProps) {
  const avatarUrl = hotel ? getAvatarUrl(hotel, entry.figureString, variant === "podium" ? "l" : "m") : "";
  const isTopThree = entry.rank <= 3;
  const href = `/habbo/${entry.hotelId}/${encodeURIComponent(entry.name)}`;

  return (
    <li
      style={style}
      className="absolute left-0 top-0 w-full list-none"
      aria-label={`Posição ${entry.rank}: ${entry.name}, ${entry.badgeCount} emblemas`}
    >
      <Link
        href={href}
        className={cn(
          "flex items-center gap-4 rounded-xl border border-transparent bg-transparent px-4 py-3 transition-colors hover:border-border hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          variant === "podium" && "gap-5 py-4"
        )}
        style={{ minHeight: variant === "podium" ? 88 : ROW_HEIGHT - 8 }}
      >
        <span
          className={cn(
            "flex w-10 shrink-0 items-center justify-center font-mono text-sm font-bold tabular-nums",
            isTopThree ? "text-base" : "text-muted-foreground",
            variant === "podium" && "w-12"
          )}
        >
          {isTopThree ? (
            <>
              <RankMedal rank={entry.rank} />
              <span className="sr-only">#{entry.rank}</span>
            </>
          ) : (
            `#${entry.rank}`
          )}
        </span>
          <span
            className={cn(
              "flex shrink-0 overflow-hidden rounded-full ring-2 ring-border bg-muted",
              variant === "podium" ? "h-14 w-14" : "h-11 w-11"
            )}
          >
            <img
            src={avatarUrl}
            alt=""
            className="h-full w-full object-cover object-top image-rendering-pixelated"
            loading="lazy"
          />
        </span>
        <span className="min-w-0 flex-1 truncate font-medium text-foreground">
          {entry.name}
        </span>
        <Badge
          variant="secondary"
          className="shrink-0 gap-1 font-mono tabular-nums"
          aria-label={`${entry.badgeCount} emblemas`}
        >
          <Award className="h-3.5 w-3.5" aria-hidden />
          {entry.badgeCount}
        </Badge>
      </Link>
    </li>
  );
}
