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

const OTHER_LOCATIONS = "Également présents à Hanoï et Da Nang.";

const [aboutPlano, aboutHcmc] = aboutOffices.offices;

const PRODUCT_DETAILS: Dictionaries["productDetails"] = {
  "parent-hub": {
    madeFor: "Parents et familles",
    features: [
      "Alertes quand votre enfant arrive au portail",
      "Notes et commentaires dès leur publication",
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
      "Présences et dossiers en temps réel",
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
      "Projecteurs, écrans et son",
      "Éclairage et climatisation selon l’emploi du temps",
      "Portes et zones gérées de façon centralisée",
      "Consommation d’énergie sur tout le campus",
    ].map((title, i) => ({ ...productDetails.iot.features[i], title })),
  },
  "ai-tutor": {
    madeFor: "Les élèves, accompagnés de leurs enseignants",
    features: [
      "Diagnostic compétence par compétence",
      "Des indices pas à pas, une fois que vous avez essayé",
      "La maîtrise, seulement quand vous y arrivez seul",
    ].map((title, i) => ({ ...productDetails["ai-tutor"].features[i], title })),
  },
};

const APP_TAGLINES: Record<AppId, string> = {
  "parent-hub":
    "Les parents restent proches de chaque journée d’école, sur leur téléphone.",
  "staff-hub":
    "Un seul espace de travail où le personnel, les enseignants et la direction partagent les mêmes données.",
  iot: "Pilotez les équipements des salles, l’éclairage, la climatisation et les accès depuis un seul écran.",
  "ai-tutor":
    "[Placeholder] Résoudre de nouveaux problèmes par soi-même. Pas seulement lire des solutions.",
};

const FAQ: Record<string, { question: string; answer: string }> = {
  what: {
    question: "Que fait XionTech ?",
    answer:
      "Nous développons nos propres plateformes pour les écoles (Parent Hub, Staff Hub et IoT Device Management) et réalisons des logiciels pour d’autres entreprises : ingénierie produit, analytique pilotée par l’IA, co-création de produits et mise à disposition de talents.",
  },
  industries: {
    question: "Avec quels secteurs travaillez-vous ?",
    answer:
      "L’EdTech est notre cœur de métier. Nous servons aussi la santé, la logistique et le capital-investissement.",
  },
  "try-apps": {
    question: "Comment notre école peut-elle essayer Parent Hub ou Staff Hub ?",
    answer:
      "Contactez-nous. Nous vous présentons les applications à partir de scénarios tirés de votre propre école.",
  },
  "time-zones": {
    question: "Comment travaillez-vous avec plusieurs fuseaux horaires ?",
    answer:
      "Nos équipes de Plano, Hô Chi Minh-Ville, Hanoï et Da Nang couvrent les fuseaux horaires des États-Unis, de l’Europe et de l’Australie, avec des outils partagés pour des mises à jour en temps réel.",
  },
  shape: {
    question: "Quand adaptez-vous la solution à nos besoins ?",
    answer:
      "Dès le départ. La découverte, la première de nos quatre étapes, définit vos objectifs, vos utilisateurs et le périmètre avant le début de la conception.",
  },
  results: {
    question: "Quels résultats pouvons-nous attendre ?",
    answer:
      "Une réalisation rentable par des ingénieurs vietnamiens qualifiés, des livraisons dans les délais et des résultats mesurables qui soutiennent votre croissance.",
  },
  security: {
    question: "Comment protégez-vous nos données ?",
    answer:
      "[Placeholder] Nous travaillons avec honnêteté, transparence et des normes éthiques claires, appuyées par l’automatisation de la sécurité et une analyse continue.",
  },
  feedback: {
    question: "Comment donner notre avis pendant un projet ?",
    answer:
      "Par des canaux dédiés, des points réguliers et des sprints agiles, pour que vos retours façonnent le produit du début à la fin.",
  },
  value: {
    question: "Comment mesurez-vous et démontrez-vous la valeur ?",
    answer:
      "Nous suivons la vitesse, la qualité, l’impact sur le produit et l’autonomie de l’équipe, et nous les partageons ouvertement avec vous.",
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
        "Passez de la découverte et de l’UX à l’ingénierie, aux tests et au lancement avec une seule équipe de réalisation.",
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
      title: "Appliquer l’IA là où elle crée de la valeur",
      description:
        "Utilisez l’IA, l’analytique et l’automatisation pour améliorer les produits, les processus et la prise de décision.",
    },
  ],
};

