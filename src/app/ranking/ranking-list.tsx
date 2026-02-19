"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getHotelByID } from "@/lib/hotels";
import type { EmblematicEntry } from "./types";
import { RankingRow, ROW_HEIGHT } from "./ranking-row";

const ROW_GAP = 8;
const OVERSCAN = 6;

interface RankingListProps {
  items: EmblematicEntry[];
  hotelId: string;
  skip?: number;
}

export function RankingList({ items, hotelId, skip = 0 }: RankingListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const listItems = skip > 0 ? items.slice(skip) : items;

  const virtualizer = useVirtualizer({
    count: listItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT + ROW_GAP,
    overscan: OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const hotel = getHotelByID(hotelId);

  return (
    <section
      ref={scrollRef}
      aria-labelledby="ranking-list-title"
      className="overflow-auto rounded-xl border border-border/60 bg-muted/20 max-h-[55vh] focus:outline-none"
      tabIndex={0}
    >
      <h2 id="ranking-list-title" className="sr-only">
        Lista do ranking
      </h2>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
        className="px-2 pt-2"
      >
        <ol
          className="relative"
          style={{ listStyle: "none" }}
          aria-label={`${listItems.length} usuários no ranking`}
        >
          {virtualItems.map((virtualRow) => {
            const entry = listItems[virtualRow.index];
            if (!entry || !hotel) return null;
            return (
              <RankingRow
                key={entry.userId}
                entry={entry}
                hotel={hotel}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </ol>
      </div>
    </section>
  );
}
