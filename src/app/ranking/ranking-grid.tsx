"use client";

import { getHotelByID } from "@/lib/hotels";
import type { EmblematicEntry } from "./types";
import { RankingCard } from "./ranking-card";

interface RankingGridProps {
  items: EmblematicEntry[];
  hotelId: string;
}

export function RankingGrid({ items, hotelId }: RankingGridProps) {
  const hotel = getHotelByID(hotelId);

  return (
    <section
      aria-labelledby="ranking-grid-title"
      className="overflow-auto max-h-[65vh] focus:outline-none"
    >
      <h2 id="ranking-grid-title" className="sr-only">
        Ranking em cards
      </h2>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4"
        role="list"
        aria-label={`${items.length} usuários no ranking`}
      >
        {items.map((entry) => (
          <div key={entry.userId} role="listitem">
            <RankingCard entry={entry} hotel={hotel} />
          </div>
        ))}
      </div>
    </section>
  );
}
