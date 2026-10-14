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

// Japanese. AI-translated from the English for native review. Product and
// service names and "Get IT done" stay English; addresses, numbers, emails,
// hrefs and ids are shared with English.

const count = (n: number) => n.toLocaleString("ja-JP");

const parentHub = appById("parent-hub");
const staffHub = appById("staff-hub");

const NEW_TAB = "（新しいタブで開きます）";
const US_DELIVERY_CENTER = "米国デリバリーセンター";
const VIETNAM_DELIVERY_CENTER = "ベトナム デリバリーセンター";
const DETAILS_CONSENT =
  "ご入力いただいた情報は、このお問い合わせへの回答にのみ使用します。";
const SEND_ERROR = "リクエストを送信できませんでした。もう一度お試しください。";
const RATE_ERROR =
  "短時間に複数回送信されています。数分後にもう一度お試しください。";
const FIX_HEADING = "次の項目を修正してください：";
const PRIVACY_LINK = "プライバシーポリシー";
const SUMMIT = "登頂成功。ありがとうございます！";
const FLIP_FRONT = "めくって詳細を見る";
const FLIP_BACK = "元に戻す";

// The accessible name of an external contact: its visible label, an optional
// prefix (the bracketed views drop "WhatsApp" from the label) and the new-tab note.
const withNewTab = (contacts: OfficeContact[], prefix = ""): OfficeContact[] =>
  contacts.map((contact) =>
    contact.external
      ? {
          ...contact,
          ariaLabel: `${prefix}${contact.label} ${NEW_TAB}`,
        }
      : contact,
  );

const planoJa: Office = {
  ...plano,
  name: "米国テキサス州プレイノ",
  contacts: withNewTab(plano.contacts),
  zoneLabel: "米国中部時間",
};

const hcmcJa: Office = {
  ...hcmc,
  name: "ベトナム ホーチミン市",
  tag: VIETNAM_DELIVERY_CENTER,
};

const OTHER_LOCATIONS = "ハノイとダナンにも拠点があります。";

