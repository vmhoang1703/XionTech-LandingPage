import { useId } from "react";

export type Stat = {
  value: string;
  suffix?: string;
  caption: string;
  // Unconfirmed figures are shown with a [Placeholder] caption (decision A2).
  placeholder?: boolean;
};

type StatsBandProps = {
  label: string;
  stats: Stat[];
  // navy: amber suffix; light (paper or mist): amber-text suffix (UX-DR13).
  tone: "navy" | "light";
  // When true, hides the label visually but keeps it for screen readers; list drops top border and gap.
  hideLabel?: boolean;
};

// Shared stats band: Home hero (3.3), Services (5.2) and About (6.4) pass
// their own figures. Final values render on load; the count-up is after demo.
export function StatsBand({
  label,
  stats,
  tone,
  hideLabel,
}: Readonly<StatsBandProps>) {
  const labelId = useId();
  const suffixClass = tone === "navy" ? "text-amber" : "text-amber-text";
  const h2ClassName = hideLabel ? "label sr-only" : "label";
  const ulClassName = hideLabel
    ? "border-border grid grid-cols-2 gap-y-7 sm:grid-cols-3 lg:grid-cols-5"
    : "border-border mt-4.5 grid grid-cols-2 gap-y-7 border-t pt-6.5 sm:grid-cols-3 lg:grid-cols-5";

  return (
    <div role="group" aria-labelledby={labelId}>
      <h2 id={labelId} className={h2ClassName}>
        {label}
      </h2>
      <ul className={ulClassName}>
        {stats.map((stat) => (
          <li
            key={stat.caption}
            className="sm:border-border py-2 sm:border-l sm:px-6.5 sm:first:border-l-0 sm:first:pl-0"
          >
            <p className="font-display text-stat-fluid text-heading">
              {stat.value}
              {stat.suffix ? (
                <span className={suffixClass}>{stat.suffix}</span>
              ) : null}
            </p>
            <p className="text-body-sm text-muted mt-2 max-w-[22ch]">
              {stat.placeholder
                ? `[Placeholder] ${stat.caption}`
                : stat.caption}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
