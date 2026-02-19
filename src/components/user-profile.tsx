"use client";

import { useEffect, useState, useCallback } from "react";
import { HabboProfile, HabboProfileResponse } from "@/lib/types";
import { Hotel } from "@/lib/types";
import { getAvatarUrl, getBadgeUrl } from "@/lib/hotels";
import { getUserProfile } from "@/lib/habbo-api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BadgesGrid } from "./badges-grid";
import { FriendsList } from "./friends-list";
import { GroupsList } from "./groups-list";
import { RoomsList } from "./rooms-list";
import {
  Calendar,
  Quote,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FlickeringGrid } from "./ui/flickering-grid";

interface UserProfileProps {
  hotel: Hotel;
  userId: string;
  userName: string;
  figureString: string;
}

export function UserProfile({ hotel, userId, userName, figureString }: UserProfileProps) {
  const [profile, setProfile] = useState<HabboProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile(hotel.id, userId);
      setProfile(data);
    } catch {
      setError("Failed to load profile. The profile might be private.");
    } finally {
      setLoading(false);
    }
  }, [hotel.id, userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div>
            <p className="font-medium">{error || "Failed to load profile"}</p>
            <p className="text-sm text-muted-foreground">
              This user may have a private profile.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const user = profile.user;
  const memberDate = new Date(user.memberSince);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="relative">
          <FlickeringGrid
            className="absolute inset-2 z-0 size-full w-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.1}
          />

          <CardContent className="relative p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative shrink-0">
                <img
                  src={getAvatarUrl(hotel, figureString, "l")}
                  alt={userName}
                  className="object-top image-rendering-pixelated"
                />
                {user.currentLevel > 0 && (
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground shadow-md">
                    <img src="/star.png" alt="" className="h-3 w-3 object-contain" />
                    {user.currentLevel}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 min-w-0">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                  {user.motto && (
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <Quote className="h-3 w-3 shrink-0" />
                      <p className="text-sm italic truncate">{user.motto}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Member since{" "}
                      {memberDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {user.starGemCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <img src="/star.png" alt="" className="h-3.5 w-3.5 object-contain" />
                      <span>{user.starGemCount} star gems</span>
                    </div>
                  )}
                </div>

                {user.selectedBadges && user.selectedBadges.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Wearing:</span>
                    <div className="flex gap-1">
                      {user.selectedBadges
                        .sort((a, b) => a.badgeIndex - b.badgeIndex)
                        .map((badge) => (
                          <Tooltip key={badge.code}>
                            <TooltipTrigger asChild>
                              <div className="rounded-md border border-border/50 bg-muted/50 p-1 hover:bg-accent transition-colors">
                                <img
                                  src={getBadgeUrl(badge.code)}
                                  alt={badge.name || badge.code}
                                  className="hobject-contain image-rendering-pixelated"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">{badge.name || badge.code}</p>
                              {badge.description && (
                                <p className="text-xs text-muted-foreground">{badge.description}</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-1 flex-wrap">
                  <Badge variant="secondary" className="gap-1.5">
                    <img src="https://images.habbo.com/c_images/album1584/PT327.png" alt="" className="h-3 w-3 object-contain" />
                    {profile.badges.length} emblemas
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <img src="https://images.habbo.com/c_images/album1584/VSP07.png" alt="" className="h-3 w-3 object-contain" />
                    {profile.friends.length} amigos
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <img src="https://images.habbo.com/c_images/album1584/DE16D.png" alt="" className="h-3 w-3 object-contain" />
                    {profile.groups.length} grupos
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5">
                    <img src="https://images.habbo.com/c_images/album1584/ITB60.png" alt="" className="h-3 w-3 object-contain" />
                    {profile.rooms.length} quartos
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <Separator />

      <Tabs defaultValue="badges" className="w-full">
        <TabsList variant="underline" className="grid w-full grid-cols-4">
          <TabsTrigger value="badges" className="gap-1.5">
            <span className="profile-button-icon flex h-4 w-4 shrink-0 items-center justify-center">
              <img src="https://images.habbo.com/c_images/album1584/PT327.png" alt="" className="h-4 w-4 object-contain grayscale" />
            </span>
            <span className="hidden sm:inline">Emblemas</span>
          </TabsTrigger>
          <TabsTrigger value="rooms" className="gap-1.5">
            <span className="profile-button-icon flex h-4 w-4 shrink-0 items-center justify-center">
              <img src="https://images.habbo.com/c_images/album1584/ITB60.png" alt="" className="h-4 w-4 object-contain grayscale" />
            </span>
            <span className="hidden sm:inline">Quartos</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-1.5">
            <span className="profile-button-icon flex h-4 w-4 shrink-0 items-center justify-center">
              <img src="https://images.habbo.com/c_images/album1584/DE16D.png" alt="" className="h-4 w-4 object-contain grayscale" />
            </span>
            <span className="hidden sm:inline">Grupos</span>
          </TabsTrigger>
          <TabsTrigger value="friends" className="gap-1.5">
            <span className="profile-button-icon flex h-4 w-4 shrink-0 items-center justify-center">
              <img src="https://images.habbo.com/c_images/album1584/VSP07.png" alt="" className="h-4 w-4 object-contain grayscale" />
            </span>
            <span className="hidden sm:inline">Amigos</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="badges" className="mt-4 data-[state=inactive]:hidden" >
          <BadgesGrid
            badges={profile.badges}
            newBadgeCodes={(profile as HabboProfileResponse).newBadgeCodes}
            badgeFirstSeen={(profile as HabboProfileResponse).badgeFirstSeen}
          />
        </TabsContent>
        <TabsContent value="friends" className="mt-4 data-[state=inactive]:hidden" >
          <FriendsList friends={profile.friends} hotel={hotel} />
        </TabsContent>
        <TabsContent value="groups" className="mt-4 data-[state=inactive]:hidden" >
          <GroupsList groups={profile.groups} hotel={hotel} />
        </TabsContent>
        <TabsContent value="rooms" className="mt-4 data-[state=inactive]:hidden" >
          <RoomsList rooms={profile.rooms} hotel={hotel} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Skeleton className="h-[130px] w-[80px] rounded-xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}
