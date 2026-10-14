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

const OTHER_LOCATIONS = "하노이와 다낭에도 있습니다.";

const [aboutPlano, aboutHcmc] = aboutOffices.offices;

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "학부모와 가족",
    features: [
      "자녀가 교문에 도착하면 알림",
      "성적과 피드백을 게시 즉시 확인",
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
      "실시간 출결과 기록",
      "학급, 시간표, 성적",
      `${parentHub.shortName}를 통한 학부모 메시지`,
      "오늘의 우선순위를 보여 주는 경영진 대시보드",
    ].map((title, i) => ({
      ...productDetails["staff-hub"].features[i],
      title,
    })),
  },
  iot: {
    madeFor: "시설 운영 및 유지보수 팀",
    features: [
      "프로젝터, 디스플레이, 음향",
      "시간표에 따른 조명과 냉난방",
      "중앙에서 관리하는 출입문과 구역",
      "캠퍼스 전체의 에너지 사용량",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "교사와 함께하는 학생",
    features: [
      "역량별 진단",
      "스스로 시도한 뒤에 받는 단계별 힌트",
      "혼자 해낼 수 있을 때에만 인정되는 숙달",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub": "학부모가 휴대폰으로 매일의 학교생활을 가까이에서 확인합니다.",
  "staff-hub":
    "교직원, 교사, 관리자가 같은 데이터를 공유하는 하나의 업무 공간입니다.",
  iot: "교실 기기, 조명, 냉난방, 출입을 하나의 화면에서 제어합니다.",
  "ai-tutor":
    "[Placeholder] 해답을 읽기만 하는 것이 아니라 새로운 문제를 스스로 풉니다.",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech는 어떤 일을 하나요?",
    answer:
      "학교를 위한 자체 플랫폼(Parent Hub, Staff Hub, IoT Device Management)을 만들고, 다른 기업을 위한 소프트웨어를 개발합니다. 제품 엔지니어링, AI 기반 분석, 제품 공동 개발, 인력 지원을 제공합니다.",
  },
  industries: {
    question: "어떤 산업과 협업하나요?",
    answer:
      "에듀테크가 핵심 분야입니다. 헬스케어, 물류, 사모펀드 분야도 지원합니다.",
  },
  "try-apps": {
    question: `우리 학교에서 ${parentHub.shortName}나 ${staffHub.shortName}를 어떻게 체험할 수 있나요?`,
    answer:
      "문의해 주세요. 귀교의 실제 상황을 바탕으로 앱을 직접 안내해 드립니다.",
  },
  "time-zones": {
    question: "여러 시간대에 걸쳐 어떻게 협업하나요?",
    answer:
      "플레이노, 호찌민시, 하노이, 다낭의 팀이 미국, 유럽, 호주 시간대를 지원하며, 공유 도구로 실시간 업데이트를 제공합니다.",
  },
  shape: {
    question: "언제부터 저희 요구에 맞춰 솔루션을 만들어 가나요?",
    answer:
      "처음부터입니다. 4단계 중 첫 단계인 탐색에서 설계를 시작하기 전에 목표, 사용자, 범위를 정합니다.",
  },
  results: {
    question: "어떤 결과를 기대할 수 있나요?",
    answer:
      "숙련된 베트남 엔지니어의 비용 효율적인 개발, 일정에 맞춘 출시, 그리고 성장을 뒷받침하는 측정 가능한 성과입니다.",
  },
  security: {
    question: "저희 데이터는 어떻게 보호하나요?",
    answer:
      "[Placeholder] 정직함, 투명성, 명확한 윤리 기준을 바탕으로 일하며, 보안 자동화와 지속적인 스캔으로 이를 뒷받침합니다.",
  },
  feedback: {
    question: "프로젝트 진행 중에 어떻게 의견을 전달하나요?",
    answer:
      "전용 채널, 정기 점검, 애자일 스프린트를 통해 처음부터 끝까지 고객의 의견이 제품에 반영됩니다.",
  },
  value: {
    question: "가치를 어떻게 측정하고 보여 주나요?",
    answer:
      "속도, 품질, 제품에 미치는 영향, 팀의 자율성을 추적하고 그 결과를 투명하게 공유합니다.",
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
        "하나의 개발 팀과 함께 탐색과 UX부터 엔지니어링, 테스트, 출시까지 진행합니다.",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "팀 역량 확장",
      description:
        "사내 팀에 더 많은 인력이나 특정 기술이 필요할 때 전문 기술 인재를 더합니다.",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "기존 플랫폼 현대화",
      description:
        "이미 잘 작동하는 부분은 지키면서 애플리케이션, 인프라, 클라우드 배포, 엔지니어링 방식을 개선합니다.",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "가치를 만드는 곳에 AI 적용",
      description:
        "AI, 분석, 자동화를 활용해 제품, 프로세스, 의사결정을 개선합니다.",
    },
  ],
};

