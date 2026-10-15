import { SERVICES } from "@/components/layout/nav-data";
import {
  aboutCta,
  aboutFaq,
  aboutHero,
  aboutOffices,
  aboutStory,
} from "@/content/about";
import { appById } from "@/content/apps";
import { careersLife } from "@/content/careers";
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
import { journeyBoard, productDetails, productRoad } from "@/content/products";
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
      ? { ...contact, ariaLabel: `${prefix}${contact.label}${NEW_TAB}` }
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

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "家长与家庭",
    features: [
      "实时到校提醒",
      "已发布的成绩和评语",
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
      "考勤和学生档案",
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
      "设备集中管理",
      "照明和空调定时控制",
      "集中管理门禁与区域",
      "全校园能耗",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "学生，教师从旁陪伴",
    features: [
      "按技能检查理解程度",
      "个性化的分步提示",
      "只有能独立完成时才算掌握",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub": "让家长随时了解孩子的校园生活，与学校保持联系。",
  "staff-hub": "把学校的日常运营汇集到一个互联的工作空间。",
  iot: "让学校更轻松地管理互联的校园技术。",
  "ai-tutor": "通过引导式学习，帮助学生理解错误、建立信心。",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech 做什么？",
    answer:
      "我们打造 AI 驱动的产品，并为企业提供定制软件、产品工程、专属团队和技术解决方案。",
  },
  industries: {
    question: "你们服务哪些行业？",
    answer:
      "教育是我们的起点。我们根据每位客户的需求，把灵活的工程能力带到其他行业的项目中。",
  },
  begin: {
    question: "新项目如何开始？",
    answer:
      "我们先了解您的目标和需求，确定实施方法，再依次推进设计、开发、测试和部署。",
  },
  "time-zones": {
    question: "你们的团队如何跨时区协作？",
    answer:
      "我们在普莱诺、胡志明市、河内和岘港的团队覆盖美国、欧洲和澳大利亚时区，并通过共享工具实时同步进展。",
  },
  quality: {
    question: "你们如何保证交付质量？",
    answer:
      "工程师会评审工作成果，并按照约定的项目标准，将测试和质量保证与 AI 辅助开发相结合。",
  },
};

// Home asks its own four (website copy v3).
const HOME_FAQ: Record<string, { question: string; answer: string }> = {
  "try-apps": {
    question: "我们学校如何试用 Parent Hub 或 Staff Hub？",
    answer:
      "在产品页面留下您的工作邮箱，我们会结合贵校的实际场景为您介绍这些应用。",
  },
  "time-zones": {
    question: "你们如何跨时区协作？",
    answer:
      "我们在普莱诺、胡志明市、河内和岘港的团队覆盖美国、欧洲和澳大利亚时区，并通过共享工具实时同步进展。",
  },
  results: {
    question: "我们可以期待什么成果？",
    answer:
      "由技术娴熟的越南工程师带来高性价比的交付、按时发布，以及支持您发展的可衡量成果。",
  },
  feedback: {
    question: "项目进行中我们如何反馈意见？",
    answer:
      "通过专属沟通渠道、频繁的进度沟通和敏捷冲刺，让您的意见贯穿始终地塑造产品。",
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
      description:
        "通过端到端设计、定制软件开发、测试和上线支持，把您的想法变成可以推向市场的产品。",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "扩充您的团队",
      description: "当内部团队需要更多人手或特定技能时，补充专业的技术人才。",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "升级现有平台",
      description:
        "在保留现有可靠部分的同时，改进应用、基础设施、云交付和工程实践。",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "借助 AI 创造商业价值",
      description:
        "构建 AI 驱动的解决方案，实现流程自动化，把业务数据转化为可行的洞察，支持更明智的决策。",
    },
  ],
};

const START_PROJECT = "启动项目";

