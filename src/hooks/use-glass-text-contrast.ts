import { useEffect, useRef } from "react"
import gsap from "gsap"

function normalizeChannel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

function getLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * normalizeChannel(r) +
    0.7152 * normalizeChannel(g) +
    0.0722 * normalizeChannel(b)
  )
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function parseRgb(color: string): [number, number, number] | null {
  const m = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/)
  if (m) return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]
  return null
}

function getEffectiveBackground(el: Element): [number, number, number] {
  let current: Element | null = el
  while (current) {
    const bg = getComputedStyle(current).backgroundColor
    const rgb = parseRgb(bg)
    if (rgb) return rgb
    current = current.parentElement
  }
  return [255, 255, 255]
}

const LIGHT_TEXT = { r: 250, g: 250, b: 249 }
const DARK_TEXT = { r: 28, g: 25, b: 23 }

export function useGlassTextContrast(
  glassRef: React.RefObject<HTMLElement | null>,
  forceDark: boolean = false,
) {
  const proxyRef = useRef({ value: 0.5 })
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const sample = (): number => {
      if (forceDark) return 0

      const glass = glassRef.current
      if (!glass) return 0.5

      const rect = glass.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      glass.style.pointerEvents = "none"
      const el = document.elementFromPoint(cx, cy)
      glass.style.pointerEvents = ""

      if (!el) return 0.5
      const [r, g, b] = getEffectiveBackground(el)
      return getLuminance(r, g, b)
    }

    const applyColor = (lum: number) => {
      const t = smoothstep(0.2, 0.55, lum)
      const r = Math.round(lerp(LIGHT_TEXT.r, DARK_TEXT.r, t))
      const g = Math.round(lerp(LIGHT_TEXT.g, DARK_TEXT.g, t))
      const b = Math.round(lerp(LIGHT_TEXT.b, DARK_TEXT.b, t))
      glassRef.current?.style.setProperty(
        "--glass-text-color",
        `rgb(${r},${g},${b})`,
      )
    }

    const update = () => {
      const target = sample()
      if (tweenRef.current) tweenRef.current.kill()
      tweenRef.current = gsap.to(proxyRef.current, {
        value: target,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: () => applyColor(proxyRef.current.value),
      })
    }

    update()

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (tweenRef.current) tweenRef.current.kill()
    }
  }, [glassRef, forceDark])
}
