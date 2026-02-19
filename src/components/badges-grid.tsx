"use client";

import { useState, useDeferredValue, useMemo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { HabboBadge } from "@/lib/types";
import { getBadgeUrl } from "@/lib/hotels";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search } from "lucide-react";

const ROW_HEIGHT = 80;
const OVERSCAN = 2;

function useColumnCount(): number {
  const [cols, setCols] = useState(6);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      if (w >= 1024) setCols(12);
      else if (w >= 768) setCols(10);
      else if (w >= 640) setCols(8);
      else setCols(6);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function formatFirstSeen(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

interface BadgeCellProps {
  badge: HabboBadge;
  isNew: boolean;
  firstSeenFormatted: string | null;
}

const BadgeCell = ({ badge, isNew, firstSeenFormatted }: BadgeCellProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="relative flex items-center justify-center rounded-lg border border-border/50 bg-transparent p-3 transition-all hover:border-primary/50 hover:bg-accent hover:scale-110 cursor-default aspect-square">
        {isNew && (
          <span className="absolute -top-0.5 -right-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow">
            Novo
          </span>
        )}
        <img
          src={getBadgeUrl(badge.code)}
          alt={badge.name || badge.code}
          className="h-10 w-10 object-contain image-rendering-pixelated"
          loading="lazy"
        />
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="max-w-xs">
      <p className="font-semibold">{badge.name || badge.code}</p>
      {badge.description && (
        <p className="text-xs text-[#101010] mt-1">{badge.description}</p>
      )}
      <p className="text-xs text-[#6c6c6c] mt-1 font-mono">{badge.code}</p>
      {firstSeenFormatted && (
        <p className="text-xs text-[#6c6c6c] mt-0.5">
          Descoberto em {firstSeenFormatted}
        </p>
      )}
    </TooltipContent>
  </Tooltip>
);

interface BadgesGridProps {
  badges: HabboBadge[];
  newBadgeCodes?: string[];
  badgeFirstSeen?: Record<string, string>;
}

export function BadgesGrid({ badges, newBadgeCodes = [], badgeFirstSeen = {} }: BadgesGridProps) {
  const newSet = useMemo(
    () => new Set(newBadgeCodes),
    [newBadgeCodes]
  );
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const scrollRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount();

  const filtered = useMemo(
    () =>
      badges.filter(
        (b) =>
          b.name?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          b.code?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          b.description?.toLowerCase().includes(deferredSearch.toLowerCase())
      ),
    [badges, deferredSearch]
  );

  const rowCount = Math.ceil(filtered.length / columns) || 0;
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-sm">
          {badges.length} badges
        </Badge>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search badges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          No badges found
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="overflow-auto max-h-[60vh] rounded-lg border border-border/50"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualRows.map((virtualRow) => {
              const start = virtualRow.index * columns;
              const rowBadges = filtered.slice(start, start + columns);
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4 px-2 py-2"
                >
                  {rowBadges.map((badge) => {
                    const firstSeen = badgeFirstSeen[badge.code];
                    const firstSeenFormatted = firstSeen ? formatFirstSeen(firstSeen) : null;
                    return (
                      <BadgeCell
                        key={badge.code}
                        badge={badge}
                        isNew={newSet.has(badge.code)}
                        firstSeenFormatted={firstSeenFormatted}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
