import {
  ArrowsClockwiseIcon,
  LightbulbFilamentIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { ValueDrawing } from "@/components/sections/value-flip-card";
import type { Localized } from "@/i18n/content";

// "What drives us" (website copy v3): five principles on Home and About
// (HomeValues). Flip cards: the front shows the icon, the number and label
// and the title; the back the line.

type Value = {
  icon: Icon;
  /** Round 13: the Careers line drawing About shows in place of the icon. */
  drawing: ValueDrawing;
  number: string;
  label: string;
  title: string;
  text: string;
  featured?: boolean;
};

export const aboutValues: { items: Value[] } = {
  items: [
    {
      icon: ArrowsClockwiseIcon,
      number: "01",
      drawing: "agile",
      label: "Stay agile",
      title: "Adapt with purpose.",
      text: "Stay flexible, respond to change, and keep moving toward what matters.",
    },
    {
      icon: ShieldCheckIcon,
      number: "02",
      drawing: "outcome",
      label: "Take ownership",
      title: "Own the outcome.",
      text: "Speak up, take responsibility, and see things through from start to finish.",
    },
    {
      icon: LightbulbFilamentIcon,
      number: "03",
      drawing: "innovate",
      label: "Innovate",
      title: "Make innovation useful.",
      text: "Explore new ideas and technologies that create meaningful value for people and businesses.",
    },
    {
      icon: UsersThreeIcon,
      number: "04",
      drawing: "together",
      label: "Grow together",
      title: "Better together.",
      text: "Share knowledge, support each other, and grow through collaboration and feedback.",
    },
    {
      icon: TargetIcon,
      number: "05",
      drawing: "done",
      label: "Get IT done",
      title: "Turn ideas into impact.",
      text: "Move beyond ideas and deliver practical solutions that make a difference.",
      featured: true,
    },
  ],
};

export const homeValuesHeading = {
  title: "What drives us",
  lede: "Five principles that guide how we collaborate, make decisions, and deliver meaningful results.",
  // Same words as the Careers flip cards.
  frontHint: "Flip for details",
  backHint: "Flip back",
};

export const aboutValuesViList: Pick<Value, "label" | "title" | "text">[] = [
  {
    label: "Linh hoạt",
    title: "Thích ứng có mục đích.",
    text: "Luôn linh hoạt, phản ứng với thay đổi và tiếp tục tiến về những điều quan trọng.",
  },
  {
    label: "Tinh thần làm chủ",
    title: "Làm chủ kết quả.",
    text: "Lên tiếng, nhận trách nhiệm và theo đuổi công việc từ đầu đến cuối.",
  },
  {
    label: "Đổi mới",
    title: "Đổi mới để tạo giá trị.",
    text: "Khám phá những ý tưởng và công nghệ mới, tạo ra giá trị thiết thực cho con người và doanh nghiệp.",
  },
  {
    label: "Cùng nhau phát triển",
    title: "Cùng nhau tốt hơn.",
    text: "Chia sẻ kiến thức, hỗ trợ lẫn nhau và cùng phát triển qua hợp tác và góp ý.",
  },
  {
    label: "Get IT done",
    title: "Biến ý tưởng thành tác động.",
    text: "Vượt lên trên ý tưởng và mang đến những giải pháp thiết thực tạo nên khác biệt.",
  },
];

export const aboutValuesVi: typeof aboutValues = {
  items: aboutValues.items.map((item, index) => ({
    ...item,
    ...aboutValuesViList[index],
  })),
};

export const homeValuesHeadingVi: Localized<typeof homeValuesHeading> = {
  title: "Điều thúc đẩy chúng tôi",
  lede: "Năm nguyên tắc định hướng cách chúng tôi hợp tác, đưa ra quyết định và mang lại kết quả có ý nghĩa.",
  frontHint: "Lật để xem chi tiết",
  backHint: "Lật lại",
};
