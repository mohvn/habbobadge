"use client";

import { useState, useDeferredValue, useMemo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { HabboFriend } from "@/lib/types";
import { getAvatarHeadUrl } from "@/lib/hotels";
import { Hotel } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const ROW_HEIGHT = 100;
const OVERSCAN = 2;

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function useColumnCount(): number {
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const update = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      if (w >= 1024) setCols(3);
      else if (w >= 640) setCols(2);
      else setCols(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

interface FriendsListProps {
  friends: HabboFriend[];
  hotel: Hotel;
}

export function FriendsList({ friends, hotel }: FriendsListProps) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const scrollRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount();

  const filtered = useMemo(
    () =>
      friends.filter((f) =>
        f.name?.toLowerCase().includes(deferredSearch.toLowerCase())
      ),
    [friends, deferredSearch]
  );

  const sorted = useMemo(
    () => [...filtered.filter((f) => f.online), ...filtered.filter((f) => !f.online)],
    [filtered]
  );

  const rowCount = Math.ceil(sorted.length / columns) || 0;
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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {friends.length} friends
          </Badge>
          <Badge variant="outline" className="text-sm text-green-500 border-green-500/30">
            {friends.filter((f) => f.online).length} online
          </Badge>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>
      {sorted.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          No friends found
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
              const rowFriends = sorted.slice(start, start + columns);
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
                  className={`grid gap-4 px-2 py-2 ${GRID_COLS[columns]}`}
                >
                  {rowFriends.map((friend) => (
                    <Link
                      key={friend.uniqueId}
                      href={`/habbo/${hotel.id}/${encodeURIComponent(friend.name)}`}
                      className="flex min-w-0 items-center gap-3 rounded-lg border border-border/50 bg-transparent p-3 transition-all hover:border-primary/30"
                    >
                      <img
                        src={getAvatarHeadUrl(hotel, friend.name, "b")}
                        alt={friend.name}
                        className="shrink-0 rounded-full object-cover image-rendering-pixelated"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{friend.name}</span>
                          <img
                            src={friend.online ? "/online.png" : "/offline.png"}
                            alt={friend.online ? "Online" : "Offline"}
                            className="w-auto shrink-0 object-contain"
                          />
                        </div>
                        {friend.motto && (
                          <p className="truncate text-xs text-muted-foreground">{friend.motto}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
