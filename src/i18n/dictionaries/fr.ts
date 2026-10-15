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

// French. AI-translated from the English for native review. Product and
// service names and "Get IT done" stay English; addresses, numbers, emails,
// hrefs and ids are shared with English. French typography: a no-break space
// (U+00A0) before : ; ? ! and inside « ».

const count = (n: number) => n.toLocaleString("fr-FR");

const NEW_TAB = "(s’ouvre dans un nouvel onglet)";
const US_DELIVERY_CENTER = "Centre de développement aux États-Unis";
const VIETNAM_DELIVERY_CENTER = "Centre de développement au Vietnam";
const DETAILS_CONSENT =
  "Nous utilisons vos coordonnées uniquement pour répondre à cette demande.";
const SEND_ERROR =
  "Nous n’avons pas pu envoyer votre demande. Veuillez réessayer.";
const RATE_ERROR =
  "Vous avez envoyé plusieurs demandes en peu de temps. Veuillez réessayer dans quelques minutes.";
const FIX_HEADING = "Veuillez corriger les points suivants :";
const PRIVACY_LINK = "Politique de confidentialité";
const SUMMIT = "Sommet atteint. Merci !";
const FLIP_FRONT = "Retourner pour en savoir plus";
const FLIP_BACK = "Revenir";
const BREADCRUMB = "Fil d’Ariane";
const HOME = "Accueil";

// The accessible name of an external contact: its visible label, an optional
// prefix (the bracketed views drop "WhatsApp" from the label) and the new-tab note.
const withNewTab = (contacts: OfficeContact[], prefix = ""): OfficeContact[] =>
  contacts.map((contact) =>
    contact.external
      ? { ...contact, ariaLabel: `${prefix}${contact.label} ${NEW_TAB}` }
      : contact,
  );

const planoFr: Office = {
  ...plano,
  name: "Plano, Texas, États-Unis",
  contacts: withNewTab(plano.contacts),
  zoneLabel: "Heure du Centre (États-Unis)",
};

