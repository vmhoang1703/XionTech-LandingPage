import {
  HandshakeIcon,
  LightbulbFilamentIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  TargetIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";

// Core values, shown on Home (the About page dropped them in E-S3).

type AboutValue = {
  icon: Icon;
  title: string;
  text: string;
  featured?: boolean;
};

export const aboutValues: {
  items: AboutValue[];
} = {
  items: [
    {
      icon: RocketLaunchIcon,
      title: "Startup Spirit",
      text: "Embody an entrepreneurial mindset, embracing agility, flexibility, and a passion for innovation. Our commitment to excellence is driven by resilience and a culture of continuous improvement.",
    },
    {
      icon: HandshakeIcon,
      title: "Client Centricity",
      text: "Clients are at the heart of everything we do. We strive to deliver exceptional experiences and impactful outcomes through deep understanding, proactive engagement, and tailored solutions.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Integrity First",
      text: "Operate with honesty, transparency, and accountability. Ethical standards guide every decision and interaction, fostering trust and long-term relationships.",
    },
    {
      icon: LightbulbFilamentIcon,
      title: "Innovation Driven",
      text: "Passionate about exploring emerging technologies and creative approaches. Innovation is embedded in our DNA, enabling us to evolve our solutions and stay ahead of industry trends.",
    },
    {
      icon: TargetIcon,
      title: '"Get IT Done" Attitude',
      text: "Take ownership of our commitments and deliver high-quality, reliable, and efficient solutions. Our team is driven by accountability and a results-oriented mindset that meets or exceeds industry standards.",
      featured: true,
    },
    {
      icon: UsersThreeIcon,
      title: "People-Centered Culture",
      text: "Cultivate a workplace where every team member feels valued, supported, and empowered. Our culture goes beyond employment: it's about belonging, collaboration, and shared success.",
    },
  ],
};

export const homeValuesHeading = {
  title: "Our core values.",
  lede: "What guides how we work.",
};
