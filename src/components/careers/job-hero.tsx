import { LocaleLink } from "@/components/layout/locale-link";
import { HeroArt } from "@/components/sections/hero-art";
import { jobHero } from "@/content/job";
import { type OpenRoleDetail, roleTypeLabel } from "@/lib/careers/open-roles";

// Server Component. Amber page hero with crumbs, the role title and chips (CAP-1).
export function JobHero({ role }: Readonly<{ role: OpenRoleDetail }>) {
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCareers, chipsLabel } =
    jobHero;
  const chips = [role.team, role.location, roleTypeLabel(role.type)].filter(
    (chip): chip is string => Boolean(chip),
  );

  return (
    <section className="hero-amber page-hero" aria-labelledby="job-h1">
      <HeroArt tone="amber" />
      <div className="wrap">
        <nav className="crumbs" aria-label={breadcrumbLabel}>
          <LocaleLink href="/">{breadcrumbHome}</LocaleLink>
          <span>/</span>
          <LocaleLink href="/careers">{breadcrumbCareers}</LocaleLink>
          <span>/</span>
          <span aria-current="page">{role.title}</span>
        </nav>
        <h1 id="job-h1">{role.title}</h1>
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
