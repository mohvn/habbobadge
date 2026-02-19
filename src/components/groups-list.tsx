"use client";

import { useState, useDeferredValue, useMemo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { HabboGroup } from "@/lib/types";
import { Hotel } from "@/lib/types";
import { getGroupBadgeUrl } from "@/lib/hotels";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Shield } from "lucide-react";

const ROW_HEIGHT = 80;
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

interface GroupsListProps {
  groups: HabboGroup[];
  hotel: Hotel;
}

export function GroupsList({ groups, hotel }: GroupsListProps) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const scrollRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount();

  const filtered = useMemo(
    () =>
      groups.filter(
        (g) =>
          g.name?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          g.description?.toLowerCase().includes(deferredSearch.toLowerCase())
      ),
    [groups, deferredSearch]
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
          {groups.length} groups
        </Badge>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          No groups found
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
              const rowGroups = filtered.slice(start, start + columns);
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
                  {rowGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-border/50 bg-transparent p-3 transition-all hover:border-primary/30"
                    >
                      {group.badgeCode ? (
                        <img
                          src={getGroupBadgeUrl(hotel, group.badgeCode)}
                          alt={group.name}
                          className="h-10 w-10 shrink-0 object-contain image-rendering-pixelated"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{group.name}</span>
                          {group.isAdmin && (
                            <Badge variant="outline" className="shrink-0 text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                        {group.description ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="truncate text-xs text-muted-foreground">
                                {group.description}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <p className="whitespace-pre-wrap break-words">{group.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : null}
                      </div>
                    </div>
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
