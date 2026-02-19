"use client";

import { useState, useDeferredValue, useMemo, useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { HabboRoom } from "@/lib/types";
import { Hotel } from "@/lib/types";
import { getRoomUrl, getRoomThumbnailUrls } from "@/lib/hotels";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const ICON_OWNER = "https://images.habbo.com/c_images/catalogue/icon_264.png";
const ICON_LIKES = "https://i.imgur.com/9h8L3Rt.png";
const ICON_CAPACITY = "https://i.imgur.com/zGiyf9i.png";
const ICON_ROOM_LINK = "https://images.habbo.com/c_images/catalogue/icon_55.png";

const ROW_HEIGHT = 88;
const OVERSCAN = 3;

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function useColumnCount(): number {
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const update = () => {
      setCols(typeof window !== "undefined" && window.innerWidth >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function RoomCard({ room, hotel }: { room: HabboRoom; hotel: Hotel }) {
  const thumbnailStyle = { backgroundImage: getRoomThumbnailUrls(hotel.id, room.id) };

  return (
    <div className="flex h-18 overflow-hidden rounded-lg border border-border/50 bg-transparent transition-all hover:border-primary/40 hover:bg-accent/30">
      <div className="relative h-full w-20 shrink-0 overflow-hidden bg-muted">
        {room.thumbnailUrl ? (
          <>
            <img
              src={room.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "block";
              }}
            />
            <div
              className="absolute inset-0 hidden h-full w-full bg-cover bg-center bg-no-repeat"
              style={thumbnailStyle}
            />
          </>
        ) : (
          <div className="h-full w-full bg-cover bg-center bg-no-repeat" style={thumbnailStyle} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-2">
        <p className="truncate text-sm font-semibold leading-tight text-foreground" title={room.name}>
          {room.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 truncate">
            <img src={ICON_OWNER} alt="Dono" className="h-3.5 w-3.5 object-contain" />
            <span className="truncate">{room.ownerName}</span>
          </span>
          <span className="flex items-center gap-1">
            <img src={ICON_LIKES} alt="Likes" className="h-3.5 w-3.5 object-contain" />
            {room.rating ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <img src={ICON_CAPACITY} alt="Capacidade" className="h-3.5 w-3.5 object-contain" />
            {room.maximumVisitors}
          </span>
          <a
            href={getRoomUrl(hotel, room.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={ICON_ROOM_LINK} alt="" className="h-3.5 w-3.5 object-contain" />
            Ver
          </a>
        </div>
      </div>
    </div>
  );
}

interface RoomsListProps {
  rooms: HabboRoom[];
  hotel: Hotel;
}

export function RoomsList({ rooms, hotel }: RoomsListProps) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const scrollRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount();

  const filtered = useMemo(
    () =>
      rooms.filter(
        (r) =>
          r.name?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          r.description?.toLowerCase().includes(deferredSearch.toLowerCase())
      ),
    [rooms, deferredSearch]
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
          {rooms.length} quartos
        </Badge>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar quartos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Nenhum quarto encontrado
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
              const rowRooms = filtered.slice(start, start + columns);
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
                  {rowRooms.map((room) => (
                    <RoomCard key={room.id} room={room} hotel={hotel} />
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