const PROCESS_STEPS = [
  {
    title: "探索",
    line: "通过工作坊厘清您的目标、用户、风险和范围，把想法转化为清晰的需求",
    receive: "清晰的需求、估算和交付计划",
  },
  {
    title: "设计",
    line: "这些需求变成用户流程和可点击的原型，让产品在开发前就能看见并不断完善",
    receive: "经过确认的原型和技术设计",
  },
  {
    title: "开发",
    line: "以确认的原型为指引，在敏捷冲刺中开发，每个冲刺都进行测试",
    receive: "每次演示都能交付经过测试、可运行的软件",
  },
  {
    title: "部署",
    line: "成品安全上线，随后在真实使用中持续监控和改进",
    receive: "正式运行的产品和持续支持",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "4-D 流程",
  receiveLabel: "您将获得",
  start: {
    ...processFlow.start,
    title: "您的需求",
    line: "一个想法、一份需求说明或一项业务需要",
  },
  end: {
    ...processFlow.end,
    title: "上线",
    line: "一次次发布，与您共同成长产品",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "为学校社区打造的一系列互联产品，将家长、学习、教职员工工作和校园技术连接成一个生态系统。";

const PRIVACY_META_TITLE = "隐私政策 | XionTech";

const RETENTION_DECIDED =
  "咨询和演示请求、提交的电子邮箱地址，以及求职申请和简历均无限期保存。";

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
  aboutCta: {
    title: "一起打造下一步",
    text: "有产品想法、技术难题，或需要扩充的工程团队？让我们一起探讨如何把您的目标变成有意义的解决方案。",
    primary: { href: aboutCta.primary.href, label: "聊聊您的项目" },
    secondary: { href: aboutCta.secondary.href, label: "了解我们的产品" },
  },
  aboutFaq: {
    title: "想更了解 XionTech？",
    lede: "与我们合作前，您可能想知道的几件事。",
    items: ABOUT_FAQ_ITEMS,
  },
  aboutHero: {
    title: {
      lead: "我们是 XionTech。",
      middle: "以",
      accent: "主人翁精神",
      tail: "打造技术",
    },
    text: "我们把人、想法和技术连接在一起，打造有意义的数字解决方案。从开发软件产品到探索 AI 驱动的创新，我们结合工程专长、经验丰富的领导力和强烈的主人翁精神，帮助企业不断前进。",
    links: [
      { href: aboutHero.links[0].href, label: "与我们的团队交流" },
      { href: aboutHero.links[1].href, label: "了解服务" },
    ],
  },
  aboutMeta: {
    title: "关于 XionTech | Get IT Done",
    description:
      "XionTech 是一家在美国和越南设有团队的工程合作伙伴。我们打造软件产品，探索 AI 驱动的创新，并与客户一起对交付负责。",
  },
  aboutOffices: {
    title: "两个交付中心，一支互联的团队",
    lede: "从普莱诺到胡志明市，我们的团队跨时区协作，为客户提供支持，推动项目不断前进。",
    timeLabel: "当地时间",
    mapLabel: "在 Google 地图中打开{city}（在新标签页中打开）",
    locations: [
      {
        ...aboutOffices.locations[0],
        eyebrow: US_DELIVERY_CENTER,
        city: "得克萨斯州普莱诺",
      },
      {
        ...aboutOffices.locations[1],
        eyebrow: VIETNAM_DELIVERY_CENTER,
        city: "胡志明市",
      },
    ],
  },
  aboutStory: {
    title: {
      lead: "灵感源于山。",
      middle: "",
      highlight: "使命",
      tail: "驱动我们前行",
    },
    paragraphs: [
      "我们的名字源于一座山：它象征着抱负、团结，以及攀登新高峰的决心。",
      "这种精神塑造了今天的我们。我们把人与技术连接在一起，勇于迎接挑战，对自己打造的一切负责，努力迈向一个由创新带来有意义进步的未来。",
    ],
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        label: "保持敏捷",
        title: "有目标地适应。",
        text: "保持灵活，积极应对变化，持续朝重要的方向前进。",
      },
      {
        label: "主人翁精神",
        title: "对结果负责。",
        text: "敢于发声，勇于担当，从开始到结束把事情做好。",
      },
      {
        label: "创新",
        title: "让创新真正有用。",
        text: "探索能为人和企业创造实际价值的新想法和新技术。",
      },
      {
        label: "共同成长",
        title: "携手更出色。",
        text: "分享知识，互相支持，在协作和反馈中共同成长。",
      },
      {
        label: "Get IT done",
        title: "把想法变成影响力。",
        text: "不止于想法，交付真正带来改变的实用解决方案。",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  aboutValuesHeading: {
    title: "驱动我们的力量",
    lede: "五项原则，指引我们如何协作、如何决策，以及如何交付有意义的成果。",
  },
  appTaglines: APP_TAGLINES,
  careersGain: {
    heading: "我们珍视的原则",
    intro:
      "提升技能，探索新技术，与互相支持的伙伴一起工作。以下是你在 XionTech 可以期待的。",
    cards: [
      {
        number: "01",
        title: "在实践中学习",
        text: "通过工作坊、知识分享和真实的工程挑战，在动手中学习。",
      },
      {
        number: "02",
        title: "AI 与新技术",
        text: "探索帮助你更聪明工作的 AI 工具、自动化和现代技术。",
      },
      {
        number: "03",
        title: "真实项目",
        text: "解决真实的客户问题，看到你的工作带来的改变。",
      },
      {
        number: "04",
        title: "团队时光",
        text: "通过团队活动、共同学习和一起庆祝成功，建立彼此的联系。",
      },
    ],
  },
  careersHero: {
    title: { first: "加入", second: "XionTech" },
    lede: "我们汇聚好奇心强的人：热爱解决问题、探索新技术，并打造能带来改变的产品。",
    prompt: "准备好与我们一起创造了吗？",
    artAlt: "三张叠放的卡片，展示 AI 驱动的工程、代码芯片和互联技术",
  },
  careersLife: {
    heading: "认识 XionTech 团队",
    lede: "在 XionTech，我们认真对待工程，但不会太把自己当回事。我们提出问题、勇于担当，并一起不断学习。下班后，我们把同样的团队精神带到羽毛球场、足球场、卡拉 OK 麦克风前和游戏大厅里。",
    tagsLabel: "我们团队的兴趣",
    tags: [
      "羽毛球常客",
      "足球迷",
      "英雄联盟小队",
      "K 歌之夜成员",
      "下班小聚",
      "咖啡爱好者",
      "二次元",
      "吉他手",
      "AI 探索者",
      "电影迷",
      "...你呢？",
    ],
    stripLabel: "XionTech 团队照片",
    photoAlt: "XionTech 团队瞬间",
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
    heading: "寻找你的下一个挑战",
    emptyText: "目前暂无在招职位。",
    applyLabel: "查看并申请",
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
      email: "电子邮箱",
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
      lede: "正在打造新产品，或想改进现有产品？告诉我们您的目标，我们会一起探讨如何提供帮助。",
      name: "姓名",
      email: "电子邮箱",
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
        heading: "看看它在贵校如何运行",
        lede: "留下您的工作邮箱，我们将为贵校安排一场量身定制的演示。",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "联系我们",
        consent: "您的邮箱仅用于安排演示。",
      },
      project: {
        heading: "告诉我们您在打造什么",
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
  footerOffices: [
    { ...footerOffices[0], tag: US_DELIVERY_CENTER },
    {
      ...footerOffices[1],
      name: "胡志明市",
      tag: VIETNAM_DELIVERY_CENTER,
    },
  ],
  hcmc: hcmcZh,
  homeApps: {
    title: "互联的学校",
    lede: "用为家长、教职员工、学生和校园运营打造的互联解决方案，把整个学校社区连接在一起，让日常的学校管理更简单。",
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
    title: "为什么选择 XionTech",
    lede: "我们亲自打造产品，并把这些实践经验带给客户，将行业探索、工程担当和 AI 辅助开发结合在一起。",
    delivery: {
      label: "全球交付",
      title: "两个总部，同一个工作日",
      line: "跨时区的团队利用切实可行的重叠工作时间，让开发持续推进。",
    },
    industries: {
      label: "领域专长",
      title: "从教育出发，灵活适应",
      line: "我们在教育科技领域的积累，为面向各行各业开发定制解决方案打下了坚实基础。",
      main: "教育",
      more: ["医疗", "物流", "私募股权"],
      moreLabel: "另外 3 个行业：医疗、物流、私募股权",
    },
    motto: {
      lead: "Get IT Done",
      title: "从最初的想法到交付，始终以主人翁精神打造。",
      line: "",
    },
  },
  homeDoors: {
    label: "我们的业务",
    products: {
      ...homeDoors.products,
      label: "面向学校的产品",
      title: "同一生态中的多个平台",
      line: "一个集成的 AI 驱动生态系统，提升学习体验，简化学校管理，让学生保持投入",
    },
    services: {
      ...homeDoors.services,
      label: "外包服务",
      title: "为您的企业定制软件",
      line: "与我们的专属团队一起开发定制软件。我们围绕您的产品组建团队，从探索到上线和后续支持全程与您同行。",
      chips: [...homeDoors.services.chips.slice(0, -1), "另有 3 项"],
    },
  },
  homeFaq: {
    title: "联系我们之前",
    lede: "关于我们的产品、服务和工作方式的坦诚解答。",
    items: homeFaq.items.map((item) => ({
      id: item.id,
      ...HOME_FAQ[item.id],
    })),
    link: { href: homeFaq.link.href, label: "查看所有问题" },
  },
  homeHero: {
    title: {
      lines: ["更智能地构建。", "更快速地发布。"],
      highlight: "Get IT done",
      tail: "",
    },
    sub: "XionTech 将实践经验与现代技术相结合，打造 AI 驱动的产品和定制解决方案，解决企业面临的挑战。",
    motion: { pause: "暂停动画", play: "播放动画" },
    cta: { href: homeHero.cta.href, label: "联系我们" },
  },
  homeMeta: {
    title: "XionTech | 学校平台与越南软件外包",
    description:
      "XionTech 打造 AI 驱动的产品和定制解决方案：学校平台（Parent Hub、Staff Hub、IoT、AI Tutor）以及来自越南的软件外包。",
  },
  homeNews: {
    heading: "XionTech 最新动态",
    lede: "了解我们正在打造的产品、正在探索的想法，以及背后的团队。",
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
    title: "我们的工作方式",
    lede: "从想法到上线，我们的 4-D 流程为每个阶段带来清晰、协作和可衡量的进展。借助 AI 辅助的工作流程和清晰的交付物，您可以从头到尾参与其中。",
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
    title: "驱动我们的力量",
    lede: "五项原则，指引我们如何协作、如何决策，以及如何交付有意义的成果。",
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
    details: "详情",
    lanes: ["学生", "教师与教职员工", "家长"].map((label, i) => ({
      ...journeyBoard.lanes[i],
      label,
    })),
  },
  journeyMap: {
    intro: {
      title: "各自打造，携手更强",
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
    allFilter: { id: newsPage.allFilter.id, label: "全部" },
    empty: "该类别暂无文章。",
    showAll: "显示全部",
    countOne: "显示 1 篇文章",
    countMany: "显示 {n} 篇文章",
  },
  newsStory: {
    storyLabel: "文章",
    backToNews: {
      href: newsStory.backToNews.href,
      label: "返回新闻",
    },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoZh, hcmcZh],
  otherLocations: "河内、岘港",
  plano: planoZh,
  privacy: {
    metaTitle: PRIVACY_META_TITLE,
    metaDescription: "XionTech 如何使用您通过我们的表单提供的个人数据。",
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCurrent: PRIVACY_LINK,
    title: PRIVACY_LINK,
    bodyLabel: "政策",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "我们收集的信息",
        paragraphs: [
          "电子邮箱、姓名、电话号码、机构、职位，以及您通过我们的表单发送的任何内容，包括您申请职位时提交的简历。",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "我们如何使用这些信息",
        paragraphs: ["仅用于回复您的请求，或审阅您的求职申请和简历。"],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "我们与谁共享",
        paragraphs: [
          "代表我们处理数据的服务提供商：Gmail（将表单消息发送到公司收件箱）、Upstash（由哈希值生成的限流计数器）、Vercel（网站托管和简历私密存储）、Google Fonts（日文、韩文和中文页面所用的字体）。",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "我们保留多久",
        paragraphs: [RETENTION_DECIDED],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
  productRoad: {
    ...productRoad,
    start: "出发",
    finish: "到达",
  },
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
    title: "越南软件外包 | XionTech",
    description:
      "来自胡志明市的软件外包：产品工程、AI 驱动的分析、共创、人才派遣、定制应用、低代码、AI 解决方案和云。",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "您带来",
      words: ["愿景", "挑战", "想法", "抱负", "目标"],
      suffix: "。",
      tail: ["我们以“", "Get IT done", "”回应"],
      staticWord: "愿景。",
      label: "您带来愿景。我们以“Get IT done”回应",
    },
    lede: "从数字产品到 AI 集成和技术现代化，我们提供专业能力，帮助您解决挑战、加速创新、推动业务向前发展。",
    primaryCta: { ...servicesPage.primaryCta, label: "一起打造" },
    secondaryCta: { ...servicesPage.secondaryCta, label: "了解我们的服务" },
    stack: {
      label: "插图：软件构建中的需求、线框图和技术代码三个层次",
      requirements: "需求",
      wireframe: "线框图",
      code: "技术代码",
    },
  },
  servicesProcess: {
    title: "我们的 4-D 流程：从您的需求到上线",
    lede: "每个阶段都以您可以查看、测试和批准的成果结束。AI 贯穿每个阶段，我们也在不断改进使用 AI 的方式。",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "八项服务，一支团队",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description: "把想法变成可以推向市场的数字产品，从概念到上线。",
      },
      {
        ...servicesSection.services[1],
        description: "借助 AI 和直观的仪表板，把复杂数据转化为可行的洞察。",
      },
      {
        ...servicesSection.services[2],
        description:
          "将您的行业知识与我们的产品专长相结合，打造真正有价值的解决方案。",
      },
      {
        ...servicesSection.services[3],
        description: "找到合适的技术人才，支持您的项目并扩充团队。",
      },
      {
        ...servicesSection.services[4],
        description: "构建贴合您业务需求和工作流程的定制应用。",
      },
      {
        ...servicesSection.services[5],
        description:
          "借助灵活的低代码平台，更快地构建应用、实现工作流程自动化。",
      },
      {
        ...servicesSection.services[6],
        description: "用智能解决方案让 AI 发挥作用，简化流程、提升效率。",
      },
      {
        ...servicesSection.services[7],
        description: "构建、扩展和管理云解决方案，支持您不断成长的业务。",
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
      contactShort: "联系我们",
      cityPlano: "普莱诺",
      cityHcmc: "胡志明市",
    },
    language: { label: "语言" },
    theme: { label: "深色模式" },
    backToTop: { label: "返回顶部" },
    footer: {
      blurb:
        "XionTech 将实践经验与现代技术相结合，打造 AI 驱动的产品和定制解决方案，解决企业面临的挑战。",
      products: "产品",
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
      title: "页面未找到",
      primary: "返回首页",
    },
  },
  meta: {
    title: "XionTech",
    description: "IT 服务与产品工程：AI、云、定制应用和低代码解决方案。",
  },
};
