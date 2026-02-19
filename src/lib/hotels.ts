import { Hotel } from "./types";

export const hotels: Hotel[] = [
  { id: "com", name: "Habbo.com", domain: "www.habbo.com", flag: "🇺🇸" },
  { id: "com.br", name: "Habbo.com.br", domain: "www.habbo.com.br", flag: "🇧🇷" },
  { id: "de", name: "Habbo.de", domain: "www.habbo.de", flag: "🇩🇪" },
  { id: "es", name: "Habbo.es", domain: "www.habbo.es", flag: "🇪🇸" },
  { id: "fi", name: "Habbo.fi", domain: "www.habbo.fi", flag: "🇫🇮" },
  { id: "fr", name: "Habbo.fr", domain: "www.habbo.fr", flag: "🇫🇷" },
  { id: "it", name: "Habbo.it", domain: "www.habbo.it", flag: "🇮🇹" },
  { id: "nl", name: "Habbo.nl", domain: "www.habbo.nl", flag: "🇳🇱" },
  { id: "com.tr", name: "Habbo.com.tr", domain: "www.habbo.com.tr", flag: "🇹🇷" },
];

export function getHotelByID(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

export function getBaseUrl(hotel: Hotel): string {
  return `https://${hotel.domain}`;
}

export function getRoomUrl(hotel: Hotel, roomId: number): string {
  return `https://${hotel.domain}/room/${roomId}`;
}

const HOTEL_S3_CODES: Record<string, string> = {
  "com": "hhus",
  "com.br": "hhbr",
  "de": "hhde",
  "es": "hhes",
  "fi": "hhfi",
  "fr": "hhfr",
  "it": "hhit",
  "nl": "hhnl",
  "com.tr": "hhtr",
};

const ROOM_THUMBNAIL_FALLBACK = "https://i.imgur.com/N3coP8Z.png";

export function getRoomThumbnailUrls(hotelId: string, roomId: number): string {
  const code = HOTEL_S3_CODES[hotelId] ?? "hhus";
  const s3Url = `https://habbo-stories-content.s3.amazonaws.com/navigator-thumbnail/${code}/${roomId}.png`;
  return `url('${s3Url}'), url('${ROOM_THUMBNAIL_FALLBACK}')`;
}

export function getAvatarUrl(hotel: Hotel, figureString: string, size: "s" | "m" | "l" = "l", direction: number = 2): string {
  return `https://${hotel.domain}/habbo-imaging/avatarimage?size=${size}&figure=${figureString}&direction=${direction}&head_direction=${direction}`;
}

export function getAvatarHeadUrl(hotel: Hotel, userName: string, size: "s" | "b" = "b"): string {
  const user = encodeURIComponent(userName);
  return `https://${hotel.domain}/habbo-imaging/avatarimage?hb=img&user=${user}&size=${size}&headonly=1`;
}

export function getBadgeUrl(badgeCode: string): string {
  return `https://images.habbo.com/c_images/album1584/${badgeCode}.gif`;
}

export function getGroupBadgeUrl(hotel: Hotel, badgeCode: string): string {
  return `https://${hotel.domain}/habbo-imaging/badge/${badgeCode}.png`;
}
