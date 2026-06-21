import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

export interface LiquidGlassCanvasHandle {
  setMouse: (x: number, y: number) => void
  triggerRipple: (x: number, y: number, strength: number) => void
  setHoverInfluence: (index: number, x: number, y: number, value: number) => void
  setStretch: (value: number) => void
}

interface LiquidGlassCanvasProps {
  className?: string
}

const MAX_RIPPLES = 6
const MAX_HOVERS = 6

const VERTEX_SHADER = `
attribute vec4 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition.xy * 0.5 + 0.5;
  gl_Position = aPosition;
}
`

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform vec4 uRipples[${MAX_RIPPLES}];
uniform vec3 uHovers[${MAX_HOVERS}];
uniform float uStretch;
uniform float uReducedMotion;

varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float timeScale = mix(1.0, 0.15, uReducedMotion);
  float t = uTime * timeScale;

  float halfW = 0.5 * aspect;
  float halfH = 0.5;
  float radius = halfH * 0.95;
  float sdf = sdRoundedBox(p, vec2(halfW, halfH), radius);

  float edgeEpsilon = 0.008 / max(halfH, 0.01);
  float inside = 1.0 - smoothstep(-edgeEpsilon, edgeEpsilon, sdf);

  float edgeDist = max(-sdf, 0.0);
  float edgeNorm = smoothstep(0.0, 0.18, edgeDist);

  float n1 = snoise(uv * vec2(3.0, 8.0) + vec2(t * 0.4, t * 0.25));
  float n2 = snoise(uv * vec2(7.0, 14.0) - vec2(t * 0.3, t * 0.5));
  float n3 = snoise(uv * vec2(15.0, 25.0) + vec2(t * 0.6, -t * 0.4));
  float liquidPattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

  float waveSpeed = t * 1.5;
  float wave = sin(uv.x * 12.0 + waveSpeed) * sin(uv.y * 25.0 + waveSpeed * 0.7);
  wave *= 0.5 + 0.5 * n1;

  float fresnelWidth = 0.06 + uStretch * 0.04;
  float fresnel = 1.0 - smoothstep(0.0, fresnelWidth, edgeDist);
  fresnel = pow(fresnel, 2.0);

  float innerFresnel = 1.0 - smoothstep(0.0, fresnelWidth * 2.5, edgeDist);
  innerFresnel = pow(innerFresnel, 1.5);

  float caStrength = pow(fresnel, 3.5) * 0.6;
  float caR = 1.0 + caStrength * 0.4;
  float caG = 1.0 + caStrength * 0.05;
  float caB = 1.0 - caStrength * 0.4;

  vec2 mouseP = (uMouse - 0.5) * vec2(aspect, 1.0);
  float mouseDist = length(p - mouseP);
  float specular = exp(-mouseDist * mouseDist * 70.0);
  float specularBroad = exp(-mouseDist * mouseDist * 15.0) * 0.35;
  float specularAmbient = exp(-mouseDist * mouseDist * 4.0) * 0.08;

  float topRefl = smoothstep(0.2, 0.45, 0.5 - p.y) * 0.18;
  float bottomRefl = smoothstep(0.25, 0.45, p.y + 0.5) * 0.08;

  float thickness = 1.0 - edgeNorm;

  float rippleEffect = 0.0;
  float rippleGlow = 0.0;
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    vec4 r = uRipples[i];
    if (r.z > 0.01) {
      vec2 rp = uv - r.xy;
      rp.x *= aspect;
      float rd = length(rp);
      float age = uTime - r.w;
      float decay = exp(-age * 2.5) * r.z;
      float wavefront = sin(rd * 45.0 - age * 8.0);
      float falloff = exp(-rd * 10.0);
      rippleEffect += wavefront * falloff * decay;
      rippleGlow += exp(-rd * 6.0) * decay * 0.5;
    }
  }

  float hoverGlow = 0.0;
  float hoverRipple = 0.0;
  for (int i = 0; i < ${MAX_HOVERS}; i++) {
    vec3 h = uHovers[i];
    if (h.z > 0.01) {
      vec2 hp = uv - h.xy;
      hp.x *= aspect;
      float hd = length(hp);
      hoverGlow += exp(-hd * hd * 18.0) * h.z * 0.15;
      hoverRipple += sin(hd * 30.0 - t * 4.0) * exp(-hd * 5.0) * h.z * 0.1;
    }
  }

  float iridescence = pow(fresnel, 5.0) * 0.3;
  vec3 irColor = vec3(
    0.5 + 0.5 * sin(t * 0.5 + uv.x * 3.0),
    0.5 + 0.5 * sin(t * 0.5 + uv.x * 3.0 + 2.1),
    0.5 + 0.5 * sin(t * 0.5 + uv.x * 3.0 + 4.2)
  );

  vec3 glassTint = vec3(0.90, 0.93, 0.98);

  vec3 color = glassTint;
  color *= vec3(caR, caG, caB);

  color += fresnel * vec3(0.55, 0.72, 1.0) * 0.55;
  color += innerFresnel * vec3(0.4, 0.55, 0.9) * 0.12;

  color += specular * vec3(1.0, 0.96, 0.88);
  color += specularBroad * vec3(0.65, 0.78, 1.0);
  color += specularAmbient * vec3(0.4, 0.5, 0.7);

  color += liquidPattern * 0.035 * vec3(0.55, 0.72, 1.0) * edgeNorm;
  color += wave * 0.015 * vec3(0.6, 0.75, 1.0) * edgeNorm;

  color += rippleEffect * 0.1 * vec3(0.45, 0.65, 1.0);
  color += rippleGlow * vec3(0.5, 0.7, 1.0) * 0.15;

  color += hoverGlow * vec3(0.45, 0.6, 0.9);
  color += hoverRipple * vec3(0.4, 0.55, 0.85);

  color += topRefl * vec3(1.0, 0.95, 0.85);
  color += bottomRefl * vec3(0.7, 0.8, 1.0);

  color += iridescence * irColor * vec3(0.3, 0.4, 0.5);

  color *= 1.0 - thickness * 0.12;

  float stretchDarken = uStretch * 0.05;
  color *= 1.0 - stretchDarken;

  float alpha = 0.04;
  alpha += fresnel * 0.55;
  alpha += innerFresnel * 0.1;
  alpha += specular * 0.35;
  alpha += specularBroad * 0.12;
  alpha += specularAmbient * 0.04;
  alpha += thickness * 0.06;
  alpha += abs(rippleEffect) * 0.25;
  alpha += rippleGlow * 0.2;
  alpha += hoverGlow * 0.15;
  alpha += iridescence * 0.1;
  alpha = clamp(alpha, 0.0, 0.88);
  alpha *= inside;

  gl_FragColor = vec4(color, alpha);
}
`

const LiquidGlassCanvas = forwardRef<
  LiquidGlassCanvasHandle,
  LiquidGlassCanvasProps
>(function LiquidGlassCanvas({ className }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const uniformsRef = useRef<Record<string, WebGLUniformLocation | null>>({})
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef(Date.now())

  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })
  const ripplesRef = useRef<
    { x: number; y: number; strength: number; time: number }[]
  >([])
  const hoversRef = useRef<
    { x: number; y: number; value: number; target: number }[]
  >(Array.from({ length: MAX_HOVERS }, () => ({ x: 0, y: 0, value: 0, target: 0 })))
  const stretchRef = useRef(0)
  const stretchTargetRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const visibleRef = useRef(true)

  function loadShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string,
  ): WebGLShader | null {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  function initProgram(
    gl: WebGLRenderingContext,
    vs: string,
    fs: string,
  ): WebGLProgram | null {
    const vShader = loadShader(gl, gl.VERTEX_SHADER, vs)
    const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fs)
    if (!vShader || !fShader) return null
    const program = gl.createProgram()
    if (!program) return null
    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program))
      return null
    }
    return program
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      depth: false,
      stencil: false,
    })
    if (!gl) {
      console.warn("WebGL not supported")
      return
    }

    glRef.current = gl
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const program = initProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)
    if (!program) return
    programRef.current = program

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const posLoc = gl.getAttribLocation(program, "aPosition")

    const u = (name: string) => gl.getUniformLocation(program, name)
    uniformsRef.current = {
      uResolution: u("uResolution"),
      uTime: u("uTime"),
      uMouse: u("uMouse"),
      uRipples: u("uRipples"),
      uHovers: u("uHovers"),
      uStretch: u("uStretch"),
      uReducedMotion: u("uReducedMotion"),
    }

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === 0 || h === 0) return
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const rippleData = new Float32Array(MAX_RIPPLES * 4)
    const hoverData = new Float32Array(MAX_HOVERS * 3)

    const render = () => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      const time = (Date.now() - startTimeRef.current) / 1000

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.12
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.12

      stretchRef.current +=
        (stretchTargetRef.current - stretchRef.current) * 0.1

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i]
        const age = time - r.time
        if (age > 4) {
          ripplesRef.current.splice(i, 1)
        }
      }

      for (let i = 0; i < MAX_RIPPLES; i++) {
        const r = ripplesRef.current[i]
        if (r) {
          rippleData[i * 4] = r.x
          rippleData[i * 4 + 1] = r.y
          rippleData[i * 4 + 2] = r.strength
          rippleData[i * 4 + 3] = r.time
        } else {
          rippleData[i * 4] = 0
          rippleData[i * 4 + 1] = 0
          rippleData[i * 4 + 2] = 0
          rippleData[i * 4 + 3] = 0
        }
      }

      for (let i = 0; i < MAX_HOVERS; i++) {
        const h = hoversRef.current[i]
        h.value += (h.target - h.value) * 0.12
        hoverData[i * 3] = h.x
        hoverData[i * 3 + 1] = h.y
        hoverData[i * 3 + 2] = h.value
      }

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(posLoc)

      gl.uniform2f(
        uniformsRef.current.uResolution,
        canvas.width,
        canvas.height,
      )
      gl.uniform1f(uniformsRef.current.uTime, time)
      gl.uniform2f(
        uniformsRef.current.uMouse,
        mouseRef.current.x,
        mouseRef.current.y,
      )
      gl.uniform4fv(uniformsRef.current.uRipples, rippleData)
      gl.uniform3fv(uniformsRef.current.uHovers, hoverData)
      gl.uniform1f(uniformsRef.current.uStretch, stretchRef.current)
      gl.uniform1f(
        uniformsRef.current.uReducedMotion,
        reducedMotionRef.current ? 1.0 : 0.0,
      )

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    const handleVisibility = () => {
      visibleRef.current = !document.hidden
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      ro.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      gl.deleteProgram(program)
      gl.deleteBuffer(buffer)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    setMouse: (x: number, y: number) => {
      mouseRef.current.tx = x
      mouseRef.current.ty = y
    },
    triggerRipple: (x: number, y: number, strength: number) => {
      const time = (Date.now() - startTimeRef.current) / 1000
      ripplesRef.current.push({ x, y, strength, time })
      if (ripplesRef.current.length > MAX_RIPPLES) {
        ripplesRef.current.shift()
      }
    },
    setHoverInfluence: (
      index: number,
      x: number,
      y: number,
      value: number,
    ) => {
      if (index < 0 || index >= MAX_HOVERS) return
      const h = hoversRef.current[index]
      h.x = x
      h.y = y
      h.target = value
    },
    setStretch: (value: number) => {
      stretchTargetRef.current = value
    },
  }))

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  )
})

export default LiquidGlassCanvas
