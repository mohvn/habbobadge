"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hotels } from "@/lib/hotels";
import { Search, Loader2 } from "lucide-react";

interface SearchFormProps {
  defaultHotel?: string;
  defaultName?: string;
  compact?: boolean;
}

export function SearchForm({ defaultHotel = "com.br", defaultName = "", compact = false }: SearchFormProps) {
  const router = useRouter();
  const [hotel, setHotel] = useState(defaultHotel);
  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    router.push(`/habbo/${hotel}/${encodeURIComponent(name.trim())}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Select value={hotel} onValueChange={setHotel}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hotels.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                <span className="mr-1">{h.flag}</span> {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Habbo name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 w-[180px]"
        />
        <Button type="submit" size="sm" disabled={loading || !name.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
      <div className="flex gap-3">
        <Select value={hotel} onValueChange={setHotel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select hotel" />
          </SelectTrigger>
          <SelectContent>
            {hotels.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                <span className="mr-2">{h.flag}</span> {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter Habbo name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading || !name.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search Habbo
          </>
        )}
      </Button>
    </form>
  );
}
