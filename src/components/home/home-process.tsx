import { ProcessFlow } from "@/components/sections/process-flow";
import { homeProcess } from "@/content/home";
import { processFlow } from "@/content/process";

// Home navy band with the shared 4-D process flow (Story 3.6).
export function HomeProcess() {
  const { label, title } = homeProcess;

  return (
    <section
      aria-labelledby="process-title"
      className="surface-navy py-section"
    >
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto">
        <div className="mb-section-head-gap">
          <span className="font-brand text-label uppercase">{label}</span>
          <h2 id="process-title" className="mt-4">
            {title}
          </h2>
        </div>
        <ProcessFlow flow={processFlow} />
      </div>
    </section>
  );
}
