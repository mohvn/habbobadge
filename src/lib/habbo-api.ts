import axios from "axios";
import { HabboUser, HabboProfileResponse, HabboBadge, HabboFriend, HabboGroup, HabboRoom } from "./types";

const api = axios.create({
  baseURL: "/api/habbo",
  timeout: 15000,
});

export async function searchUser(hotel: string, name: string): Promise<HabboUser> {
  const { data } = await api.get<HabboUser>("/user", {
    params: { hotel, name },
  });
  return data;
}

export async function getUserProfile(hotel: string, userId: string): Promise<HabboProfileResponse> {
  const { data } = await api.get<HabboProfileResponse>(`/profile`, {
    params: { hotel, id: userId },
  });
  return data;
}

export async function getUserBadges(hotel: string, userId: string): Promise<HabboBadge[]> {
  const { data } = await api.get<HabboBadge[]>(`/badges`, {
    params: { hotel, id: userId },
  });
  return data;
}

export async function getUserFriends(hotel: string, userId: string): Promise<HabboFriend[]> {
  const { data } = await api.get<HabboFriend[]>(`/friends`, {
    params: { hotel, id: userId },
  });
  return data;
}

export async function getUserGroups(hotel: string, userId: string): Promise<HabboGroup[]> {
  const { data } = await api.get<HabboGroup[]>(`/groups`, {
    params: { hotel, id: userId },
  });
  return data;
}

export async function getUserRooms(hotel: string, userId: string): Promise<HabboRoom[]> {
  const { data } = await api.get<HabboRoom[]>(`/rooms`, {
    params: { hotel, id: userId },
  });
  return data;
}
