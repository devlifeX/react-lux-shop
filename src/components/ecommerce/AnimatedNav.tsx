import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { X } from 'lucide-react'

interface AnimatedNavProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Collection', href: '#collection' },
  { label: 'Timepieces', href: '#timepieces' },
  { label: 'Jewelry', href: '#jewelry' },
  { label: 'Leather', href: '#leather' },
  { label: 'Fragrance', href: '#fragrance' },
]

export function AnimatedNav({ open, onClose }: AnimatedNavProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const openMenu = useCallback(() => {
    const tl = gsap.timeline({ paused: true })

    tl.set(overlayRef.current, { display: 'block' })
      .fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' },
      )
      .fromTo(
        panelRef.current,
        { clipPath: 'circle(0% at 100% 0%)' },
        {
          clipPath: 'circle(150% at 100% 0%)',
          duration: 0.8,
          ease: 'power3.inOut',
        },
        '-=0.3',
      )
      .fromTo(
        closeRef.current,
        { opacity: 0, rotate: -90 },
        { opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.7)' },
        '-=0.4',
      )
      .fromTo(
        Array.from(itemsRef.current?.children ?? []),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.3',
      )

    tl.play()
  }, [])

  const closeMenu = useCallback(() => {
    const tl = gsap.timeline({ paused: true })

    tl.to(Array.from(itemsRef.current?.children ?? []), {
      y: -20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.in',
    })
      .to(
        closeRef.current,
        { opacity: 0, rotate: 90, duration: 0.2 },
        '-=0.2',
      )
      .to(
        panelRef.current,
        {
          clipPath: 'circle(0% at 100% 0%)',
          duration: 0.6,
          ease: 'power3.in',
        },
        '-=0.1',
      )
      .to(
        overlayRef.current,
        { opacity: 0, duration: 0.3 },
        '-=0.3',
      )
      .set(overlayRef.current, { display: 'none' })

    tl.play()
  }, [])

  useEffect(() => {
    if (open) {
      openMenu()
    } else {
      closeMenu()
    }
  }, [open, openMenu, closeMenu])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] hidden"
      style={{ display: 'none' }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col justify-center bg-background/10 backdrop-blur-2xl"
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          <X size={20} />
        </button>

        <div ref={itemsRef} className="flex flex-col gap-2 px-12">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="group relative overflow-hidden py-4 text-4xl font-light tracking-tight text-white/50 transition-colors hover:text-white md:text-5xl"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="absolute bottom-12 left-12 text-sm text-white/30">
          <p>Luxora — Luxury Ecommerce</p>
          <p>Est. 2026</p>
        </div>
      </div>
    </div>
  )
}
