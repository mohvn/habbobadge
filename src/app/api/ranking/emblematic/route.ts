import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getHotelByID } from "@/lib/hotels";

export interface EmblematicEntry {
  rank: number;
  hotelId: string;
  userId: string;
  name: string;
  figureString: string;
  badgeCount: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hotel = searchParams.get("hotel");
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 1000, 1), 5000);

  if (!hotel) {
    return NextResponse.json({ error: "Missing hotel parameter" }, { status: 400 });
  }

  const hotelData = getHotelByID(hotel);
  if (!hotelData) {
    return NextResponse.json({ error: "Invalid hotel" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Ranking not available (Supabase not configured)" },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await supabase.rpc("get_emblematic_ranking", {
      p_hotel_id: hotel,
      p_limit: limit,
    });

    if (error) {
      console.error("get_emblematic_ranking error:", error);
      return NextResponse.json(
        { error: "Failed to fetch ranking" },
        { status: 500 }
      );
    }

    const items: EmblematicEntry[] = (data ?? []).map(
      (row: { rank: number; hotel_id: string; habbo_user_id: string; name: string; figure_string: string; badge_count: number }) => ({
        rank: Number(row.rank),
        hotelId: row.hotel_id,
        userId: row.habbo_user_id,
        name: row.name,
        figureString: row.figure_string,
        badgeCount: Number(row.badge_count),
      })
    );

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch ranking" },
      { status: 500 }
    );
  }
}
