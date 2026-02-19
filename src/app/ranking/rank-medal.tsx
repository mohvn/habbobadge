import { Medal } from "lucide-react";

export function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <Medal className="h-6 w-6 text-amber-400" aria-hidden />;
  if (rank === 2) return <Medal className="h-6 w-6 text-slate-300" aria-hidden />;
  if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" aria-hidden />;
  return null;
}
