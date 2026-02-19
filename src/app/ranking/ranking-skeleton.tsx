import { Skeleton } from "@/components/ui/skeleton";

export function RankingSkeleton() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      role="status"
      aria-live="polite"
      aria-label="Carregando ranking"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="relative flex justify-center bg-muted/30 pt-4 pb-2">
            <Skeleton className="absolute left-3 top-3 h-8 w-8 rounded-lg" />
            <Skeleton className="h-27.5 w-16" />
          </div>
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-5 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-10 w-full rounded-lg mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
