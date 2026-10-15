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

// Korean. AI-translated from the English for native review. Product and
// service names and "Get IT done" stay English; addresses, numbers, emails,
// hrefs and ids are shared with English.

const parentHub = appById("parent-hub");
const staffHub = appById("staff-hub");
const iotApp = appById("iot");
const aiTutor = appById("ai-tutor");

const count = (n: number) => n.toLocaleString("ko-KR");

const NEW_TAB = "(새 탭에서 열림)";
const US_DELIVERY_CENTER = "미국 딜리버리 센터";
const VIETNAM_DELIVERY_CENTER = "베트남 딜리버리 센터";
const DETAILS_CONSENT = "입력하신 정보는 이 문의에 답변하는 데에만 사용합니다.";
const SEND_ERROR = "요청을 보내지 못했습니다. 다시 시도해 주세요.";
const RATE_ERROR =
  "짧은 시간에 여러 번 요청하셨습니다. 몇 분 후에 다시 시도해 주세요.";
const FIX_HEADING = "다음 항목을 수정해 주세요:";
const PRIVACY_LINK = "개인정보 처리방침";
const SUMMIT = "정상에 도착했습니다. 감사합니다!";
const FLIP_FRONT = "카드를 뒤집어 자세히 보기";
const FLIP_BACK = "되돌리기";
const BREADCRUMB = "탐색 경로";
const HOME = "홈";

// The accessible name of an external contact: its visible label, an optional
// prefix (the bracketed views drop "WhatsApp" from the label) and the new-tab note.
const withNewTab = (contacts: OfficeContact[], prefix = ""): OfficeContact[] =>
  contacts.map((contact) =>
    contact.external
      ? { ...contact, ariaLabel: `${prefix}${contact.label} ${NEW_TAB}` }
      : contact,
  );

const planoKo: Office = {
  ...plano,
  name: "미국 텍사스주 플레이노",
  contacts: withNewTab(plano.contacts),
  zoneLabel: "미국 중부 시간",
};

