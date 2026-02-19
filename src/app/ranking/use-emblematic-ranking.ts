"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import type { EmblematicEntry } from "./types";

const RANKING_LIMIT = 1000;

export function useEmblematicRanking(hotelId: string) {
  const [items, setItems] = useState<EmblematicEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    axios
      .get<{ items: EmblematicEntry[] }>("/api/ranking/emblematic", {
        params: { hotel: hotelId, limit: RANKING_LIMIT },
      })
      .then((res) => {
        if (!cancelled) setItems(res.data.items ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Falha ao carregar ranking.");
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  return { items, loading, error };
}