const START_PROJECT = "Démarrer un projet";

const PROCESS_STEPS = [
  {
    title: "Découverte",
    line: "Des ateliers pour comprendre vos objectifs, vos utilisateurs, les risques et le périmètre.",
    receive: "Un périmètre clair, une estimation et un plan de réalisation.",
  },
  {
    title: "Conception",
    line: "Parcours utilisateurs, interfaces et architecture validés avant d’écrire le code.",
    receive: "Un prototype cliquable et une conception technique.",
  },
  {
    title: "Développement",
    line: "Des sprints agiles avec des démos régulières. Les tests et l’assurance qualité (QA) ont lieu dans chaque sprint, pas à la fin.",
    receive: "Un logiciel testé et fonctionnel à chaque sprint.",
  },
  {
    title: "Déploiement",
    line: "Une mise en production sûre, une surveillance et des améliorations après le lancement.",
    receive: "Une version en production avec un support continu.",
  },
];

const PROCESS_FLOW: Dictionaries["processFlow"] = {
  label: "Processus 4-D",
  receiveLabel: "Vous recevez",
  start: {
    ...processFlow.start,
    title: "Votre demande",
    line: "Une idée, un brief ou un besoin.",
  },
  end: {
    ...processFlow.end,
    title: "Lancement",
    line: "Et nous continuons à le faire grandir ensemble.",
  },
  steps: processFlow.steps.map((step, i) => ({ ...step, ...PROCESS_STEPS[i] })),
};

const JOURNEY_LEDE =
  "Une suite connectée pour les communautés scolaires, qui réunit les parents, l’apprentissage, la gestion du personnel et la technologie du campus dans un même écosystème.";

const RETENTION_DECIDED =
  "Les demandes de contact et de démo, les adresses e-mail envoyées, les candidatures et les CV sont conservés sans limite de durée.";

