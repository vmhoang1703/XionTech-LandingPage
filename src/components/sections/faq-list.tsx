import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";

type FaqItem = { question: string; answer: string };

// Questions as native details rows in two hairline columns, then a link in
// the next slot (About E-S3; Home shows four). Works with no JavaScript.
export function FaqList({
  items,
  link,
}: Readonly<{
  items: readonly FaqItem[];
  link?: { href: string; label: string };
}>) {
  return (
    <div className="faq" data-reveal="">
      {items.map(({ question, answer }) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
      {link ? (
        <LocaleLink className="faq-ask" href={link.href}>
          <span>{link.label}</span>
          <ArrowRightIcon aria-hidden="true" />
        </LocaleLink>
      ) : null}
    </div>
  );
}
