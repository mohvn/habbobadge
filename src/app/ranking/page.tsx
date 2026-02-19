"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { hotels } from "@/lib/hotels";
import { useEmblematicRanking } from "./use-emblematic-ranking";
import { RankingGrid } from "./ranking-grid";
import { RankingSkeleton } from "./ranking-skeleton";

export { type EmblematicEntry } from "./types";

export default function RankingPage() {
  const [hotelId, setHotelId] = useState("com.br");
  const { items, loading, error } = useEmblematicRanking(hotelId);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="container mx-auto flex min-h-0 flex-1 flex-col max-w-2xl px-4 py-8 sm:py-10">
        <nav className="mb-6" aria-label="Navegação">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar ao início
          </Link>
        </nav>

        <Card className="overflow-hidden border border-border/50 shadow-lg sm:shadow-xl bg-card backdrop-blur-sm">
          <CardHeader className="space-y-5 p-5 sm:p-6 pb-4">
            <div className="flex flex-col gap-1">
              <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary"
                  aria-hidden
                >
                  <Trophy className="h-7 w-7" />
                </span>
                Ranking emblemático
              </h1>
              <CardDescription className="text-base text-muted-foreground">
                Usuários com mais emblemas descobertos no site neste hotel.
              </CardDescription>
            </div>
            <Select value={hotelId} onValueChange={setHotelId}>
              <SelectTrigger
                id="ranking-hotel"
                className="w-full h-11 border-border/80 bg-background/80"
                aria-label="Selecione o hotel para ver o ranking"
              >
                <SelectValue placeholder="Hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    <span className="mr-1" aria-hidden>
                      {h.flag}
                    </span>{" "}
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent className="px-5 sm:px-6 pt-0 pb-6 space-y-6">
            {loading && <RankingSkeleton />}

            {!loading && error && (
              <div
                role="alert"
                className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-8 text-center text-destructive"
              >
                <p className="font-medium">{error}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tente trocar o hotel ou recarregar a página.
                </p>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center">
                <Award className="mx-auto h-12 w-12 text-muted-foreground/60" aria-hidden />
                <p className="mt-3 font-medium text-foreground">Nenhum dado ainda</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Busque perfis no hotel para popular o ranking.
                </p>
                <Link href="/" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Buscar perfis
                  </Button>
                </Link>
              </div>
            )}

            {!loading && !error && items.length > 0 && (
              <RankingGrid items={items} hotelId={hotelId} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
