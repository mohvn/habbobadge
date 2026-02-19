import { SearchForm } from "@/components/search-form";
import { Award, Users, Shield, DoorOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col items-center justify-center px-4 overflow-hidden">
      <div className="relative z-10 w-full max-w-lg space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Habbo<span className="text-primary/70">Badge</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore Habbo profiles, badges, friends and more.
          </p>
        </div>

        <SearchForm />

        <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
          <FeatureCard icon={Award} label="Badges" />
          <FeatureCard icon={Users} label="Friends" />
          <FeatureCard icon={Shield} label="Groups" />
          <FeatureCard icon={DoorOpen} label="Rooms" />
        </div>

        <p className="text-xs text-muted-foreground/50 pt-8">
          HabboBadge is not affiliated with, endorsed by, or connected to Sulake Corporation Oy.
          <br />
          All data is fetched from the official Habbo public API.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-transparent p-4 transition-colors hover:bg-accent/50">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
