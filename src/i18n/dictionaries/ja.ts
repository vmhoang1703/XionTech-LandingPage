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

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "保護者とご家族",
    features: [
      "リアルタイムの到着通知",
      "公開された成績とフィードバック",
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
      "出欠と生徒の記録",
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
      "機器の一元管理",
      "照明と空調のスケジュール制御",
      "ドアとエリアを一元管理",
      "キャンパス全体のエネルギー使用量",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "生徒と、寄り添う教員",
    features: [
      "スキルごとの理解度チェック",
      "一人ひとりに合わせたステップごとのヒント",
      "一人でできるようになって初めて習得",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub":
    "保護者がお子さまの学校生活をいつでも把握し、つながっていられます。",
  "staff-hub":
    "学校の日々の運営を、ひとつのつながったワークスペースにまとめます。",
  iot: "キャンパスのコネクテッド技術の管理をシンプルにします。",
  "ai-tutor":
    "ガイド付きの学習で、生徒が間違いを理解し自信をつけられるよう支えます。",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "XionTech は何をしている会社ですか？",
    answer:
      "AI を活用した製品を開発し、企業向けにカスタムソフトウェア、プロダクトエンジニアリング、専任チーム、テクノロジーソリューションを提供しています。",
  },
  industries: {
    question: "どのような業界と仕事をしていますか？",
    answer:
      "出発点は教育です。お客様それぞれのニーズに応じて、柔軟なエンジニアリング力を他の業界のプロジェクトにも提供しています。",
  },
  begin: {
    question: "新しいプロジェクトはどのように始まりますか？",
    answer:
      "まずお客様の目標と要件を理解し、進め方を固めたうえで、設計、開発、テスト、デプロイへと進みます。",
  },
  "time-zones": {
    question: "チームは複数のタイムゾーンでどのように働いていますか？",
    answer:
      "プレイノ、ホーチミン市、ハノイ、ダナンのチームが米国、ヨーロッパ、オーストラリアのタイムゾーンをカバーし、共有ツールでリアルタイムに情報を更新しています。",
  },
  quality: {
    question: "開発の品質をどのように保っていますか？",
    answer:
      "エンジニアが成果物をレビューし、合意したプロジェクト基準に沿って、テストと品質保証を AI 支援開発と組み合わせています。",
  },
};

// Home asks its own four (website copy v3).
const HOME_FAQ: Record<string, { question: string; answer: string }> = {
  "try-apps": {
    question: "私たちの学校で Parent Hub や Staff Hub を試すには？",
    answer:
      "製品ページで仕事用のメールアドレスを残していただければ、貴校の実際の場面に沿ってアプリをご紹介します。",
  },
  "time-zones": {
    question: "複数のタイムゾーンでどのように働いていますか？",
    answer:
      "プレイノ、ホーチミン市、ハノイ、ダナンのチームが米国、ヨーロッパ、オーストラリアのタイムゾーンをカバーし、共有ツールでリアルタイムに情報を更新しています。",
  },
  results: {
    question: "どのような成果が期待できますか？",
    answer:
      "優秀なベトナム人エンジニアによるコスト効率の高い開発、期日どおりのリリース、そして成長を支える測定可能な成果です。",
  },
  feedback: {
    question: "プロジェクト中にどのようにフィードバックを伝えられますか？",
    answer:
      "専用チャンネル、頻繁な打ち合わせ、アジャイルなスプリントを通じて、お客様の意見を最初から最後まで製品に反映します。",
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
      title: "新しいデジタル製品をつくる",
      description:
        "エンドツーエンドの設計、カスタムソフトウェア開発、テスト、ローンチ支援で、アイデアを市場に出せる製品へと形にします。",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "チームを拡張する",
      description:
        "社内チームにさらなる人員や特定のスキルが必要なときに、専門的な技術人材を加えます。",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "既存のプラットフォームを刷新する",
      description:
        "うまく機能している部分を守りながら、アプリケーション、インフラ、クラウドでの提供、エンジニアリングの実践を改善します。",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "AI でビジネス価値を生み出す",
      description:
        "AI を活用したソリューションを構築し、業務を自動化し、ビジネスデータをより良い意思決定のための実用的な知見に変えます。",
    },
  ],
};

const START_PROJECT = "プロジェクトを始める";