const START_PROJECT = "프로젝트 시작하기";

const PROCESS_STEPS = [
  {
    title: "탐색",
    line: "워크숍을 통해 목표, 사용자, 리스크, 범위를 파악합니다.",
    receive: "명확한 범위, 견적, 개발 계획.",
  },
  {
    title: "설계",
    line: "코드를 작성하기 전에 사용자 흐름, 화면, 아키텍처를 합의합니다.",
    receive: "클릭 가능한 프로토타입과 기술 설계.",
  },
  {
    title: "개발",
    line: "정기적인 데모와 함께하는 애자일 스프린트. 테스트와 QA는 마지막이 아니라 매 스프린트 안에서 진행합니다.",
    receive: "매 스프린트마다 테스트를 마친 작동하는 소프트웨어.",
  },
  {
    title: "배포",
    line: "안전한 릴리스, 모니터링, 출시 후 개선.",
    receive: "지속적인 지원과 함께하는 운영 릴리스.",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "4-D 프로세스",
  receiveLabel: "받으시는 결과물",
  start: {
    ...processFlow.start,
    title: "고객의 요청",
    line: "아이디어, 브리프 또는 필요한 것.",
  },
  end: {
    ...processFlow.end,
    title: "출시",
    line: "그리고 함께 계속 키워 갑니다.",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "학교 커뮤니티를 위한 연결된 제품군으로, 학부모, 학습, 교직원 업무, 캠퍼스 기술을 하나의 생태계로 묶습니다.";

const RETENTION_DECIDED =
  "문의 및 데모 요청, 제출된 이메일 주소, 입사 지원서와 이력서는 기간 제한 없이 보관됩니다.";

const [arrive, attendance, parentStop, learn, campus, connected] =
  dayRoad.stops;

const ERRORS = {
  name: "이름을 입력해 주세요.",
  email: "올바른 이메일 주소를 입력해 주세요.",
  org: "소속 기관을 입력해 주세요.",
  phone: "올바른 전화번호를 입력해 주세요. 예: (+1) 469 322 9899.",
  date: "오늘 또는 이후 날짜를 선택해 주세요.",
  message: `메시지는 ${count(MESSAGE_MAX_LENGTH)}자 미만이어야 합니다.`,
};

export const ko: Dictionaries = {
  aboutCapture: {
    heading: "앱이 실제로 작동하는 모습을 확인하세요.",
    lede: `업무용 이메일을 남겨 주시면 ${parentHub.shortName}와 ${staffHub.shortName} 안내 일정을 잡아 드립니다.`,
  },
  aboutFaq: {
    title: "궁금한 점에 답해 드립니다",
    lede: "제품, 서비스, 일하는 방식에 대한 솔직한 답변입니다.",
    items: ABOUT_FAQ_ITEMS,
    ask: {
      href: aboutFaq.ask.href,
      label: "아직 궁금한 점이 있나요? 직접 문의해 주세요",
    },
  },
  aboutHero: {
    title: {
      lead: "우리는 XionTech,",
      middle: "",
      accent: "주인의식",
      tail: "으로 만드는 기술입니다.",
    },
    text: "사람과 아이디어, 기술을 연결해 탁월한 IT 시스템을 만들고 모두를 위한 더 밝은 미래를 만들어 갑니다. 호찌민시와 플레이노에서 학교를 위한 자체 플랫폼을 만들고, 전 세계 고객을 위한 디지털 제품을 개발합니다.",
    links: [
      { href: aboutHero.links[0].href, label: "제품 살펴보기" },
      { href: aboutHero.links[1].href, label: "서비스 살펴보기" },
    ],
  },
  aboutMeta: {
    title: "XionTech 소개 | Get IT Done",
    description:
      "XionTech는 미국 플레이노와 베트남 호찌민시에 본사를 두고 하노이와 다낭에 팀을 둔 교육 기술 기업이자 소프트웨어 파트너로, 미국, 유럽, 호주의 고객을 지원합니다.",
  },
  aboutOffices: {
    title: "두 개의 본사, 네 개의 거점.",
    more: OTHER_LOCATIONS,
    offices: [
      {
        ...planoKo,
        tag: US_DELIVERY_CENTER,
        contacts: withNewTab(aboutPlano.contacts, "WhatsApp "),
      },
      { ...hcmcKo, contacts: aboutHcmc.contacts },
    ],
  },
  aboutStory: {
    title: {
      lead: "산에서 영감을 얻었습니다.",
      middle: "",
      highlight: "목적",
      tail: "으로 하나가 되었습니다.",
    },
    chapters: [
      {
        number: aboutStory.chapters[0].number,
        title: "영감",
        text: "우리의 이름은 산에서 영감을 얻었습니다. 사람들이 우러러보고, 함께 모이고, 더 밝은 미래를 향해 함께 오르는 곳입니다.",
      },
      {
        number: aboutStory.chapters[1].number,
        title: "목적",
        text: "[Placeholder] 이 비전에 영감을 받은 개척자들이 미국에서 newXion을 설립했습니다. 변치 않는 핵심 가치를 길잡이 삼아, 그들은 산의 정신을 담은 커뮤니티를 만들고자 했습니다. 사람들이 하나가 되어 최첨단 기술을 활용하고, 탁월한 IT 시스템을 만들어 인류를 발전시키고 모두를 위한 더 밝은 미래를 만드는 곳입니다.",
      },
    ],
    closing: {
      line: "우리의 영감은 산입니다. 우리의 목적은 사람입니다.",
      tags: "비전 · 커뮤니티 · 기술",
    },
    cue: "스크롤",
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        title: "스타트업 정신",
        short: "민첩하고, 회복력 있고, 늘 발전합니다.",
        text: "민첩성, 유연성, 혁신에 대한 열정을 갖춘 기업가 정신을 실천합니다. 탁월함을 향한 노력은 회복력과 지속적인 개선의 문화에 뿌리를 두고 있습니다.",
      },
      {
        title: "고객 중심",
        short: "모든 일의 중심에 고객이 있습니다.",
        text: "고객은 우리가 하는 모든 일의 중심에 있습니다. 깊은 이해, 적극적인 소통, 맞춤형 솔루션으로 탁월한 경험과 의미 있는 성과를 제공하기 위해 노력합니다.",
      },
      {
        title: "정직이 먼저",
        short: "정직하고, 투명하고, 책임감 있게.",
        text: "정직하고 투명하며 책임감 있게 행동합니다. 윤리 기준이 모든 결정과 소통을 이끌며 신뢰와 오래가는 관계를 만듭니다.",
      },
      {
        title: "혁신 주도",
        short: "새로운 기술을 탐구하며 앞서 나갑니다.",
        text: "새로운 기술과 창의적인 접근법을 탐구하는 데 열정을 가지고 있습니다. 혁신은 우리의 DNA에 새겨져 있어 솔루션을 발전시키고 업계 흐름을 앞서 나가게 합니다.",
      },
      {
        title: "‘Get IT Done’ 마인드셋",
        short: "약속을 책임지고 결과를 냅니다.",
        text: "약속에 책임을 지고 품질 높고 신뢰할 수 있으며 효율적인 솔루션을 제공합니다. 우리 팀은 책임감과 결과 중심의 사고로 업계 기준을 충족하거나 넘어섭니다.",
      },
      {
        title: "사람 중심 문화",
        short: "모든 팀원이 존중받고, 지원받고, 힘을 얻습니다.",
        text: "모든 팀원이 존중받고 지원받으며 힘을 얻는 업무 환경을 만듭니다. 우리의 문화는 단순한 고용을 넘어 소속감, 협업, 함께 이루는 성공을 바탕으로 합니다.",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  appTaglines: APP_TAGLINES,
  careersGrowth: {
    caption: "[Placeholder] 성장을 위한 학습 모델",
    center: "성장",
    steps: ["호기심", "학습", "질문", "성장", "발전"],
  },
  careersHero: {
    title: {
      first: "호기심을 잃지 마세요.",
      second: "다음을 만드세요.",
    },
    lede: "빠르게 배우고, 더 나은 질문을 하고, 상황이 바뀌면 적응하며, 과업만이 아니라 결과를 중요하게 여기는 사람들을 위한 팀을 만들고 있습니다. 이곳에서 AI로 소프트웨어를 만드는 새로운 방식을 함께 만들어 가게 됩니다.",
    cta: { href: careersHero.cta.href, label: "채용 중인 포지션 보기" },
  },
  careersInside: {
    heading: "XionTech의 안쪽.",
    lede: "이곳의 일상을 만드는 순간들을 엿보세요. 워크숍, 프로젝트 킥오프, 팀 데이, 축하 행사, 함께하는 학습, 그리고 그 사이의 작은 순간들까지.",
    tiles: [
      {
        tag: "함께 배우기",
        title: "워크숍과 실험",
        text: "팀이 새로운 도구, 에이전트 기반 워크플로, 더 나은 일하는 방식을 시험해 보는 실습 세션입니다.",
      },
      {
        tag: "관계 만들기",
        title: "고객 방문",
        text: "맥락을 직접 이해하고 업무 관계를 다집니다.",
      },
      {
        tag: "같은 방향",
        title: "타운홀 미팅",
        text: "무엇이 바뀌었는지, 지금 무엇이 중요한지, 다음은 어디로 가는지.",
      },
      {
        tag: "함께 시작하기",
        title: "프로젝트 킥오프",
        text: "새로운 일은 알 수 없는 작업 목록이 아니라 공유된 맥락에서 시작합니다.",
      },
      {
        tag: "성과 축하하기",
        title: "[Placeholder] 축하 행사",
        text: "완료된 일은 초록색으로 바뀐 상태 표시 이상을 누릴 자격이 있기 때문입니다.",
      },
    ].map((copy, i) => ({ ...careersInside.tiles[i], ...copy })),
  },
  careersLife: {
    heading: "XionTech에서의 생활.",
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
    heading: "다음 도전을 찾아보세요.",
    emptyText: "현재 채용 중인 포지션이 없습니다.",
    applyLabel: "보기 및 지원",
  },
  careersValues: {
    heading: "우리가 일하는 방식을 만드는 다섯 가지 원칙.",
    lede: "모두가 매일 우리에게서 느끼기를 바라는 행동입니다. 카드를 뒤집어 각 원칙이 실제로 무엇을 뜻하는지 확인하세요.",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
    cards: [
      {
        title: "[Placeholder] 민첩하게",
        label: "민첩하게",
        backTitle: "[Placeholder] 방향을 잃지 않고 움직입니다.",
        text: "새로운 정보나 더 나은 답이 길을 바꾸면 유연하게 적응합니다.",
      },
      {
        title: "[Placeholder] 결과에 책임지기",
        label: "주인의식",
        backTitle: "[Placeholder] 내 업무 너머를 봅니다.",
        text: "문제를 일찍 알리고, 품질을 지키며, 일이 실제로 성공하도록 책임집니다.",
      },
      {
        title: "[Placeholder] 목적 있는 혁신",
        label: "혁신",
        backTitle: "[Placeholder] 새로움은 도움이 될 때에만 의미가 있습니다.",
        text: "제품, 사용자 경험, 일하는 방식을 개선할 때 새로운 기술을 탐구합니다.",
      },
      {
        title: "[Placeholder] 함께 성장하기",
        label: "함께 성장",
        backTitle: "[Placeholder] 서로를 더 낫게 만듭니다.",
        text: "아는 것을 나누고, 도움이 되는 피드백을 주며, 동료가 도전하고 기여하고 성장할 여지를 줍니다.",
      },
      {
        title: "[Placeholder] Get IT Done",
        label: "GET IT DONE",
        backTitle: "[Placeholder] 가능성을 현실로 바꿉니다.",
        text: "좋은 아이디어는 중요합니다. 유용하고 실제적인 결과를 내야 그 가치가 생깁니다.",
      },
    ].map((copy, i) => ({ ...careersValues.cards[i], ...copy })),
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
      email: "업무용 이메일",
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
      lede: "귀하와 진행 중인 일에 대해 조금 알려 주세요. 저희 팀이 더 자세히 알아보기 위해 연락드리겠습니다.",
      name: "이름",
      email: "업무용 이메일",
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
        heading: "귀교에서 작동하는 모습을 확인하세요.",
        lede: "업무용 이메일을 남겨 주시면 귀교에 맞춘 안내 일정을 잡아 드립니다.",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "문의하기",
        consent: "이메일은 데모 일정을 잡는 데에만 사용합니다.",
      },
      project: {
        heading: "무엇을 만들고 계신지 알려 주세요.",
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
  dayRoad: {
    heading: "학교에서의 하루.",
    lede: "평범한 학교 하루 동안 한 학생의 여정을 따라가며, 학생, 학부모, 교직원이 각 단계에서 어떻게 정보를 받고 연결되는지 확인하세요.",
    start: "출발",
    finish: "도착",
    stops: [
      {
        ...arrive,
        title: "학생 도착",
        text: "학생이 캠퍼스에 도착합니다.",
      },
      {
        ...attendance,
        title: "출석 기록",
        text: `교사가 ${staffHub.shortName}에서 학생의 출석을 기록합니다.`,
      },
      {
        ...parentStop,
        title: "학부모 알림",
        text: `${parentHub.shortName}가 학부모에게 학생이 학교에 있다고 알립니다.`,
      },
      {
        ...learn,
        title: "학생 학습",
        text: `학생들이 ${aiTutor.shortName}와 함께 연습하고 질문합니다.`,
      },
      {
        ...campus,
        title: PRODUCT_DETAILS.iot.features[1].title,
        text: APP_TAGLINES.iot,
      },
      {
        ...connected,
        title: "연결된 하루",
        text: "알림과 학교 정보가 시스템 전체에서 연결된 상태로 유지됩니다.",
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
  hcmc: hcmcKo,
  homeApps: {
    title: "연결된 학교.",
    lede: JOURNEY_LEDE,
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
    title: "왜 XionTech인가.",
    lede: "모든 학교 앱과 우리가 제공하는 모든 제품 뒤에 있는 역량, 그리고 AI로 더 스마트하게 만드는 방법을 계속 찾아가는 팀.",
    delivery: {
      label: "글로벌 딜리버리",
      title: "두 개의 본사, 하나의 업무일.",
      line: "여러 시간대에 걸친 팀이 실질적으로 겹치는 시간을 활용해 개발을 계속 진행합니다.",
    },
    industries: {
      label: "도메인 전문성",
      title: "교육에 깊이. 변화에 유연하게.",
      line: "가장 깊이 있는 분야는 교육이며, 같은 엔지니어링 역량으로 다른 산업도 지원합니다.",
      main: "교육",
      more: ["헬스케어", "물류", "사모펀드"],
      moreLabel: "+3개 산업 더: 헬스케어, 물류, 사모펀드",
    },
    motto: {
      lead: "Get IT Done",
      title: "주인의식으로 만듭니다.",
      line: "약속에 책임을 지고 품질에 자부심을 갖습니다.",
    },
  },
  homeDoors: {
    label: "우리가 하는 일",
    products: {
      ...homeDoors.products,
      title: "학교를 위한 제품",
      line: "학부모, 학생, 교사, 관리자, 교직원을 위한 연결된 앱.",
    },
    services: {
      ...homeDoors.services,
      label: "아웃소싱 서비스",
      title: "귀사의 소프트웨어 개발 팀",
      line: "디지털 제품을 만드는 기업을 위한 전담 팀과 엔드투엔드 개발.",
      chips: [...homeDoors.services.chips.slice(0, -1), "+3개 더"],
    },
  },
  homeFaq: {
    title: "궁금한 점에 답해 드립니다.",
    lede: "제품, 서비스, 일하는 방식에 대한 솔직한 답변입니다.",
    items: homeFaq.items.map((item) => ({ id: item.id, ...FAQ[item.id] })),
    link: { href: homeFaq.link.href, label: "모든 질문 보기" },
  },
  homeHero: {
    title: {
      lines: ["더 스마트하게 만들고.", "더 빠르게 출시하고."],
      highlight: "Get IT done",
      tail: ".",
    },
    sub: "AI 지원 개발을 이끄는 사람들이 만드는 학교와 캠퍼스를 위한 연결된 솔루션, 소프트웨어 제품, 전담 팀.",
    motion: { pause: "애니메이션 일시 정지", play: "애니메이션 재생" },
    cta: { href: homeHero.cta.href, label: "문의하기" },
  },
  homeMeta: {
    title: "XionTech | 학교 플랫폼과 베트남 소프트웨어 아웃소싱",
  },
  homeNews: {
    heading: "XionTech의 최신 소식.",
    lede: "우리 팀이 만들고 출시하는 것들을 확인하세요.",
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
    title: "우리가 일하는 방식.",
    lede: "4-D 프로세스(탐색, 설계, 개발, 배포)는 아이디어를 출시까지 이끌며, 각 단계는 직접 보고 승인할 수 있는 결과물로 마무리됩니다. AI는 모든 단계에 함께하며, 우리는 AI를 활용하는 방식을 계속 개선합니다.",
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
    title: "핵심 가치.",
    lede: "우리가 일하는 방식을 이끄는 것들. 카드를 뒤집어 각 가치를 끝까지 읽어 보세요.",
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
    hint: "단계를 선택하면 그 단계를 지원하는 앱을 볼 수 있습니다.",
    everyone: "모두",
    details: "상세",
    lanes: ["학생", "교사와 교직원", "학부모", "캠퍼스"].map((label, i) => ({
      ...journeyBoard.lanes[i],
      label,
    })),
  },
  journeyMap: {
    intro: {
      title: "따로 만들었지만, 함께일 때 더 좋습니다.",
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
    sampleNote:
      "newXion 뉴스룸의 기사입니다. [Placeholder] 표시가 있는 기사는 예시입니다.",
    allFilter: { id: newsPage.allFilter.id, label: "전체" },
    empty: "이 카테고리에는 아직 기사가 없습니다.",
    showAll: "모두 보기",
    countOne: "기사 1개 표시 중",
    countMany: "기사 {n}개 표시 중",
  },
  newsStory: {
    storyLabel: "기사",
    sampleNote:
      "[Placeholder] 레이아웃을 보여 주기 위한 예시 기사입니다. 출시 전에 실제 기사로 교체해야 합니다.",
    backToNews: {
      href: newsStory.backToNews.href,
      label: "소식으로 돌아가기",
    },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoKo, hcmcKo],
  otherLocations: OTHER_LOCATIONS,
  plano: planoKo,
  privacy: {
    metaTitle: "개인정보 처리방침 | XionTech",
    metaDescription:
      "[Placeholder] XionTech가 양식을 통해 보내 주신 개인정보를 어떻게 사용하는지 설명합니다.",
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCurrent: PRIVACY_LINK,
    title: "개인정보 처리방침.",
    lede: "[Placeholder] 베트남 시행령 13/2023(PDPD)에 따른 방침 문구는 법무 담당자가 제공할 예정입니다.",
    bodyLabel: "방침",
    outlineNote:
      "[Placeholder] 내용 개요입니다. 아래 섹션은 방침이 다뤄야 할 내용을 나타내며, 실제 방침이 아닙니다.",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "회사 소개 및 연락 방법",
        paragraphs: [
          "[Placeholder] 개인정보 처리자(XionTech 법인), 주소, 개인정보 관련 문의 연락처.",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "수집하는 정보",
        paragraphs: [
          "[Placeholder] 이메일, 이름, 전화번호, 소속 기관, 직책, 그리고 양식을 통해 보내 주신 모든 내용(입사 지원 시 이력서 포함).",
          "[Placeholder] 이메일 수집 배너에 입력하신 이메일은 양식 메시지와 마찬가지로 회사 받은편지함으로 전송됩니다. 브라우저도 데모 요청 페이지가 읽을 때까지만 세션 저장소에 이를 보관합니다.",
        ],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "정보의 사용 방법",
        paragraphs: [
          "[Placeholder] 문의에 답변하거나, 데모 일정을 잡거나, 지원서와 이력서를 검토하는 데에만 사용합니다.",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "정보를 공유하는 대상",
        paragraphs: [
          "[Placeholder] 당사를 대신해 데이터를 처리하는 업체: Gmail(양식 메시지를 회사 받은편지함으로 전송), Upstash(해시된 값으로 만든 요청 제한 카운터), Vercel(웹사이트 호스팅 및 비공개 이력서 저장소).",
        ],
      },
      {
        id: PRIVACY.sections[4].id,
        heading: "베트남 외부로의 이전",
        paragraphs: [
          "[Placeholder] 데이터가 해외(예: 플레이노 사무소)로 이전되는 경우와 시행령 13/2023이 요구하는 보호 조치.",
        ],
      },
      {
        id: PRIVACY.sections[5].id,
        heading: "보관 기간",
        paragraphs: [
          RETENTION_DECIDED,
          "[Placeholder] 보관에 관한 최종 문구와, 이후 기간 제한을 추가할지 여부.",
        ],
      },
      {
        id: PRIVACY.sections[6].id,
        heading: "쿠키와 분석",
        paragraphs: [
          "[Placeholder] 임시 문구입니다. 최종 문구에서는 필수 자사 언어 쿠키(무엇을 저장하고 왜 저장하는지)를 명시하고, 동의 없이는 비필수 쿠키나 분석 도구를 설정하지 않는다고 밝힐 예정입니다.",
        ],
      },
      {
        id: PRIVACY.sections[7].id,
        heading: "이용자의 권리",
        paragraphs: [
          "[Placeholder] 데이터 열람, 정정, 삭제 또는 동의 철회. 삭제를 요청하는 방법은 아직 정해지지 않았습니다.",
        ],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
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
    title:
      "베트남 소프트웨어 아웃소싱 | Product Engineering, AI, Low-code & Cloud | XionTech",
    description:
      "호찌민시에서 제공하는 전담 팀과 엔드투엔드 소프트웨어 개발: 미국, 유럽, 호주 시간대에 걸친 제품 엔지니어링, AI, 로우코드, 클라우드.",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "‘",
      highlight: "Get IT done",
      tail: "’을 실현하는 소프트웨어 팀.",
    },
    lede: "호찌민시에서 미국, 유럽, 호주 시간대에 걸쳐 제공하는 제품 엔지니어링, AI, 로우코드, 클라우드 개발. AI로 더 스마트하게 일하고, 개발 방식을 끊임없이 혁신합니다.",
    primaryCta: { ...servicesPage.primaryCta, label: START_PROJECT },
  },
  servicesProcess: {
    title: "4-D 프로세스: 요청부터 출시까지.",
    lede: "각 단계는 직접 보고, 테스트하고, 승인할 수 있는 결과물로 마무리됩니다. AI는 모든 단계에 함께하며, 우리는 AI를 활용하는 방식을 계속 개선합니다.",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "여덟 가지 서비스, 하나의 팀.",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description:
          "엔드투엔드 엔지니어링 전문성으로 혁신적인 아이디어를 시장에 출시할 수 있는 디지털 제품으로 바꿉니다.",
      },
      {
        ...servicesSection.services[1],
        description:
          "AI와 고급 시각화로 원시 데이터를 실행 가능한 인사이트로 바꿉니다.",
      },
      {
        ...servicesSection.services[2],
        description:
          "귀사의 도메인 지식과 우리의 기술 전문성을 결합해 혁신을 가속합니다.",
      },
      {
        ...servicesSection.services[3],
        description: "필요할 때 유연한 방식으로 전문 기술 인재를 확보합니다.",
      },
      {
        ...servicesSection.services[4],
        description: "고유한 요구 사항에 맞춘 맞춤형 솔루션을 개발합니다.",
      },
      {
        ...servicesSection.services[5],
        description:
          "주요 로우코드 플랫폼에서 도구와 자동화를 더 빠르게 제공합니다.",
      },
      {
        ...servicesSection.services[6],
        description: "인공지능을 활용해 운영을 혁신합니다.",
      },
      {
        ...servicesSection.services[7],
        description: "Azure, AWS, GCP 전반의 전문 솔루션.",
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
      cityPlano: "플레이노",
      cityHcmc: "호찌민시",
    },
    language: { label: "언어" },
    footer: {
      blurb: "학교와 기업을 위한 교육 기술 제품과 소프트웨어 개발 서비스.",
      products: "제품",
      forSchools: "학교용",
      forStudents: "학생용",
      forParents: "학부모용",
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
      title: "길에서 벗어났습니다.",
      lede: "찾으시는 페이지가 여기에 없습니다. 길을 따라 홈으로 돌아가거나 아래에서 경로를 선택하세요.",
      primary: "홈으로 돌아가기",
      here: "현재 위치",
    },
  },
  meta: {
    title: "XionTech",
    description:
      "IT 서비스와 제품 엔지니어링: AI, 클라우드, 맞춤형 앱, 로우코드 솔루션.",
  },
};
