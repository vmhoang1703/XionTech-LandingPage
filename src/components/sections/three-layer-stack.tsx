"use client";

import { useEffect, useState } from "react";

// Services hero illustration (approved ref
// services-three-layer-synchronized.html): technical code, wireframe and
// requirements as three isometric plates with L-shaped callouts. The opening
// is pure CSS keyframes (globals.css, "Three-layer stack"), so it runs once
// when the server-rendered markup first paints. A module-level flag marks it
// played: a remount later in the same page lifecycle (client-side navigation
// back to /services, a React remount) renders the final state with no
// animation. Only a real page load resets the module and plays it again. No
// observers, no hover, click or scroll triggers.
let played = false;

const MONO = { fontFamily: "var(--font-mono)" } as const;

export type ThreeLayerStackLabels = {
  label: string;
  requirements: string;
  wireframe: string;
  code: string;
};

export function ThreeLayerStack({
  labels,
}: Readonly<{ labels: ThreeLayerStackLabels }>) {
  // Read once per mount: false on the first render after a page load (so
  // hydration matches the server markup), true on any later remount.
  const [settled] = useState(() => played);
  useEffect(() => {
    played = true;
  }, []);

  return (
    <div
      className="tls-stack"
      role="img"
      aria-label={labels.label}
      data-settled={settled ? "" : undefined}
    >
      <svg
        className="tls-svg"
        viewBox="0 0 1200 825"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="tls-mid" x2="0" y2="1">
            <stop stopColor="#0d3474" />
            <stop offset="1" stopColor="#061f4b" />
          </linearGradient>
          <linearGradient id="tls-lower" x2="0" y2="1">
            <stop stopColor="#0e1724" />
            <stop offset="1" stopColor="#070b12" />
          </linearGradient>
        </defs>

        {/* Bottom: code editor */}
        <g className="tls-layer tls-tech" data-layer="tech">
          <g transform="matrix(1 .47 -1 .47 512 312)">
            <rect
              x="0"
              y="0"
              width="556"
              height="282"
              rx="10"
              fill="#050c16"
              stroke="#66788e"
              strokeWidth="2"
            />
            <rect
              x="12"
              y="12"
              width="532"
              height="258"
              rx="5"
              fill="url(#tls-lower)"
              stroke="#2a405e"
            />
            <rect x="12" y="12" width="532" height="33" fill="#1a293e" />
            <circle cx="32" cy="28" r="5" fill="#db785f" />
            <circle cx="50" cy="28" r="5" fill="#dfb151" />
            <circle cx="68" cy="28" r="5" fill="#6caa94" />
            <rect x="25" y="58" width="52" height="199" rx="4" fill="#0c1728" />
            <rect
              x="90"
              y="58"
              width="440"
              height="199"
              rx="4"
              fill="#081321"
            />
            <g style={MONO} fontSize="17" fill="#6680a5">
              <text x="103" y="81">
                01
              </text>
              <text x="103" y="109">
                02
              </text>
              <text x="103" y="137">
                03
              </text>
              <text x="103" y="165">
                04
              </text>
              <text x="103" y="193">
                05
              </text>
              <text x="103" y="221">
                06
              </text>
            </g>
            <g style={MONO} fontSize="18">
              <text x="145" y="81" fill="#8bb5ff">
                function
              </text>
              <text x="255" y="81" fill="#e4c578">
                buildSolution
              </text>
              <text x="424" y="81" fill="#a9b7cd">
                {"() {"}
              </text>
              <text x="163" y="109" fill="#90cba6">
                const
              </text>
              <text x="237" y="109" fill="#c0d0e5">
                scope =
              </text>
              <text x="335" y="109" fill="#efb75e">
                requirements
              </text>
              <text x="163" y="137" fill="#90cba6">
                const
              </text>
              <text x="237" y="137" fill="#c0d0e5">
                ui =
              </text>
              <text x="313" y="137" fill="#8bb5ff">
                render
              </text>
              <text x="401" y="137" fill="#c0d0e5">
                (scope)
              </text>
              <text x="163" y="165" fill="#8bb5ff">
                return
              </text>
              <text x="252" y="165" fill="#e4c578">
                deploy
              </text>
              <text x="329" y="165" fill="#c0d0e5">
                (ui)
              </text>
              <text x="145" y="193" fill="#a9b7cd">
                {"}"}
              </text>
            </g>
            <path
              d="M145 215h335 M145 235h250"
              stroke="#23415f"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
          <path
            d="M230 574 L230 593 L786 854 L1068 721 L1068 703"
            stroke="#39475e"
            strokeWidth="2"
            fill="none"
            opacity=".55"
          />
        </g>

        {/* Middle: interface wireframe */}
        <g className="tls-layer tls-wire" data-layer="wire">
          <g transform="matrix(1 .47 -1 .47 512 192)">
            <rect
              x="0"
              y="0"
              width="556"
              height="282"
              rx="11"
              fill="url(#tls-mid)"
              stroke="#2871d8"
              strokeWidth="3"
            />
            <rect
              x="15"
              y="15"
              width="526"
              height="252"
              rx="7"
              fill="#082759"
              stroke="#2f6abe"
            />
            <rect x="15" y="15" width="526" height="38" rx="6" fill="#1761cb" />
            <circle
              cx="40"
              cy="34"
              r="7"
              fill="none"
              stroke="#92c7ff"
              strokeWidth="2"
            />
            <rect
              x="72"
              y="28"
              width="98"
              height="12"
              rx="6"
              fill="#95c7ff"
              opacity=".85"
            />
            <rect
              x="275"
              y="22"
              width="192"
              height="24"
              rx="12"
              fill="#80b9ff"
            />
            <circle
              cx="487"
              cy="34"
              r="9"
              stroke="#98c7ff"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="28"
              y="70"
              width="110"
              height="182"
              rx="7"
              fill="#061d47"
              stroke="#467bc6"
            />
            <rect x="46" y="91" width="69" height="11" rx="5" fill="#80baff" />
            <rect x="46" y="120" width="77" height="8" rx="4" fill="#31609c" />
            <rect x="46" y="143" width="63" height="8" rx="4" fill="#31609c" />
            <rect x="46" y="166" width="72" height="8" rx="4" fill="#31609c" />
            <rect
              x="154"
              y="70"
              width="368"
              height="75"
              rx="8"
              fill="#103f85"
              stroke="#6baaff"
              strokeWidth="2"
            />
            <rect
              x="173"
              y="87"
              width="155"
              height="11"
              rx="5"
              fill="#75b7ff"
            />
            <rect
              x="173"
              y="111"
              width="214"
              height="8"
              rx="4"
              fill="#386aa8"
            />
            <rect x="419" y="86" width="82" height="41" rx="6" fill="#78b6ff" />
            <rect
              x="154"
              y="158"
              width="171"
              height="94"
              rx="8"
              fill="#0a3675"
              stroke="#427bd0"
            />
            <rect
              x="342"
              y="158"
              width="180"
              height="94"
              rx="8"
              fill="#0a3675"
              stroke="#427bd0"
            />
            <rect x="169" y="172" width="87" height="9" rx="4" fill="#75b7ff" />
            <path
              d="M175 227 L207 201 L235 215 L268 189 L305 208"
              fill="none"
              stroke="#7fbaff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect x="357" y="173" width="90" height="9" rx="4" fill="#75b7ff" />
            <rect
              x="360"
              y="197"
              width="20"
              height="35"
              rx="3"
              fill="#397dda"
            />
            <rect
              x="389"
              y="184"
              width="20"
              height="48"
              rx="3"
              fill="#5b9df5"
            />
            <rect
              x="418"
              y="202"
              width="20"
              height="30"
              rx="3"
              fill="#397dda"
            />
            <rect
              x="447"
              y="190"
              width="20"
              height="42"
              rx="3"
              fill="#5b9df5"
            />
          </g>
        </g>

        {/* Top: structured requirement notes */}
        <g className="tls-layer tls-req" data-layer="req">
          <g transform="matrix(1 .47 -1 .47 512 70)">
            <rect
              x="0"
              y="0"
              width="556"
              height="282"
              rx="12"
              fill="#0b111b"
              fillOpacity=".17"
              stroke="#adb5c2"
              strokeOpacity=".75"
              strokeWidth="3"
            />
            <rect
              x="14"
              y="14"
              width="528"
              height="254"
              rx="8"
              fill="none"
              stroke="#657385"
              strokeOpacity=".54"
            />
            <rect
              x="31"
              y="30"
              width="227"
              height="100"
              rx="7"
              fill="#142237"
              fillOpacity=".87"
              stroke="#7c91aa"
              strokeOpacity=".8"
            />
            <rect
              x="48"
              y="48"
              width="104"
              height="8"
              rx="4"
              fill="#ebc55e"
              fillOpacity=".83"
            />
            <rect
              x="48"
              y="68"
              width="178"
              height="6"
              rx="3"
              fill="#9fafc5"
              fillOpacity=".64"
            />
            <rect
              x="48"
              y="83"
              width="142"
              height="6"
              rx="3"
              fill="#9fafc5"
              fillOpacity=".48"
            />
            <rect
              x="48"
              y="99"
              width="160"
              height="6"
              rx="3"
              fill="#9fafc5"
              fillOpacity=".48"
            />
            <rect
              x="292"
              y="30"
              width="231"
              height="100"
              rx="7"
              fill="#142237"
              fillOpacity=".87"
              stroke="#7c91aa"
              strokeOpacity=".8"
            />
            <rect
              x="310"
              y="48"
              width="132"
              height="8"
              rx="4"
              fill="#b3c8e6"
              fillOpacity=".82"
            />
            <rect
              x="310"
              y="68"
              width="181"
              height="6"
              rx="3"
              fill="#9fafc5"
              fillOpacity=".64"
            />
            <rect
              x="310"
              y="83"
              width="158"
              height="6"
              rx="3"
              fill="#9fafc5"
              fillOpacity=".48"
            />
            <rect
              x="310"
              y="99"
              width="117"
              height="6"
              rx="3"
              fill="#9fafc5"
              fillOpacity=".48"
            />
            <rect
              x="31"
              y="151"
              width="492"
              height="104"
              rx="7"
              fill="#101d30"
              fillOpacity=".89"
              stroke="#7c91aa"
              strokeOpacity=".75"
            />
            <rect
              x="49"
              y="171"
              width="102"
              height="8"
              rx="4"
              fill="#ebc55e"
              fillOpacity=".78"
            />
            <path
              d="M49 199h198 M49 219h157 M300 199h181 M300 219h139"
              stroke="#b5c5dd"
              strokeOpacity=".54"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <rect
              x="257"
              y="190"
              width="1.2"
              height="46"
              fill="#647893"
              opacity=".55"
            />
          </g>
        </g>

        {/* Outside labels. Each leader starts on its plate edge (anchor dot,
            computed from the plate matrix) and stops 12 units short of its
            label text. Requirements: top plate, upper-right edge (local 400,0).
            Wireframe: middle plate, upper-left edge (local 0,240). Technical
            code: bottom plate, lower-left edge (local 400,282). */}
        <g className="tls-callouts">
          <path className="tls-leader" d="M1004 106V190L912 258" />
          <circle className="tls-anchor" cx="912" cy="258" r="4" />
          <text className="tls-label" data-label="req" x="925" y="94">
            {labels.requirements}
          </text>
          <path className="tls-leader" d="M272 304.8H130V222" />
          <circle className="tls-anchor" cx="272" cy="304.8" r="4" />
          <text className="tls-label" data-label="wire" x="60" y="200">
            {labels.wireframe}
          </text>
          <path className="tls-leader" d="M630 632.5V750H668" />
          <circle className="tls-anchor" cx="630" cy="632.5" r="4" />
          <text className="tls-label" data-label="tech" x="680" y="760">
            {labels.code}
          </text>
        </g>
      </svg>
    </div>
  );
}
