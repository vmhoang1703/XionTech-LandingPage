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
import type { servicesSection } from "@/content/services";

export type ServiceId = (typeof servicesSection.services)[number]["id"];

// Icon and variant per service card, as in the prototype: two amber-tinted "feature"
// cards and one navy card. Used by the Services page.
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
