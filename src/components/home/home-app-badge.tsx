import type { Icon } from "@phosphor-icons/react";
import { SparkleIcon } from "@phosphor-icons/react/ssr";
import {
  badgeLabel,
  type App,
  type AppBadge,
  type AppId,
} from "@/content/apps";

// Home's app badges (the doors and the app cards). Text badges show their
// text; icon badges show the icon with the app's short name for screen
// readers.

// Every app is listed, so a new app is a type error until it gets a class.
const BADGE_CLASS: Record<AppId, string> = {
  "parent-hub": "b-pxp",
  "staff-hub": "b-sxp",
  "ai-tutor": "b-ait",
};

const BADGE_ICON: Record<Extract<AppBadge, { kind: "icon" }>["icon"], Icon> = {
  Sparkle: SparkleIcon,
};

export function HomeAppBadge({ app }: Readonly<{ app: App }>) {
  const { badge } = app;
  const className = `badge ${BADGE_CLASS[app.id]}`;
  if (badge.kind === "text") {
    return <span className={className}>{badge.text}</span>;
  }
  const BadgeIcon = BADGE_ICON[badge.icon];
  return (
    <span className={className}>
      <BadgeIcon aria-hidden="true" />
      <span className="sr-only">{badgeLabel(app)}</span>
    </span>
  );
}
