import { SERVICES } from "@/components/layout/nav-data";
import { aboutFaq, aboutHero, aboutOffices, aboutStory } from "@/content/about";
import { appById } from "@/content/apps";
import {
  careersHero,
  careersInside,
  careersLife,
  careersValues,
} from "@/content/careers";
import {
  homeApps,
  homeDoors,
  homeFaq,
  homeHero,
  homeOutcomes,
  homeProcess,
  homeStats,
} from "@/content/home";
import { jobDetails, jobForm } from "@/content/job";
import { homeNews, newsPage, newsStory } from "@/content/news";
import { footerOffices, hcmc, plano } from "@/content/offices";
import { PRIVACY } from "@/content/privacy";
import { processFlow } from "@/content/process";
import { dayRoad, journeyBoard, productDetails } from "@/content/products";
import {
  servicesOutcomes,
  servicesPage,
  servicesSection,
} from "@/content/services";
import { aboutValues } from "@/content/values";
import { CONTACT_STRINGS } from "@/components/contact/contact-strings";
import {
  MESSAGE_MAX_LENGTH,
  TEXT_MAX_LENGTH,
} from "@/lib/contact/contact-rules";
import type { AppId } from "@/content/apps";
import type { Office, OfficeContact } from "@/content/offices";
import { SERVICE_NAMES } from "../service-names";
import type { Dictionaries } from "../translations";

// Simplified Chinese (zh-Hans). AI-translated from the English for native
// review. Product and service names and "Get IT done" stay English; addresses,
// numbers, emails, hrefs and ids are shared with English. Full-width
// punctuation, with “” for quotes.

const count = (n: number) => n.toLocaleString("zh-CN");

const NEW_TAB = "（在新标签页中打开）";
const US_DELIVERY_CENTER = "美国交付中心";
const VIETNAM_DELIVERY_CENTER = "越南交付中心";
const DETAILS_CONSENT = "您提供的信息仅用于回复本次咨询。";
const SEND_ERROR = "请求未能发送，请重试。";
const RATE_ERROR = "短时间内请求次数过多，请几分钟后再试。";
const FIX_HEADING = "请修正以下内容：";
const PRIVACY_LINK = "隐私政策";
const SUMMIT = "登顶成功，谢谢！";
const FLIP_FRONT = "翻转卡片查看详情";
const FLIP_BACK = "翻回";
const BREADCRUMB = "面包屑导航";
const HOME = "首页";

// The accessible name of an external contact: its visible label, an optional
// prefix (the bracketed views drop "WhatsApp" from the label) and the new-tab note.
const withNewTab = (contacts: OfficeContact[], prefix = ""): OfficeContact[] =>
  contacts.map((contact) =>
    contact.external
      ? { ...contact, ariaLabel: `${prefix}${contact.label} ${NEW_TAB}` }
      : contact,
  );

const planoZh: Office = {
  ...plano,
  name: "美国得克萨斯州普莱诺",
  contacts: withNewTab(plano.contacts),
  zoneLabel: "美国中部时间",
};

const hcmcZh: Office = {
  ...hcmc,
  name: "越南胡志明市",
  tag: VIETNAM_DELIVERY_CENTER,
};

const OTHER_LOCATIONS = "我们也在河内和岘港。";

