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

// Icon per service card. Used by the Services page.
export const serviceIcons: Record<ServiceId, { icon: Icon }> = {
  "product-engineering": { icon: CubeIcon },
  "ai-analytics": { icon: ChartScatterIcon },
  "co-creation": { icon: IntersectIcon },
  staffing: { icon: UserPlusIcon },
  "custom-apps": { icon: AppWindowIcon },
  "low-code": { icon: PuzzlePieceIcon },
  "ai-solutions": { icon: SparkleIcon },
  cloud: { icon: CloudIcon },
};
