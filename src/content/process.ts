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
      line: "Workshops to understand your goals, users, risks and scope.",
      receive: "A clear scope, estimate and delivery plan.",
      icon: MagnifyingGlassIcon,
      orbs: [UsersIcon, TargetIcon, NoteIcon],
    },
    {
      num: "02",
      title: "Design",
      line: "User flows, interfaces and architecture agreed before code is written.",
      receive: "A clickable prototype and technical design.",
      icon: PenNibIcon,
      orbs: [LayoutIcon, TreeStructureIcon, CursorClickIcon],
    },
    {
      num: "03",
      title: "Development",
      line: "Agile sprints with regular demos. Testing and quality assurance (QA) run inside every sprint, not at the end.",
      receive: "Tested, working software every sprint.",
      icon: CodeIcon,
      orbs: [GitBranchIcon, CheckSquareIcon, ArrowsClockwiseIcon],
    },
    {
      num: "04",
      title: "Deployment",
      line: "A safe release, monitoring and improvement after launch.",
      receive: "A live release with ongoing support.",
      icon: RocketLaunchIcon,
      orbs: [CloudArrowUpIcon, PulseIcon, LifebuoyIcon],
    },
  ],
};

const STEPS_VI: Pick<ProcessStep, "title" | "line" | "receive">[] = [
  {
    title: "Khám phá",
    line: "Workshop để hiểu mục tiêu, người dùng, rủi ro và phạm vi.",
    receive: "Phạm vi rõ ràng, ước tính và kế hoạch triển khai.",
  },
  {
    title: "Thiết kế",
    line: "Luồng người dùng, giao diện và kiến trúc được thống nhất trước khi viết code.",
    receive: "Bản mẫu có thể nhấp và thiết kế kỹ thuật.",
  },
  {
    title: "Phát triển",
    line: "Sprint Agile với demo thường xuyên. Kiểm thử và đảm bảo chất lượng (QA) diễn ra trong từng sprint, không phải ở cuối dự án.",
    receive: "Phần mềm đã kiểm thử, chạy được sau mỗi sprint.",
  },
  {
    title: "Triển khai",
    line: "Phát hành an toàn, theo dõi và cải tiến sau khi ra mắt.",
    receive: "Bản phát hành chính thức và hỗ trợ liên tục.",
  },
];

export const processFlowVi: ProcessFlowContent = {
  label: "Quy trình 4-D",
  receiveLabel: "Bạn nhận được",
  start: {
    ...processFlow.start,
    title: "Yêu cầu của bạn",
    line: "Ý tưởng, bản mô tả hoặc yêu cầu.",
  },
  end: {
    ...processFlow.end,
    title: "Ra mắt",
    line: "Và phát triển tiếp cùng nhau.",
  },
  steps: processFlow.steps.map((step, index) => ({
    ...step,
    ...STEPS_VI[index],
  })),
};