const PROCESS_STEPS = [
  {
    title: "ディスカバリー",
    line: "ワークショップで目標、ユーザー、リスク、範囲を明らかにし、アイデアを明確な要件に落とし込みます",
    receive: "明確な要件、見積もり、開発計画",
  },
  {
    title: "デザイン",
    line: "要件をユーザーフローとクリックできるプロトタイプにし、つくる前に製品を見て磨き込めるようにします",
    receive: "承認済みのプロトタイプと技術設計",
  },
  {
    title: "開発",
    line: "承認したプロトタイプをもとにアジャイルなスプリントで開発し、スプリントごとにテストします",
    receive: "デモのたびにテスト済みで動くソフトウェア",
  },
  {
    title: "デプロイ",
    line: "完成した製品を安全に公開し、実際の利用を通じて監視と改善を続けます",
    receive: "稼働中の製品と継続的なサポート",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "4-D プロセス",
  receiveLabel: "お届けするもの",
  start: {
    ...processFlow.start,
    title: "お客様のご依頼",
    line: "アイデア、要望、またはビジネス上のニーズ",
  },
  end: {
    ...processFlow.end,
    title: "ローンチ",
    line: "リリースを重ねながら、製品をともに育てる",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "学校コミュニティのためのつながったスイート。保護者、学び、職員の業務、キャンパスのテクノロジーをひとつのエコシステムにまとめます。";

const PRIVACY_META_TITLE = "プライバシーポリシー | XionTech";

const RETENTION_DECIDED =
  "お問い合わせとデモのご依頼、メールアドレスの送信、応募書類と CV は、期限を設けずに保管します。";

const ERRORS = {
  name: "お名前を入力してください。",
  email: "有効なメールアドレスを入力してください。",
  org: "組織名を入力してください。",
  phone: "有効な電話番号を入力してください（例：(+1) 469 322 9899）。",
  date: "今日以降の日付を選択してください。",
  message: `メッセージは ${count(MESSAGE_MAX_LENGTH)} 文字以内で入力してください。`,
};

export const ja: Dictionaries = {
  aboutCta: {
    title: "次のものを一緒につくりましょう",
    text: "製品のアイデア、技術的な課題、あるいは拡大したいエンジニアリングチームはありますか？ 目標を意味のあるソリューションに変える方法を一緒に考えましょう。",
    primary: {
      href: aboutCta.primary.href,
      label: "プロジェクトについて相談する",
    },
    secondary: { href: aboutCta.secondary.href, label: "製品を見る" },
  },
  aboutFaq: {
    title: "XionTech についてもっと知りたいですか？",
    lede: "一緒に仕事を始める前に知っておきたいことをまとめました。",
    items: ABOUT_FAQ_ITEMS,
  },
  aboutHero: {
    title: {
      lead: "私たちは XionTech。",
      middle: "",
      accent: "オーナーシップ",
      tail: "でつくるテクノロジー",
    },
    text: "人、アイデア、テクノロジーを結びつけ、意味のあるデジタルソリューションをつくります。ソフトウェア製品の開発から AI を活用したイノベーションの探求まで、エンジニアリングの専門性、経験豊富なリーダーシップ、そして強い当事者意識を組み合わせ、企業の前進を支えます。",
    links: [
      { href: aboutHero.links[0].href, label: "チームに相談する" },
      { href: aboutHero.links[1].href, label: "サービスを見る" },
    ],
  },
  aboutMeta: {
    title: "XionTech について | Get IT Done",
    description:
      "XionTech は米国とベトナムにチームを持つエンジニアリングパートナーです。ソフトウェア製品をつくり、AI を活用したイノベーションを探求し、お客様とともに責任を持って開発を進めます。",
  },
  aboutOffices: {
    title: "2 つのデリバリーセンター、ひとつにつながるチーム",
    lede: "プレイノからホーチミン市まで、チームは複数のタイムゾーンをまたいでお客様を支え、プロジェクトを前に進めます。",
    timeLabel: "現地時刻",
    mapLabel: "Google マップで{city}を開く（新しいタブで開きます）",
    locations: [
      {
        ...aboutOffices.locations[0],
        eyebrow: US_DELIVERY_CENTER,
        city: "テキサス州プレイノ",
      },
      {
        ...aboutOffices.locations[1],
        eyebrow: VIETNAM_DELIVERY_CENTER,
        city: "ホーチミン市",
      },
    ],
  },
  aboutStory: {
    title: {
      lead: "山に着想を得て。",
      middle: "",
      highlight: "目的",
      tail: "に突き動かされて",
    },
    paragraphs: [
      "私たちの名前は山に着想を得ています。山は、志、団結、そして新たな高みを目指す決意の象徴です。",
      "その精神が今の私たちをかたちづくっています。人とテクノロジーを結びつけ、課題に挑み、自分たちがつくるものに責任を持ち、イノベーションが意味のある進歩を生む未来を目指しています。",
    ],
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        label: "俊敏であること",
        title: "目的を持って適応する。",
        text: "柔軟に変化へ対応し、大切なことに向かって進み続けます。",
      },
      {
        label: "当事者意識",
        title: "成果に責任を持つ。",
        text: "声を上げ、責任を引き受け、最初から最後までやり遂げます。",
      },
      {
        label: "イノベーション",
        title: "イノベーションを役立つものに。",
        text: "人と企業に意味のある価値を生む、新しいアイデアと技術を探求します。",
      },
      {
        label: "ともに成長する",
        title: "一緒だからこそ、より良く。",
        text: "知識を共有し、支え合い、協力とフィードバックを通じて成長します。",
      },
      {
        label: "Get IT done",
        title: "アイデアを成果に変える。",
        text: "アイデアの先へ進み、違いを生む実用的なソリューションを届けます。",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  aboutValuesHeading: {
    title: "私たちを動かすもの",
    lede: "協力の仕方、意思決定、そして意味のある成果の届け方を導く 5 つの原則です。",
  },
  appTaglines: APP_TAGLINES,
  careersGain: {
    heading: "私たちが大切にする価値観",
    intro:
      "スキルを伸ばし、新しい技術を探求し、支え合う仲間と働けます。XionTech で期待できることをご紹介します。",
    cards: [
      {
        number: "01",
        title: "実践で学ぶ",
        text: "ワークショップ、知識の共有、実際のエンジニアリングの課題を通じて、手を動かしながら学びます。",
      },
      {
        number: "02",
        title: "AI と新しい技術",
        text: "よりスマートに働くための AI ツール、自動化、最新の技術を探求します。",
      },
      {
        number: "03",
        title: "実際のプロジェクト",
        text: "お客様の本当の課題を解決し、自分の仕事が生む違いを実感できます。",
      },
      {
        number: "04",
        title: "チームでの体験",
        text: "チーム活動、ともに学ぶ時間、成功をみんなで祝うことを通じてつながりを築きます。",
      },
    ],
  },
  careersHero: {
    title: { first: "XionTech の", second: "採用情報" },
    lede: "私たちは、課題解決が好きで、新しい技術を探求し、違いを生み出すものをつくることに情熱を持つ、好奇心あふれる仲間を集めています。",
    prompt: "一緒につくりませんか？",
    artAlt:
      "AI を活用したエンジニアリング、コードチップ、つながるテクノロジーを描いた 3 枚の重なったカード",
  },
  careersLife: {
    heading: "XionTech のチームを紹介",
    lede: "XionTech では、エンジニアリングには真剣に、でも自分たちのことは深刻に考えすぎないようにしています。問いを立て、当事者意識を持ち、共に学び続けます。仕事の後も、同じチームワークでバドミントンコート、サッカーのピッチ、カラオケのマイク、ゲームのロビーへ。",
    tagsLabel: "チームの趣味",
    tags: [
      "バドミントン常連",
      "サッカー好き",
      "League of Legends 部隊",
      "カラオケ仲間",
      "仕事帰りの集まり",
      "コーヒー好き",
      "オタク",
      "ギタリスト",
      "AI 探究者",
      "映画好き",
      "...あなたは？",
    ],
    stripLabel: "XionTech チームの写真",
    photoAlt: "XionTech チームのひととき",
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
    heading: "次の挑戦を見つけよう",
    emptyText: "現在、募集中の職種はありません。",
    applyLabel: "詳細を見て応募する",
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
      email: "メールアドレス",
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
      lede: "新しいものをつくりたい、あるいは今あるものを改善したいとお考えですか？ 目標をお聞かせください。どのようにお手伝いできるか一緒に考えます。",
      name: "お名前",
      email: "メールアドレス",
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
        heading: "貴校での動きをご覧ください",
        lede: "仕事用のメールアドレスを残していただければ、貴校に合わせたデモを手配します。",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "お問い合わせ",
        consent: "メールアドレスはデモの手配にのみ使用します。",
      },
      project: {
        heading: "つくりたいものを教えてください",
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
  footerOffices: [
    { ...footerOffices[0], tag: US_DELIVERY_CENTER },
    {
      ...footerOffices[1],
      name: "ホーチミン市",
      tag: VIETNAM_DELIVERY_CENTER,
    },
  ],
  hcmc: hcmcJa,
  homeApps: {
    title: "つながる学校",
    lede: "保護者、教職員、生徒、キャンパス運営のためのコネクテッドなソリューションで、学校コミュニティ全体をひとつにします。すべて、日々の学校運営をシンプルにするために設計されています。",
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
    title: "XionTech が選ばれる理由",
    lede: "私たちは自ら製品をつくり、その実践的な経験をお客様に還元しています。業界の理解、エンジニアリングへの責任、AI 支援開発を組み合わせています。",
    delivery: {
      label: "グローバルデリバリー",
      title: "2 つの本社、ひとつの稼働日",
      line: "タイムゾーンをまたぐチームが、実用的に重なる時間帯を活かしてデリバリーを止めません。",
    },
    industries: {
      label: "ドメインの専門性",
      title: "教育から始まり、どこへでも適応",
      line: "教育テクノロジーを構築してきた経験が、さまざまな業界向けのソリューション開発の確かな土台になっています。",
      main: "教育",
      more: ["ヘルスケア", "物流", "プライベートエクイティ"],
      moreLabel: "ほか 3 業界：ヘルスケア、物流、プライベートエクイティ",
    },
    motto: {
      lead: "Get IT Done",
      title: "最初のアイデアから納品まで、当事者意識で。",
      line: "",
    },
  },
  homeDoors: {
    label: "私たちの仕事",
    products: {
      ...homeDoors.products,
      label: "学校向けの製品",
      title: "ひとつのエコシステムにつながるプラットフォーム",
      line: "学びを深め、学校運営をシンプルにし、生徒の意欲を保つ、AI を活用した統合エコシステム",
    },
    services: {
      ...homeDoors.services,
      label: "アウトソーシングサービス",
      title: "ビジネスのためのカスタムソフトウェア",
      line: "専任チームとともにカスタムソフトウェアを開発します。製品に合わせてチームを編成し、ディスカバリーからローンチ、サポートまで伴走します。",
      chips: [...homeDoors.services.chips.slice(0, -1), "ほか 3 件"],
    },
  },
  homeFaq: {
    title: "お問い合わせの前に",
    lede: "製品、サービス、私たちの働き方について率直にお答えします。",
    items: homeFaq.items.map((item) => ({
      id: item.id,
      ...HOME_FAQ[item.id],
    })),
    link: { href: homeFaq.link.href, label: "すべての質問を見る" },
  },
  homeHero: {
    title: {
      lines: ["もっとスマートにつくる。", "もっと速く届ける。"],
      highlight: "Get IT done",
      tail: "",
    },
    sub: "XionTech は、現場での経験と最新技術を組み合わせ、AI を活用した製品とカスタムソリューションでビジネスの課題を解決します。",
    motion: { pause: "アニメーションを停止", play: "アニメーションを再生" },
    cta: { href: homeHero.cta.href, label: "お問い合わせ" },
  },
  homeMeta: {
    title:
      "XionTech | ベトナムの学校向けプラットフォームとソフトウェア開発委託",
    description:
      "XionTech は AI を活用した製品とカスタムソリューションを開発しています。学校向けプラットフォーム（Parent Hub、Staff Hub、IoT、AI Tutor）とベトナムからのソフトウェア開発委託。",
  },
  homeNews: {
    heading: "XionTech の最新情報",
    lede: "私たちがつくっているもの、探求しているアイデア、そして仕事を支える人々をご紹介します。",
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
    title: "私たちの進め方",
    lede: "アイデアからローンチまで、4-D プロセスはすべての段階に明確さ、協力、そして測定可能な進捗をもたらします。AI 支援のワークフローと明確な成果物により、最初から最後までプロジェクトに関わっていただけます。",
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
    title: "私たちを動かすもの",
    lede: "協力の仕方、意思決定、そして意味のある成果の届け方を導く 5 つの原則です。",
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
    details: "詳細",
    lanes: ["生徒", "教員と職員", "保護者"].map((label, i) => ({
      ...journeyBoard.lanes[i],
      label,
    })),
  },
  journeyMap: {
    intro: {
      title: "別々につくり、一緒にもっと良く",
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
    allFilter: { id: newsPage.allFilter.id, label: "すべて" },
    empty: "このカテゴリにはまだ記事がありません。",
    showAll: "すべて表示",
    countOne: "1 件の記事を表示中",
    countMany: "{n} 件の記事を表示中",
  },
  newsStory: {
    storyLabel: "記事",
    backToNews: { href: newsStory.backToNews.href, label: "ニュースに戻る" },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoJa, hcmcJa],
  otherLocations: "ハノイ、ダナン",
  plano: planoJa,
  privacy: {
    metaTitle: PRIVACY_META_TITLE,
    metaDescription:
      "フォームを通じてご提供いただいた個人データを XionTech がどのように利用するかについて。",
    breadcrumbLabel: "パンくずリスト",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: PRIVACY_LINK,
    title: PRIVACY_LINK,
    bodyLabel: "ポリシー",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "収集する情報",
        paragraphs: [
          "メールアドレス、氏名、電話番号、所属組織、役職、そしてフォームから送信されたすべての内容（求人に応募される場合は履歴書を含む）。",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "利用目的",
        paragraphs: [
          "お問い合わせへの回答、または応募書類と履歴書の検討にのみ利用します。",
        ],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "共有先",
        paragraphs: [
          "当社に代わってデータを処理するサービス提供者：Gmail（フォームのメッセージを会社の受信トレイに送信）、Upstash（ハッシュ化した値から作るレート制限カウンター）、Vercel（ウェブサイトのホスティングと履歴書の非公開保存）、Google Fonts（日本語、韓国語、中国語ページのフォント）。",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "保存期間",
        paragraphs: [RETENTION_DECIDED],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
  productRoad: {
    ...productRoad,
    start: "スタート",
    finish: "ゴール",
  },
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
    title: "ベトナムのソフトウェアアウトソーシング | XionTech",
    description:
      "ホーチミン市からのソフトウェアアウトソーシング：プロダクトエンジニアリング、AI 分析、共創、人材提供、カスタムアプリ、ローコード、AI ソリューション、クラウド。",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "お客様の",
      words: ["ビジョン", "課題", "アイデア", "志", "目標"],
      suffix: "。",
      tail: ["私たちは「", "Get IT done", "」で応えます"],
      staticWord: "ビジョン。",
      label: "お客様のビジョン。私たちは「Get IT done」で応えます",
    },
    lede: "デジタル製品から AI の統合、技術の刷新まで、課題を解決し、イノベーションを加速し、ビジネスを前進させる専門性を提供します。",
    primaryCta: { ...servicesPage.primaryCta, label: "一緒につくりましょう" },
    secondaryCta: { ...servicesPage.secondaryCta, label: "サービスを見る" },
    stack: {
      label:
        "イラスト：ソフトウェア開発の要件、ワイヤーフレーム、技術コードの 3 つのレイヤー",
      requirements: "要件",
      wireframe: "ワイヤーフレーム",
      code: "技術コード",
    },
  },
  servicesProcess: {
    title: "4-D プロセス：ご依頼からローンチまで",
    lede: "各ステップの終わりには、目で見て、試して、承認できる成果物があります。AI はすべてのステップに組み込まれており、その使い方を改善し続けています。",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "8 つのサービス、ひとつのチーム",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description:
          "アイデアを、コンセプトからローンチまで、市場に出せるデジタル製品に変えます。",
      },
      {
        ...servicesSection.services[1],
        description:
          "AI と直感的なダッシュボードで、複雑なデータを実用的な知見に変えます。",
      },
      {
        ...servicesSection.services[2],
        description:
          "お客様の業界知識と私たちの製品の専門性を組み合わせ、意味のあるソリューションをつくります。",
      },
      {
        ...servicesSection.services[3],
        description:
          "プロジェクトを支え、チームを拡大するのにふさわしい技術人材を確保します。",
      },
      {
        ...servicesSection.services[4],
        description:
          "ビジネスのニーズとワークフローに合ったアプリケーションをつくります。",
      },
      {
        ...servicesSection.services[5],
        description:
          "柔軟なローコードプラットフォームで、アプリケーションの構築とワークフローの自動化をより速く進めます。",
      },
      {
        ...servicesSection.services[6],
        description:
          "業務を効率化し生産性を高めるインテリジェントなソリューションで、AI を活用します。",
      },
      {
        ...servicesSection.services[7],
        description:
          "成長するビジネスを支えるクラウドソリューションを構築、拡張、管理します。",
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
    backToTop: { label: "ページの先頭へ" },
    footer: {
      blurb:
        "XionTech は、現場での経験と最新技術を組み合わせ、AI を活用した製品とカスタムソリューションでビジネスの課題を解決します。",
      products: "製品",
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
      title: "ページが見つかりません",
      primary: "ホームへ",
    },
  },
  meta: {
    title: "XionTech",
    description:
      "IT サービスとプロダクトエンジニアリング：AI、クラウド、カスタムアプリ、ローコードソリューション。",
  },
};
