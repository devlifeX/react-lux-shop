import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

export interface ParticleTransitionHandle {
  burst: (originX: number, originY: number) => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const COLORS = [
  "rgba(202,138,4,0.9)",
  "rgba(251,191,36,0.8)",
  "rgba(255,215,100,0.7)",
  "rgba(255,255,255,0.6)",
  "rgba(180,140,30,0.7)",
]

const ParticleTransition = forwardRef<ParticleTransitionHandle>(
  function ParticleTransition(_props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const rafRef = useRef<number | null>(null)
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(dpr, dpr)
        ctxRef.current = ctx
      }
    }

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)

      return () => {
        ro.disconnect()
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
      }
    }, [])

    const tick = () => {
      const ctx = ctxRef.current
      const canvas = canvasRef.current
      if (!ctx || !canvas) return

      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const particles = particlesRef.current
      let alive = false

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (p.life <= 0) continue
        alive = true

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        p.vy += 0.04
        p.life -= 1

        const alpha = Math.max(0, p.life / p.maxLife)
        const size = p.size * alpha

        if (size > 0.1) {
          ctx.globalAlpha = alpha
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx.fill()

          ctx.globalAlpha = alpha * 0.3
          ctx.beginPath()
          ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1

      if (alive) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        ctx.clearRect(0, 0, rect.width, rect.height)
      }
    }

    const burst = (originX: number, originY: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const count = 220
      const particles: Particle[] = []

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3
        const speed = 2 + Math.random() * 8
        const life = 40 + Math.random() * 40
        particles.push({
          x: originX + (Math.random() - 0.5) * 60,
          y: originY + (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          size: 1 + Math.random() * 2.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }

      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist = 40 + Math.random() * 120
        const life = 30 + Math.random() * 30
        particles.push({
          x: originX + Math.cos(angle) * dist,
          y: originY + Math.sin(angle) * dist,
          vx: -Math.cos(angle) * (1 + Math.random() * 2),
          vy: -Math.sin(angle) * (1 + Math.random() * 2),
          life,
          maxLife: life,
          size: 0.8 + Math.random() * 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }

      particlesRef.current = particles

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    useImperativeHandle(ref, () => ({ burst }), [])

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full"
        aria-hidden="true"
      />
    )
  },
)

export default ParticleTransition
