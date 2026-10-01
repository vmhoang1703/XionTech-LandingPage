import type { ProcessFlowContent } from "@/content/process";
import { FlowReveal } from "./flow-reveal";

// Step entry delays from the prototype; the amber track fills over 2.4s.
const STEP_DELAYS = ["0.3s", "0.85s", "1.4s", "1.95s"];

// Before the flow is in view (phase "armed") the track is empty and the steps
// are hidden; phase "on" plays the transition once; "static" shows everything.
const stepMotion =
  "transition-[opacity,translate] duration-900 ease-brand motion-reduce:transition-none group-data-[phase=armed]/flow:translate-y-4 group-data-[phase=armed]/flow:opacity-0";

function EndNode({ title, line }: { title: string; line: string }) {
  return (
    <li className="hidden w-32 flex-col items-center gap-2 text-center lg:row-span-4 lg:flex">
      <span
        aria-hidden="true"
        className="bg-amber size-4 rounded-full ring-4 ring-white/15"
      />
      <b className="text-white">{title}</b>
      <small className="text-body-sm">{line}</small>
    </li>
  );
}

// Shared 4-D process flow: Home navy band (3.6) and Services #process (5.4)
// pass their step content in as data.
// Above 1080px the "You receive" rows align across the four cards (subgrid);
// at 1080px and below the track and end nodes hide and steps use 2 columns,
// then 1 column at 640px and below.
export function ProcessFlow({ flow }: { flow: ProcessFlowContent }) {
  const { label, receiveLabel, start, end, steps } = flow;

  return (
    <FlowReveal
      label={label}
      className="relative grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-[auto_repeat(4,minmax(0,1fr))_auto] lg:grid-rows-[auto_auto_1fr_auto]"
    >
      <li
        aria-hidden="true"
        className="absolute top-2 right-16 left-16 hidden h-0.5 bg-white/15 lg:block"
      >
        <span className="from-amber-tint to-amber ease-brand block h-full origin-left bg-linear-to-r transition-transform duration-2400 group-data-[phase=armed]/flow:scale-x-0 motion-reduce:transition-none" />
      </li>
      <EndNode title={start.title} line={start.line} />
      {steps.map((step, index) => (
        <li
          key={step.num}
          style={{ transitionDelay: STEP_DELAYS[index] }}
          className={`border-on-navy-border grid gap-2 rounded-lg border p-6 lg:row-span-4 lg:grid-rows-subgrid ${stepMotion}`}
        >
          <span className="text-data text-amber-tint font-mono">
            {step.num}
          </span>
          <h3>{step.title}</h3>
          <p className="text-body-sm">{step.line}</p>
          <div className="border-on-navy-border border-t pt-3">
            <b className="font-brand text-label-sm block uppercase">
              {receiveLabel}
            </b>
            <span className="text-body-sm">{step.receive}</span>
          </div>
        </li>
      ))}
      <EndNode title={end.title} line={end.line} />
    </FlowReveal>
  );
}
