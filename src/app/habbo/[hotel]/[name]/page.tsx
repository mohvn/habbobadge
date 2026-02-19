"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { searchUser } from "@/lib/habbo-api";
import { getHotelByID } from "@/lib/hotels";
import { HabboUser, Hotel } from "@/lib/types";
import { UserProfile } from "@/components/user-profile";
import { SearchForm } from "@/components/search-form";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HabboProfilePage() {
  const params = useParams<{ hotel: string; name: string }>();
  const hotelId = params.hotel;
  const name = decodeURIComponent(params.name);

  const [user, setUser] = useState<HabboUser | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const hotelData = getHotelByID(hotelId);
    if (!hotelData) {
      setError("Invalid hotel selected.");
      setLoading(false);
      return;
    }
    setHotel(hotelData);

    try {
      setLoading(true);
      setError(null);
      const userData = await searchUser(hotelId, name);
      setUser(userData);
    } catch {
      setError(`User "${name}" not found on ${hotelData.name}.`);
    } finally {
      setLoading(false);
    }
  }, [hotelId, name]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col max-w-5xl px-4 py-6 space-y-6">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <SearchForm compact defaultHotel={hotelId} defaultName={name} />
      </div>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Skeleton className="h-32.5 w-20 rounded-xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div>
              <p className="font-medium text-lg">{error}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Check the spelling or try a different hotel.
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Search</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {user && hotel && (
        <UserProfile
          hotel={hotel}
          userId={user.uniqueId}
          userName={user.name}
          figureString={user.figureString}
        />
      )}
    </div>
  );
}