const [aboutPlano, aboutHcmc] = aboutOffices.offices;

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "保護者とご家族",
    features: [
      "お子さまが校門に着いたらお知らせ",
      "成績とコメントを公開と同時に確認",
      "先生との双方向メッセージ",
      "明細がわかりやすい学費のお支払い",
    ].map((title, i) => ({
      ...productDetails["parent-hub"].features[i],
      title,
    })),
  },
  "staff-hub": {
    madeFor: "職員、教員、学校管理職",
    features: [
      "出欠と記録をリアルタイムで",
      "クラス、時間割、成績",
      `${parentHub.shortName} を通じた保護者へのメッセージ`,
      "管理職向けの今日の優先事項ダッシュボード",
    ].map((title, i) => ({
      ...productDetails["staff-hub"].features[i],
      title,
    })),
  },
  iot: {
    madeFor: "学校の運営・施設管理チーム",
    features: [
      "プロジェクター、ディスプレイ、音響",
      "時間割に合わせた照明と空調",
      "ドアとエリアを一元管理",
      "キャンパス全体のエネルギー使用量",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "生徒と、寄り添う教員",
    features: [
      "スキルごとの診断",
      "自分で取り組んだ後のステップごとのヒント",
      "一人でできるようになって初めて習得",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub": "毎日の学校生活を、保護者のスマートフォンに届けます。",
  "staff-hub":
    "職員、教員、管理職が同じデータを共有する、ひとつのワークスペース。",
  iot: "教室の機器、照明、空調、入退室をひとつの画面で管理。",
  "ai-tutor":
    "[Placeholder] 新しい問題を自分の力で解く。解答を読むだけではなく。",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech は何をしている会社ですか？",
    answer:
      "学校向けの自社プラットフォーム（Parent Hub、Staff Hub、IoT Device Management）を開発するとともに、他社向けのソフトウェア開発を行っています。プロダクトエンジニアリング、AI を活用したアナリティクス、プロダクト共創、人材提供です。",
  },
  industries: {
    question: "どの業界と仕事をしていますか？",
    answer:
      "中核は EdTech です。ヘルスケア、物流、プライベートエクイティの分野にもサービスを提供しています。",
  },
  "try-apps": {
    question: `${parentHub.shortName} や ${staffHub.shortName} を学校で試すにはどうすればよいですか？`,
    answer:
      "お気軽にお問い合わせください。貴校の実際の場面に沿ってアプリをご案内します。",
  },
  "time-zones": {
    question: "タイムゾーンをまたいでどのように仕事をしていますか？",
    answer:
      "プレイノ、ホーチミン市、ハノイ、ダナンのチームが米国、ヨーロッパ、オーストラリアのタイムゾーンをカバーし、共有ツールでリアルタイムに情報を更新しています。",
  },
  shape: {
    question: "ソリューションを私たちのニーズに合わせるのはいつですか？",
    answer:
      "最初からです。4 つのステップの第一歩であるディスカバリーで、設計を始める前に目標、ユーザー、スコープを定めます。",
  },
  results: {
    question: "どのような成果が期待できますか？",
    answer:
      "経験豊富なベトナム人エンジニアによるコスト効率の高い開発、期日どおりのリリース、そして貴社の成長を支える測定可能な成果です。",
  },
  security: {
    question: "データの安全はどのように守っていますか？",
    answer:
      "[Placeholder] 誠実さ、透明性、明確な倫理基準のもとで業務を行い、セキュリティの自動化と継続的なスキャンでそれを支えています。",
  },
  feedback: {
    question: "プロジェクト中にどのようにフィードバックを伝えればよいですか？",
    answer:
      "専用のチャネル、頻繁な確認の場、アジャイルなスプリントを通じて、お客様のご意見が最後までプロダクトに反映されます。",
  },
  value: {
    question: "価値をどのように測定し、示していますか？",
    answer:
      "スピード、品質、プロダクトへの影響、チームの自律性を追跡し、お客様とオープンに共有します。",
  },
};

const ABOUT_FAQ_ITEMS = aboutFaq.items.map((item) => ({
  id: item.id,
  ...FAQ[item.id],
}));

const SERVICES_LEDE =
  "ひとつのサービスを選ぶことも、複数を組み合わせることもできます。お客様のプロダクトに合わせてチームを編成します。";

const OUTCOMES: Dictionaries["servicesOutcomes"] = {
  title: "どのような目標の実現をお手伝いできますか？",
  items: [
    {
      id: servicesOutcomes.items[0].id,
      title: "新しいデジタルプロダクトをつくる",
      description:
        "ディスカバリーと UX から、エンジニアリング、テスト、ローンチまで、ひとつのデリバリーチームで進めます。",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "チームを拡張する",
      description:
        "社内チームに人手や特定のスキルが必要なとき、専門性の高い技術人材を加えます。",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "既存のプラットフォームを刷新する",
      description:
        "うまく機能している部分を守りながら、アプリケーション、インフラ、クラウドでのデリバリー、エンジニアリングの手法を改善します。",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "価値を生む場面で AI を活用する",
      description:
        "AI、アナリティクス、自動化を使って、プロダクト、ワークフロー、経営判断を改善します。",
    },
  ],
};

const START_PROJECT = "プロジェクトを始める";

const PROCESS_STEPS = [
  {
    title: "ディスカバリー",
    line: "目標、ユーザー、リスク、スコープを理解するためのワークショップ。",
    receive: "明確なスコープ、見積もり、デリバリー計画。",
  },
  {
    title: "デザイン",
    line: "コードを書く前に、ユーザーフロー、インターフェース、アーキテクチャを合意します。",
    receive: "クリックできるプロトタイプと技術設計。",
  },
  {
    title: "開発",
    line: "定期的なデモを伴うアジャイルなスプリント。テストと品質保証（QA）は最後ではなく、毎スプリントの中で行います。",
    receive: "毎スプリント、テスト済みで動作するソフトウェア。",
  },
  {
    title: "デプロイ",
    line: "安全なリリース、モニタリング、ローンチ後の改善。",
    receive: "本番リリースと継続的なサポート。",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "4-D プロセス",
  receiveLabel: "お届けするもの",
  start: {
    ...processFlow.start,
    title: "お客様のご依頼",
    line: "アイデア、概要、または要件。",
  },
  end: {
    ...processFlow.end,
    title: "ローンチ",
    line: "その後も一緒に育てていきます。",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "学校コミュニティのためのつながったスイート。保護者、学び、職員の業務、キャンパスのテクノロジーをひとつのエコシステムにまとめます。";

const RETENTION_DECIDED =
  "お問い合わせとデモのご依頼、メールアドレスの送信、応募書類と CV は、期限を設けずに保管します。";

const [arrive, attendance, parentStop, learn, campus, connected] =
  dayRoad.stops;

const ERRORS = {
  name: "お名前を入力してください。",
  email: "有効なメールアドレスを入力してください。",
  org: "組織名を入力してください。",
  phone: "有効な電話番号を入力してください（例：(+1) 469 322 9899）。",
  date: "今日以降の日付を選択してください。",
  message: `メッセージは ${count(MESSAGE_MAX_LENGTH)} 文字以内で入力してください。`,
};

export const ja: Dictionaries = {
  aboutCapture: {
    heading: "アプリの実際の動きをご覧ください。",
    lede: `業務用メールアドレスをご入力いただければ、${parentHub.shortName} と ${staffHub.shortName} のご案内を手配します。`,
  },
  aboutFaq: {
    title: "ご質問にお答えします",
    lede: "製品、サービス、仕事の進め方について、率直にお答えします。",
    items: ABOUT_FAQ_ITEMS,
    ask: {
      href: aboutFaq.ask.href,
      label: "まだ疑問がありますか？直接お尋ねください",
    },
  },
  aboutHero: {
    title: {
      lead: "私たちは XionTech。",
      middle: "",
      accent: "オーナーシップ",
      tail: "でつくるテクノロジー。",
    },
    text: "人、アイデア、テクノロジーを結びつけ、優れた IT システムを構築し、すべての人にとってより明るい未来を形づくります。ホーチミン市とプレイノを拠点に、学校向けの自社プラットフォームを開発し、世界中のお客様にデジタルプロダクトをお届けしています。",
    links: [
      { href: aboutHero.links[0].href, label: "製品を見る" },
      { href: aboutHero.links[1].href, label: "サービスを見る" },
    ],
  },
  aboutMeta: {
    title: "XionTech について | Get IT Done",
    description:
      "XionTech は教育テクノロジー企業であり、ソフトウェアパートナーです。プレイノ（米国）とホーチミン市（ベトナム）に本社を置き、ハノイとダナンにもチームを持ち、米国、ヨーロッパ、オーストラリアのお客様にサービスを提供しています。",
  },
  aboutOffices: {
    title: "2 つの本社、4 つの拠点。",
    more: OTHER_LOCATIONS,
    offices: [
      {
        ...planoJa,
        tag: US_DELIVERY_CENTER,
        contacts: withNewTab(aboutPlano.contacts, "WhatsApp "),
      },
      { ...hcmcJa, contacts: aboutHcmc.contacts },
    ],
  },
  aboutStory: {
    title: {
      lead: "山に着想を得て。",
      middle: "",
      highlight: "目的",
      tail: "で結ばれて。",
    },
    chapters: [
      {
        number: aboutStory.chapters[0].number,
        title: "着想",
        text: "私たちの名前は、ある山に着想を得ています。人々が見上げ、集い、より明るい未来へと共に登っていく場所です。",
      },
      {
        number: aboutStory.chapters[1].number,
        title: "目的",
        text: "[Placeholder] このビジョンに触発された先駆者たちが、米国で newXion を設立しました。揺るぎないコアバリューに導かれ、彼らは山の精神に忠実なコミュニティを築こうとしました。人々が団結し、最先端のテクノロジーを活かし、優れた IT システムを構築して人類の発展とすべての人のより明るい未来に貢献する場所です。",
      },
    ],
    closing: {
      line: "私たちの着想は山。私たちの目的は人。",
      tags: "ビジョン · コミュニティ · テクノロジー",
    },
    cue: "スクロール",
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        title: "スタートアップ精神",
        short: "俊敏で、粘り強く、常に改善を続ける。",
        text: "起業家精神を体現し、俊敏さ、柔軟性、イノベーションへの情熱を大切にします。卓越への取り組みは、粘り強さと継続的な改善の文化によって支えられています。",
      },
      {
        title: "クライアント中心",
        short: "すべての仕事の中心にお客様がいます。",
        text: "お客様は私たちのすべての仕事の中心にいます。深い理解、主体的な関わり、最適なソリューションを通じて、卓越した体験と確かな成果をお届けします。",
      },
      {
        title: "誠実さを第一に",
        short: "誠実、透明、そして責任ある姿勢。",
        text: "誠実さ、透明性、説明責任をもって行動します。あらゆる判断とやり取りを倫理基準が導き、信頼と長期的な関係を育みます。",
      },
      {
        title: "イノベーション志向",
        short: "新しい技術を探求し、一歩先を行く。",
        text: "新しいテクノロジーと創造的なアプローチの探求に情熱を注ぎます。イノベーションは私たちの DNA に組み込まれており、ソリューションを進化させ、業界の潮流の先を行くことを可能にしています。",
      },
      {
        title: "「Get IT Done」の姿勢",
        short: "約束に責任を持ち、やり遂げる。",
        text: "約束に責任を持ち、高品質で信頼性が高く効率的なソリューションをお届けします。私たちのチームは、業界水準を満たし、またはそれを上回る、説明責任と成果志向の姿勢に支えられています。",
      },
      {
        title: "人を大切にする文化",
        short: "一人ひとりが尊重され、支えられ、力を発揮できる。",
        text: "一人ひとりが尊重され、支えられ、力を発揮できる職場を育てます。私たちの文化は雇用の枠を超え、帰属意識、協働、そして共に分かち合う成功を大切にしています。",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  appTaglines: APP_TAGLINES,
  careersGrowth: {
    caption: "[Placeholder] 成長のための学習モデル",
    center: "成長",
    steps: ["好奇心", "学ぶ", "問う", "成長する", "改善する"],
  },
  careersHero: {
    title: { first: "好奇心を持ち続ける。", second: "次をつくる。" },
    lede: "私たちが築いているのは、学ぶのが早く、より良い問いを立て、変化に適応し、タスクだけでなく成果にこだわる人のためのチームです。ここでは、AI を使ったソフトウェア開発の新しい方法を切り拓く役割を担います。",
    cta: { href: careersHero.cta.href, label: "募集中の職種を見る" },
  },
  careersInside: {
    heading: "XionTech の内側。",
    lede: "ここでの日々を形づくる瞬間をご紹介します。ワークショップ、プロジェクトの始動、チームの日、お祝い、共に学ぶ時間、そしてその合間の小さな瞬間です。",
    tiles: [
      {
        tag: "共に学ぶ",
        title: "ワークショップと実験",
        text: "新しいツール、エージェント型のワークフロー、より良い働き方をチームで試す実践的なセッション。",
      },
      {
        tag: "関係を築く",
        title: "お客様訪問",
        text: "背景を直接理解し、より強い協力関係を築きます。",
      },
      {
        tag: "方向をそろえる",
        title: "タウンホール",
        text: "何が変わったのか、今何が重要なのか、次にどこへ向かうのか。",
      },
      {
        tag: "共に始める",
        title: "プロジェクトキックオフ",
        text: "新しい仕事は、謎めいたタスクリストではなく、共有された背景から始まります。",
      },
      {
        tag: "前進を祝う",
        title: "[Placeholder] お祝い",
        text: "リリースした仕事には、緑のステータスラベル以上のものがふさわしいから。",
      },
    ].map((copy, i) => ({ ...careersInside.tiles[i], ...copy })),
  },
  careersLife: {
    heading: "XionTech での毎日。",
    frames: [
      "[Placeholder] チームの写真",
      "[Placeholder] オフィスの写真",
      "[Placeholder] イベントの写真",
    ].map((placeholder, i) => ({ ...careersLife.frames[i], placeholder })),
  },
  careersMeta: {
    title: "XionTech の採用情報 | ホーチミン市のソフトウェア職",
    description:
      "ホーチミン市の XionTech に参加しませんか。人を大切にする文化の中で、AI/ML、生成 AI、クラウド、アジャイルなデリバリーを活かし、学校向けプラットフォームとお客様のプロダクトに携われます。",
  },
  careersRoles: {
    heading: "次の挑戦を見つけよう。",
    emptyText: "現在、募集中の職種はありません。",
    applyLabel: "詳細を見て応募する",
  },
  careersValues: {
    heading: "私たちの働き方を形づくる 5 つのこと。",
    lede: "これらは、私たちが毎日周りの人に感じてほしい行動です。カードをめくると、それぞれが実際に何を意味するかがわかります。",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
    cards: [
      {
        title: "[Placeholder] 柔軟であり続ける",
        label: "柔軟に",
        backTitle: "[Placeholder] 方向を見失わずに動く。",
        text: "新しい情報やより良い答えによって道筋が変わるときも、柔軟に適応します。",
      },
      {
        title: "[Placeholder] 成果に責任を持つ",
        label: "オーナーシップ",
        backTitle: "[Placeholder] 自分のタスクの先まで気を配る。",
        text: "問題を早めに伝え、品質を守り、仕事が本当に成功するかどうかに責任を持ちます。",
      },
      {
        title: "[Placeholder] 目的あるイノベーション",
        label: "イノベーション",
        backTitle: "[Placeholder] 新しさは、役に立ってこそ意味がある。",
        text: "プロダクト、ユーザー体験、働き方を良くするときに、新しいテクノロジーを探求します。",
      },
      {
        title: "[Placeholder] 共に成長する",
        label: "共に成長",
        backTitle: "[Placeholder] お互いを高め合う。",
        text: "知っていることを共有し、役立つフィードバックを伝え、仲間が挑戦し、貢献し、成長できる場をつくります。",
      },
      {
        title: "[Placeholder] Get IT Done",
        label: "GET IT DONE",
        backTitle: "[Placeholder] 可能性を現実のものに。",
        text: "良いアイデアは大切です。役に立ち、実際に動く成果を届けてこそ、その価値が生まれます。",
      },
    ].map((copy, i) => ({ ...careersValues.cards[i], ...copy })),
  },
  categoryLabels: {
    schools: "学校",
    students: "生徒",
    parents: "保護者",
    company: "会社",
  },
  contactErrors: {
    messageRequired: "プロジェクトについて少し教えてください。",
    length: `${count(TEXT_MAX_LENGTH)} 文字以内で入力してください。`,
    cv: "CV は PDF または Word 形式、5 MB までのファイルでアップロードしてください。",
    note: `メッセージは ${count(MESSAGE_MAX_LENGTH)} 文字以内で入力してください。`,
  },
  contactStrings: {
    metaTitle: "デモの予約・プロジェクトのご相談 | XionTech",
    metaDescription: `貴校向けに ${parentHub.shortName} と ${staffHub.shortName} のデモをご予約いただくか、ソフトウェアプロジェクトについてお聞かせください。XionTech、ホーチミン市とプレイノ。`,
    hero: {
      breadcrumbLabel: "パンくずリスト",
      breadcrumbHome: "ホーム",
      breadcrumbCurrent: "お問い合わせ",
      titleBefore: "",
      titleHighlight: "学校",
      titleAfter: "やプロジェクトについてお話ししましょう。",
      items: [
        `貴校の実際の場面に沿った ${parentHub.shortName} と ${staffHub.shortName} のご案内。`,
        "導入、データ、サポートに関するご質問への回答。",
        "プロジェクトの場合：4 つのステップの第一歩となる、最初のディスカバリーの打ち合わせ。",
      ],
      officesLabel: "拠点",
    },
    form: {
      heading: "どのようなご用件でしょうか？",
      tabsLabel: "ご依頼の種類",
      tabDemo: "製品デモ",
      tabProject: "開発委託プロジェクト",
      name: "氏名",
      email: "業務用メールアドレス",
      org: "学校名または会社名",
      role: "役職",
      roleHelp: "例：校長、IT 責任者",
      products: "関心のある製品",
      schoolSize: "学校の規模",
      date: "希望日",
      service: "サービス",
      startTiming: "開始のご希望時期",
      message: "メッセージ（任意）",
      submit: "送信する",
      sending: "送信中...",
      successHeading: SUMMIT,
      successText: "近日中にご連絡いたします。",
      sendError: SEND_ERROR,
      rateError: RATE_ERROR,
      consent: DETAILS_CONSENT,
      privacyLink: PRIVACY_LINK,
      errorsHeading: FIX_HEADING,
    },
    home: {
      heading: "つくりたいものはありますか？",
      lede: "あなたご自身と取り組んでいることについて、少し教えてください。詳しくお伺いするため、私たちのチームからご連絡します。",
      name: "お名前",
      email: "業務用メールアドレス",
      phone: "電話番号",
      optional: "（任意）",
      phonePlaceholder: CONTACT_STRINGS.home.phonePlaceholder,
      message: "プロジェクトについて教えてください",
      messagePlaceholder:
        "何をつくりたいですか？アイデア、既存のプロダクト、チーム、課題について教えてください。",
      submit: "相談を始める",
      consent: "ご入力いただいた情報は、メッセージへの返信にのみ使用します。",
      successHeading:
        "登頂成功。ありがとうございます。メッセージを受け取りました。",
      successText:
        "お寄せいただいた内容を私たちのチームが確認し、ご連絡いたします。",
    },
    capture: {
      emailLabel: "業務用メールアドレス",
      demo: {
        heading: "貴校で実際に動く様子をご覧ください。",
        lede: "業務用メールアドレスをご入力いただければ、貴校に合わせたご案内を手配します。",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "お問い合わせ",
        consent: "メールアドレスはデモの手配にのみ使用します。",
      },
      project: {
        heading: "つくっているものを教えてください。",
        lede: "業務用メールアドレスをご入力いただければ、ディスカバリーを始めるためにご連絡します。",
        placeholder: CONTACT_STRINGS.capture.project.placeholder,
        button: "お問い合わせ",
        consent: DETAILS_CONSENT,
      },
    },
    errors: ERRORS,
    productPills: CONTACT_STRINGS.productPills,
    defaultProduct: CONTACT_STRINGS.defaultProduct,
    schoolSizes: [
      "生徒数 500 人未満",
      "生徒数 500〜1,500 人",
      "生徒数 1,500 人超",
      "複数キャンパス",
    ],
    startTimings: ["できるだけ早く", "1〜3 か月以内", "情報収集中"],
    services: [...SERVICES.map((service) => service.name), "未定"],
  },
  dayRoad: {
    heading: "学校の一日。",
    lede: "ある生徒の典型的な一日をたどり、生徒、保護者、学校職員が各段階でどのように情報を共有し、つながっているかをご覧ください。",
    start: "スタート",
    finish: "ゴール",
    stops: [
      {
        ...arrive,
        title: "生徒が登校",
        text: "生徒がキャンパスに到着します。",
      },
      {
        ...attendance,
        title: "出欠を記録",
        text: `教員が ${staffHub.shortName} で生徒の出欠を記録します。`,
      },
      {
        ...parentStop,
        title: "保護者にお知らせ",
        text: `${parentHub.shortName} が、生徒が学校に着いたことを保護者に通知します。`,
      },
      {
        ...learn,
        title: "生徒が学ぶ",
        text: "生徒は AI Tutor で練習し、質問します。",
      },
      {
        ...campus,
        title: PRODUCT_DETAILS.iot.features[1].title,
        text: APP_TAGLINES.iot,
      },
      {
        ...connected,
        title: "一日中つながる",
        text: "通知と学校の情報が、システム全体でつながり続けます。",
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
  hcmc: hcmcJa,
  homeApps: {
    title: "つながる学校。",
    lede: JOURNEY_LEDE,
    apps: homeApps.apps.map((card) => ({
      ...card,
      madeFor: PRODUCT_DETAILS[card.app.id].madeFor,
      features: PRODUCT_DETAILS[card.app.id].features
        .slice(0, 2)
        .map((feature) => feature.title),
    })),
    link: { href: homeApps.link.href, label: "製品を見る" },
  },
  homeCapabilities: {
    title: "XionTech が選ばれる理由。",
    lede: "あらゆる学校向けアプリとお届けするすべてのプロダクトを支える力、そして AI を使ったよりスマートなつくり方を探し続けるチーム。",
    delivery: {
      label: "グローバルデリバリー",
      title: "2 つの本社、ひとつの稼働日。",
      line: "タイムゾーンをまたぐチームが、実用的に重なる時間帯を活かしてデリバリーを止めません。",
    },
    industries: {
      label: "ドメインの専門性",
      title: "教育に深く。変化に強く。",
      line: "最も深く取り組んでいるのは教育ですが、同じエンジニアリング力がほかの業界も支えています。",
      main: "教育",
      more: ["ヘルスケア", "物流", "プライベートエクイティ"],
      moreLabel: "ほか 3 業界：ヘルスケア、物流、プライベートエクイティ",
    },
    motto: {
      lead: "Get IT Done",
      title: "オーナーシップでつくる。",
      line: "約束への責任と、品質への誇り。",
    },
  },
  homeDoors: {
    label: "私たちの仕事",
    products: {
      ...homeDoors.products,
      title: "学校向け製品",
      line: "保護者、生徒、教員、管理職、学校職員をつなぐアプリ。",
    },
    services: {
      ...homeDoors.services,
      label: "開発委託サービス",
      title: "あなたのソフトウェア開発チーム",
      line: "デジタルプロダクトをつくる企業のための専任チームとエンドツーエンドのデリバリー。",
      chips: [...homeDoors.services.chips.slice(0, -1), "ほか 3 件"],
    },
  },
  homeFaq: {
    title: "よくあるご質問。",
    lede: "製品、サービス、仕事の進め方について、率直にお答えします。",
    items: homeFaq.items.map((item) => ({ id: item.id, ...FAQ[item.id] })),
    link: { href: homeFaq.link.href, label: "すべての質問を見る" },
  },
  homeHero: {
    title: {
      lines: ["もっとスマートにつくる。", "もっと速く届ける。"],
      highlight: "Get IT done",
      tail: "。",
    },
    sub: "学校とキャンパスをつなぐソリューション、ソフトウェア製品、専任チームを、AI を活用した開発の先頭に立つ人々がお届けします。",
    motion: { pause: "アニメーションを停止", play: "アニメーションを再生" },
    cta: { href: homeHero.cta.href, label: "お問い合わせ" },
  },
  homeMeta: {
    title:
      "XionTech | ベトナムの学校向けプラットフォームとソフトウェア開発委託",
  },
  homeNews: {
    heading: "XionTech の最新情報。",
    lede: "私たちのチームがつくり、届けているものをご覧ください。",
    seeAll: { href: homeNews.seeAll.href, label: "すべてのニュースを見る" },
    readStory: "記事を読む",
  },
  homeOutcomes: {
    title: OUTCOMES.title,
    lede: SERVICES_LEDE,
    items: OUTCOMES.items,
    cta: { href: homeOutcomes.cta.href, label: START_PROJECT },
    link: { href: homeOutcomes.link.href, label: "サービスを見る" },
  },
  homeProcess: {
    title: "仕事の進め方。",
    lede: "私たちの 4-D プロセス（ディスカバリー、デザイン、開発、デプロイ）は、アイデアをローンチまで導きます。各ステップの終わりには、目で見て承認できる成果物があります。AI はすべてのステップに組み込まれており、その使い方を改善し続けています。",
    link: { href: homeProcess.link.href, label: "プロセスの全体を見る" },
  },
  homeStats: {
    label: "信頼できる実績",
    stats: [
      "ソフトウェア分野でのリーダーシップ経験年数",
      "タイムゾーンをまたぐグローバル対応",
      "対応している技術スタック",
      "アイデアから運用までのサービス",
      "拠点：プレイノとホーチミン市に本社",
    ].map((caption, i) => ({ ...homeStats.stats[i], caption })),
  },
  homeValuesHeading: {
    title: "私たちのコアバリュー。",
    lede: "私たちの働き方の指針です。カードをめくると、それぞれの価値観の全文を読めます。",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
  },
  jobDetails: {
    sectionLabel: "職種の詳細と応募",
    aboutHeading: "この職種について",
    doHeading: "担当業務",
    bringHeading: "求めるスキル・経験",
    backLabel: "募集中のすべての職種",
    backHref: jobDetails.backHref,
  },
  jobForm: {
    heading: "この職種に応募する",
    name: "氏名",
    email: "メールアドレス",
    phone: "電話番号（任意）",
    cv: "CV",
    cvHelp: "PDF または Word、5 MB まで。",
    note: "カバーノート（任意）",
    submit: "応募する",
    sending: "送信中...",
    successHeading: SUMMIT,
    successText: "応募書類を受け取りました。条件が合う場合はご連絡いたします。",
    sendError: "応募書類を送信できませんでした。もう一度お試しください。",
    rateError: RATE_ERROR,
    consent: "ご入力いただいた情報と CV は、選考にのみ使用します。",
    privacyLink: PRIVACY_LINK,
    privacyHref: jobForm.privacyHref,
    errorsHeading: FIX_HEADING,
  },
  jobHero: {
    breadcrumbLabel: "パンくずリスト",
    breadcrumbHome: "ホーム",
    breadcrumbCareers: "採用情報",
    chipsLabel: "職種の詳細",
  },
  jobMeta: {
    title: "募集職種 | XionTech の採用情報",
    description:
      "職種の内容を確認し、CV を添えてご応募ください。XionTech、ホーチミン市。",
  },
  journeyBoard: {
    ...journeyBoard,
    hint: "ステップを選ぶと、その裏で動くアプリが表示されます。",
    everyone: "全員",
    details: "詳細",
    lanes: ["生徒", "教員と職員", "保護者", "キャンパス"].map((label, i) => ({
      ...journeyBoard.lanes[i],
      label,
    })),
  },
  journeyMap: {
    intro: {
      title: "それぞれに。そして、つながるともっと良く。",
      lede: JOURNEY_LEDE,
    },
  },
  newsMeta: {
    title: "ニュース | XionTech",
    description:
      "XionTech の製品、学校、チーム、お客様との仕事についての短い記事。",
  },
  newsPage: {
    title: "最新情報をチェック",
    sub: "最新のニュースとお知らせを、いち早くお届けします。",
    storiesHeading: "すべての記事",
    filtersLabel: "対象で記事を絞り込む",
    sampleNote:
      "newXion ニュースルームの記事です。[Placeholder] と記されたものはサンプルです。",
    allFilter: { id: newsPage.allFilter.id, label: "すべて" },
    empty: "このカテゴリにはまだ記事がありません。",
    showAll: "すべて表示",
    countOne: "1 件の記事を表示中",
    countMany: "{n} 件の記事を表示中",
  },
  newsStory: {
    storyLabel: "記事",
    sampleNote:
      "[Placeholder] レイアウトを示すためのサンプル記事です。公開前に実際の記事に差し替えてください。",
    backToNews: { href: newsStory.backToNews.href, label: "ニュースに戻る" },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoJa, hcmcJa],
  otherLocations: OTHER_LOCATIONS,
  plano: planoJa,
  privacy: {
    metaTitle: "プライバシーポリシー | XionTech",
    metaDescription:
      "[Placeholder] フォームを通じてご提供いただいた個人データを XionTech がどのように使用するか。",
    breadcrumbLabel: "パンくずリスト",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: PRIVACY_LINK,
    title: "プライバシーポリシー。",
    lede: "[Placeholder] ポリシー本文は法務担当者が用意し、ベトナムの政令 13/2023（PDPD）に準拠します。",
    bodyLabel: "ポリシー",
    outlineNote:
      "[Placeholder] 内容の概要です。以下の各セクションはポリシーが扱うべき項目であり、実際のポリシーではありません。",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "私たちについてと連絡先",
        paragraphs: [
          "[Placeholder] データ管理者（XionTech の法人）、その所在地、プライバシーに関するお問い合わせ先。",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "収集する情報",
        paragraphs: [
          "[Placeholder] メールアドレス、氏名、電話番号、組織、役職、およびフォームを通じて送信されたすべての内容。求人に応募された場合は CV を含みます。",
          "[Placeholder] メールアドレス入力欄に入力されたメールアドレスは、フォームのメッセージと同様に当社の受信箱に送信されます。また、デモ依頼ページが読み込むまでの間に限り、ブラウザーのセッションストレージにも保持されます。",
        ],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "情報の利用方法",
        paragraphs: [
          "[Placeholder] お問い合わせへの回答、デモの手配、または応募書類と CV の選考にのみ使用します。",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "情報の共有先",
        paragraphs: [
          "[Placeholder] 当社に代わってデータを処理するサービス提供者：Gmail（フォームのメッセージを当社の受信箱に送信）、Upstash（ハッシュ化した値から作成するレート制限カウンター）、Vercel（ウェブサイトのホスティングと CV の非公開保管）、Google Fonts（日本語・韓国語・中国語ページ用のフォント）。",
        ],
      },
      {
        id: PRIVACY.sections[4].id,
        heading: "ベトナム国外への移転",
        paragraphs: [
          "[Placeholder] データが国外（例：プレイノのオフィス）に移転される場合と、政令 13/2023 が求める保護措置。",
        ],
      },
      {
        id: PRIVACY.sections[5].id,
        heading: "保管期間",
        paragraphs: [
          RETENTION_DECIDED,
          "[Placeholder] 保管期間に関する最終的な文言と、今後期限を設けるかどうか。",
        ],
      },
      {
        id: PRIVACY.sections[6].id,
        heading: "Cookie とアナリティクス",
        paragraphs: [
          "[Placeholder] 暫定の文章です。最終版では、必須のファーストパーティ言語 Cookie（保存する内容とその理由）を記載し、同意なしに必須ではない Cookie やアナリティクスを設定しないことを明記します。",
        ],
      },
      {
        id: PRIVACY.sections[7].id,
        heading: "お客様の権利",
        paragraphs: [
          "[Placeholder] データへのアクセス、訂正、削除、または同意の撤回。削除を依頼する方法はまだ決まっていません。",
        ],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
  productsMeta: {
    title: `学校向けアプリ：${appById("parent-hub").shortName}、${appById("staff-hub").shortName}、${appById("iot").shortName}、${appById("ai-tutor").shortName} | XionTech`,
    description: `保護者向けの ${appById("parent-hub").shortName}、職員・教員・管理職向けの ${appById("staff-hub").shortName}、キャンパス向けの ${appById("iot").fullName}。XionTech のつながる学校向けアプリ。`,
  },
  productsShowcase: { madeFor: "対象", featuresHeading: "機能" },
  roadDialog: { close: "閉じる" },
  roleTypes: {
    "full-time": "正社員",
    "part-time": "パートタイム",
    contract: "契約",
    internship: "インターンシップ",
  },
  servicesMeta: {
    title:
      "ベトナムのソフトウェア開発委託 | Product Engineering, AI, Low-code & Cloud | XionTech",
    description:
      "ホーチミン市から、専任チームとエンドツーエンドのソフトウェアデリバリーを。プロダクトエンジニアリング、AI、ローコード、クラウドを、米国、ヨーロッパ、オーストラリアのタイムゾーンでご提供します。",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "「",
      highlight: "Get IT done",
      tail: "」を体現するソフトウェアチーム。",
    },
    lede: "ホーチミン市から、プロダクトエンジニアリング、AI、ローコード、クラウドのデリバリーを、米国、ヨーロッパ、オーストラリアのタイムゾーンに合わせてご提供します。AI でよりスマートに働き、デリバリーの方法を革新し続けています。",
    primaryCta: { ...servicesPage.primaryCta, label: START_PROJECT },
  },
  servicesProcess: {
    title: "4-D プロセス：ご依頼からローンチまで。",
    lede: "各ステップの終わりには、目で見て、試して、承認できる成果物があります。AI はすべてのステップに組み込まれており、その使い方を改善し続けています。",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "8 つのサービス、ひとつのチーム。",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description:
          "エンドツーエンドのエンジニアリングの専門性で、革新的なアイデアを市場投入できるデジタルプロダクトに変えます。",
      },
      {
        ...servicesSection.services[1],
        description:
          "AI と高度な可視化で、生データを行動につながるインテリジェンスに変えます。",
      },
      {
        ...servicesSection.services[2],
        description:
          "お客様の業界知識と私たちの技術的専門性を組み合わせ、イノベーションを加速します。",
      },
      {
        ...servicesSection.services[3],
        description:
          "必要なときに、柔軟な形態で専門性の高い技術人材を確保できます。",
      },
      {
        ...servicesSection.services[4],
        description: "お客様固有の要件に合わせたソリューションを開発します。",
      },
      {
        ...servicesSection.services[5],
        description:
          "主要なローコードプラットフォームで、ツールと自動化をより速く提供します。",
      },
      {
        ...servicesSection.services[6],
        description: "人工知能を活用して、業務を変革します。",
      },
      {
        ...servicesSection.services[7],
        description: "Azure、AWS、GCP に精通したソリューション。",
      },
    ],
  },
  shell: {
    names: SERVICE_NAMES,
    nav: {
      home: "ホーム",
      products: "製品",
      services: "サービス",
      news: "ニュース",
      about: "会社概要",
      careers: "採用情報",
      skipLink: "本文へスキップ",
      mainNav: "メイン",
      homeLink: "XionTech ホーム",
      logoAlt: "XionTech, Get IT Done",
      menu: "メニュー",
      contact: "お問い合わせ",
      contactShort: "お問い合わせ",
      cityPlano: "プレイノ",
      cityHcmc: "ホーチミン市",
    },
    language: { label: "言語" },
    footer: {
      blurb:
        "学校と企業のための教育テクノロジー製品とソフトウェア開発サービス。",
      products: "製品",
      forSchools: "学校向け",
      forStudents: "生徒向け",
      forParents: "保護者向け",
      services: "サービス",
      howWeWork: "仕事の進め方",
      allServices: "すべてのサービス",
      company: "会社",
      aboutUs: "会社概要",
      offices: "拠点",
      privacy: PRIVACY_LINK,
    },
    notFound: {
      metaTitle: "ページが見つかりません | XionTech",
      title: "道に迷ってしまったようです。",
      lede: "お探しのページはここにはありません。道をたどってホームに戻るか、下から行き先を選んでください。",
      primary: "ホームへ",
      here: "現在地",
    },
  },
  meta: {
    title: "XionTech",
    description:
      "IT サービスとプロダクトエンジニアリング：AI、クラウド、カスタムアプリ、ローコードソリューション。",
  },
};
