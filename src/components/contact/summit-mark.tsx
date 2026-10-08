/** The success picture: a flag goes up on a summit. Decorative, so hidden from AT. */
export function SummitMark() {
  return (
    <div className="summit" aria-hidden="true">
      <svg viewBox="0 0 120 80" focusable="false">
        <path
          className="sm-range"
          d="M4 76 L38 40 L52 52 L72 22 L96 50 L116 76 Z"
        />
        <path className="sm-pole" d="M72 22 L72 4" />
        <path className="sm-flag" d="M72 4 L90 9 L72 14 Z" />
      </svg>
    </div>
  );
}
