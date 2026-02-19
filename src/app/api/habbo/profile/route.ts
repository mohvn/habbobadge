import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getHotelByID, getBaseUrl } from "@/lib/hotels";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hotel = searchParams.get("hotel");
  const id = searchParams.get("id");

  if (!hotel || !id) {
    return NextResponse.json({ error: "Missing hotel or id parameter" }, { status: 400 });
  }

  const hotelData = getHotelByID(hotel);
  if (!hotelData) {
    return NextResponse.json({ error: "Invalid hotel" }, { status: 400 });
  }

  try {
    const baseUrl = getBaseUrl(hotelData);
    const { data } = await axios.get(`${baseUrl}/api/public/users/${id}/profile`, {
      timeout: 10000,
    });

    const supabase = getSupabaseAdmin();
    let badges = data.badges ?? [];
    let newBadgeCodes: string[] = [];

    if (supabase) {
      const now = new Date().toISOString();
      const user = data.user as { uniqueId?: string; name?: string; figureString?: string } | undefined;
      if (user?.uniqueId != null) {
        await supabase.from("habbo_users").upsert(
          {
            hotel_id: hotel,
            habbo_user_id: user.uniqueId,
            name: user.name ?? "?",
            figure_string: user.figureString ?? "",
            last_seen_at: now,
          },
          { onConflict: "hotel_id,habbo_user_id" }
        );
      }
    }

    if (supabase && Array.isArray(badges) && badges.length > 0) {
      const now = new Date().toISOString();
      const badgeByCode = new Map(badges.map((b: { code: string }) => [b.code, b]));
      const currentCodes = badges.map((b: { code: string }) => b.code);

      const { data: existing } = await supabase
        .from("habbo_user_badges")
        .select("badge_code")
        .eq("hotel_id", hotel)
        .eq("habbo_user_id", id);

      const existingSet = new Set((existing ?? []).map((r: { badge_code: string }) => r.badge_code));
      newBadgeCodes = currentCodes.filter((c: string) => !existingSet.has(c));

      if (newBadgeCodes.length > 0) {
        const newRows = badges
          .filter((b: { code: string }) => newBadgeCodes.includes(b.code))
          .map((b: { code: string }, idx: number) => ({
            hotel_id: hotel,
            habbo_user_id: id,
            badge_code: b.code,
            first_seen_at: now,
            first_seen_position: currentCodes.indexOf(b.code),
            last_seen_at: now,
          }));
        await supabase.from("habbo_user_badges").insert(newRows);
      }

      if (currentCodes.length > 0) {
        await supabase
          .from("habbo_user_badges")
          .update({ last_seen_at: now })
          .eq("hotel_id", hotel)
          .eq("habbo_user_id", id)
          .in("badge_code", currentCodes);
      }

      const { data: orderedRows } = await supabase
        .from("habbo_user_badges")
        .select("badge_code, first_seen_at")
        .eq("hotel_id", hotel)
        .eq("habbo_user_id", id)
        .order("first_seen_at", { ascending: false })
        .order("first_seen_position", { ascending: true });

      const orderedRowsList = orderedRows ?? [];
      const orderedCodes = orderedRowsList.map((r: { badge_code: string }) => r.badge_code);
      const badgeFirstSeen: Record<string, string> = {};
      for (const r of orderedRowsList as { badge_code: string; first_seen_at: string }[]) {
        badgeFirstSeen[r.badge_code] = r.first_seen_at;
      }
      const orderedBadges = orderedCodes
        .map((code: string) => badgeByCode.get(code))
        .filter(Boolean);
      const appended = badges.filter(
        (b: { code: string }) => !orderedCodes.includes(b.code)
      );
      badges = [...orderedBadges, ...appended];

      return NextResponse.json({
        ...data,
        badges,
        newBadgeCodes,
        badgeFirstSeen,
      });
    }

    return NextResponse.json({
      ...data,
      badges,
      newBadgeCodes,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }
}
