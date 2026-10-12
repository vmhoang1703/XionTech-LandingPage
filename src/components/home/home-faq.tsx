import { FaqList } from "@/components/sections/faq-list";
import { homeFaq } from "@/content/home";

// Home "Your questions, answered.": four About answers and a link to the rest.
export function HomeFaq() {
  const { title, lede, items, link } = homeFaq;

  return (
    <section aria-labelledby="home-faq-h" className="sec">
      <div className="wrap faq-head" data-reveal="">
        <h2 id="home-faq-h">{title}</h2>
        <p className="lede">{lede}</p>
      </div>
      <div className="wrap">
        <FaqList items={items} link={link} />
      </div>
    </section>
  );
}
