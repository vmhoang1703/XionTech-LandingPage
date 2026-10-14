// WebGL silk cloth for the Home hero, ported from the prototype
// (prototype-enhancement/prototype/js/site.js). Colours are the DESIGN.md hero-silk palette:
// ink background, navy-glow base, amber-tint sheen, amber threads.

const VERTEX = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FRAGMENT = `precision highp float;
uniform vec2 r;uniform float t,a;uniform vec3 bg,base,fold,sheen,thread;
float h(vec2 p){float v=0.;
 v+=sin(p.x*1.4+t*.30+sin(p.y*1.2+t*.18)*1.6)*.55;
 v+=sin(p.y*2.1-t*.24+sin(p.x*.9-t*.12)*1.3)*.33;
 v+=sin((p.x*.7+p.y)*3.0+t*.40)*.10;
 v+=sin((p.x-p.y*.6)*5.2-t*.35)*.035;return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 p=vec2(uv.x*r.x/r.y,uv.y)*2.4;p+=vec2(-t*.02,0.);
 float e=.004;float hc=h(p);
 float dx=(h(p+vec2(e,0.))-h(p-vec2(e,0.)))/(2.*e);float dy=(h(p+vec2(0.,e))-h(p-vec2(0.,e)))/(2.*e);
 vec3 n=normalize(vec3(-dx,-dy,1.35));vec3 L=normalize(vec3(-.45,.55,.7));
 float diff=clamp(dot(n,L),0.,1.);float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),28.);
 vec3 col=mix(fold,base,smoothstep(.25,.95,diff));col+=sheen*spec*.55*(.3+.7*a);
 float th=abs(sin(hc*7.5+p.x*.35));th=1.-smoothstep(0.,.045,th);col=mix(col,thread,th*(.35+.4*diff)*a);
 float m=smoothstep(.30,.95,uv.x+uv.y*.10+hc*.07);m=max(m,smoothstep(.55,0.,uv.y)*smoothstep(.15,.7,uv.x)*.9);
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

export type Silk = {
  // threads: 1 = amber threads and sheen at full strength, 0 = threads hidden,
  // sheen dimmed (while the particle shapes show,
  // the gold is all in them).
  draw: (time: number, threads?: number) => void;
  resize: () => void;
};

function toRgb(hex: string) {
  return [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
}

export function createSilk(canvas: HTMLCanvasElement): Silk | null {
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
  // Asking for the link result makes the page wait for the GPU to build the
  // shader (about 200 ms on a slow device, all before the first paint). With
  // the parallel-compile extension we ask only whether it is done, and draw
  // once it is; the static glow shows until then.
  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  if (!parallel && !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return null;
  }

  let timeUniform: WebGLUniformLocation | null = null;
  let threadUniform: WebGLUniformLocation | null = null;
  let sizeUniform: WebGLUniformLocation | null = null;
  let lastTime = SILK_START_TIME;
  let lastThreads = 1;
  let ready = false;
  let failed = false;

  const fit = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(sizeUniform, canvas.width, canvas.height);
  };

  // Sets the program up once it is linked; false while it is still building.
  const setUp = () => {
    if (
      parallel &&
      !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)
    ) {
      return false;
    }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      failed = true;
      return false;
    }
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
    timeUniform = uniform("t");
    threadUniform = uniform("a");
    sizeUniform = uniform("r");
    fit();
    ready = true;
    return true;
  };

  const draw = (time: number, threads = 1) => {
    lastTime = time;
    lastThreads = threads;
    if (!ready && (failed || !setUp())) return;
    gl.uniform1f(timeUniform, time);
    gl.uniform1f(threadUniform, threads);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    if (ready) fit();
    draw(lastTime, lastThreads);
  };

  return { draw, resize };
}
