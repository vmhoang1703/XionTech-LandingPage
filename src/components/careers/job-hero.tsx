import Link from "next/link";
import { HeroArt } from "@/components/sections/hero-art";
import { jobHero } from "@/content/job";
import { type OpenRoleDetail, roleTypeLabel } from "@/lib/careers/open-roles";
import { heroWords } from "@/components/sections/hero-words";

// Server Component. Amber page hero with crumbs, the role title and chips (CAP-1).
export function JobHero({ role }: Readonly<{ role: OpenRoleDetail }>) {
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCareers, chipsLabel } =
    jobHero;
  const chips = [role.team, role.location, roleTypeLabel(role.type)].filter(
    (chip): chip is string => Boolean(chip),
  );

  const t = heroWords();
  return (
    <section className="hero-amber page-hero" aria-labelledby="job-h1">
      <HeroArt tone="amber" />
      <div className="wrap">
        <nav className="crumbs" aria-label={breadcrumbLabel}>
          <Link href="/">{breadcrumbHome}</Link>
          <span>/</span>
          <Link href="/careers">{breadcrumbCareers}</Link>
          <span>/</span>
          <span aria-current="page">{role.title}</span>
        </nav>
        <h1 id="job-h1">{t.words(role.title)}</h1>
        {chips.length > 0 && (
          <ul className="chips mt-4.5" aria-label={chipsLabel}>
            {chips.map((chip) => (
              <li key={chip} className="chip">
                {chip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
