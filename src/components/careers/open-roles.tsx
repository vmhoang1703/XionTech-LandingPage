import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { Fragment } from "react";
import { LocaleLink } from "@/components/layout/locale-link";
import { careersRoles, careersRolesVi } from "@/content/careers";
import { fallbackLang, pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import {
  type OpenRole,
  roleMeta,
  roleTypeLabel,
} from "@/lib/careers/open-roles";

// The meta line as one string, or as parts when a Sanity field fell back to
// English, so only that part is marked lang="en".
function RoleMeta({
  role,
  locale,
}: Readonly<{ role: OpenRole; locale: Locale }>) {
  const parts = [
    { text: role.team, lang: fallbackLang(role.teamLang, locale) },
    { text: role.location, lang: fallbackLang(role.locationLang, locale) },
    { text: roleTypeLabel(role.type, locale) },
  ].filter((part) => part.text);
  if (!parts.some((part) => part.lang)) return <>{roleMeta(role, locale)}</>;
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={part.text}>
          {i > 0 ? " · " : null}
          <span lang={part.lang}>{part.text}</span>
        </Fragment>
      ))}
    </>
  );
}

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
              return (
                <LocaleLink
                  key={role.slug}
                  href={`/careers/${role.slug}`}
                  className="spot role"
                >
                  <span className="role-main">
                    <b lang={fallbackLang(role.titleLang, locale)}>
                      {role.title}
                    </b>
                    {roleMeta(role, locale) ? (
                      <small>
                        <RoleMeta role={role} locale={locale} />
                      </small>
                    ) : null}
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
