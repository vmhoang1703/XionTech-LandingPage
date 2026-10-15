// Products page copy (E-A5), from the prototype products.html. Kept out of the
// components so it can be translated later. App names, badges and taglines
// come from apps.ts.
import { appById, appTaglinesVi, type AppId } from "@/content/apps";

const [parentHub, staffHub, iot, aiTutor] = [
  appById("parent-hub"),
  appById("staff-hub"),
  appById("iot"),
  appById("ai-tutor"),
];

export const productsMeta = {
  title: `School Apps: ${parentHub.shortName}, ${staffHub.shortName}, ${iot.shortName} & ${aiTutor.shortName} | XionTech`,
  description: `${parentHub.shortName} for parents, ${staffHub.shortName} for staff, teachers and leaders, and ${iot.fullName} for campuses. Connected school apps from XionTech.`,
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
  | "av"
  | "climate"
  | "doors"
  | "energy"
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
  iot: {
    madeFor: "School operations and facilities teams",
    features: [
      { id: "av", title: "Centralized device management" },
      { id: "climate", title: "Scheduled lighting and climate controls" },
      { id: "doors", title: "Doors and zones managed centrally" },
      { id: "energy", title: "Energy use across the campus" },
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
    lede: "A connected suite for school communities — bringing parents, learning, staff operations and campus technology into one shared ecosystem.",
  },
};

// The school-day roadmap: one student's day from arrival to the end of the
// day, as stations on a road. Times, titles and text are the prototype's
// "A day at school" copy (products.html); the IoT stop uses IoT's own
// feature title and tagline, and has no time because the prototype gives none.
export type RoadStop = {
  id: string;
  time?: string;
  title: string;
  text: string;
  app?: AppId;
};

export const dayRoad = {
  heading: "A day at school",
  lede: "Follow one student journey through a typical school day and see how students, parents and school staff stay informed and connected across each step.",
  start: "Start",
  finish: "Finish",
  stops: [
    {
      id: "arrive",
      time: "07:45",
      title: "Student arrives",
      text: "The student arrives on campus.",
    },
    {
      id: "attendance",
      time: "08:00",
      title: "Attendance recorded",
      text: "A teacher marks the student's attendance in Staff Hub.",
      app: "staff-hub",
    },
    {
      id: "parent",
      time: "08:01",
      title: "Parent updated",
      text: "Parent Hub notifies parents that the student is at school.",
      app: "parent-hub",
    },
    {
      id: "learn",
      time: "09:30",
      title: "Student learns",
      text: "Students practice and ask questions with the AI Tutor.",
      app: "ai-tutor",
    },
    {
      id: "campus",
      title: productDetails.iot.features[1].title,
      text: iot.tagline,
      app: "iot",
    },
    {
      id: "connected",
      time: "15:30",
      title: "Day stays connected",
      text: "Notifications and school information stay connected across the system.",
    },
  ] satisfies RoadStop[],
} as const;

// The journey board: who acts at each stop of the day. Each lane is a person
// in the school and the app they use; the last stop belongs to everyone.
export type LaneId = "student" | "staff" | "parent" | "campus";

export const journeyBoard = {
  hint: "Select a step to see the app behind it.",
  everyone: "Everyone",
  details: "Details",
  lanes: [
    { id: "student", label: "Student", app: "ai-tutor" },
    { id: "staff", label: "Teacher and staff", app: "staff-hub" },
    { id: "parent", label: "Parent", app: "parent-hub" },
    { id: "campus", label: "Campus", app: "iot" },
  ] satisfies { id: LaneId; label: string; app: AppId }[],
  // Lane per stop id; "all" spans every lane.
  laneOf: {
    arrive: "student",
    attendance: "staff",
    parent: "parent",
    learn: "student",
    campus: "campus",
    connected: "all",
  } as Record<string, LaneId | "all">,
} as const;

// The close button of the stop dialog.
export const roadDialog = { close: "Close" };

// Vietnamese. App names, badges and ids stay English (2026-10-13); times and
// lanes are shared with English.
export const productsMetaVi: typeof productsMeta = {
  title: `Ứng dụng cho trường học: ${parentHub.shortName}, ${staffHub.shortName}, ${iot.shortName} & ${aiTutor.shortName} | XionTech`,
  description: `${parentHub.shortName} cho phụ huynh, ${staffHub.shortName} cho nhân viên, giáo viên và lãnh đạo, và ${iot.fullName} cho khuôn viên trường. Các ứng dụng trường học kết nối từ XionTech.`,
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
  iot: {
    madeFor: "Đội vận hành và cơ sở vật chất của trường",
    features: [
      feature("iot", 0, "Quản lý thiết bị tập trung"),
      feature("iot", 1, "Điều khiển ánh sáng và điều hòa theo lịch"),
      feature("iot", 2, "Quản lý cửa và khu vực tập trung"),
      feature("iot", 3, "Mức dùng năng lượng toàn trường"),
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
    lede: "Bộ ứng dụng kết nối cho cộng đồng trường học — đưa phụ huynh, việc học, vận hành nhà trường và công nghệ khuôn viên vào một hệ sinh thái chung.",
  },
};

const [arrive, attendance, parent, learn, campus, connected] = dayRoad.stops;

// The shapes components read either language through.
export type DayRoad = {
  heading: string;
  lede: string;
  start: string;
  finish: string;
  stops: readonly RoadStop[];
};

export type JourneyBoard = {
  hint: string;
  everyone: string;
  details: string;
  lanes: readonly { id: LaneId; label: string; app: AppId }[];
  laneOf: Record<string, LaneId | "all">;
};

export const dayRoadVi: DayRoad = {
  heading: "Một ngày ở trường",
  lede: "Theo chân một học sinh qua một ngày học điển hình để thấy học sinh, phụ huynh và nhà trường luôn được cập nhật và kết nối ở từng bước.",
  start: "Bắt đầu",
  finish: "Kết thúc",
  stops: [
    {
      ...arrive,
      title: "Học sinh đến trường",
      text: "Học sinh đến khuôn viên trường.",
    },
    {
      ...attendance,
      title: "Ghi nhận điểm danh",
      text: "Giáo viên điểm danh học sinh trên Staff Hub.",
    },
    {
      ...parent,
      title: "Phụ huynh được cập nhật",
      text: "Parent Hub báo cho phụ huynh rằng con đã đến trường.",
    },
    {
      ...learn,
      title: "Học sinh học tập",
      text: "Học sinh luyện tập và đặt câu hỏi cùng AI Tutor.",
    },
    {
      ...campus,
      title: productDetailsVi.iot.features[1].title,
      text: appTaglinesVi.iot,
    },
    {
      ...connected,
      title: "Cả ngày luôn kết nối",
      text: "Thông báo và thông tin của trường luôn kết nối trên toàn hệ thống.",
    },
  ],
};

export const journeyBoardVi: JourneyBoard = {
  ...journeyBoard,
  hint: "Chọn một bước để xem ứng dụng phía sau.",
  everyone: "Mọi người",
  details: "Chi tiết",
  lanes: [
    { ...journeyBoard.lanes[0], label: "Học sinh" },
    { ...journeyBoard.lanes[1], label: "Giáo viên và nhân viên" },
    { ...journeyBoard.lanes[2], label: "Phụ huynh" },
    { ...journeyBoard.lanes[3], label: "Khuôn viên" },
  ],
};

export const roadDialogVi: typeof roadDialog = { close: "Đóng" };
