// 4-D process copy, shared by Home (3.6) and Services #process (5.4).
// Kept out of the components so it can be translated later.

export type ProcessFlowContent = {
  label: string;
  receiveLabel: string;
  start: { title: string; line: string };
  end: { title: string; line: string };
  steps: { num: string; title: string; line: string; receive: string }[];
};

export const processFlow: ProcessFlowContent = {
  label: "4-D process",
  receiveLabel: "You receive",
  start: { title: "Your request", line: "An idea, a brief or a requirement." },
  end: { title: "Launch", line: "And we keep growing it together." },
  steps: [
    {
      num: "01",
      title: "Discovery",
      line: "We learn your goals, users and scope.",
      receive: "A clear scope and delivery plan.",
    },
    {
      num: "02",
      title: "Design",
      line: "We shape flows, interfaces and architecture.",
      receive: "A clickable prototype and technical design.",
    },
    {
      num: "03",
      title: "Development",
      line: "We build in agile sprints with open updates.",
      receive: "Working software every sprint.",
    },
    {
      num: "04",
      title: "Deployment",
      line: "We release, monitor and keep improving.",
      receive: "A live release with ongoing support.",
    },
  ],
};
