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
};

// Shared stats band: Home hero (3.3), Services (5.2) and About (6.4) pass
// their own figures. Final values render on load; the count-up is after demo.
export function StatsBand({ label, stats, tone }: Readonly<StatsBandProps>) {
  const labelId = useId();
  const suffixClass = tone === "navy" ? "text-amber" : "text-amber-text";

  return (
    <div role="group" aria-labelledby={labelId}>
      <h2 id={labelId} className="font-brand text-label uppercase">
        {label}
      </h2>
      <ul className="border-border mt-4.5 grid grid-cols-2 gap-y-7 border-t pt-6.5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <li
            key={stat.caption}
            className="sm:border-border py-2 sm:border-l sm:px-6.5"
          >
            <p className="font-display text-stat">
              {stat.value}
              {stat.suffix ? (
                <span className={suffixClass}>{stat.suffix}</span>
              ) : null}
            </p>
            <p className="text-body-sm text-muted mt-2">
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
