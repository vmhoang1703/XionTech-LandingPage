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
    line: "An idea, a brief or a business need",
    icon: PaperPlaneTiltIcon,
  },
  end: {
    title: "Launch",
    line: "Growing the product together, release after release",
    icon: FlagCheckeredIcon,
  },
  steps: [
    {
      num: "01",
      title: "Discovery",
      line: "Our workshops uncover your goals, users, risks and scope, and turn the idea into clear requirements",
      receive: "Clear requirements, an estimate and a delivery plan",
      icon: MagnifyingGlassIcon,
      orbs: [UsersIcon, TargetIcon, NoteIcon],
    },
    {
      num: "02",
      title: "Design",
      line: "Those requirements become user flows and a clickable prototype, so the product can be seen and refined before it’s built",
      receive: "An approved prototype and technical design",
      icon: PenNibIcon,
      orbs: [LayoutIcon, TreeStructureIcon, CursorClickIcon],
    },
    {
      num: "03",
      title: "Development",
      line: "The approved prototype guides the build in Agile sprints, with testing in every sprint",
      receive: "Tested, working software at every demo",
      icon: CodeIcon,
      orbs: [GitBranchIcon, CheckSquareIcon, ArrowsClockwiseIcon],
    },
    {
      num: "04",
      title: "Deployment",
      line: "The finished product goes live safely, then is monitored and improved through real use",
      receive: "A live product with ongoing support",
      icon: RocketLaunchIcon,
      orbs: [CloudArrowUpIcon, PulseIcon, LifebuoyIcon],
    },
  ],
};

export const processStepsViList: Pick<
  ProcessStep,
  "title" | "line" | "receive"
>[] = [
  {
    title: "Khám phá",
    line: "Các buổi workshop giúp làm rõ mục tiêu, người dùng, rủi ro và phạm vi, rồi biến ý tưởng thành yêu cầu rõ ràng",
    receive: "Yêu cầu rõ ràng, ước tính và kế hoạch triển khai",
  },
  {
    title: "Thiết kế",
    line: "Các yêu cầu đó trở thành luồng người dùng và bản mẫu có thể nhấp, để sản phẩm được nhìn thấy và tinh chỉnh trước khi xây dựng",
    receive: "Bản mẫu đã được phê duyệt và thiết kế kỹ thuật",
  },
  {
    title: "Phát triển",
    line: "Bản mẫu đã duyệt dẫn dắt việc xây dựng qua các sprint Agile, với kiểm thử trong từng sprint",
    receive: "Phần mềm đã kiểm thử, chạy được ở mỗi buổi demo",
  },
  {
    title: "Triển khai",
    line: "Sản phẩm hoàn thiện được đưa vào vận hành an toàn, sau đó được theo dõi và cải tiến qua quá trình sử dụng thực tế",
    receive: "Sản phẩm vận hành chính thức và hỗ trợ liên tục",
  },
];

export const processFlowVi: ProcessFlowContent = {
  label: "Quy trình 4-D",
  receiveLabel: "Bạn nhận được",
  start: {
    ...processFlow.start,
    title: "Yêu cầu của bạn",
    line: "Một ý tưởng, bản mô tả hoặc nhu cầu kinh doanh",
  },
  end: {
    ...processFlow.end,
    title: "Ra mắt",
    line: "Cùng phát triển sản phẩm qua từng bản phát hành",
  },
  steps: processFlow.steps.map((step, index) => ({
    ...step,
    ...processStepsViList[index],
  })),
};
