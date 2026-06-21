import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealOptions {
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  scrub?: boolean | number
  markers?: boolean
  start?: string
  end?: string
  toggleActions?: string
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null)
  const revealed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fromVars = options.from ?? { y: 60, opacity: 0 }
    const toVars = { opacity: 1, y: 0, ...options.to }

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(el, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: el,
          start: options.start ?? 'top 85%',
          end: options.end ?? 'top 40%',
          scrub: options.scrub ?? false,
          toggleActions: options.toggleActions ?? 'play none none reverse',
          markers: options.markers ?? false,
          onEnter: () => { revealed.current = true },
        },
      })

      tween.eventCallback('onComplete', () => { revealed.current = true })
    })

    ScrollTrigger.refresh()

    const safety = setTimeout(() => {
      if (!revealed.current) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
        revealed.current = true
      }
    }, 3000)

    return () => {
      clearTimeout(safety)
      ctx.revert()
    }
  }, [])

  return ref
}

export function useCinematicParallax<T extends HTMLElement>(
  speed: number = 0.3,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: `${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [speed])

  return ref
}
