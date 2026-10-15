// Products page copy (E-A5), from the prototype products.html. Kept out of the
// components so it can be translated later. App names, badges and taglines
// come from apps.ts.
import { appById, type AppId } from "@/content/apps";

const [parentHub, staffHub, aiTutor] = [
  appById("parent-hub"),
  appById("staff-hub"),
  appById("ai-tutor"),
];

export const productsMeta = {
  title: `School platforms: ${parentHub.shortName}, ${staffHub.shortName}, ${aiTutor.shortName} | XionTech`,
  description: `One connected school ecosystem: ${parentHub.shortName} for families, ${staffHub.shortName} for teachers and leaders, and ${aiTutor.shortName} for students.`,
};

// CAP-2.
export const productsShowcase = {
  madeFor: "Made for",
  featuresHeading: "Features",
};

export type FeatureId =
  | "gate"
  | "scores"
  | "messages"
  | "fees"
  | "attendance"
  | "classes"
  | "parents"
  | "dashboards"
  | "diagnosis"
  | "hints"
  | "mastery";

export type ProductDetail = {
  madeFor: string;
  features: readonly { id: FeatureId; title: string }[];
};

// CAP-3. Feature titles and "Made for" lines are copied from products.html.
export const productDetails: Record<AppId, ProductDetail> = {
  "parent-hub": {
    madeFor: "Parents and families",
    features: [
      { id: "gate", title: "Real-time arrival alerts" },
      { id: "scores", title: "Published grades and feedback" },
      { id: "messages", title: "Two-way messages with teachers" },
      { id: "fees", title: "Fee payments with clear receipts" },
    ],
  },
  "staff-hub": {
    madeFor: "Staff, teachers and school leaders",
    features: [
      { id: "attendance", title: "Attendance and student records" },
      { id: "classes", title: "Classes, timetables and grades" },
      {
        id: "parents",
        title: `Messages to parents through ${parentHub.shortName}`,
      },
      { id: "dashboards", title: "Leader dashboards for today's priorities" },
    ],
  },
  "ai-tutor": {
    madeFor: "Students, with teachers alongside",
    features: [
      { id: "diagnosis", title: "Skill-level understanding checks" },
      { id: "hints", title: "Personalized step-by-step hints" },
      { id: "mastery", title: "Mastery only when you can do it alone" },
    ],
  },
};

export const journeyMap = {
  intro: {
    title: "Built apart. Better together",
    lede: "A connected suite for school communities. Parents, learning and staff operations share one ecosystem.",
  },
};

// The roadmap: the three apps as milestones on a road (lead, 2026-10-14),
// each one a stop. A stop is its app, so the card and the dialog take the
// name, tagline, audience and features from apps.ts and the product details
// below: the road has no copy of its own but the two end labels.
export type RoadApp = AppId;

export type ProductRoad = {
  start: string;
  finish: string;
  stops: readonly RoadApp[];
};

export const productRoad: ProductRoad = {
  start: "Start",
  finish: "Finish",
  stops: ["parent-hub", "staff-hub", "ai-tutor"],
};

// The tag on each stop's card: who the app is for, and the card's "Details" cue.
export type JourneyBoard = {
  details: string;
  // The road dot's name for assistive technology; {name} is the app.
  viewDetails: string;
  lanes: readonly { app: RoadApp; label: string }[];
};

export const journeyBoard: JourneyBoard = {
  details: "Details",
  viewDetails: "View details: {name}",
  lanes: [
    { app: "ai-tutor", label: "Student" },
    { app: "staff-hub", label: "Teacher and staff" },
    { app: "parent-hub", label: "Parent" },
  ],
};

// The close button of the stop dialog.
export const roadDialog = {
  close: "Close",
  previous: "Previous",
  next: "Next",
};

// Vietnamese. App names, badges and ids stay English (2026-10-13).
export const productsMetaVi: typeof productsMeta = {
  title: `Nền tảng trường học: ${parentHub.shortName}, ${staffHub.shortName}, ${aiTutor.shortName} | XionTech`,
  description: `Một hệ sinh thái trường học kết nối: ${parentHub.shortName} cho gia đình, ${staffHub.shortName} cho giáo viên và lãnh đạo nhà trường, và ${aiTutor.shortName} cho học sinh.`,
};

export const productsShowcaseVi: typeof productsShowcase = {
  madeFor: "Dành cho",
  featuresHeading: "Tính năng",
};

const feature = (app: AppId, index: number, title: string) => ({
  id: productDetails[app].features[index].id,
  title,
});

export const productDetailsVi: Record<AppId, ProductDetail> = {
  "parent-hub": {
    madeFor: "Phụ huynh và gia đình",
    features: [
      feature("parent-hub", 0, "Thông báo đến trường theo thời gian thực"),
      feature("parent-hub", 1, "Điểm số và nhận xét đã công bố"),
      feature("parent-hub", 2, "Nhắn tin hai chiều với giáo viên"),
      feature("parent-hub", 3, "Đóng học phí với biên lai rõ ràng"),
    ],
  },
  "staff-hub": {
    madeFor: "Nhân viên, giáo viên và lãnh đạo nhà trường",
    features: [
      feature("staff-hub", 0, "Điểm danh và hồ sơ học sinh"),
      feature("staff-hub", 1, "Lớp, thời khóa biểu và điểm số"),
      feature(
        "staff-hub",
        2,
        `Gửi tin đến phụ huynh qua ${parentHub.shortName}`,
      ),
      feature("staff-hub", 3, "Bảng điều khiển cho việc cần xử lý hôm nay"),
    ],
  },
  "ai-tutor": {
    madeFor: "Học sinh, cùng giáo viên đồng hành",
    features: [
      feature("ai-tutor", 0, "Kiểm tra mức độ hiểu theo từng kỹ năng"),
      feature("ai-tutor", 1, "Gợi ý từng bước theo từng học sinh"),
      feature("ai-tutor", 2, "Chỉ thành thạo khi tự làm được"),
    ],
  },
};

export const journeyMapVi: typeof journeyMap = {
  intro: {
    title: "Xây dựng riêng. Mạnh hơn khi kết nối",
    lede: "Bộ ứng dụng kết nối cho cộng đồng trường học. Phụ huynh, việc học và vận hành nhà trường dùng chung một hệ sinh thái.",
  },
};

export const productRoadVi: ProductRoad = {
  ...productRoad,
  start: "Bắt đầu",
  finish: "Kết thúc",
};

export const journeyBoardVi: JourneyBoard = {
  ...journeyBoard,
  details: "Chi tiết",
  viewDetails: "Xem chi tiết: {name}",
  lanes: [
    { ...journeyBoard.lanes[0], label: "Học sinh" },
    { ...journeyBoard.lanes[1], label: "Giáo viên và nhân viên" },
    { ...journeyBoard.lanes[2], label: "Phụ huynh" },
  ],
};

export const roadDialogVi: typeof roadDialog = {
  close: "Đóng",
  previous: "Trước",
  next: "Tiếp",
};
