import { ProcessFlow } from "@/components/sections/process-flow";
import { homeProcess } from "@/content/home";
import { processFlow } from "@/content/process";

// Home navy band with the shared 4-D process flow (Story 3.6).
export function HomeProcess() {
  const { label, title } = homeProcess;

  return (
    <section
      aria-labelledby="process-title"
      className="sec surface-navy gridbg"
    >
      <div className="wrap">
        <div className="sec-head">
          <span className="label">{label}</span>
          <h2 id="process-title">{title}</h2>
        </div>
        <ProcessFlow flow={processFlow} />
      </div>
    </section>
  );
}
