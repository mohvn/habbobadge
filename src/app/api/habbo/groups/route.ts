import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getHotelByID, getBaseUrl } from "@/lib/hotels";

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
    const { data } = await axios.get(`${baseUrl}/api/public/users/${id}/groups`, {
      timeout: 10000,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ error: "Groups not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}
