import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { ProcessFlow } from "@/components/sections/process-flow";
import { homeProcess } from "@/content/home";
import { processFlow } from "@/content/process";

// Home "How we work." section: the page's one navy moment, a rounded navy
// panel (surface-navy) with a moving amber light, the shared 4-D process
// flow and the link to Services on the heading row (lead, 2026-10-11).
export function HomeProcess() {
  const { title, lede, link } = homeProcess;

  return (
    <section
      aria-labelledby="process-title"
      className="sec home-process surface-navy"
    >
      <div className="wrap">
        <div className="sec-head-row" data-reveal="">
          <div className="sec-head">
            <h2 id="process-title">{title}</h2>
            <p className="lede">{lede}</p>
          </div>
          <LocaleLink href={link.href} className="link-arrow">
            <span>{link.label}</span>
            <ArrowRightIcon aria-hidden="true" />
          </LocaleLink>
        </div>
        <ProcessFlow flow={processFlow} />
      </div>
    </section>
  );
}
