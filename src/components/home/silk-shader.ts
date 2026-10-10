// WebGL silk cloth for the Home hero, ported from the prototype
// (prototype-enhancement/prototype/js/site.js). Colours are the DESIGN.md hero-silk palette:
// ink background, navy-glow base, amber-tint sheen, amber threads.

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAGMENT = `precision highp float;
uniform vec2 r,xc;uniform float t,k,xs;uniform vec3 bg,base,fold,sheen,thread;
float sg(vec2 q,vec2 a,vec2 b){vec2 pa=q-a,ba=b-a;return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.,1.));}
vec2 xq(vec2 p){return((p+vec2(t*.02,0.))*r.y/2.4-xc)/xs;}
float amb(vec2 q){return min(min(sg(q,vec2(-.85,.42),vec2(-.42,0.)),sg(q,vec2(-.42,0.),vec2(-.05,.22))),min(sg(q,vec2(-.05,.22),vec2(.40,.41)),sg(q,vec2(.40,.41),vec2(.95,.52))));}
float nav(vec2 q){return min(min(sg(q,vec2(-.02,.42),vec2(-.82,-.40)),sg(q,vec2(-.82,-.40),vec2(-1.02,-.44))),min(sg(q,vec2(-.42,0.),vec2(-.04,-.44)),sg(q,vec2(.56,.36),vec2(.56,-.44))));}
float xt(vec2 q){float d=min(amb(q),nav(q));return(1.-smoothstep(.0,.09,d))*.72+(1.-smoothstep(.0,.26,d))*.28;}
float w(vec2 p){float v=0.;
 v+=sin(p.x*1.4+t*.30+sin(p.y*1.2+t*.18)*1.6)*.55;
 v+=sin(p.y*2.1-t*.24+sin(p.x*.9-t*.12)*1.3)*.33;
 v+=sin((p.x*.7+p.y)*3.0+t*.40)*.10;
 v+=sin((p.x-p.y*.6)*5.2-t*.35)*.035;return v;}
float h(vec2 p){float v=w(p);return k>0.?mix(v,v*.4+xt(xq(p))*.6,k):v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 p=vec2(uv.x*r.x/r.y,uv.y)*2.4;p+=vec2(-t*.02,0.);
 float e=.004;float hc=h(p);
 float dx=(h(p+vec2(e,0.))-h(p-vec2(e,0.)))/(2.*e);float dy=(h(p+vec2(0.,e))-h(p-vec2(0.,e)))/(2.*e);
 vec3 n=normalize(vec3(-dx,-dy,1.35));vec3 L=normalize(vec3(-.45,.55,.7));
 float diff=clamp(dot(n,L),0.,1.);float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),28.);
 vec3 col=mix(fold,base,smoothstep(.25,.95,diff));col+=sheen*spec*.55;
 if(k>0.){vec2 q=xq(p);float ia=1.-smoothstep(.0,.07,amb(q));col=mix(col,thread*(.45+.55*diff),ia*k*.5);}
 float th=abs(sin(hc*7.5+p.x*.35));th=1.-smoothstep(0.,.045,th);col=mix(col,thread,th*(.35+.4*diff));
 float m=smoothstep(.30,.95,uv.x+uv.y*.10+hc*.07);m=max(m,smoothstep(.55,0.,uv.y)*smoothstep(.15,.7,uv.x)*.9);
 if(k>0.)m=max(m,xt(xq(p))*k);
 gl_FragColor=vec4(mix(bg,col,m),1.);}`;

const PALETTE = {
  bg: "#0B1730",
  base: "#1E4178",
  fold: "#050C1A",
  sheen: "#FFCF06",
  thread: "#FFC000",
};

// Prototype time scale: shader time advances 0.35 per second.
export const SILK_TIME_SCALE = 0.35;
export const SILK_START_TIME = 8;

// XT loop, in shader time (12 s per cycle at SILK_TIME_SCALE): the folds rise
// into the XionTech mark (2 s), hold (3 s), melt back (2 s), then plain waves
// (5 s). SILK_START_TIME sits mid-hold, so a paused silk (reduced motion)
// shows the mark at rest.
const XT_CYCLE = 12 * SILK_TIME_SCALE;
const XT_RISE = 2 * SILK_TIME_SCALE;
const XT_HOLD_END = 5 * SILK_TIME_SCALE;
const XT_MELT_END = 7 * SILK_TIME_SCALE;
const XT_PHASE_AT_START = 3.5 * SILK_TIME_SCALE;

function smoothstep(edge0: number, edge1: number, x: number) {
  const v = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return v * v * (3 - 2 * v);
}

// How far the silk has folded into the XT mark: 0 = plain waves, 1 = full mark.
export function xtAmount(time: number): number {
  const cycle = time - SILK_START_TIME + XT_PHASE_AT_START;
  const phase = ((cycle % XT_CYCLE) + XT_CYCLE) % XT_CYCLE;
  return (
    smoothstep(0, XT_RISE, phase) *
    (1 - smoothstep(XT_HOLD_END, XT_MELT_END, phase))
  );
}

// Where the XT mark folds up, in CSS pixels from the canvas's top-left:
// its centre and its height. null = no room, plain waves only.
export type MarkArea = { x: number; y: number; size: number } | null;

export type Silk = {
  draw: (time: number) => void;
  resize: () => void;
};

function toRgb(hex: string) {
  return [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
}

export function createSilk(
  canvas: HTMLCanvasElement,
  measureMark: () => MarkArea = () => null,
): Silk | null {
  const gl = canvas.getContext("webgl", {
    premultipliedAlpha: false,
    antialias: true,
  });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  for (const [name, hex] of Object.entries(PALETTE)) {
    gl.uniform3fv(uniform(name), toRgb(hex));
  }
  const timeUniform = uniform("t");
  const xtUniform = uniform("k");
  const markCentre = uniform("xc");
  const markSize = uniform("xs");
  let hasMark = false;
  const sizeUniform = uniform("r");
  let lastTime = SILK_START_TIME;

  const draw = (time: number) => {
    lastTime = time;
    gl.uniform1f(timeUniform, time);
    gl.uniform1f(xtUniform, hasMark ? xtAmount(time) : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(sizeUniform, canvas.width, canvas.height);
    const mark = measureMark();
    hasMark = mark !== null;
    if (mark) {
      // GL pixels count up from the bottom edge.
      gl.uniform2f(markCentre, mark.x * ratio, canvas.height - mark.y * ratio);
      gl.uniform1f(markSize, mark.size * ratio);
    }
    draw(lastTime);
  };

  return { draw, resize };
}
