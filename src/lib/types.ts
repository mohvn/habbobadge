export interface HabboUser {
  uniqueId: string;
  name: string;
  figureString: string;
  motto: string;
  memberSince: string;
  profileVisible: boolean;
  selectedBadges: HabboBadge[];
  currentLevel: number;
  currentLevelCompletePercent: number;
  totalExperience: number;
  starGemCount: number;
}

export interface HabboBadge {
  badgeIndex: number;
  code: string;
  name: string;
  description: string;
}

export interface HabboFriend {
  uniqueId: string;
  name: string;
  motto: string;
  figureString: string;
  online: boolean;
}

export interface HabboGroup {
  id: string;
  name: string;
  description: string;
  type: string;
  roomId: string;
  badgeCode: string;
  primaryColour: string;
  secondaryColour: string;
  isAdmin: boolean;
}

export interface HabboRoom {
  id: number;
  name: string;
  description: string;
  ownerName: string;
  ownerUniqueId: string;
  tags: string[];
  categories: string[];
  maximumVisitors: number;
  showOwnerName: boolean;
  rating: number;
  uniqueId: string;
  thumbnailUrl: string;
  imageUrl: string;
  creationTime: string;
  habboGroupId?: string;
}

export interface HabboProfile {
  user: HabboUser;
  friends: HabboFriend[];
  groups: HabboGroup[];
  rooms: HabboRoom[];
  badges: HabboBadge[];
}

export interface HabboProfileResponse extends HabboProfile {
  newBadgeCodes?: string[];
  badgeFirstSeen?: Record<string, string>;
}

export interface Hotel {
  id: string;
  name: string;
  domain: string;
  flag: string;
}
