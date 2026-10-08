import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { ProcessFlow } from "@/components/sections/process-flow";
import { homeProcess } from "@/content/home";
import { processFlow } from "@/content/process";

// Home "How we approach." section: light surface, the shared 4-D process flow
// and the link to Services on the heading row.
export function HomeProcess() {
  const { title, lede, link } = homeProcess;

  return (
    <section aria-labelledby="process-title" className="sec home-process">
      <div className="wrap">
        <div className="sec-head-row">
          <div className="sec-head">
            <h2 id="process-title">{title}</h2>
            <p className="lede">{lede}</p>
          </div>
          <Link href={link.href} className="link-arrow">
            <span>{link.label}</span>
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>
        <ProcessFlow flow={processFlow} />
      </div>
    </section>
  );
}
