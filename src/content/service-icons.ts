import {
  AppWindowIcon,
  ChartScatterIcon,
  CloudIcon,
  CubeIcon,
  IntersectIcon,
  PuzzlePieceIcon,
  SparkleIcon,
  UserPlusIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { homeServices } from "@/content/home";

export type ServiceId = (typeof homeServices.cards)[number]["id"];

// Icon and variant per service card, as in the prototype: two amber-tinted "feature"
// cards and one navy card. Used by Home and Services pages.
export const serviceIcons: Record<
  ServiceId,
  { icon: Icon; variant?: "feature" | "navy" }
> = {
  "product-engineering": { icon: CubeIcon, variant: "feature" },
  "ai-analytics": { icon: ChartScatterIcon },
  "co-creation": { icon: IntersectIcon },
  staffing: { icon: UserPlusIcon },
  "custom-apps": { icon: AppWindowIcon },
  "low-code": { icon: PuzzlePieceIcon },
  "ai-solutions": { icon: SparkleIcon, variant: "navy" },
  cloud: { icon: CloudIcon, variant: "feature" },
};