const [arrive, attendance, parentStop, learn, campus, connected] =
  dayRoad.stops;

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
  aboutCapture: {
    heading: "Découvrez nos applications en action.",
    lede: `Laissez votre e-mail professionnel et nous organiserons une présentation de ${parentHub.shortName} et ${staffHub.shortName}.`,
  },
  aboutFaq: {
    title: "Vos questions, nos réponses",
    lede: "Des réponses franches sur nos produits, nos services et notre façon de travailler.",
    items: ABOUT_FAQ_ITEMS,
    ask: {
      href: aboutFaq.ask.href,
      label: "Encore une question ? Posez-la-nous directement",
    },
  },
  aboutHero: {
    title: {
      lead: "Nous sommes XionTech,",
      middle: "une technologie bâtie avec ",
      accent: "responsabilité",
      tail: ".",
    },
    text: "Nous réunissons les personnes, les idées et la technologie pour créer des systèmes informatiques d’exception et bâtir un avenir meilleur pour tous. Depuis Hô Chi Minh-Ville et Plano, nous développons nos propres plateformes pour les écoles et réalisons des produits numériques pour des clients du monde entier.",
    links: [
      { href: aboutHero.links[0].href, label: "Découvrir nos produits" },
      { href: aboutHero.links[1].href, label: "Découvrir nos services" },
    ],
  },
  aboutMeta: {
    title: "À propos de XionTech | Get IT Done",
    description:
      "XionTech est une entreprise de technologie éducative et un partenaire logiciel, avec des sièges à Plano (États-Unis) et à Hô Chi Minh-Ville (Vietnam) et des équipes à Hanoï et Da Nang, au service de clients aux États-Unis, en Europe et en Australie.",
  },
  aboutOffices: {
    title: "Deux sièges, quatre implantations.",
    more: OTHER_LOCATIONS,
    offices: [
      {
        ...planoFr,
        tag: US_DELIVERY_CENTER,
        contacts: withNewTab(aboutPlano.contacts, "WhatsApp "),
      },
      { ...hcmcFr, contacts: aboutHcmc.contacts },
    ],
  },
  aboutStory: {
    title: {
      lead: "Inspirés par une montagne.",
      middle: "Unis par un ",
      highlight: "but",
      tail: ".",
    },
    chapters: [
      {
        number: aboutStory.chapters[0].number,
        title: "L’inspiration",
        text: "Notre nom s’inspire d’une montagne : un lieu que l’on admire, autour duquel on se rassemble et que l’on gravit ensemble vers un avenir meilleur.",
      },
      {
        number: aboutStory.chapters[1].number,
        title: "Le but",
        text: "[Placeholder] Inspirés par cette vision, un groupe de pionniers a fondé newXion en Amérique. Guidés par des valeurs fondamentales durables, ils ont entrepris de bâtir une communauté fidèle à l’esprit de la montagne : un lieu où les gens s’unissent, exploitent les technologies de pointe et créent des systèmes informatiques d’exception pour faire progresser l’humanité et bâtir un avenir meilleur pour tous.",
      },
    ],
    closing: {
      line: "Notre inspiration est une montagne. Notre but, ce sont les gens.",
      tags: "Vision · Communauté · Technologie",
    },
    cue: "Défiler",
    tagName: aboutStory.tagName,
  },
  aboutValues: {
    items: [
      {
        title: "Esprit start-up",
        short: "Agiles, résilients et toujours en progrès.",
        text: "Incarner un état d’esprit entrepreneurial, fait d’agilité, de flexibilité et de passion pour l’innovation. Notre exigence d’excellence repose sur la résilience et une culture d’amélioration continue.",
      },
      {
        title: "Le client au centre",
        short: "Les clients au cœur de tout ce que nous faisons.",
        text: "Les clients sont au cœur de tout ce que nous faisons. Nous nous efforçons d’offrir des expériences exceptionnelles et des résultats concrets grâce à une compréhension approfondie, un engagement proactif et des solutions sur mesure.",
      },
      {
        title: "L’intégrité d’abord",
        short: "Honnêtes, transparents et responsables.",
        text: "Agir avec honnêteté, transparence et responsabilité. Des normes éthiques guident chaque décision et chaque échange, et favorisent la confiance et les relations durables.",
      },
      {
        title: "Portés par l’innovation",
        short:
          "Explorer les nouvelles technologies pour garder une longueur d’avance.",
        text: "Passionnés par l’exploration des technologies émergentes et des approches créatives. L’innovation est inscrite dans notre ADN : elle nous permet de faire évoluer nos solutions et de garder une longueur d’avance sur les tendances du secteur.",
      },
      {
        title: "L’état d’esprit « Get IT Done »",
        short: "Nous tenons nos engagements et nous livrons.",
        text: "Assumer nos engagements et livrer des solutions de haute qualité, fiables et efficaces. Notre équipe est animée par le sens des responsabilités et un état d’esprit orienté résultats, qui atteint ou dépasse les standards du secteur.",
      },
      {
        title: "Une culture centrée sur les personnes",
        short:
          "Chaque membre de l’équipe valorisé, soutenu et en mesure d’agir.",
        text: "Cultiver un environnement de travail où chaque membre de l’équipe se sent valorisé, soutenu et en mesure d’agir. Notre culture va au-delà de l’emploi : elle repose sur l’appartenance, la collaboration et la réussite partagée.",
      },
    ].map((copy, i) => ({ ...aboutValues.items[i], ...copy })),
  },
  appTaglines: APP_TAGLINES,
  careersGrowth: {
    caption: "[Placeholder] Modèle d’apprentissage pour grandir",
    center: "Grandir",
    steps: ["Curiosité", "Apprendre", "Questionner", "Grandir", "Progresser"],
  },
  careersHero: {
    title: {
      first: "Restez curieux.",
      second: "Construisez la suite.",
    },
    lede: "Nous construisons une équipe pour celles et ceux qui apprennent vite, posent de meilleures questions, s’adaptent quand les choses changent et se soucient du résultat, pas seulement de la tâche. Ici, vous contribuerez à inventer de nouvelles façons de créer des logiciels avec l’IA.",
    cta: { href: careersHero.cta.href, label: "Voir les postes ouverts" },
  },
  careersInside: {
    heading: "Au cœur de XionTech.",
    lede: "Un aperçu des moments qui rythment la vie ici : ateliers, lancements de projets, journées d’équipe, célébrations, apprentissage partagé et les petits moments entre les deux.",
    tiles: [
      {
        tag: "Apprendre ensemble",
        title: "Ateliers et expérimentations",
        text: "Des sessions pratiques où l’équipe teste de nouveaux outils, des workflows agentiques et de meilleures façons de travailler.",
      },
      {
        tag: "Créer des liens",
        title: "Visites clients",
        text: "Comprendre le contexte sur place et renforcer les relations de travail.",
      },
      {
        tag: "Un cap commun",
        title: "Réunions générales",
        text: "Ce qui a changé, ce qui compte maintenant et où nous allons ensuite.",
      },
      {
        tag: "Démarrer ensemble",
        title: "Lancements de projets",
        text: "Un nouveau travail commence par un contexte partagé, pas par une mystérieuse liste de tâches.",
      },
      {
        tag: "Célébrer les progrès",
        title: "[Placeholder] Célébration",
        text: "Parce qu’un travail livré mérite plus qu’un statut passé au vert.",
      },
    ].map((copy, i) => ({ ...careersInside.tiles[i], ...copy })),
  },
  careersLife: {
    heading: "La vie chez XionTech.",
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
    heading: "Trouvez votre prochain défi.",
    emptyText: "Aucun poste ouvert pour le moment.",
    applyLabel: "Voir et postuler",
  },
  careersValues: {
    heading: "Cinq principes qui façonnent notre façon de travailler.",
    lede: "Ce sont les comportements que nous voulons que chacun ressente de notre part, chaque jour. Retournez une carte pour voir ce que chacun signifie en pratique.",
    frontHint: FLIP_FRONT,
    backHint: FLIP_BACK,
    cards: [
      {
        title: "[Placeholder] Rester agile",
        label: "RESTER AGILE",
        backTitle: "[Placeholder] Avancer sans perdre le cap.",
        text: "Rester flexible et s’adapter quand une nouvelle information ou une meilleure réponse change le chemin.",
      },
      {
        title: "[Placeholder] Assumer le résultat",
        label: "RESPONSABILITÉ",
        backTitle: "[Placeholder] Voir au-delà de sa tâche.",
        text: "Signaler les problèmes tôt, protéger la qualité et assumer la réussite réelle du travail.",
      },
      {
        title: "[Placeholder] Innover avec un but",
        label: "INNOVER",
        backTitle: "[Placeholder] La nouveauté n’est utile que si elle aide.",
        text: "Explorer les technologies émergentes quand elles améliorent le produit, l’expérience utilisateur ou notre façon de travailler.",
      },
      {
        title: "[Placeholder] Grandir ensemble",
        label: "GRANDIR ENSEMBLE",
        backTitle: "[Placeholder] Se rendre meilleurs les uns les autres.",
        text: "Partager ce que l’on sait, donner des retours utiles et laisser à ses collègues l’espace pour se dépasser, contribuer et grandir.",
      },
      {
        title: "[Placeholder] Get IT Done",
        label: "GET IT DONE",
        backTitle: "[Placeholder] Transformer le possible en réalité.",
        text: "Les bonnes idées comptent. C’est en livrant des résultats utiles et concrets qu’on leur donne de la valeur.",
      },
    ].map((copy, i) => ({ ...careersValues.cards[i], ...copy })),
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
      email: "E-mail professionnel",
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
      lede: "Parlez-nous un peu de vous et de ce sur quoi vous travaillez. Notre équipe vous contactera pour en savoir plus.",
      name: "Votre nom",
      email: "E-mail professionnel",
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
        heading: "Voyez-le fonctionner dans votre école.",
        lede: "Laissez votre e-mail professionnel et nous organiserons une présentation pensée pour votre école.",
        placeholder: CONTACT_STRINGS.capture.demo.placeholder,
        button: "Nous contacter",
        consent:
          "Nous utilisons votre e-mail uniquement pour organiser votre démo.",
      },
      project: {
        heading: "Dites-nous ce que vous construisez.",
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
  dayRoad: {
    heading: "Une journée à l’école.",
    lede: "Suivez le parcours d’un élève au fil d’une journée d’école type, et voyez comment élèves, parents et personnel restent informés et connectés à chaque étape.",
    start: "Départ",
    finish: "Arrivée",
    stops: [
      {
        ...arrive,
        title: "L’élève arrive",
        text: "L’élève arrive sur le campus.",
      },
      {
        ...attendance,
        title: "Présence enregistrée",
        text: `Un enseignant enregistre la présence de l’élève dans ${staffHub.shortName}.`,
      },
      {
        ...parentStop,
        title: "Parents informés",
        text: `${parentHub.shortName} informe les parents que l’élève est à l’école.`,
      },
      {
        ...learn,
        title: "L’élève apprend",
        text: `Les élèves s’exercent et posent leurs questions avec ${aiTutor.shortName}.`,
      },
      {
        ...campus,
        title: PRODUCT_DETAILS.iot.features[1].title,
        text: APP_TAGLINES.iot,
      },
      {
        ...connected,
        title: "Une journée connectée",
        text: "Les notifications et les informations de l’école restent connectées dans tout le système.",
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
  hcmc: hcmcFr,
  homeApps: {
    title: "Une école connectée.",
    lede: JOURNEY_LEDE,
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
    title: "Pourquoi XionTech.",
    lede: "Les compétences derrière chaque application scolaire et chaque produit que nous livrons, et une équipe qui ne cesse de trouver des façons plus intelligentes de construire avec l’IA.",
    delivery: {
      label: "Réalisation mondiale",
      title: "Deux sièges, une seule journée de travail.",
      line: "Des équipes réparties sur plusieurs fuseaux horaires font avancer la réalisation grâce à des plages communes concrètes.",
    },
    industries: {
      label: "Expertise métier",
      title: "Experts de l’éducation. Prêts à s’adapter.",
      line: "C’est dans l’éducation que nous allons le plus loin, et les mêmes compétences d’ingénierie servent aussi d’autres secteurs.",
      main: "Éducation",
      more: ["Santé", "Logistique", "Capital-investissement"],
      moreLabel:
        "+3 autres secteurs : santé, logistique et capital-investissement",
    },
    motto: {
      lead: "Get IT Done",
      title: "Bâti avec responsabilité.",
      line: "Nous assumons nos engagements et sommes fiers de la qualité.",
    },
  },
  homeDoors: {
    label: "Ce que nous faisons",
    products: {
      ...homeDoors.products,
      title: "Des produits pour les écoles",
      line: "Des applications connectées pour les parents, les élèves, les enseignants, la direction et le personnel.",
    },
    services: {
      ...homeDoors.services,
      label: "Services d’externalisation",
      title: "Votre équipe de réalisation logicielle",
      line: "Des équipes dédiées et une réalisation de bout en bout pour les entreprises qui créent des produits numériques.",
      chips: [...homeDoors.services.chips.slice(0, -1), "+3 autres"],
    },
  },
  homeFaq: {
    title: "Vos questions, nos réponses.",
    lede: "Des réponses franches sur nos produits, nos services et notre façon de travailler.",
    items: homeFaq.items.map((item) => ({ id: item.id, ...FAQ[item.id] })),
    link: { href: homeFaq.link.href, label: "Voir toutes les questions" },
  },
  homeHero: {
    title: {
      lines: ["Construire plus intelligemment.", "Livrer plus vite."],
      highlight: "Get IT done",
      tail: ".",
    },
    sub: "Des solutions connectées pour les écoles et les campus, des produits logiciels et des équipes dédiées, par des pionniers du développement assisté par l’IA.",
    motion: { pause: "Mettre l’animation en pause", play: "Lire l’animation" },
    cta: { href: homeHero.cta.href, label: "Nous contacter" },
  },
  homeMeta: {
    title:
      "XionTech | Plateformes scolaires et externalisation logicielle au Vietnam",
  },
  homeNews: {
    heading: "Les dernières nouvelles de XionTech.",
    lede: "Découvrez ce que notre équipe construit et livre.",
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
    title: "Notre façon de travailler.",
    lede: "Notre processus 4-D (Découverte, Conception, Développement, Déploiement) mène votre idée jusqu’au lancement, et chaque étape se termine par un livrable que vous pouvez voir et valider. L’IA intervient à chaque étape, et nous améliorons sans cesse notre façon de l’utiliser.",
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
    title: "Nos valeurs fondamentales.",
    lede: "Ce qui guide notre façon de travailler. Retournez une carte pour lire chaque valeur en entier.",
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
    hint: "Sélectionnez une étape pour voir l’application qui la porte.",
    everyone: "Tout le monde",
    details: "Détails",
    lanes: ["Élève", "Enseignants et personnel", "Parents", "Campus"].map(
      (label, i) => ({ ...journeyBoard.lanes[i], label }),
    ),
  },
  journeyMap: {
    intro: {
      title: "Conçues séparément. Meilleures ensemble.",
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
    sampleNote:
      "Articles de la salle de presse newXion ; ceux marqués [Placeholder] sont des exemples.",
    allFilter: { id: newsPage.allFilter.id, label: "Tous" },
    empty: "Aucun article n’est encore disponible dans cette catégorie.",
    showAll: "Tout afficher",
    countOne: "1 article affiché",
    countMany: "{n} articles affichés",
  },
  newsStory: {
    storyLabel: "Article",
    sampleNote:
      "[Placeholder] Article d’exemple pour montrer la mise en page. À remplacer par un vrai article avant le lancement.",
    backToNews: {
      href: newsStory.backToNews.href,
      label: "Retour aux actualités",
    },
    metaTitle: newsStory.metaTitle,
  },
  offices: [planoFr, hcmcFr],
  otherLocations: OTHER_LOCATIONS,
  plano: planoFr,
  privacy: {
    metaTitle: "Politique de confidentialité | XionTech",
    metaDescription:
      "[Placeholder] Comment XionTech utilise les données personnelles que vous transmettez via nos formulaires.",
    breadcrumbLabel: BREADCRUMB,
    breadcrumbHome: HOME,
    breadcrumbCurrent: PRIVACY_LINK,
    title: "Politique de confidentialité.",
    lede: "[Placeholder] Texte de la politique à fournir par le responsable juridique, conforme au décret vietnamien 13/2023 (PDPD).",
    bodyLabel: "Politique",
    outlineNote:
      "[Placeholder] Plan du contenu. Les sections ci-dessous indiquent ce que la politique doit couvrir, il ne s’agit pas de la politique réelle.",
    retentionDecided: RETENTION_DECIDED,
    sections: [
      {
        id: PRIVACY.sections[0].id,
        heading: "Qui nous sommes et comment nous joindre",
        paragraphs: [
          "[Placeholder] Le responsable du traitement (entité juridique XionTech), son adresse et un contact pour les demandes relatives à la vie privée.",
        ],
      },
      {
        id: PRIVACY.sections[1].id,
        heading: "Ce que nous collectons",
        paragraphs: [
          "[Placeholder] E-mail, nom, numéro de téléphone, organisation, fonction et tout ce que vous envoyez via nos formulaires, y compris un CV si vous postulez à un emploi.",
          "[Placeholder] L’e-mail que vous saisissez dans le bandeau de collecte d’e-mail est envoyé à la boîte de réception de l’entreprise, comme un message de formulaire. Votre navigateur le conserve aussi dans le stockage de session, uniquement jusqu’à ce que la page de demande de démo le lise.",
        ],
      },
      {
        id: PRIVACY.sections[2].id,
        heading: "Comment nous les utilisons",
        paragraphs: [
          "[Placeholder] Uniquement pour répondre à votre demande, organiser une démo, ou étudier votre candidature et votre CV.",
        ],
      },
      {
        id: PRIVACY.sections[3].id,
        heading: "Avec qui nous les partageons",
        paragraphs: [
          "[Placeholder] Les prestataires qui traitent des données pour notre compte : Gmail (envoie les messages des formulaires à la boîte de réception de l’entreprise), Upstash (compteurs de limitation de débit créés à partir de valeurs hachées), Vercel (hébergement du site web et stockage privé des CV), Google Fonts (polices des pages en japonais, coréen et chinois).",
        ],
      },
      {
        id: PRIVACY.sections[4].id,
        heading: "Transferts hors du Vietnam",
        paragraphs: [
          "[Placeholder] Quand des données sont transférées à l’étranger (par exemple vers notre bureau de Plano) et les garanties exigées par le décret 13/2023.",
        ],
      },
      {
        id: PRIVACY.sections[5].id,
        heading: "Durée de conservation",
        paragraphs: [
          RETENTION_DECIDED,
          "[Placeholder] La formulation définitive de la conservation, et si une limite de durée sera ajoutée plus tard.",
        ],
      },
      {
        id: PRIVACY.sections[6].id,
        heading: "Cookies et mesure d’audience",
        paragraphs: [
          "[Placeholder] Texte provisoire. Le texte définitif listera le cookie de langue propriétaire essentiel (ce qu’il stocke et pourquoi) et précisera qu’aucun cookie non essentiel ni outil de mesure d’audience n’est déposé sans votre consentement.",
        ],
      },
      {
        id: PRIVACY.sections[7].id,
        heading: "Vos droits",
        paragraphs: [
          "[Placeholder] Accéder à vos données, les corriger ou les supprimer, ou retirer votre consentement ; la manière de demander la suppression n’est pas encore décidée.",
        ],
      },
    ],
  },
  processFlow: PROCESS_FLOW,
  productDetails: PRODUCT_DETAILS,
  productsMeta: {
    title: `Applications scolaires : ${parentHub.shortName}, ${staffHub.shortName}, ${iotApp.shortName} et ${aiTutor.shortName} | XionTech`,
    description: `${parentHub.shortName} pour les parents, ${staffHub.shortName} pour le personnel, les enseignants et la direction, et ${iotApp.fullName} pour les campus. Des applications scolaires connectées signées XionTech.`,
  },
  productsShowcase: {
    madeFor: "Conçu pour",
    featuresHeading: "Fonctionnalités",
  },
  roadDialog: { close: "Fermer" },
  roleTypes: {
    "full-time": "Temps plein",
    "part-time": "Temps partiel",
    contract: "Contrat",
    internship: "Stage",
  },
  servicesMeta: {
    title:
      "Externalisation logicielle au Vietnam | Product Engineering, AI, Low-code & Cloud | XionTech",
    description:
      "Des équipes dédiées et une réalisation logicielle de bout en bout depuis Hô Chi Minh-Ville : ingénierie produit, IA, low-code et cloud, sur les fuseaux horaires des États-Unis, de l’Europe et de l’Australie.",
  },
  servicesOutcomes: OUTCOMES,
  servicesPage: {
    title: {
      lead: "Des équipes logicielles qui incarnent « ",
      highlight: "Get IT done",
      tail: " ».",
    },
    lede: "Ingénierie produit, IA, low-code et cloud depuis Hô Chi Minh-Ville, sur les fuseaux horaires des États-Unis, de l’Europe et de l’Australie. Nous travaillons plus intelligemment grâce à l’IA et innovons sans cesse dans notre façon de livrer.",
    primaryCta: { ...servicesPage.primaryCta, label: START_PROJECT },
  },
  servicesProcess: {
    title: "Notre processus 4-D : de votre demande au lancement.",
    lede: "Chaque étape se termine par un livrable que vous pouvez voir, tester et valider. L’IA intervient à chaque étape, et nous améliorons sans cesse notre façon de l’utiliser.",
    flow: PROCESS_FLOW,
  },
  servicesSection: {
    title: "Huit services, une seule équipe.",
    lede: SERVICES_LEDE,
    services: [
      {
        ...servicesSection.services[0],
        description:
          "Transformez des idées innovantes en produits numériques prêts pour le marché grâce à une expertise d’ingénierie de bout en bout.",
      },
      {
        ...servicesSection.services[1],
        description:
          "Transformez des données brutes en informations exploitables grâce à l’IA et à la visualisation avancée.",
      },
      {
        ...servicesSection.services[2],
        description:
          "Accélérez l’innovation en associant votre connaissance métier à notre expertise technique.",
      },
      {
        ...servicesSection.services[3],
        description:
          "Accédez à des talents techniques spécialisés quand vous en avez besoin, avec des formules flexibles.",
      },
      {
        ...servicesSection.services[4],
        description:
          "Développez des solutions sur mesure, alignées sur vos besoins spécifiques.",
      },
      {
        ...servicesSection.services[5],
        description:
          "Livrez plus vite des outils et des automatisations sur les principales plateformes low-code.",
      },
      {
        ...servicesSection.services[6],
        description:
          "Exploitez l’intelligence artificielle pour transformer vos opérations.",
      },
      {
        ...servicesSection.services[7],
        description: "Des solutions expertes sur Azure, AWS et GCP.",
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
      cityPlano: "Plano",
      cityHcmc: "Hô Chi Minh-Ville",
    },
    language: { label: "Langue" },
    footer: {
      blurb:
        "Produits de technologie éducative et services de réalisation logicielle pour les écoles et les entreprises.",
      products: "Produits",
      forSchools: "Pour les écoles",
      forStudents: "Pour les élèves",
      forParents: "Pour les parents",
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
      title: "Vous vous êtes écarté du sentier.",
      lede: "La page que vous cherchez n’est pas ici. Suivez le sentier pour revenir à l’accueil, ou choisissez un chemin ci-dessous.",
      primary: "Retour à l’accueil",
      here: "Vous êtes ici",
    },
  },
  meta: {
    title: "XionTech",
    description:
      "Services informatiques et ingénierie produit : IA, cloud, applications sur mesure et solutions low-code.",
  },
};
