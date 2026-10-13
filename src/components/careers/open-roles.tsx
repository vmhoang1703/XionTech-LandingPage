import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { careersRoles, careersRolesVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { type OpenRole, roleMeta } from "@/lib/careers/open-roles";

// Server Component. Each role is one link and nothing inside it is interactive
// (FR-32, AC-A11Y-4). With no roles it shows the empty panel (CAP-3).
export function OpenRoles({
  roles,
  locale = "en",
}: Readonly<{ roles: OpenRole[]; locale?: Locale }>) {
  const { heading, emptyText, applyLabel } = pickLocale(locale, {
    en: careersRoles,
    vi: careersRolesVi,
  });

  return (
    <section id="roles" className="sec" aria-labelledby="roles-h">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="roles-h">{heading}</h2>
        </div>
        {roles.length === 0 ? (
          <p className="roles-empty">{emptyText}</p>
        ) : (
          <div className="roles" data-reveal="">
            {roles.map((role) => {
              const meta = roleMeta(role, locale);
              return (
                <LocaleLink
                  key={role.slug}
                  href={`/careers/${role.slug}`}
                  className="spot role"
                >
                  <span className="role-main" lang={role.lang ?? undefined}>
                    <b>{role.title}</b>
                    {meta ? <small>{meta}</small> : null}
                  </span>
                  <span className="link-arrow">
                    <span>{applyLabel}</span>
                    <ArrowRightIcon aria-hidden="true" />
                  </span>
                </LocaleLink>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
