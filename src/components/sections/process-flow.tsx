import type { CSSProperties } from "react";
import type { ProcessFlowContent } from "@/content/process";
import { FlowReveal } from "./flow-reveal";

// Step entry delays from the prototype (--d, used only while revealing); the
// amber track fills over 2.4s.
const STEP_DELAYS = ["0.3s", "0.85s", "1.4s", "1.95s"];

type Node = ProcessFlowContent["start"];

function EndNode({ node, end }: Readonly<{ node: Node; end?: boolean }>) {
  const { icon: NodeIcon } = node;
  return (
    <li className={end ? "node end" : "node"}>
      <span className="dot">
        <NodeIcon aria-hidden="true" />
      </span>
      <b>{node.title}</b>
      <small>{node.line}</small>
    </li>
  );
}

// Shared 4-D process flow, ported from the prototype: Home navy band (3.6) and
// Services #process (5.4) pass their step content, icons included, as data.
// Above 1080px the "You receive" rows align across the four cards (subgrid);
// at 1080px and below the track and end nodes hide and steps use 2 columns,
// then 1 column at 640px and below.
export function ProcessFlow({ flow }: Readonly<{ flow: ProcessFlowContent }>) {
  const { label, receiveLabel, start, end, steps } = flow;

  return (
    <FlowReveal label={label}>
      <li className="track" aria-hidden="true">
        <i />
      </li>
      <EndNode node={start} />
      {steps.map((step, index) => {
        const { icon: MainIcon } = step;
        return (
          <li
            key={step.num}
            style={{ "--d": STEP_DELAYS[index] } as CSSProperties}
            className="step4"
          >
            <div className="art" aria-hidden="true">
              <span className="main">
                <MainIcon />
              </span>
            </div>
            <span className="num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.line}</p>
            <div className="get">
              <b>{receiveLabel}</b>
              <span>{step.receive}</span>
            </div>
          </li>
        );
      })}
      <EndNode node={end} end />
    </FlowReveal>
  );
}