const hcmcKo: Office = {
  ...hcmc,
  name: "베트남 호찌민시",
  tag: VIETNAM_DELIVERY_CENTER,
};

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "학부모와 가족",
    features: [
      "실시간 도착 알림",
      "공개된 성적과 피드백",
      "교사와 양방향 메시지",
      "명확한 영수증과 함께 학비 납부",
    ].map((title, i) => ({
      ...productDetails["parent-hub"].features[i],
      title,
    })),
  },
  "staff-hub": {
    madeFor: "교직원, 교사, 학교 관리자",
    features: [
      "출결과 학생 기록",
      "학급, 시간표, 성적",
      `${parentHub.shortName}를 통한 학부모 메시지`,
      "오늘의 우선순위를 보여 주는 관리자 대시보드",
    ].map((title, i) => ({
      ...productDetails["staff-hub"].features[i],
      title,
    })),
  },
  iot: {
    madeFor: "시설 운영 및 유지보수 팀",
    features: [
      "기기 통합 관리",
      "조명과 냉난방 예약 제어",
      "중앙에서 관리하는 출입문과 구역",
      "캠퍼스 전체의 에너지 사용량",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "교사와 함께하는 학생",
    features: [
      "기술별 이해도 점검",
      "학생에게 맞춘 단계별 힌트",
      "혼자 해낼 수 있을 때에만 인정되는 숙달",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub":
    "학부모가 자녀의 학교생활을 늘 알고, 가까이 연결되도록 돕습니다.",
  "staff-hub": "학교의 일상 운영을 하나로 연결된 업무 공간에 모읍니다.",
  iot: "캠퍼스의 커넥티드 기술 관리를 간편하게 만듭니다.",
  "ai-tutor":
    "안내형 학습으로 학생이 실수를 이해하고 자신감을 키우도록 돕습니다.",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech는 어떤 일을 하나요?",
    answer:
      "AI 기반 제품을 만들고, 기업을 위한 맞춤형 소프트웨어, 제품 엔지니어링, 전담 팀, 기술 솔루션을 제공합니다.",
  },
  industries: {
    question: "어떤 산업과 함께 일하나요?",
    answer:
      "교육이 우리의 출발점입니다. 고객마다 다른 요구에 맞춰, 유연한 엔지니어링 역량을 다른 산업의 프로젝트에도 제공합니다.",
  },
  begin: {
    question: "새 프로젝트는 어떻게 시작되나요?",
    answer:
      "먼저 목표와 요구 사항을 이해하고 접근 방식을 정한 뒤, 디자인, 개발, 테스트, 배포 단계로 나아갑니다.",
  },
  "time-zones": {
    question: "팀은 여러 시간대에서 어떻게 일하나요?",
    answer:
      "플레이노, 호찌민시, 하노이, 다낭의 팀이 미국, 유럽, 호주 시간대를 지원하며, 공유 도구로 실시간 업데이트를 제공합니다.",
  },
  quality: {
    question: "개발 품질은 어떻게 유지하나요?",
    answer:
      "엔지니어가 작업을 검토하고, 합의된 프로젝트 기준에 따라 테스트와 품질 보증을 AI 지원 개발과 결합합니다.",
  },
};

// Home asks its own four (website copy v3).
const HOME_FAQ: Record<string, { question: string; answer: string }> = {
  "try-apps": {
    question: "우리 학교는 Parent Hub나 Staff Hub를 어떻게 체험할 수 있나요?",
    answer:
      "제품 페이지에 업무용 이메일을 남겨 주시면, 귀교의 실제 상황을 바탕으로 앱을 소개해 드립니다.",
  },
  "time-zones": {
    question: "여러 시간대에서 어떻게 일하나요?",
    answer:
      "플레이노, 호찌민시, 하노이, 다낭의 팀이 미국, 유럽, 호주 시간대를 지원하며, 공유 도구로 실시간 업데이트를 제공합니다.",
  },
  results: {
    question: "어떤 성과를 기대할 수 있나요?",
    answer:
      "숙련된 베트남 엔지니어의 비용 효율적인 개발, 일정에 맞춘 릴리스, 그리고 성장을 뒷받침하는 측정 가능한 성과입니다.",
  },
  feedback: {
    question: "프로젝트 중에는 어떻게 피드백을 전달하나요?",
    answer:
      "전용 채널, 잦은 점검 미팅, 애자일 스프린트를 통해 고객의 의견이 처음부터 끝까지 제품에 반영됩니다.",
  },
};

const ABOUT_FAQ_ITEMS = aboutFaq.items.map((item) => ({
  id: item.id,
  ...FAQ[item.id],
}));

const SERVICES_LEDE =
  "하나의 서비스를 선택하거나 여러 서비스를 조합하세요. 귀사의 제품에 맞춰 팀을 구성합니다.";

const OUTCOMES: Dictionaries["servicesOutcomes"] = {
  title: "무엇을 이루도록 도와드릴까요?",
  items: [
    {
      id: servicesOutcomes.items[0].id,
      title: "새로운 디지털 제품 만들기",
      description:
        "엔드투엔드 디자인, 맞춤형 소프트웨어 개발, 테스트, 출시 지원으로 아이디어를 시장에 내놓을 수 있는 제품으로 만듭니다.",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "팀 확장하기",
      description:
        "내부 팀에 더 많은 인력이나 특정 역량이 필요할 때 전문 기술 인재를 더합니다.",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "기존 플랫폼 현대화하기",
      description:
        "이미 잘 작동하는 부분은 지키면서 애플리케이션, 인프라, 클라우드 제공, 엔지니어링 방식을 개선합니다.",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "AI로 비즈니스 가치 만들기",
      description:
        "AI 기반 솔루션을 구축하고, 업무를 자동화하며, 비즈니스 데이터를 더 나은 의사 결정을 위한 실질적인 인사이트로 바꿉니다.",
    },
  ],
};

const START_PROJECT = "프로젝트 시작하기";

const PROCESS_STEPS = [
  {
    title: "디스커버리",
    line: "워크숍으로 목표, 사용자, 리스크, 범위를 파악하고 아이디어를 명확한 요구 사항으로 정리합니다",
    receive: "명확한 요구 사항, 견적, 개발 계획",
  },
  {
    title: "디자인",
    line: "요구 사항을 사용자 흐름과 클릭 가능한 프로토타입으로 만들어, 개발 전에 제품을 보고 다듬을 수 있게 합니다",
    receive: "승인된 프로토타입과 기술 설계",
  },
  {
    title: "개발",
    line: "승인된 프로토타입을 바탕으로 애자일 스프린트로 개발하며, 스프린트마다 테스트합니다",
    receive: "데모마다 테스트를 거친, 작동하는 소프트웨어",
  },
  {
    title: "배포",
    line: "완성된 제품을 안전하게 출시하고, 실제 사용을 통해 모니터링하고 개선합니다",
    receive: "운영 중인 제품과 지속적인 지원",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "4-D 프로세스",
  receiveLabel: "받으시는 결과물",
  start: {
    ...processFlow.start,
    title: "고객의 요청",
    line: "아이디어, 요청서 또는 비즈니스 요구",
  },
  end: {
    ...processFlow.end,
    title: "출시",
    line: "릴리스를 거듭하며 제품을 함께 키워 갑니다",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "학교 커뮤니티를 위한 연결된 제품군으로, 학부모, 학습, 교직원 업무, 캠퍼스 기술을 하나의 생태계로 묶습니다.";

const PRIVACY_META_TITLE = "개인정보 처리방침 | XionTech";

const RETENTION_DECIDED =
  "문의 및 데모 요청, 제출된 이메일 주소, 입사 지원서와 이력서는 기간 제한 없이 보관됩니다.";

const ERRORS = {
  name: "이름을 입력해 주세요.",
  email: "올바른 이메일 주소를 입력해 주세요.",
  org: "소속 기관을 입력해 주세요.",
  phone: "올바른 전화번호를 입력해 주세요. 예: (+1) 469 322 9899.",
  date: "오늘 또는 이후 날짜를 선택해 주세요.",
  message: `메시지는 ${count(MESSAGE_MAX_LENGTH)}자 미만이어야 합니다.`,
};

export const ko: Dictionaries = {
  aboutCta: {
    title: "다음을 함께 만들어요",
    text: "제품 아이디어, 기술 과제, 또는 확장할 엔지니어링 팀이 있으신가요? 목표를 의미 있는 솔루션으로 바꾸는 방법을 함께 찾아보세요.",
    primary: { href: aboutCta.primary.href, label: "프로젝트 이야기하기" },
    secondary: { href: aboutCta.secondary.href, label: "제품 살펴보기" },
  },
  aboutFaq: {
    title: "XionTech가 궁금하신가요?",
    lede: "함께 일하기 전에 알아 두면 좋은 몇 가지입니다.",
    items: ABOUT_FAQ_ITEMS,
  },
  aboutHero: {
    title: {
      lead: "우리는 XionTech입니다.",
      middle: "",
      accent: "주인의식",
      tail: "으로 만드는 기술",
    },
    text: "사람과 아이디어, 기술을 연결해 의미 있는 디지털 솔루션을 만듭니다. 소프트웨어 제품 개발부터 AI 기반 혁신 탐구까지, 엔지니어링 전문성과 경험 많은 리더십, 그리고 강한 주인의식으로 기업의 전진을 돕습니다.",
    links: [
      { href: aboutHero.links[0].href, label: "제품 살펴보기" },
      { href: aboutHero.links[1].href, label: "서비스 살펴보기" },
    ],
  },
  aboutMeta: {
    title: "XionTech 소개 | Get IT Done",
    description:
      "XionTech는 미국과 베트남에 팀을 둔 엔지니어링 파트너입니다. 소프트웨어 제품을 만들고, AI 기반 혁신을 탐구하며, 고객과 함께 책임감 있게 개발을 이끕니다.",
  },
  aboutOffices: {
    title: "두 개의 딜리버리 센터, 하나로 연결된 팀",
    lede: "플레이노에서 호찌민시까지, 팀이 여러 시간대에 걸쳐 고객을 지원하고 프로젝트를 앞으로 나아가게 합니다.",
    timeLabel: "현지 시간",
    mapLabel: "Google 지도에서 {city} 열기(새 탭에서 열림)",
    locations: [
      {
        ...aboutOffices.locations[0],
        eyebrow: US_DELIVERY_CENTER,
        city: "텍사스주 플레이노",
      },
      {
        ...aboutOffices.locations[1],
        eyebrow: VIETNAM_DELIVERY_CENTER,
        city: "호찌민시",
      },
    ],
  },
  aboutStory: {
    title: {
      lead: "산에서 영감을 얻었습니다.",
      middle: "",
      highlight: "목적",
      tail: "이 우리를 이끕니다",
    },
    paragraphs: [
      "우리의 이름은 산에서 영감을 얻었습니다. 산은 포부와 단결, 그리고 새로운 정상에 오르려는 의지의 상징입니다.",
      "그 정신이 오늘의 우리를 만듭니다. 사람과 기술을 연결하고, 도전을 받아들이며, 우리가 만드는 것에 책임을 지고, 혁신이 의미 있는 진보를 만드는 미래를 향해 나아갑니다.",
    ],
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        label: "민첩하게",
        title: "목적을 가지고 적응합니다.",
        text: "유연하게 변화에 대응하며 중요한 것을 향해 계속 나아갑니다.",
      },
      {
        label: "주인의식",
        title: "결과에 책임집니다.",
        text: "의견을 말하고, 책임을 지며, 처음부터 끝까지 해냅니다.",
      },
      {
        label: "혁신",
        title: "쓸모 있는 혁신을 만듭니다.",
        text: "사람과 기업에 의미 있는 가치를 만드는 새로운 아이디어와 기술을 탐구합니다.",
      },
      {
        label: "함께 성장",
        title: "함께여서 더 좋습니다.",
        text: "지식을 나누고 서로를 지지하며, 협업과 피드백으로 함께 성장합니다.",
      },
      {
        label: "Get IT done",
        title: "아이디어를 성과로 바꿉니다.",
        text: "아이디어에 머물지 않고, 변화를 만드는 실용적인 솔루션을 제공합니다.",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  aboutValuesHeading: {
    title: "우리를 움직이는 것",
    lede: "협업하고, 결정하고, 의미 있는 결과를 내는 방식을 이끄는 다섯 가지 원칙입니다.",
  },
  appTaglines: APP_TAGLINES,
  careersGain: {
    heading: "함께하며 얻게 되는 것",
    intro:
      "역량을 키우고, 새로운 기술을 탐구하며, 서로를 지지하는 동료들과 일하세요. XionTech에서 기대할 수 있는 것들을 소개합니다.",
    cards: [
      {
        number: "01",
        title: "실전에서 배우기",
        text: "워크숍, 지식 공유, 실제 엔지니어링 과제를 통해 직접 해 보며 배웁니다.",
      },
      {
        number: "02",
        title: "AI와 새로운 기술",
        text: "더 스마트하게 일하도록 돕는 AI 도구, 자동화, 최신 기술을 탐구합니다.",
      },
      {
        number: "03",
        title: "실제 프로젝트",
        text: "고객의 실제 문제를 해결하고, 내 일이 만드는 변화를 직접 확인합니다.",
      },
      {
        number: "04",
        title: "팀 경험",
        text: "팀 활동, 함께하는 배움, 성공을 함께 축하하는 시간을 통해 관계를 쌓습니다.",
      },
    ],
  },
  careersHero: {
    title: {
      first: "호기심을 잃지 마세요.",
      second: "다음을 만드세요",
    },
    lede: "빠르게 배우고, 더 나은 질문을 하고, 상황이 바뀌면 적응하며, 과업만이 아니라 결과를 중요하게 여기는 사람들을 위한 팀을 만들고 있습니다. 이곳에서 AI로 소프트웨어를 만드는 새로운 방식을 함께 만들어 가게 됩니다.",
  },
  careersLife: {
    heading: "XionTech에서의 일상",
    prevLabel: "이전 사진",
    nextLabel: "다음 사진",
    frames: [
      "[Placeholder] 팀 사진",
      "[Placeholder] 사무실 사진",
      "[Placeholder] 행사 사진",
    ].map((placeholder, i) => ({ ...careersLife.frames[i], placeholder })),
  },
  careersMeta: {
    title: "XionTech 채용 | 호찌민시 소프트웨어 일자리",
    description:
      "호찌민시에서 XionTech와 함께하세요. 사람 중심 문화 속에서 AI/ML, 생성형 AI, 클라우드, 애자일 개발로 학교 플랫폼과 고객 제품을 만듭니다.",
  },
  careersRoles: {
    heading: "다음 도전을 찾아보세요",
    emptyText: "현재 채용 중인 포지션이 없습니다.",
    applyLabel: "보기 및 지원",
  },
  categoryLabels: {
    schools: "학교",
    students: "학생",
    parents: "학부모",
    company: "회사",
  },
  contactErrors: {
    messageRequired: "프로젝트에 대해 조금만 알려 주세요.",
    length: `이 항목은 ${count(TEXT_MAX_LENGTH)}자 미만이어야 합니다.`,
    cv: "이력서를 PDF 또는 Word 형식, 5MB 이하로 업로드해 주세요.",
    note: `메모는 ${count(MESSAGE_MAX_LENGTH)}자 미만이어야 합니다.`,
  },
  contactStrings: {
    metaTitle: "데모 예약 또는 프로젝트 시작 | XionTech",
    metaDescription: `귀교를 위한 ${parentHub.shortName}와 ${staffHub.shortName} 데모를 예약하거나, 소프트웨어 프로젝트에 대해 알려 주세요. XionTech, 호찌민시와 플레이노.`,
    hero: {
      breadcrumbLabel: BREADCRUMB,
      breadcrumbHome: HOME,
      breadcrumbCurrent: "문의하기",
      titleBefore: "귀하의 ",
      titleHighlight: "학교",
      titleAfter: " 또는 프로젝트에 대해 이야기해 보세요.",
      items: [
        `귀교의 상황을 바탕으로 한 ${parentHub.shortName}와 ${staffHub.shortName} 안내.`,
        "도입, 데이터, 지원에 대한 답변.",
        "프로젝트의 경우: 4단계 중 첫 단계인 탐색 상담.",
      ],
      officesLabel: "사무소",
    },
    form: {
      heading: "무엇을 도와드릴까요?",
      tabsLabel: "문의 유형",
      tabDemo: "제품 데모",
      tabProject: "아웃소싱 프로젝트",
      name: "성명",
      email: "이메일 주소",
      org: "학교 또는 회사",
      role: "직책",
      roleHelp: "예: 교장, IT 책임자",
      products: "관심 있는 제품",
      schoolSize: "학교 규모",
      date: "희망 날짜",
      service: "서비스",
      startTiming: "언제 시작하고 싶으신가요?",
      message: "메시지 (선택)",
      submit: "요청 보내기",
      sending: "보내는 중…",
      successHeading: SUMMIT,
      successText: "곧 연락드리겠습니다.",
      sendError: SEND_ERROR,
      rateError: RATE_ERROR,
      consent: DETAILS_CONSENT,
      privacyLink: PRIVACY_LINK,
      errorsHeading: FIX_HEADING,
    },
    home: {
      heading: "만들고 싶은 것이 있나요?",
      lede: "새로운 것을 만들거나 지금 있는 것을 개선하려고 하시나요? 목표를 알려 주시면 어떻게 도울 수 있을지 함께 찾아보겠습니다.",
      name: "이름",
      email: "이메일 주소",
      phone: "전화번호",
      optional: "(선택)",
      phonePlaceholder: CONTACT_STRINGS.home.phonePlaceholder,
      message: "프로젝트에 대해 알려 주세요",
      messagePlaceholder:
        "무엇을 만들고 싶으신가요? 아이디어, 기존 제품, 팀 또는 과제에 대해 알려 주세요.",
      submit: "대화 시작하기",
      consent: "입력하신 정보는 메시지에 답변하는 데에만 사용합니다.",
      successHeading: "정상에 도착했습니다. 감사합니다. 메시지를 받았습니다.",
      successText: "보내 주신 내용을 검토한 뒤 다시 연락드리겠습니다.",
    },
    capture: {
      emailLabel: "업무용 이메일",
      demo: {
        heading: "귀교에서 작동하는 모습을 확인하세요",
        lede: "업무용 이메일을 남겨 주시면 귀교에 맞춘 데모를 준비해 드립니다.",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "문의하기",
        consent: "이메일은 데모 일정을 잡는 데에만 사용합니다.",
      },
      project: {
        heading: "만들고 있는 것을 알려 주세요",
        lede: "업무용 이메일을 남겨 주시면 탐색 단계를 시작하기 위해 연락드리겠습니다.",
        placeholder: CONTACT_STRINGS.capture.project.placeholder,
        button: "문의하기",
        consent: DETAILS_CONSENT,
      },
    },
    errors: ERRORS,
    productPills: CONTACT_STRINGS.productPills,
    defaultProduct: CONTACT_STRINGS.defaultProduct,
    schoolSizes: [
      `학생 ${count(500)}명 미만`,
      `학생 ${count(500)}~${count(1500)}명`,
      `학생 ${count(1500)}명 초과`,
      "여러 캠퍼스",
    ],
    startTimings: ["가능한 한 빨리", "1~3개월 이내", "아직 알아보는 중"],
    services: [...SERVICES.map((service) => service.name), "아직 정하지 않음"],
  },
  footerOffices: [
    { ...footerOffices[0], tag: US_DELIVERY_CENTER },
    {
      ...footerOffices[1],
      name: "호찌민시",
      tag: VIETNAM_DELIVERY_CENTER,
    },
  ],
  hcmc: hcmcKo,
  homeApps: {
    title: "하나로 연결된 학교",
    lede: "학부모, 교직원, 학생, 캠퍼스 운영을 위한 연결된 솔루션으로 학교 공동체 전체를 하나로 모읍니다. 모두 일상적인 학교 운영을 간편하게 하도록 설계되었습니다.",
    apps: homeApps.apps.map((card) => ({
      ...card,
      madeFor: PRODUCT_DETAILS[card.app.id].madeFor,
      features: PRODUCT_DETAILS[card.app.id].features
        .slice(0, 2)
        .map((feature) => feature.title),
    })),
    link: { href: homeApps.link.href, label: "제품 살펴보기" },
  },
  homeCapabilities: {
    title: "왜 XionTech인가",
    lede: "우리는 직접 제품을 만들고, 그 실전 경험을 고객에게 전합니다. 산업 이해, 엔지니어링 책임, AI 지원 개발을 결합합니다.",
    delivery: {
      label: "글로벌 딜리버리",
      title: "두 개의 본사, 하나의 업무일",
      line: "여러 시간대에 걸친 팀이 실질적으로 겹치는 시간을 활용해 개발을 계속 진행합니다.",
    },
    industries: {
      label: "도메인 전문성",
      title: "교육에서 시작해, 어디에든 적응합니다",
      line: "교육 기술을 만들어 온 경험은 여러 산업에 맞춘 솔루션을 개발하는 탄탄한 기반이 됩니다.",
      main: "교육",
      more: ["헬스케어", "물류", "사모펀드"],
      moreLabel: "+3개 산업 더: 헬스케어, 물류, 사모펀드",
    },
    motto: {
      lead: "Get IT Done",
      title: "첫 아이디어부터 납품까지, 주인의식으로 만듭니다.",
      line: "",
    },
  },
  homeDoors: {
    label: "우리가 하는 일",
    products: {
      ...homeDoors.products,
      label: "학교를 위한 제품",
      title: "하나의 생태계로 연결된 플랫폼",
      line: "학습을 풍부하게 하고, 학교 행정을 간소화하며, 학생의 참여를 이끄는 AI 기반 통합 생태계",
    },
    services: {
      ...homeDoors.services,
      label: "아웃소싱 서비스",
      title: "비즈니스를 위한 맞춤형 소프트웨어",
      line: "전담 팀과 함께 맞춤형 소프트웨어를 만드세요. 제품에 맞춰 팀을 구성하고, 디스커버리부터 출시와 지원까지 함께합니다.",
      chips: [...homeDoors.services.chips.slice(0, -1), "+3개 더"],
    },
  },
  homeFaq: {
    title: "문의하기 전에",
    lede: "제품, 서비스, 일하는 방식에 대해 솔직하게 답해 드립니다.",
    items: homeFaq.items.map((item) => ({
      id: item.id,
      ...HOME_FAQ[item.id],
    })),
    link: { href: homeFaq.link.href, label: "모든 질문 보기" },
  },
  homeHero: {
    title: {
      lines: ["더 스마트하게 만들고.", "더 빠르게 출시하고."],
      highlight: "Get IT done",
      tail: "",
    },
    sub: "XionTech는 실무 경험과 최신 기술을 결합해 AI 기반 제품과 맞춤형 솔루션으로 비즈니스 과제를 해결합니다.",
    motion: { pause: "애니메이션 일시 정지", play: "애니메이션 재생" },
    cta: { href: homeHero.cta.href, label: "문의하기" },
  },
  homeMeta: {
    title: "XionTech | 학교 플랫폼과 베트남 소프트웨어 아웃소싱",
    description:
      "XionTech는 AI 기반 제품과 맞춤형 솔루션을 만듭니다. 학교 플랫폼(Parent Hub, Staff Hub, IoT, AI Tutor)과 베트남 소프트웨어 아웃소싱.",
  },
  homeNews: {
    heading: "XionTech 소식",
    lede: "우리가 만들고 있는 것, 탐구하는 아이디어, 그리고 그 일을 하는 사람들을 만나 보세요.",
    seeAll: { href: homeNews.seeAll.href, label: "모든 소식 보기" },
    readStory: "기사 읽기",
  },
  homeOutcomes: {
    title: OUTCOMES.title,
    lede: SERVICES_LEDE,
    items: OUTCOMES.items,
    cta: { href: homeOutcomes.cta.href, label: START_PROJECT },
    link: { href: homeOutcomes.link.href, label: "서비스 살펴보기" },
  },
  homeProcess: {
    title: "우리가 일하는 방식",
    lede: "아이디어에서 출시까지, 4-D 프로세스는 모든 단계에 명확함과 협업, 측정 가능한 진척을 더합니다. AI 지원 워크플로와 명확한 결과물로 처음부터 끝까지 함께 참여하실 수 있습니다.",
    link: { href: homeProcess.link.href, label: "전체 프로세스 보기" },
  },
  homeStats: {
    label: "믿을 수 있는 경험",
    stats: [
      "소프트웨어 분야 리더십 경력(년)",
      "여러 시간대에 걸친 글로벌 지원",
      "다루는 기술 스택",
      "아이디어부터 운영까지의 서비스",
      "거점: 플레이노와 호찌민시 본사",
    ].map((caption, i) => ({ ...homeStats.stats[i], caption })),
  },
  homeValuesHeading: {
    title: "우리를 움직이는 것",
    lede: "협업하고, 결정하고, 의미 있는 결과를 내는 방식을 이끄는 다섯 가지 원칙입니다.",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
  },
  jobDetails: {
    sectionLabel: "포지션 상세 및 지원",
    aboutHeading: "포지션 소개",
    doHeading: "담당 업무",
    bringHeading: "자격 요건",
    backLabel: "모든 채용 포지션",
    backHref: jobDetails.backHref,
  },
  jobForm: {
    heading: "이 포지션에 지원하기",
    name: "성명",
    email: "이메일",
    phone: "전화번호 (선택)",
    cv: "이력서",
    cvHelp: "PDF 또는 Word, 최대 5MB.",
    note: "자기소개 메모 (선택)",
    submit: "지원서 보내기",
    sending: "보내는 중…",
    successHeading: SUMMIT,
    successText: "지원서를 받았습니다. 적합한 경우 연락드리겠습니다.",
    sendError: "지원서를 보내지 못했습니다. 다시 시도해 주세요.",
    rateError: RATE_ERROR,
    consent: "입력하신 정보와 이력서는 지원서 검토에만 사용합니다.",
    privacyLink: PRIVACY_LINK,
    privacyHref: jobForm.privacyHref,
    errorsHeading: FIX_HEADING,
  },
  jobHero: {
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCareers: "채용",
    chipsLabel: "포지션 상세",
  },
  jobMeta: {
    title: "채용 포지션 | XionTech 채용",
    description:
      "포지션 설명을 읽고 이력서와 함께 지원하세요. XionTech, 호찌민시.",
  },
  journeyBoard: {
    ...journeyBoard,
    details: "상세",
    lanes: ["학생", "교사와 교직원", "학부모"].map((label, i) => ({
      ...journeyBoard.lanes[i],
      label,
    })),
  },
  journeyMap: {
    intro: {
      title: "따로 만들고, 함께 더 좋게",
      lede: JOURNEY_LEDE,
    },
  },
  newsMeta: {
    title: "소식 | XionTech",
    description:
      "XionTech의 제품, 학교, 팀, 고객 프로젝트에 대한 짧은 소식입니다.",
  },
  newsPage: {
    title: "최신 소식",
    sub: "최신 소식과 공지를 발표되는 대로 확인하세요.",
    storiesHeading: "모든 기사",
    filtersLabel: "대상별 기사 필터",
    allFilter: { id: newsPage.allFilter.id, label: "전체" },
    empty: "이 카테고리에는 아직 기사가 없습니다.",
    showAll: "모두 보기",
    countOne: "기사 1개 표시 중",
    countMany: "기사 {n}개 표시 중",
  },
  newsStory: {
    storyLabel: "기사",
    backToNews: {
      href: newsStory.backToNews.href,
      label: "소식으로 돌아가기",
    },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoKo, hcmcKo],
  otherLocations: "하노이, 다낭",
  plano: planoKo,
  privacy: {
    metaTitle: PRIVACY_META_TITLE,
    metaDescription:
      "양식을 통해 공유하신 개인 데이터를 XionTech가 어떻게 사용하는지 안내합니다.",
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCurrent: PRIVACY_LINK,
    title: PRIVACY_LINK,
    bodyLabel: "방침",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "수집하는 정보",
        paragraphs: [
          "이메일, 이름, 전화번호, 소속, 직책, 그리고 양식을 통해 보내시는 모든 내용(채용에 지원하시는 경우 이력서 포함).",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "이용 목적",
        paragraphs: [
          "문의에 답변하거나 입사 지원서와 이력서를 검토하는 데에만 이용합니다.",
        ],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "공유 대상",
        paragraphs: [
          "당사를 대신해 데이터를 처리하는 서비스 제공업체: Gmail(양식 메시지를 회사 받은편지함으로 전송), Upstash(해시된 값으로 만든 요청 제한 카운터), Vercel(웹사이트 호스팅 및 이력서 비공개 저장), Google Fonts(일본어, 한국어, 중국어 페이지용 글꼴).",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "보관 기간",
        paragraphs: [RETENTION_DECIDED],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
  productRoad: {
    ...productRoad,
    start: "출발",
    finish: "도착",
  },
  productsMeta: {
    title: `학교용 앱: ${parentHub.shortName}, ${staffHub.shortName}, ${iotApp.shortName}, ${aiTutor.shortName} | XionTech`,
    description: `학부모를 위한 ${parentHub.shortName}, 교직원·교사·관리자를 위한 ${staffHub.shortName}, 캠퍼스를 위한 ${iotApp.fullName}. XionTech의 연결된 학교 앱.`,
  },
  productsShowcase: {
    madeFor: "대상",
    featuresHeading: "기능",
  },
  roadDialog: { close: "닫기" },
  roleTypes: {
    "full-time": "정규직",
    "part-time": "파트타임",
    contract: "계약직",
    internship: "인턴십",
  },
  servicesMeta: {
    title: "베트남 소프트웨어 아웃소싱 | XionTech",
    description:
      "호찌민시에서 제공하는 소프트웨어 아웃소싱: 제품 엔지니어링, AI 기반 분석, 공동 개발, 인력 지원, 맞춤형 앱, 로우코드, AI 솔루션, 클라우드.",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "여러분의 ",
      words: ["비전", "과제", "아이디어", "포부", "목표"],
      suffix: ".",
      tail: ["우리는 ‘", "Get IT done", "’으로 답합니다"],
      staticWord: "비전.",
      label: "여러분의 비전. 우리는 ‘Get IT done’으로 답합니다",
    },
    lede: "디지털 제품부터 AI 통합과 기술 현대화까지, 과제를 해결하고 혁신을 앞당기며 비즈니스를 앞으로 이끄는 전문성을 제공합니다.",
    primaryCta: { ...servicesPage.primaryCta, label: "함께 만들어요" },
    secondaryCta: { ...servicesPage.secondaryCta, label: "서비스 살펴보기" },
    stack: {
      label:
        "일러스트: 소프트웨어 구축의 요구 사항, 와이어프레임, 기술 코드 세 레이어",
      requirements: "요구 사항",
      wireframe: "와이어프레임",
      code: "기술 코드",
    },
  },
  servicesProcess: {
    title: "4-D 프로세스: 요청부터 출시까지",
    lede: "각 단계는 직접 보고, 테스트하고, 승인할 수 있는 결과물로 마무리됩니다. AI는 모든 단계에 함께하며, 우리는 AI를 활용하는 방식을 계속 개선합니다.",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "여덟 가지 서비스, 하나의 팀",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description:
          "아이디어를 콘셉트부터 출시까지, 시장에 내놓을 수 있는 디지털 제품으로 만듭니다.",
      },
      {
        ...servicesSection.services[1],
        description:
          "AI와 직관적인 대시보드로 복잡한 데이터를 실질적인 인사이트로 바꿉니다.",
      },
      {
        ...servicesSection.services[2],
        description:
          "고객의 산업 지식과 우리의 제품 전문성을 결합해 의미 있는 솔루션을 만듭니다.",
      },
      {
        ...servicesSection.services[3],
        description:
          "프로젝트를 지원하고 팀을 확장할 적합한 기술 인재를 확보하세요.",
      },
      {
        ...servicesSection.services[4],
        description: "비즈니스 요구와 워크플로에 맞는 애플리케이션을 만듭니다.",
      },
      {
        ...servicesSection.services[5],
        description:
          "유연한 로우코드 플랫폼으로 애플리케이션을 더 빠르게 만들고 워크플로를 자동화합니다.",
      },
      {
        ...servicesSection.services[6],
        description:
          "프로세스를 간소화하고 생산성을 높이는 지능형 솔루션으로 AI를 활용하세요.",
      },
      {
        ...servicesSection.services[7],
        description:
          "성장하는 비즈니스를 뒷받침하는 클라우드 솔루션을 구축, 확장, 관리합니다.",
      },
    ],
  },
  shell: {
    names: SERVICE_NAMES,
    nav: {
      home: HOME,
      products: "제품",
      services: "서비스",
      news: "소식",
      about: "회사 소개",
      careers: "채용",
      skipLink: "본문으로 건너뛰기",
      mainNav: "주 메뉴",
      homeLink: "XionTech 홈",
      logoAlt: "XionTech, Get IT Done",
      menu: "메뉴",
      contact: "문의하기",
      contactShort: "문의하기",
      cityPlano: "플레이노",
      cityHcmc: "호찌민시",
    },
    language: { label: "언어" },
    theme: { label: "다크 모드" },
    footer: {
      blurb:
        "XionTech는 실무 경험과 최신 기술을 결합해 AI 기반 제품과 맞춤형 솔루션으로 비즈니스 과제를 해결합니다.",
      products: "제품",
      services: "서비스",
      howWeWork: "일하는 방식",
      allServices: "모든 서비스",
      company: "회사",
      aboutUs: "회사 소개",
      offices: "사무소",
      privacy: PRIVACY_LINK,
    },
    notFound: {
      metaTitle: "페이지를 찾을 수 없습니다 | XionTech",
      title: "페이지를 찾을 수 없습니다",
      primary: "홈으로 돌아가기",
    },
  },
  meta: {
    title: "XionTech",
    description:
      "IT 서비스와 제품 엔지니어링: AI, 클라우드, 맞춤형 앱, 로우코드 솔루션.",
  },
};
