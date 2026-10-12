import type { Icon } from "@phosphor-icons/react";
import { CpuIcon, SparkleIcon } from "@phosphor-icons/react/ssr";
import type { AppBadge } from "@/content/apps";

const BADGE_ICONS: Record<Extract<AppBadge, { kind: "icon" }>["icon"], Icon> = {
  Cpu: CpuIcon,
  Sparkle: SparkleIcon,
};

// The app's badge in the map cards and the app list: its short text or icon.
export function MapBadge({ badge }: Readonly<{ badge: AppBadge }>) {
  if (badge.kind === "text") {
    return (
      <span className="map-badge" aria-hidden="true">
        {badge.text}
      </span>
    );
  }
  const BadgeIcon = BADGE_ICONS[badge.icon];
  return (
    <span className="map-badge" aria-hidden="true">
      <BadgeIcon weight="fill" />
    </span>
  );
}