const [aboutPlano, aboutHcmc] = aboutOffices.offices;

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "家长与家庭",
    features: [
      "孩子到达校门时即时通知",
      "成绩与反馈一经发布即可查看",
      "与教师双向沟通",
      "缴纳学费，收据清晰",
    ].map((title, i) => ({
      ...productDetails["parent-hub"].features[i],
      title,
    })),
  },
  "staff-hub": {
    madeFor: "教职员工、教师与管理层",
    features: [
      "实时考勤与记录",
      "班级、课表与成绩",
      "通过 Parent Hub 向家长发送消息",
      "展示当日重点的管理层看板",
    ].map((title, i) => ({
      ...productDetails["staff-hub"].features[i],
      title,
    })),
  },
  iot: {
    madeFor: "设施与运维团队",
    features: [
      "投影仪、显示屏与音响",
      "按课表控制照明与空调",
      "集中管理门禁与区域",
      "全校园能耗",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "学生，教师从旁陪伴",
    features: [
      "按技能诊断",
      "先自己尝试，再获得分步提示",
      "只有能独立完成时才算掌握",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub": "让家长通过手机，紧跟孩子的每个上学日。",
  "staff-hub": "一个工作空间，让教职员工、教师和管理层共享同一份数据。",
  iot: "在一个屏幕上管理教室设备、照明、空调和门禁。",
  "ai-tutor": "[Placeholder] 独立解决新问题，而不只是阅读答案。",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech 是做什么的？",
    answer:
      "我们为学校打造自有平台（Parent Hub、Staff Hub、IoT Device Management），并为其他企业开发软件。我们提供产品工程、AI 驱动的分析、产品共创和人员扩充服务。",
  },
  industries: {
    question: "你们服务哪些行业？",
    answer: "教育科技是我们的核心领域。我们也服务医疗、物流和私募股权行业。",
  },
  "try-apps": {
    question: "我们学校如何试用 Parent Hub 或 Staff Hub？",
    answer: "请联系我们。我们会结合贵校的实际情况，为您演示这些应用。",
  },
  "time-zones": {
    question: "你们如何跨时区协作？",
    answer:
      "我们在普莱诺、胡志明市、河内和岘港的团队覆盖美国、欧洲和澳大利亚时区，并通过共享工具提供实时进展。",
  },
  shape: {
    question: "你们何时开始根据我们的需求塑造方案？",
    answer:
      "从一开始。在四个阶段的第一个阶段“探索”中，我们会在设计开始前明确目标、用户和范围。",
  },
  results: {
    question: "我们可以期待什么样的成果？",
    answer:
      "由经验丰富的越南工程师提供高性价比的开发、按期交付，以及支撑业务增长的可衡量成果。",
  },
  security: {
    question: "你们如何保护我们的数据？",
    answer:
      "[Placeholder] 我们以诚信、透明和明确的道德标准行事，并以安全自动化和持续扫描作为支撑。",
  },
  feedback: {
    question: "项目进行中我们如何反馈意见？",
    answer:
      "通过专属沟通渠道、定期沟通和敏捷冲刺，您的意见从始至终都会体现在产品中。",
  },
  value: {
    question: "你们如何衡量并展示价值？",
    answer: "我们跟踪速度、质量、对产品的影响和团队自主性，并公开分享结果。",
  },
};

const ABOUT_FAQ_ITEMS = aboutFaq.items.map((item) => ({
  id: item.id,
  ...FAQ[item.id],
}));

const SERVICES_LEDE =
  "您可以选择一项服务，也可以组合多项服务。我们会围绕您的产品组建团队。";

const OUTCOMES: Dictionaries["servicesOutcomes"] = {
  title: "我们可以帮您实现什么？",
  items: [
    {
      id: servicesOutcomes.items[0].id,
      title: "打造新的数字产品",
      description: "由一支交付团队完成从探索和 UX 到工程、测试和上线的全过程。",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "扩充团队",
      description: "当内部团队需要更多人手或特定技能时，补充专业技术人才。",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "现代化现有平台",
      description:
        "在保留已有优势的同时，改进应用、基础设施、云部署和工程实践。",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "在创造价值的地方应用 AI",
      description: "运用 AI、分析和自动化，改进产品、流程和决策。",
    },
  ],
};

const START_PROJECT = "启动项目";

const PROCESS_STEPS = [
  {
    title: "探索",
    line: "通过研讨会明确目标、用户、风险和范围。",
    receive: "清晰的范围、报价和交付计划。",
  },
  {
    title: "设计",
    line: "在编写代码之前，先确定用户流程、界面和架构。",
    receive: "可点击的原型和技术设计。",
  },
  {
    title: "开发",
    line: "敏捷冲刺并定期演示。测试和 QA 贯穿每个冲刺，而不是留到最后。",
    receive: "每个冲刺都交付经过测试、可运行的软件。",
  },
  {
    title: "交付",
    line: "安全发布、监控和上线后的持续改进。",
    receive: "正式发布，并提供持续支持。",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "4-D 流程",
  receiveLabel: "您将获得",
  start: {
    ...processFlow.start,
    title: "您的需求",
    line: "一个想法、一份简报或一项需求。",
  },
  end: {
    ...processFlow.end,
    title: "上线",
    line: "然后我们继续一起推进。",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "为学校社区打造的一系列互联产品，将家长、学习、教职员工工作和校园技术连接成一个生态系统。";

const RETENTION_DECIDED =
  "咨询和演示请求、提交的电子邮箱地址，以及求职申请和简历均无限期保存。";

const [arrive, attendance, parentStop, learn, campus, connected] =
  dayRoad.stops;

const ERRORS = {
  name: "请输入您的姓名。",
  email: "请输入有效的电子邮箱地址。",
  org: "请输入您的机构名称。",
  phone: "请输入有效的电话号码，例如 (+1) 469 322 9899。",
  date: "请选择今天或之后的日期。",
  message: `留言须少于 ${count(MESSAGE_MAX_LENGTH)} 个字符。`,
};

const parentHub = appById("parent-hub");
const staffHub = appById("staff-hub");
const iotApp = appById("iot");
const aiTutor = appById("ai-tutor");

export const zh: Dictionaries = {
  aboutCapture: {
    heading: "亲眼看看这些应用如何运作。",
    lede: `留下您的工作邮箱，我们将为您安排 ${parentHub.shortName} 和 ${staffHub.shortName} 的演示。`,
  },
  aboutFaq: {
    title: "为您解答",
    lede: "关于我们的产品、服务和工作方式的坦诚回答。",
    items: ABOUT_FAQ_ITEMS,
    ask: {
      href: aboutFaq.ask.href,
      label: "还有疑问？直接问我们",
    },
  },
  aboutHero: {
    title: {
      lead: "我们是 XionTech，以",
      middle: "",
      accent: "主人翁精神",
      tail: "打造技术。",
    },
    text: "我们连接人才、创意与技术，打造卓越的 IT 系统，为所有人创造更美好的未来。我们在胡志明市和普莱诺为学校打造自有平台，并为世界各地的客户开发数字产品。",
    links: [
      { href: aboutHero.links[0].href, label: "了解产品" },
      { href: aboutHero.links[1].href, label: "了解服务" },
    ],
  },
  aboutMeta: {
    title: "关于 XionTech | Get IT Done",
    description:
      "XionTech 是一家教育科技公司和软件合作伙伴，总部位于美国普莱诺和越南胡志明市，在河内和岘港设有团队，服务美国、欧洲和澳大利亚的客户。",
  },
  aboutOffices: {
    title: "两个总部，四个地点。",
    more: OTHER_LOCATIONS,
    offices: [
      {
        ...planoZh,
        tag: US_DELIVERY_CENTER,
        contacts: withNewTab(aboutPlano.contacts, "WhatsApp "),
      },
      { ...hcmcZh, contacts: aboutHcmc.contacts },
    ],
  },
  aboutStory: {
    title: {
      lead: "灵感源于山。",
      middle: "",
      highlight: "使命",
      tail: "让我们团结。",
    },
    chapters: [
      {
        number: aboutStory.chapters[0].number,
        title: "灵感",
        text: "我们的名字源于山：人们仰望它、在此相聚，并一同攀登，奔向更美好的未来。",
      },
      {
        number: aboutStory.chapters[1].number,
        title: "使命",
        text: "[Placeholder] 受这一愿景启发，一群开拓者在美国创立了 newXion。在恒久核心价值观的指引下，他们立志打造一个忠于山之精神的社区：人们在这里团结一心，运用前沿技术，打造卓越的 IT 系统，推动人类进步，为所有人创造更美好的未来。",
      },
    ],
    closing: {
      line: "我们的灵感是山。我们的使命是人。",
      tags: "愿景 · 社区 · 技术",
    },
    cue: "滚动",
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        title: "创业精神",
        short: "敏捷、坚韧、持续进步。",
        text: "我们秉持创业精神：敏捷、灵活，并对创新充满热情。我们对卓越的追求根植于坚韧和持续改进的文化。",
      },
      {
        title: "以客户为中心",
        short: "客户是我们一切工作的核心。",
        text: "客户是我们一切工作的核心。我们通过深入理解、积极沟通和量身定制的解决方案，努力提供卓越的体验和有意义的成果。",
      },
      {
        title: "诚信为先",
        short: "诚实、透明、负责。",
        text: "我们诚实、透明、负责地行事。道德标准指导我们的每一项决策和每一次沟通，从而建立信任和长久的关系。",
      },
      {
        title: "创新驱动",
        short: "探索新技术，保持领先。",
        text: "我们热衷于探索新技术和创造性的方法。创新融入我们的基因，推动我们的解决方案不断进步，并让我们走在行业前列。",
      },
      {
        title: "“Get IT Done”心态",
        short: "对承诺负责，交付成果。",
        text: "我们对承诺负责，交付高质量、可靠、高效的解决方案。我们的团队以责任感和结果导向的思维，达到甚至超越行业标准。",
      },
      {
        title: "以人为本的文化",
        short: "每位成员都受到尊重、支持和赋能。",
        text: "我们营造让每位成员都受到尊重、支持和赋能的工作环境。我们的文化不止于雇佣关系，而是建立在归属感、协作和共同成功之上。",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  appTaglines: APP_TAGLINES,
  careersGrowth: {
    caption: "[Placeholder] 成长学习模型",
    center: "成长",
    steps: ["好奇", "学习", "提问", "成长", "进步"],
  },
  careersHero: {
    title: {
      first: "保持好奇。",
      second: "创造未来。",
    },
    lede: "我们正在组建一支团队，成员学得快、善于提出更好的问题、能随变化而调整，并且关心结果，而不只是任务。在这里，你将参与开创用 AI 构建软件的新方式。",
    cta: { href: careersHero.cta.href, label: "查看在招职位" },
  },
  careersInside: {
    heading: "走进 XionTech。",
    lede: "一窥塑造我们日常的那些时刻：研讨会、项目启动、团队日、庆祝活动、共同学习，以及其间的点滴瞬间。",
    tiles: [
      {
        tag: "一起学习",
        title: "研讨会与实验",
        text: "团队在动手实践中尝试新工具、智能体工作流和更好的工作方式。",
      },
      {
        tag: "建立关系",
        title: "拜访客户",
        text: "在现场了解背景，巩固合作关系。",
      },
      {
        tag: "目标一致",
        title: "全员大会",
        text: "发生了哪些变化，现在什么最重要，下一步走向何方。",
      },
      {
        tag: "一起启程",
        title: "项目启动",
        text: "新工作从共享的背景出发，而不是一份陌生的任务清单。",
      },
      {
        tag: "庆祝成果",
        title: "[Placeholder] 庆祝活动",
        text: "因为完成的工作，值得的不只是一个变绿的状态标记。",
      },
    ].map((copy, i) => ({ ...careersInside.tiles[i], ...copy })),
  },
  careersLife: {
    heading: "在 XionTech 的生活。",
    frames: [
      "[Placeholder] 团队照片",
      "[Placeholder] 办公室照片",
      "[Placeholder] 活动照片",
    ].map((placeholder, i) => ({ ...careersLife.frames[i], placeholder })),
  },
  careersMeta: {
    title: "XionTech 招聘 | 胡志明市软件工作机会",
    description:
      "加入胡志明市的 XionTech。在以人为本的文化中，运用 AI/ML、生成式 AI、云和敏捷开发，打造学校平台和客户产品。",
  },
  careersRoles: {
    heading: "寻找你的下一个挑战。",
    emptyText: "目前暂无在招职位。",
    applyLabel: "查看并申请",
  },
  careersValues: {
    heading: "塑造我们工作方式的五项原则。",
    lede: "这是我们希望每个人每天都能从我们身上感受到的行为。翻转卡片，看看每项原则在实践中意味着什么。",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
    cards: [
      {
        title: "[Placeholder] 保持敏捷",
        label: "敏捷",
        backTitle: "[Placeholder] 灵活行动，不失方向。",
        text: "当新信息或更好的答案改变了路线时，我们灵活调整。",
      },
      {
        title: "[Placeholder] 对结果负责",
        label: "担当",
        backTitle: "[Placeholder] 着眼于自己的任务之外。",
        text: "我们及早发现问题，守护质量，并确保工作真正取得成功。",
      },
      {
        title: "[Placeholder] 有目的地创新",
        label: "创新",
        backTitle: "[Placeholder] 新事物只有在有用时才有意义。",
        text: "当新技术能改进产品、用户体验或工作方式时，我们就去探索它。",
      },
      {
        title: "[Placeholder] 共同成长",
        label: "共同成长",
        backTitle: "[Placeholder] 让彼此变得更好。",
        text: "我们分享所知，给出有帮助的反馈，并为同事留出挑战、贡献和成长的空间。",
      },
      {
        title: "[Placeholder] Get IT Done",
        label: "GET IT DONE",
        backTitle: "[Placeholder] 把可能变为现实。",
        text: "好的想法很重要。只有交付有用、真实的成果，它才有价值。",
      },
    ].map((copy, i) => ({ ...careersValues.cards[i], ...copy })),
  },
  categoryLabels: {
    schools: "学校",
    students: "学生",
    parents: "家长",
    company: "公司",
  },
  contactErrors: {
    messageRequired: "请简单介绍一下您的项目。",
    length: `此项须少于 ${count(TEXT_MAX_LENGTH)} 个字符。`,
    cv: "请上传 PDF 或 Word 格式、不超过 5 MB 的简历。",
    note: `备注须少于 ${count(MESSAGE_MAX_LENGTH)} 个字符。`,
  },
  contactStrings: {
    metaTitle: "预约演示或启动项目 | XionTech",
    metaDescription: `为贵校预约 ${parentHub.shortName} 和 ${staffHub.shortName} 演示，或告诉我们您的软件项目。XionTech，胡志明市与普莱诺。`,
    hero: {
      breadcrumbLabel: BREADCRUMB,
      breadcrumbHome: HOME,
      breadcrumbCurrent: "联系我们",
      titleBefore: "聊聊您的",
      titleHighlight: "学校",
      titleAfter: "或项目。",
      items: [
        `结合贵校情况演示 ${parentHub.shortName} 和 ${staffHub.shortName}。`,
        "解答关于部署、数据和支持的问题。",
        "对于项目：一次探索沟通，即四个阶段中的第一个阶段。",
      ],
      officesLabel: "办公地点",
    },
    form: {
      heading: "我们能为您做些什么？",
      tabsLabel: "咨询类型",
      tabDemo: "产品演示",
      tabProject: "外包项目",
      name: "姓名",
      email: "工作邮箱",
      org: "学校或公司",
      role: "职位",
      roleHelp: "例如：校长、IT 负责人",
      products: "感兴趣的产品",
      schoolSize: "学校规模",
      date: "期望日期",
      service: "服务",
      startTiming: "您希望何时开始？",
      message: "留言（可选）",
      submit: "发送请求",
      sending: "发送中…",
      successHeading: SUMMIT,
      successText: "我们会尽快与您联系。",
      sendError: SEND_ERROR,
      rateError: RATE_ERROR,
      consent: DETAILS_CONSENT,
      privacyLink: PRIVACY_LINK,
      errorsHeading: FIX_HEADING,
    },
    home: {
      heading: "有想要打造的东西吗？",
      lede: "简单介绍一下您和您正在做的事情，我们的团队会联系您，进一步了解详情。",
      name: "姓名",
      email: "工作邮箱",
      phone: "电话",
      optional: "（可选）",
      phonePlaceholder: CONTACT_STRINGS.home.phonePlaceholder,
      message: "介绍一下您的项目",
      messagePlaceholder:
        "您想打造什么？请介绍您的想法、现有产品、团队或面临的挑战。",
      submit: "开始对话",
      consent: "您提供的信息仅用于回复您的留言。",
      successHeading: "登顶成功，谢谢。我们已收到您的留言。",
      successText: "我们会阅读您发送的内容，并回复您。",
    },
    capture: {
      emailLabel: "工作邮箱",
      demo: {
        heading: "看看它在贵校如何运作。",
        lede: "留下您的工作邮箱，我们将为贵校安排一次专属演示。",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "联系我们",
        consent: "您的邮箱仅用于安排演示。",
      },
      project: {
        heading: "告诉我们您在打造什么。",
        lede: "留下您的工作邮箱，我们会联系您，开始探索阶段。",
        placeholder: CONTACT_STRINGS.capture.project.placeholder,
        button: "联系我们",
        consent: DETAILS_CONSENT,
      },
    },
    errors: ERRORS,
    productPills: CONTACT_STRINGS.productPills,
    defaultProduct: CONTACT_STRINGS.defaultProduct,
    schoolSizes: [
      `少于 ${count(500)} 名学生`,
      `${count(500)}–${count(1500)} 名学生`,
      `超过 ${count(1500)} 名学生`,
      "多个校区",
    ],
    startTimings: ["尽快", "1–3 个月内", "仍在了解中"],
    services: [...SERVICES.map((service) => service.name), "尚未确定"],
  },
  dayRoad: {
    heading: "校园里的一天。",
    lede: "跟随一名学生度过普通的上学日，看看学生、家长和教职员工在每一步如何获得信息、保持连接。",
    start: "出发",
    finish: "到达",
    stops: [
      {
        ...arrive,
        title: "学生到校",
        text: "学生到达校园。",
      },
      {
        ...attendance,
        title: "记录考勤",
        text: `教师在 ${staffHub.shortName} 中记录学生考勤。`,
      },
      {
        ...parentStop,
        title: "通知家长",
        text: `${parentHub.shortName} 告知家长学生已到校。`,
      },
      {
        ...learn,
        title: "学生学习",
        text: `学生使用 ${aiTutor.shortName} 练习和提问。`,
      },
      {
        ...campus,
        title: PRODUCT_DETAILS.iot.features[1].title,
        text: APP_TAGLINES.iot,
      },
      {
        ...connected,
        title: "互联的一天",
        text: "通知和学校信息在整个系统中保持互通。",
      },
    ],
  },
  footerOffices: [
    { ...footerOffices[0], name: VIETNAM_DELIVERY_CENTER },
    {
      ...footerOffices[1],
      name: US_DELIVERY_CENTER,
      contacts: withNewTab(footerOffices[1].contacts, "WhatsApp "),
    },
  ],
  hcmc: hcmcZh,
  homeApps: {
    title: "互联的学校。",
    lede: JOURNEY_LEDE,
    apps: homeApps.apps.map((card) => ({
      ...card,
      madeFor: PRODUCT_DETAILS[card.app.id].madeFor,
      features: PRODUCT_DETAILS[card.app.id].features
        .slice(0, 2)
        .map((feature) => feature.title),
    })),
    link: { href: homeApps.link.href, label: "了解产品" },
  },
  homeCapabilities: {
    title: "为什么选择 XionTech。",
    lede: "这是我们每一款学校应用和每一次交付背后的能力，以及一支不断寻找用 AI 让工作更智能的团队。",
    delivery: {
      label: "全球交付",
      title: "两个总部，一个工作日。",
      line: "跨时区的团队利用真正重叠的工作时间，让开发持续推进。",
    },
    industries: {
      label: "领域专长",
      title: "深耕教育，灵活应变。",
      line: "教育是我们最深耕的领域，同样的工程能力也服务于其他行业。",
      main: "教育",
      more: ["医疗", "物流", "私募股权"],
      moreLabel: "另外 3 个行业：医疗、物流、私募股权",
    },
    motto: {
      lead: "Get IT Done",
      title: "以主人翁精神打造。",
      line: "我们对承诺负责，并以质量为荣。",
    },
  },
  homeDoors: {
    label: "我们做什么",
    products: {
      ...homeDoors.products,
      title: "面向学校的产品",
      line: "为家长、学生、教师、管理层和教职员工打造的互联应用。",
    },
    services: {
      ...homeDoors.services,
      label: "外包服务",
      title: "您的软件交付团队",
      line: "为打造数字产品的企业提供专属团队和端到端交付。",
      chips: [...homeDoors.services.chips.slice(0, -1), "另外 3 项"],
    },
  },
  homeFaq: {
    title: "为您解答。",
    lede: "关于我们的产品、服务和工作方式的坦诚回答。",
    items: homeFaq.items.map((item) => ({ id: item.id, ...FAQ[item.id] })),
    link: { href: homeFaq.link.href, label: "查看所有问题" },
  },
  homeHero: {
    title: {
      lines: ["更智能地构建。", "更快速地发布。"],
      highlight: "Get IT done",
      tail: "。",
    },
    sub: "互联的学校与校园解决方案、软件产品和专属团队，来自在 AI 辅助开发领域走在前列的团队。",
    motion: { pause: "暂停动画", play: "播放动画" },
    cta: { href: homeHero.cta.href, label: "联系我们" },
  },
  homeMeta: {
    title: "XionTech | 学校平台与越南软件外包",
  },
  homeNews: {
    heading: "XionTech 最新动态。",
    lede: "看看我们的团队正在打造和发布什么。",
    seeAll: { href: homeNews.seeAll.href, label: "查看所有动态" },
    readStory: "阅读文章",
  },
  homeOutcomes: {
    title: OUTCOMES.title,
    lede: SERVICES_LEDE,
    items: OUTCOMES.items,
    cta: { href: homeOutcomes.cta.href, label: START_PROJECT },
    link: { href: homeOutcomes.link.href, label: "了解服务" },
  },
  homeProcess: {
    title: "我们的工作方式。",
    lede: "4-D 流程（探索、设计、开发、交付）将想法推进到上线，每个阶段都以您可以查看和批准的成果结束。AI 贯穿每个阶段，我们也在不断改进使用 AI 的方式。",
    link: { href: homeProcess.link.href, label: "查看完整流程" },
  },
  homeStats: {
    label: "值得信赖的经验",
    stats: [
      "年软件行业领导经验",
      "跨时区的全球覆盖",
      "我们使用的技术栈",
      "项服务，从构想到运营",
      "个地点：总部位于普莱诺和胡志明市",
    ].map((caption, i) => ({ ...homeStats.stats[i], caption })),
  },
  homeValuesHeading: {
    title: "核心价值观。",
    lede: "指引我们工作方式的理念。翻转卡片，阅读每项价值观的完整内容。",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
  },
  jobDetails: {
    sectionLabel: "职位详情与申请",
    aboutHeading: "关于该职位",
    doHeading: "工作内容",
    bringHeading: "任职要求",
    backLabel: "所有在招职位",
    backHref: jobDetails.backHref,
  },
  jobForm: {
    heading: "申请该职位",
    name: "姓名",
    email: "邮箱",
    phone: "电话（可选）",
    cv: "简历",
    cvHelp: "PDF 或 Word，最大 5 MB。",
    note: "附言（可选）",
    submit: "提交申请",
    sending: "发送中…",
    successHeading: SUMMIT,
    successText: "我们已收到您的申请。如果合适，我们会与您联系。",
    sendError: "申请未能发送，请重试。",
    rateError: RATE_ERROR,
    consent: "您提供的信息和简历仅用于审核您的申请。",
    privacyLink: PRIVACY_LINK,
    privacyHref: jobForm.privacyHref,
    errorsHeading: FIX_HEADING,
  },
  jobHero: {
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCareers: "招聘",
    chipsLabel: "职位详情",
  },
  jobMeta: {
    title: "在招职位 | XionTech 招聘",
    description: "阅读职位介绍，并附上简历提交申请。XionTech，胡志明市。",
  },
  journeyBoard: {
    ...journeyBoard,
    hint: "选择一个步骤，查看支持该步骤的应用。",
    everyone: "所有人",
    details: "详情",
    lanes: ["学生", "教师与教职员工", "家长", "校园"].map((label, i) => ({
      ...journeyBoard.lanes[i],
      label,
    })),
  },
  journeyMap: {
    intro: {
      title: "各自独立打造，携手效果更佳。",
      lede: JOURNEY_LEDE,
    },
  },
  newsMeta: {
    title: "新闻 | XionTech",
    description: "关于 XionTech 产品、学校、团队和客户项目的简讯。",
  },
  newsPage: {
    title: "最新动态",
    sub: "第一时间了解我们的最新动态和公告。",
    storiesHeading: "所有文章",
    filtersLabel: "按受众筛选文章",
    sampleNote: "文章来自 newXion 新闻室。标有 [Placeholder] 的文章为示例。",
    allFilter: { id: newsPage.allFilter.id, label: "全部" },
    empty: "该类别暂无文章。",
    showAll: "显示全部",
    countOne: "显示 1 篇文章",
    countMany: "显示 {n} 篇文章",
  },
  newsStory: {
    storyLabel: "文章",
    sampleNote:
      "[Placeholder] 这是一篇用于展示版式的示例文章，上线前须替换为真实文章。",
    backToNews: {
      href: newsStory.backToNews.href,
      label: "返回新闻",
    },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoZh, hcmcZh],
  otherLocations: OTHER_LOCATIONS,
  plano: planoZh,
  privacy: {
    metaTitle: "隐私政策 | XionTech",
    metaDescription:
      "[Placeholder] XionTech 如何使用您通过表单发送给我们的个人数据。",
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCurrent: PRIVACY_LINK,
    title: "隐私政策。",
    lede: "[Placeholder] 依据越南第 13/2023 号法令（PDPD）的政策文本将由法务人员提供。",
    bodyLabel: "政策",
    outlineNote:
      "[Placeholder] 内容大纲。以下各节说明政策需要涵盖的内容，并非实际政策。",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "我们是谁以及如何联系我们",
        paragraphs: [
          "[Placeholder] 数据控制者（XionTech 法律实体）、地址以及隐私问题联系方式。",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "我们收集哪些信息",
        paragraphs: [
          "[Placeholder] 邮箱、姓名、电话、机构、职位，以及您通过表单发送的任何内容（求职时包括简历）。",
          "[Placeholder] 在邮箱收集横幅中输入的邮箱会像表单消息一样发送到公司收件箱。浏览器也会将其保存在会话存储中，直到演示请求页面读取为止。",
        ],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "我们如何使用这些信息",
        paragraphs: [
          "[Placeholder] 仅用于回复您的咨询、安排演示，或审核求职申请和简历。",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "我们与谁共享",
        paragraphs: [
          "[Placeholder] 代表我们处理数据的服务商：Gmail（将表单消息发送到公司收件箱）、Upstash（基于哈希值的请求频率计数器）、Vercel（网站托管和私有简历存储）。",
        ],
      },
      {
        id: PRIVACY.sections[4].id,
        heading: "向越南境外传输",
        paragraphs: [
          "[Placeholder] 数据何时传输到境外（例如普莱诺办公室），以及第 13/2023 号法令要求的保护措施。",
        ],
      },
      {
        id: PRIVACY.sections[5].id,
        heading: "保存期限",
        paragraphs: [
          RETENTION_DECIDED,
          "[Placeholder] 关于保存的最终措辞，以及之后是否增加期限限制。",
        ],
      },
      {
        id: PRIVACY.sections[6].id,
        heading: "Cookie 与分析",
        paragraphs: [
          "[Placeholder] 临时文本。最终文本将说明必要的第一方语言 Cookie（存储什么以及原因），并说明未经同意不会设置非必要 Cookie 或分析工具。",
        ],
      },
      {
        id: PRIVACY.sections[7].id,
        heading: "您的权利",
        paragraphs: [
          "[Placeholder] 查阅、更正或删除您的数据，或撤回同意。申请删除的方式尚未确定。",
        ],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
  productsMeta: {
    title: `学校应用：${parentHub.shortName}、${staffHub.shortName}、${iotApp.shortName}、${aiTutor.shortName} | XionTech`,
    description: `面向家长的 ${parentHub.shortName}、面向教职员工、教师和管理层的 ${staffHub.shortName}，以及面向校园的 ${iotApp.fullName}。XionTech 的互联学校应用。`,
  },
  productsShowcase: {
    madeFor: "适用对象",
    featuresHeading: "功能",
  },
  roadDialog: { close: "关闭" },
  roleTypes: {
    "full-time": "全职",
    "part-time": "兼职",
    contract: "合同制",
    internship: "实习",
  },
  servicesMeta: {
    title:
      "越南软件外包 | Product Engineering, AI, Low-code & Cloud | XionTech",
    description:
      "来自胡志明市的专属团队和端到端软件交付：覆盖美国、欧洲和澳大利亚时区的产品工程、AI、低代码和云。",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "践行“",
      highlight: "Get IT done",
      tail: "”的软件团队。",
    },
    lede: "从胡志明市出发，覆盖美国、欧洲和澳大利亚时区的产品工程、AI、低代码和云交付。我们借助 AI 更智能地工作，并不断革新交付方式。",
    primaryCta: { ...servicesPage.primaryCta, label: START_PROJECT },
  },
  servicesProcess: {
    title: "4-D 流程：从需求到上线。",
    lede: "每个阶段都以您可以查看、测试和批准的成果结束。AI 贯穿每个阶段，我们也在不断改进使用 AI 的方式。",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "八项服务，一个团队。",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description:
          "凭借端到端的工程专长，将创新想法转化为可推向市场的数字产品。",
      },
      {
        ...servicesSection.services[1],
        description: "借助 AI 和高级可视化，将原始数据转化为可执行的洞察。",
      },
      {
        ...servicesSection.services[2],
        description: "将您的领域知识与我们的技术专长相结合，加速创新。",
      },
      {
        ...servicesSection.services[3],
        description: "在需要时以灵活的方式获得专业技术人才。",
      },
      {
        ...servicesSection.services[4],
        description: "根据您的独特需求开发定制解决方案。",
      },
      {
        ...servicesSection.services[5],
        description: "在主流低代码平台上更快地交付工具和自动化。",
      },
      {
        ...servicesSection.services[6],
        description: "借助人工智能变革运营。",
      },
      {
        ...servicesSection.services[7],
        description: "覆盖 Azure、AWS 和 GCP 的专业解决方案。",
      },
    ],
  },
  shell: {
    names: SERVICE_NAMES,
    nav: {
      home: HOME,
      products: "产品",
      services: "服务",
      news: "新闻",
      about: "关于我们",
      careers: "招聘",
      skipLink: "跳至主要内容",
      mainNav: "主导航",
      homeLink: "XionTech 首页",
      logoAlt: "XionTech, Get IT Done",
      menu: "菜单",
      contact: "联系我们",
      cityPlano: "普莱诺",
      cityHcmc: "胡志明市",
    },
    language: { label: "语言" },
    footer: {
      blurb: "为学校和企业提供教育科技产品与软件交付服务。",
      products: "产品",
      forSchools: "面向学校",
      forStudents: "面向学生",
      forParents: "面向家长",
      services: "服务",
      howWeWork: "工作方式",
      allServices: "所有服务",
      company: "公司",
      aboutUs: "关于我们",
      offices: "办公地点",
      privacy: PRIVACY_LINK,
    },
    notFound: {
      metaTitle: "页面未找到 | XionTech",
      title: "您偏离了道路。",
      lede: "您要找的页面不在这里。沿着道路返回首页，或在下方选择一条路线。",
      primary: "返回首页",
      here: "当前位置",
    },
  },
  meta: {
    title: "XionTech",
    description: "IT 服务与产品工程：AI、云、定制应用和低代码解决方案。",
  },
};
