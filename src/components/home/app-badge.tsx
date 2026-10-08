import { CpuIcon, SparkleIcon } from "@phosphor-icons/react/ssr";
import { badgeLabel, type App, type AppId } from "@/content/apps";

// Home's app badges (the doors and the Capabilities card). Text badges show
// their text; icon badges show the icon with the app's short name for
// screen readers.
// Home shows no AI Tutor badge, so it has no colour class here.
const BADGE_CLASS: Partial<Record<AppId, string>> = {
  "parent-hub": "b-pxp",
  "staff-hub": "b-sxp",
  iot: "b-iot",
};

const BADGE_ICON = { Cpu: CpuIcon, Sparkle: SparkleIcon };

export function AppBadge({ app }: Readonly<{ app: App }>) {
  const { badge } = app;
  const className = ["badge", BADGE_CLASS[app.id]].filter(Boolean).join(" ");
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