const hcmcFr: Office = {
  ...hcmc,
  name: "Hô Chi Minh-Ville, Vietnam",
  tag: VIETNAM_DELIVERY_CENTER,
};

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "Parents et familles",
    features: [
      "Alertes d’arrivée en temps réel",
      "Notes et commentaires publiés",
      "Messagerie bidirectionnelle avec les enseignants",
      "Paiement des frais avec des reçus clairs",
    ].map((title, i) => ({
      ...productDetails["parent-hub"].features[i],
      title,
    })),
  },
  "staff-hub": {
    madeFor: "Personnel, enseignants et direction",
    features: [
      "Présences et dossiers des élèves",
      "Classes, emplois du temps et notes",
      "Messages aux parents via Parent Hub",
      "Tableaux de bord de direction pour les priorités du jour",
    ].map((title, i) => ({
      ...productDetails["staff-hub"].features[i],
      title,
    })),
  },
  iot: {
    madeFor: "Équipes d’exploitation et de maintenance des établissements",
    features: [
      "Gestion centralisée des équipements",
      "Éclairage et climatisation programmés",
      "Portes et zones gérées de façon centralisée",
      "Consommation d’énergie sur tout le campus",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "Les élèves, accompagnés de leurs enseignants",
    features: [
      "Vérification de la compréhension par compétence",
      "Des indices pas à pas personnalisés",
      "La maîtrise, seulement quand vous y arrivez seul",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub":
    "Les parents restent informés et proches de la vie scolaire de leur enfant.",
  "staff-hub":
    "Réunissez la gestion quotidienne de l’école dans un espace de travail connecté.",
  iot: "Simplifiez la gestion des technologies connectées du campus.",
  "ai-tutor":
    "Aider les élèves à comprendre leurs erreurs et à prendre confiance grâce à un apprentissage guidé.",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "Que fait XionTech ?",
    answer:
      "Nous créons des produits propulsés par l’IA et réalisons des logiciels sur mesure, de l’ingénierie produit, des équipes dédiées et des solutions technologiques pour les entreprises.",
  },
  industries: {
    question: "Avec quels secteurs travaillez-vous ?",
    answer:
      "L’éducation est notre point de départ. Nous apportons des compétences d’ingénierie adaptables à des projets dans d’autres secteurs, selon les besoins de chaque client.",
  },
  begin: {
    question: "Comment démarre un nouveau projet ?",
    answer:
      "Nous commençons par comprendre vos objectifs et vos besoins, puis nous définissons l’approche avant de passer à la conception, au développement, aux tests et au déploiement.",
  },
  "time-zones": {
    question:
      "Comment vos équipes travaillent-elles avec plusieurs fuseaux horaires ?",
    answer:
      "Nos équipes de Plano, Hô Chi Minh-Ville, Hanoï et Da Nang couvrent les fuseaux horaires des États-Unis, de l’Europe et de l’Australie, avec des outils partagés pour des mises à jour en temps réel.",
  },
  quality: {
    question: "Comment garantissez-vous la qualité de la réalisation ?",
    answer:
      "Nos ingénieurs relisent le travail et associent tests et assurance qualité au développement assisté par l’IA, selon les standards convenus pour le projet.",
  },
};

// Home asks its own four (website copy v3).
const HOME_FAQ: Record<string, { question: string; answer: string }> = {
  "try-apps": {
    question: "Comment notre école peut-elle essayer Parent Hub ou Staff Hub ?",
    answer:
      "Laissez votre e-mail professionnel sur la page Produits et nous vous présenterons les applications à partir de scénarios tirés de votre propre école.",
  },
  "time-zones": {
    question: "Comment travaillez-vous avec plusieurs fuseaux horaires ?",
    answer:
      "Nos équipes de Plano, Hô Chi Minh-Ville, Hanoï et Da Nang couvrent les fuseaux horaires des États-Unis, de l’Europe et de l’Australie, avec des outils partagés pour des mises à jour en temps réel.",
  },
  results: {
    question: "Quels résultats pouvons-nous attendre ?",
    answer:
      "Une réalisation rentable par des ingénieurs vietnamiens qualifiés, des livraisons dans les délais et des résultats mesurables qui soutiennent votre croissance.",
  },
  feedback: {
    question: "Comment donner notre avis pendant un projet ?",
    answer:
      "Par des canaux dédiés, des points réguliers et des sprints agiles, pour que vos retours façonnent le produit du début à la fin.",
  },
};

const ABOUT_FAQ_ITEMS = aboutFaq.items.map((item) => ({
  id: item.id,
  ...FAQ[item.id],
}));

const SERVICES_LEDE =
  "Choisissez un service ou combinez-en plusieurs. Nous constituons l’équipe autour de votre produit.";

const OUTCOMES: Dictionaries["servicesOutcomes"] = {
  title: "Que pouvons-nous vous aider à accomplir ?",
  items: [
    {
      id: servicesOutcomes.items[0].id,
      title: "Créer un nouveau produit numérique",
      description:
        "Transformez votre idée en un produit prêt pour le marché, avec une conception de bout en bout, un développement logiciel sur mesure, des tests et un accompagnement au lancement.",
    },
    {
      id: servicesOutcomes.items[1].id,
      title: "Renforcer votre équipe",
      description:
        "Ajoutez des talents techniques spécialisés quand votre équipe interne a besoin de plus de capacité ou de compétences précises.",
    },
    {
      id: servicesOutcomes.items[2].id,
      title: "Moderniser une plateforme existante",
      description:
        "Améliorez les applications, l’infrastructure, le déploiement dans le cloud et les pratiques d’ingénierie tout en préservant ce qui fonctionne déjà.",
    },
    {
      id: servicesOutcomes.items[3].id,
      title: "Tirer parti de l’IA pour créer de la valeur",
      description:
        "Créez des solutions propulsées par l’IA, automatisez vos processus et transformez vos données en informations exploitables pour des décisions plus éclairées.",
    },
  ],
};

const START_PROJECT = "Démarrer un projet";

const PROCESS_STEPS = [
  {
    title: "Découverte",
    line: "Nos ateliers révèlent vos objectifs, vos utilisateurs, les risques et le périmètre, et transforment l’idée en exigences claires",
    receive: "Des exigences claires, une estimation et un plan de réalisation",
  },
  {
    title: "Conception",
    line: "Ces exigences deviennent des parcours utilisateurs et un prototype cliquable, pour voir et affiner le produit avant de le construire",
    receive: "Un prototype validé et une conception technique",
  },
  {
    title: "Développement",
    line: "Le prototype validé guide la construction en sprints agiles, avec des tests à chaque sprint",
    receive: "Un logiciel testé et fonctionnel à chaque démo",
  },
  {
    title: "Déploiement",
    line: "Le produit fini est mis en production en toute sécurité, puis suivi et amélioré grâce à l’usage réel",
    receive: "Un produit en production avec un support continu",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "Processus 4-D",
  receiveLabel: "Vous recevez",
  start: {
    ...processFlow.start,
    title: "Votre demande",
    line: "Une idée, un brief ou un besoin métier",
  },
  end: {
    ...processFlow.end,
    title: "Lancement",
    line: "Faire grandir le produit ensemble, version après version",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "Une suite connectée pour les communautés scolaires, qui réunit les parents, l’apprentissage, la gestion du personnel et la technologie du campus dans un même écosystème.";

const PRIVACY_META_TITLE = "Politique de confidentialité | XionTech";

const RETENTION_DECIDED =
  "Les demandes de contact et de démo, les adresses e-mail envoyées, les candidatures et les CV sont conservés sans limite de durée.";

const ERRORS = {
  name: "Veuillez saisir votre nom.",
  email: "Veuillez saisir une adresse e-mail valide.",
  org: "Veuillez saisir votre organisation.",
  phone:
    "Veuillez saisir un numéro de téléphone valide, par exemple (+1) 469 322 9899.",
  date: "Veuillez choisir la date du jour ou une date ultérieure.",
  message: `Votre message doit faire moins de ${count(MESSAGE_MAX_LENGTH)} caractères.`,
};

const parentHub = appById("parent-hub");
const staffHub = appById("staff-hub");
const iotApp = appById("iot");
const aiTutor = appById("ai-tutor");

export const fr: Dictionaries = {
  aboutCta: {
    title: "Construisons la suite",
    text: "Vous avez une idée de produit, un défi technologique ou une équipe d’ingénierie à faire grandir ? Voyons ensemble comment transformer vos objectifs en solutions utiles.",
    primary: { href: aboutCta.primary.href, label: "Parlons de votre projet" },
    secondary: {
      href: aboutCta.secondary.href,
      label: "Découvrir nos produits",
    },
  },
  aboutFaq: {
    title: "Envie d’en savoir plus sur XionTech ?",
    lede: "Quelques points à connaître avant de travailler avec nous.",
    items: ABOUT_FAQ_ITEMS,
  },
  aboutHero: {
    title: {
      lead: "Nous sommes XionTech.",
      middle: "Une technologie bâtie avec ",
      accent: "responsabilité",
      tail: "",
    },
    text: "Nous réunissons les personnes, les idées et la technologie pour créer des solutions numériques qui comptent. Du développement de produits logiciels à l’exploration de l’innovation propulsée par l’IA, nous associons expertise d’ingénierie, direction expérimentée et un fort sens des responsabilités pour aider les entreprises à avancer.",
    links: [
      { href: aboutHero.links[0].href, label: "Parler à notre équipe" },
      { href: aboutHero.links[1].href, label: "Découvrir nos services" },
    ],
  },
  aboutMeta: {
    title: "À propos de XionTech | Get IT Done",
    description:
      "XionTech est un partenaire d’ingénierie avec des équipes aux États-Unis et au Vietnam. Nous créons des produits logiciels, explorons l’innovation propulsée par l’IA et assumons la réalisation aux côtés de nos clients.",
  },
  aboutOffices: {
    title: "Deux centres de réalisation. Une seule équipe connectée",
    lede: "De Plano à Hô Chi Minh-Ville, nos équipes travaillent sur plusieurs fuseaux horaires pour accompagner nos clients et faire avancer les projets.",
    timeLabel: "Heure locale",
    mapLabel: "Ouvrir {city} dans Google Maps (s’ouvre dans un nouvel onglet)",
    locations: [
      {
        ...aboutOffices.locations[0],
        eyebrow: US_DELIVERY_CENTER,
        city: "Plano, Texas",
      },
      {
        ...aboutOffices.locations[1],
        eyebrow: VIETNAM_DELIVERY_CENTER,
        city: "Hô Chi Minh-Ville",
      },
    ],
  },
  aboutStory: {
    title: {
      lead: "Inspirés par une montagne.",
      middle: "Portés par un ",
      highlight: "but",
      tail: "",
    },
    paragraphs: [
      "Notre nom s’inspire d’une montagne, symbole d’ambition, d’unité et de la détermination à atteindre de nouveaux sommets.",
      "Cet esprit façonne qui nous sommes aujourd’hui. Nous réunissons les personnes et la technologie, relevons les défis et assumons ce que nous construisons, pour un avenir où l’innovation crée des progrès qui comptent.",
    ],
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        label: "Rester agile",
        title: "S’adapter avec un but.",
        text: "Rester flexible, répondre au changement et continuer d’avancer vers l’essentiel.",
      },
      {
        label: "Responsabilité",
        title: "Assumer le résultat.",
        text: "Prendre la parole, prendre ses responsabilités et mener les choses du début à la fin.",
      },
      {
        label: "Innover",
        title: "Rendre l’innovation utile.",
        text: "Explorer de nouvelles idées et technologies qui créent une vraie valeur pour les personnes et les entreprises.",
      },
      {
        label: "Grandir ensemble",
        title: "Meilleurs ensemble.",
        text: "Partager ses connaissances, se soutenir et grandir grâce à la collaboration et aux retours.",
      },
      {
        label: "Get IT done",
        title: "Transformer les idées en impact.",
        text: "Aller au-delà des idées et livrer des solutions concrètes qui font la différence.",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  aboutValuesHeading: {
    title: "Ce qui nous anime",
    lede: "Cinq principes qui guident notre façon de collaborer, de décider et d’obtenir des résultats qui comptent.",
  },
  appTaglines: APP_TAGLINES,
  careersGain: {
    heading: "Les principes qui nous guident",
    intro:
      "Développez vos compétences, explorez de nouvelles technologies et travaillez avec des personnes qui se soutiennent. Voici ce qui vous attend chez XionTech.",
    cards: [
      {
        number: "01",
        title: "Apprendre par la pratique",
        text: "Apprenez en faisant, grâce aux ateliers, au partage de connaissances et à de vrais défis d’ingénierie.",
      },
      {
        number: "02",
        title: "IA et nouvelles technologies",
        text: "Explorez les outils d’IA, l’automatisation et les technologies modernes qui vous aident à travailler plus intelligemment.",
      },
      {
        number: "03",
        title: "Des projets concrets",
        text: "Résolvez de vrais problèmes clients et voyez en quoi votre travail fait la différence.",
      },
      {
        number: "04",
        title: "Des moments d’équipe",
        text: "Créez des liens grâce aux activités d’équipe, à l’apprentissage partagé et aux réussites célébrées ensemble.",
      },
    ],
  },
  careersHero: {
    title: { first: "Carrières chez", second: "XionTech" },
    lede: "Nous réunissons des esprits curieux qui aiment résoudre des problèmes, explorer de nouvelles technologies et créer des choses qui font la différence.",
    prompt: "Prêt à construire avec nous ?",
    artAlt:
      "Trois cartes empilées illustrant l’ingénierie propulsée par l’IA, une puce de code et des technologies connectées",
  },
  careersLife: {
    heading: "Découvrez l’équipe XionTech",
    lede: "Chez XionTech, nous prenons l’ingénierie au sérieux, mais pas nous-mêmes. Nous posons des questions, prenons nos responsabilités et continuons d’apprendre ensemble. Après le travail, nous apportons le même esprit d’équipe sur le terrain de badminton, le terrain de foot, au micro du karaoké et dans le salon de jeu.",
    tagsLabel: "Les passions de notre équipe",
    tags: [
      "Habitués du badminton",
      "Fans de foot",
      "Équipe League of Legends",
      "Accros du karaoké",
      "Afterworks entre collègues",
      "Amateurs de café",
      "Otaku",
      "Guitaristes",
      "Explorateurs de l’IA",
      "Cinéphiles",
      "...et vous ?",
    ],
    stripLabel: "Photos de l’équipe XionTech",
    photoAlt: "Un moment de l’équipe XionTech",
    frames: [
      "[Placeholder] Photo d’équipe",
      "[Placeholder] Photo des bureaux",
      "[Placeholder] Photo d’événement",
    ].map((placeholder, i) => ({ ...careersLife.frames[i], placeholder })),
  },
  careersMeta: {
    title:
      "Carrières chez XionTech | Emplois dans le logiciel à Hô Chi Minh-Ville",
    description:
      "Rejoignez XionTech à Hô Chi Minh-Ville. Travaillez sur des plateformes scolaires et des produits clients avec l’IA/ML, l’IA générative, le cloud et une réalisation agile, dans une culture centrée sur les personnes.",
  },
  careersRoles: {
    heading: "Trouvez votre prochain défi",
    emptyText: "Aucun poste ouvert pour le moment.",
    applyLabel: "Voir et postuler",
  },
  categoryLabels: {
    schools: "Écoles",
    students: "Élèves",
    parents: "Parents",
    company: "Entreprise",
  },
  contactErrors: {
    messageRequired: "Parlez-nous un peu de votre projet.",
    length: `Ce champ doit faire moins de ${count(TEXT_MAX_LENGTH)} caractères.`,
    cv: "Veuillez téléverser votre CV au format PDF ou Word, 5 Mo maximum.",
    note: `Votre note d’accompagnement doit faire moins de ${count(MESSAGE_MAX_LENGTH)} caractères.`,
  },
  contactStrings: {
    metaTitle: "Réserver une démo ou démarrer un projet | XionTech",
    metaDescription: `Réservez une démo de ${parentHub.shortName} et ${staffHub.shortName} pour votre école, ou parlez-nous de votre projet logiciel. XionTech, Hô Chi Minh-Ville et Plano.`,
    hero: {
      breadcrumbLabel: BREADCRUMB,
      breadcrumbHome: HOME,
      breadcrumbCurrent: "Nous contacter",
      titleBefore: "Parlons de votre ",
      titleHighlight: "école",
      titleAfter: " ou de votre projet.",
      items: [
        `Une présentation de ${parentHub.shortName} et ${staffHub.shortName} à partir des scénarios de votre école.`,
        "Des réponses sur la mise en place, les données et le support.",
        "Pour les projets : un premier échange de découverte, la première de nos quatre étapes.",
      ],
      officesLabel: "Nos bureaux",
    },
    form: {
      heading: "Comment pouvons-nous vous aider ?",
      tabsLabel: "Type de demande",
      tabDemo: "Démo produit",
      tabProject: "Projet d’externalisation",
      name: "Nom complet",
      email: "Adresse e-mail",
      org: "École ou entreprise",
      role: "Votre fonction",
      roleHelp: "Par exemple : chef d’établissement, responsable informatique",
      products: "Produits qui vous intéressent",
      schoolSize: "Taille de l’école",
      date: "Date souhaitée",
      service: "Service",
      startTiming: "Quand souhaitez-vous commencer ?",
      message: "Message (facultatif)",
      submit: "Envoyer la demande",
      sending: "Envoi en cours…",
      successHeading: SUMMIT,
      successText: "Nous vous contacterons très bientôt.",
      sendError: SEND_ERROR,
      rateError: RATE_ERROR,
      consent: DETAILS_CONSENT,
      privacyLink: PRIVACY_LINK,
      errorsHeading: FIX_HEADING,
    },
    home: {
      heading: "Vous avez un projet à construire ?",
      lede: "Vous créez quelque chose de nouveau ou améliorez l’existant ? Parlez-nous de vos objectifs, et nous verrons comment vous aider.",
      name: "Votre nom",
      email: "Adresse e-mail",
      phone: "Numéro de téléphone",
      optional: "(facultatif)",
      phonePlaceholder: CONTACT_STRINGS.home.phonePlaceholder,
      message: "Parlez-nous de votre projet",
      messagePlaceholder:
        "Que souhaitez-vous construire ? Parlez-nous de votre idée, de votre produit existant, de votre équipe ou de votre défi.",
      submit: "Engager la conversation",
      consent:
        "Nous utilisons vos coordonnées uniquement pour répondre à votre message.",
      successHeading:
        "Sommet atteint. Merci, nous avons bien reçu votre message.",
      successText:
        "Notre équipe va examiner ce que vous nous avez transmis et reviendra vers vous.",
    },
    capture: {
      emailLabel: "E-mail professionnel",
      demo: {
        heading: "Voyez-le fonctionner dans votre école",
        lede: "Laissez votre e-mail professionnel et nous organiserons une démo pensée pour votre école.",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "Nous contacter",
        consent:
          "Nous utilisons votre e-mail uniquement pour organiser votre démo.",
      },
      project: {
        heading: "Dites-nous ce que vous construisez",
        lede: "Laissez votre e-mail professionnel et nous vous contacterons pour lancer la découverte.",
        placeholder: CONTACT_STRINGS.capture.project.placeholder,
        button: "Nous contacter",
        consent: DETAILS_CONSENT,
      },
    },
    errors: ERRORS,
    productPills: CONTACT_STRINGS.productPills,
    defaultProduct: CONTACT_STRINGS.defaultProduct,
    schoolSizes: [
      `Moins de ${count(500)} élèves`,
      `De ${count(500)} à ${count(1500)} élèves`,
      `Plus de ${count(1500)} élèves`,
      "Plusieurs campus",
    ],
    startTimings: ["Dès que possible", "Dans 1 à 3 mois", "Simple exploration"],
    services: [...SERVICES.map((service) => service.name), "Pas encore décidé"],
  },
  footerOffices: [
    { ...footerOffices[0], tag: US_DELIVERY_CENTER },
    {
      ...footerOffices[1],
      name: "Hô Chi Minh-Ville",
      tag: VIETNAM_DELIVERY_CENTER,
    },
  ],
  hcmc: hcmcFr,
  homeApps: {
    title: "Une école connectée",
    lede: "Rassemblez toute la communauté scolaire avec des solutions connectées pour les parents, le personnel, les élèves et la gestion du campus, toutes pensées pour simplifier la gestion quotidienne de l’école.",
    apps: homeApps.apps.map((card) => ({
      ...card,
      madeFor: PRODUCT_DETAILS[card.app.id].madeFor,
      features: PRODUCT_DETAILS[card.app.id].features
        .slice(0, 2)
        .map((feature) => feature.title),
    })),
    link: { href: homeApps.link.href, label: "Découvrir les produits" },
  },
  homeCapabilities: {
    title: "Pourquoi XionTech",
    lede: "Nous créons nous-mêmes des produits et mettons cette expérience concrète au service de nos clients, en associant découverte métier, maîtrise de l’ingénierie et développement assisté par l’IA.",
    delivery: {
      label: "Réalisation mondiale",
      title: "Deux sièges, une seule journée de travail",
      line: "Des équipes réparties sur plusieurs fuseaux horaires font avancer la réalisation grâce à des plages communes concrètes.",
    },
    industries: {
      label: "Expertise métier",
      title: "Partir de l’éducation. Prêts à s’adapter",
      line: "Notre expérience de la technologie éducative est une base solide pour développer des solutions sur mesure dans de nombreux secteurs.",
      main: "Éducation",
      more: ["Santé", "Logistique", "Capital-investissement"],
      moreLabel:
        "+3 autres secteurs : santé, logistique et capital-investissement",
    },
    motto: {
      lead: "Get IT Done",
      title: "Bâti avec responsabilité, de la première idée à la livraison.",
      line: "",
    },
  },
  homeDoors: {
    label: "Ce que nous faisons",
    products: {
      ...homeDoors.products,
      label: "Des produits pour les écoles",
      title: "Des plateformes, un seul écosystème",
      line: "Un écosystème intégré et propulsé par l’IA qui enrichit l’apprentissage, simplifie la gestion de l’école et maintient l’engagement des élèves",
    },
    services: {
      ...homeDoors.services,
      label: "Services d’externalisation",
      title: "Des logiciels sur mesure pour votre entreprise",
      line: "Travaillez avec nos équipes dédiées sur des logiciels sur mesure. Nous constituons chaque équipe autour de votre produit et vous accompagnons de la découverte au lancement, puis au support.",
      chips: [...homeDoors.services.chips.slice(0, -1), "+3 autres"],
    },
  },
  homeFaq: {
    title: "Avant de nous contacter",
    lede: "Des réponses franches sur nos produits, nos services et notre façon de travailler.",
    items: homeFaq.items.map((item) => ({
      id: item.id,
      ...HOME_FAQ[item.id],
    })),
    link: { href: homeFaq.link.href, label: "Voir toutes les questions" },
  },
  homeHero: {
    title: {
      lines: ["Construire plus intelligemment.", "Livrer plus vite."],
      highlight: "Get IT done",
      tail: "",
    },
    sub: "XionTech conçoit des produits propulsés par l’IA et des solutions sur mesure, alliant expérience concrète et technologies modernes pour relever les défis des entreprises.",
    motion: { pause: "Mettre l’animation en pause", play: "Lire l’animation" },
    cta: { href: homeHero.cta.href, label: "Nous contacter" },
  },
  homeMeta: {
    title:
      "XionTech | Plateformes scolaires et externalisation logicielle au Vietnam",
    description:
      "XionTech conçoit des produits propulsés par l’IA et des solutions sur mesure : plateformes scolaires (Parent Hub, Staff Hub, IoT, AI Tutor) et externalisation logicielle depuis le Vietnam.",
  },
  homeNews: {
    heading: "Les dernières nouvelles de XionTech",
    lede: "Découvrez ce que nous construisons, les idées que nous explorons et les personnes derrière notre travail.",
    seeAll: { href: homeNews.seeAll.href, label: "Voir toutes les actualités" },
    readStory: "Lire l’article",
  },
  homeOutcomes: {
    title: OUTCOMES.title,
    lede: SERVICES_LEDE,
    items: OUTCOMES.items,
    cta: { href: homeOutcomes.cta.href, label: START_PROJECT },
    link: { href: homeOutcomes.link.href, label: "Découvrir les services" },
  },
  homeProcess: {
    title: "Notre façon de travailler",
    lede: "De l’idée au lancement, notre processus 4-D apporte clarté, collaboration et progrès mesurables à chaque étape. Grâce à des méthodes assistées par l’IA et des livrables clairs, vous restez impliqué du début à la fin.",
    link: { href: homeProcess.link.href, label: "Voir tout le processus" },
  },
  homeStats: {
    label: "Une expérience sur laquelle compter",
    stats: [
      "Années d’expérience de direction dans le logiciel",
      "Couverture mondiale sur plusieurs fuseaux horaires",
      "Stacks technologiques dans lesquelles nous travaillons",
      "Offres de services, de l’idée à l’exploitation",
      "Implantations : sièges à Plano et Hô Chi Minh-Ville",
    ].map((caption, i) => ({ ...homeStats.stats[i], caption })),
  },
  homeValuesHeading: {
    title: "Ce qui nous anime",
    lede: "Cinq principes qui guident notre façon de collaborer, de décider et d’obtenir des résultats qui comptent.",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
  },
  jobDetails: {
    sectionLabel: "Détails du poste et candidature",
    aboutHeading: "À propos du poste",
    doHeading: "Vos missions",
    bringHeading: "Votre profil",
    backLabel: "Tous les postes ouverts",
    backHref: jobDetails.backHref,
  },
  jobForm: {
    heading: "Postuler à ce poste",
    name: "Nom complet",
    email: "E-mail",
    phone: "Téléphone (facultatif)",
    cv: "CV",
    cvHelp: "PDF ou Word, 5 Mo maximum.",
    note: "Note d’accompagnement (facultatif)",
    submit: "Envoyer la candidature",
    sending: "Envoi en cours…",
    successHeading: SUMMIT,
    successText:
      "Nous avons bien reçu votre candidature et nous vous contacterons si votre profil correspond.",
    sendError:
      "Nous n’avons pas pu envoyer votre candidature. Veuillez réessayer.",
    rateError: RATE_ERROR,
    consent:
      "Nous utilisons vos coordonnées et votre CV uniquement pour étudier votre candidature.",
    privacyLink: PRIVACY_LINK,
    privacyHref: jobForm.privacyHref,
    errorsHeading: FIX_HEADING,
  },
  jobHero: {
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCareers: "Carrières",
    chipsLabel: "Détails du poste",
  },
  jobMeta: {
    title: "Poste ouvert | Carrières chez XionTech",
    description:
      "Lisez la description du poste et postulez avec votre CV. XionTech, Hô Chi Minh-Ville.",
  },
  journeyBoard: {
    ...journeyBoard,
    details: "Détails",
    lanes: ["Élève", "Enseignants et personnel", "Parents"].map((label, i) => ({
      ...journeyBoard.lanes[i],
      label,
    })),
  },
  journeyMap: {
    intro: {
      title: "Conçues séparément. Meilleures ensemble",
      lede: JOURNEY_LEDE,
    },
  },
  newsMeta: {
    title: "Actualités | XionTech",
    description:
      "De courts articles sur les produits, les écoles, l’équipe et les projets clients de XionTech.",
  },
  newsPage: {
    title: "Restez informé",
    sub: "Suivez nos dernières actualités et annonces, dès leur parution.",
    storiesHeading: "Tous les articles",
    filtersLabel: "Filtrer les articles par public",
    allFilter: { id: newsPage.allFilter.id, label: "Tous" },
    empty: "Aucun article n’est encore disponible dans cette catégorie.",
    showAll: "Tout afficher",
    countOne: "{n} article affiché",
    countMany: "{n} articles affichés",
  },
  newsStory: {
    storyLabel: "Article",
    backToNews: {
      href: newsStory.backToNews.href,
      label: "Retour aux actualités",
    },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoFr, hcmcFr],
  otherLocations: "Hanoï, Da Nang",
  plano: planoFr,
  privacy: {
    metaTitle: PRIVACY_META_TITLE,
    metaDescription:
      "Comment XionTech utilise les données personnelles que vous transmettez via nos formulaires.",
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCurrent: PRIVACY_LINK,
    title: PRIVACY_LINK,
    bodyLabel: "Politique",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "Ce que nous collectons",
        paragraphs: [
          "E-mail, nom, numéro de téléphone, organisation, fonction et tout ce que vous envoyez via nos formulaires, y compris un CV si vous postulez à un emploi.",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "Comment nous les utilisons",
        paragraphs: [
          "Uniquement pour répondre à votre demande ou étudier votre candidature et votre CV.",
        ],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "Avec qui nous les partageons",
        paragraphs: [
          "Les prestataires qui traitent des données pour notre compte : Gmail (envoie les messages des formulaires à la boîte de réception de l’entreprise), Upstash (compteurs de limitation de débit créés à partir de valeurs hachées), Vercel (hébergement du site web et stockage privé des CV), Google Fonts (polices des pages en japonais, coréen et chinois).",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "Durée de conservation",
        paragraphs: [RETENTION_DECIDED],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
  productRoad: {
    ...productRoad,
    start: "Départ",
    finish: "Arrivée",
  },
  productsMeta: {
    title: `Applications scolaires : ${parentHub.shortName}, ${staffHub.shortName}, ${iotApp.shortName} et ${aiTutor.shortName} | XionTech`,
    description: `${parentHub.shortName} pour les parents, ${staffHub.shortName} pour le personnel, les enseignants et la direction, et ${iotApp.fullName} pour les campus. Des applications scolaires connectées signées XionTech.`,
  },
  productsShowcase: {
    madeFor: "Conçu pour",
    featuresHeading: "Fonctionnalités",
  },
  roadDialog: { close: "Fermer", previous: "Précédent", next: "Suivant" },
  roleTypes: {
    "full-time": "Temps plein",
    "part-time": "Temps partiel",
    contract: "Contrat",
    internship: "Stage",
  },
  servicesMeta: {
    title: "Externalisation logicielle au Vietnam | XionTech",
    description:
      "Externalisation logicielle depuis Hô Chi Minh-Ville : ingénierie produit, analytique pilotée par l’IA, co-création, mise à disposition de talents, applications sur mesure, low-code, solutions d’IA et cloud.",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "Vous apportez votre ",
      words: ["vision", "défi", "idée", "projet", "objectif"],
      suffix: ".",
      tail: ["Notre réponse : « ", "Get IT done", " »"],
      staticWord: "vision.",
      label: "Vous apportez votre vision. Notre réponse : « Get IT done »",
    },
    lede: "Des produits numériques à l’intégration de l’IA et à la modernisation technologique, nous apportons l’expertise pour relever vos défis, accélérer l’innovation et faire avancer votre entreprise.",
    primaryCta: { ...servicesPage.primaryCta, label: "Construisons ensemble" },
    secondaryCta: {
      ...servicesPage.secondaryCta,
      label: "Découvrir nos services",
    },
    stack: {
      label:
        "Illustration : les couches exigences, maquette et code technique d’un logiciel",
      requirements: "EXIGENCES",
      wireframe: "MAQUETTE",
      code: "CODE TECHNIQUE",
    },
  },
  servicesProcess: {
    title: "Notre processus 4-D : de votre demande au lancement",
    lede: "Chaque étape se termine par un livrable que vous pouvez voir, tester et valider. L’IA intervient à chaque étape, et nous améliorons sans cesse notre façon de l’utiliser.",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "Huit services, une seule équipe",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description:
          "Transformez vos idées en produits numériques prêts pour le marché, du concept au lancement.",
      },
      {
        ...servicesSection.services[1],
        description:
          "Transformez des données complexes en informations exploitables grâce à l’IA et à des tableaux de bord intuitifs.",
      },
      {
        ...servicesSection.services[2],
        description:
          "Associez votre connaissance du secteur à notre expertise produit pour créer des solutions qui comptent.",
      },
      {
        ...servicesSection.services[3],
        description:
          "Trouvez les bons talents techniques pour soutenir vos projets et faire grandir votre équipe.",
      },
      {
        ...servicesSection.services[4],
        description:
          "Créez des applications sur mesure adaptées à vos besoins et à vos processus.",
      },
      {
        ...servicesSection.services[5],
        description:
          "Créez des applications et automatisez vos processus plus vite grâce à des plateformes low-code flexibles.",
      },
      {
        ...servicesSection.services[6],
        description:
          "Mettez l’IA au travail avec des solutions intelligentes qui simplifient les processus et améliorent la productivité.",
      },
      {
        ...servicesSection.services[7],
        description:
          "Créez, faites évoluer et gérez des solutions cloud qui accompagnent la croissance de votre entreprise.",
      },
    ],
  },
  shell: {
    names: SERVICE_NAMES,
    nav: {
      home: HOME,
      products: "Produits",
      services: "Services",
      news: "Actualités",
      about: "À propos",
      careers: "Carrières",
      skipLink: "Aller au contenu",
      mainNav: "Principale",
      homeLink: "Accueil XionTech",
      logoAlt: "XionTech, Get IT Done",
      menu: "Menu",
      contact: "Contact",
      contactShort: "Contact",
      cityPlano: "Plano",
      cityHcmc: "Hô Chi Minh-Ville",
    },
    language: { label: "Langue" },
    backToTop: { label: "Retour en haut" },
    footer: {
      blurb:
        "XionTech conçoit des produits propulsés par l’IA et des solutions sur mesure, alliant expérience concrète et technologies modernes pour relever les défis des entreprises.",
      products: "Produits",
      services: "Services",
      howWeWork: "Notre façon de travailler",
      allServices: "Tous les services",
      company: "Entreprise",
      aboutUs: "À propos de nous",
      offices: "Bureaux",
      privacy: PRIVACY_LINK,
    },
    notFound: {
      metaTitle: "Page introuvable | XionTech",
      title: "Page introuvable",
      primary: "Retour à l’accueil",
    },
  },
  meta: {
    title: "XionTech",
    description:
      "Services informatiques et ingénierie produit : IA, cloud, applications sur mesure et solutions low-code.",
  },
};
