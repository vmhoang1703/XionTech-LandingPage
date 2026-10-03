import type { Icon } from "@phosphor-icons/react";
import {
  ArrowsClockwiseIcon,
  CheckSquareIcon,
  CloudArrowUpIcon,
  CodeIcon,
  CursorClickIcon,
  FlagCheckeredIcon,
  GitBranchIcon,
  LayoutIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  NoteIcon,
  PaperPlaneTiltIcon,
  PenNibIcon,
  PulseIcon,
  RocketLaunchIcon,
  TargetIcon,
  TreeStructureIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";

// 4-D process copy, shared by Home (3.6) and Services #process (5.4).
// Kept out of the components so it can be translated later. The icons are the
// prototype's (ph-*): one main icon and three orbs per step.

type ProcessNode = { title: string; line: string; icon: Icon };

export type ProcessStep = {
  num: string;
  title: string;
  line: string;
  receive: string;
  icon: Icon;
  orbs: readonly [Icon, Icon, Icon];
};

export type ProcessFlowContent = {
  label: string;
  receiveLabel: string;
  start: ProcessNode;
  end: ProcessNode;
  steps: ProcessStep[];
};

export const processFlow: ProcessFlowContent = {
  label: "4-D process",
  receiveLabel: "You receive",
  start: {
    title: "Your request",
    line: "An idea, a brief or a requirement.",
    icon: PaperPlaneTiltIcon,
  },
  end: {
    title: "Launch",
    line: "And we keep growing it together.",
    icon: FlagCheckeredIcon,
  },
  steps: [
    {
      num: "01",
      title: "Discovery",
      line: "We learn your goals, users and scope.",
      receive: "A clear scope and delivery plan.",
      icon: MagnifyingGlassIcon,
      orbs: [UsersIcon, TargetIcon, NoteIcon],
    },
    {
      num: "02",
      title: "Design",
      line: "We shape flows, interfaces and architecture.",
      receive: "A clickable prototype and technical design.",
      icon: PenNibIcon,
      orbs: [LayoutIcon, TreeStructureIcon, CursorClickIcon],
    },
    {
      num: "03",
      title: "Development",
      line: "We build in agile sprints with open updates.",
      receive: "Working software every sprint.",
      icon: CodeIcon,
      orbs: [GitBranchIcon, CheckSquareIcon, ArrowsClockwiseIcon],
    },
    {
      num: "04",
      title: "Deployment",
      line: "We release, monitor and keep improving.",
      receive: "A live release with ongoing support.",
      icon: RocketLaunchIcon,
      orbs: [CloudArrowUpIcon, PulseIcon, LifebuoyIcon],
    },
  ],
};
