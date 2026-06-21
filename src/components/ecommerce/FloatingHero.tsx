import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import gsap from 'gsap'
import { X } from 'lucide-react'

interface FloatImage {
  src: string
  alt: string
  width: number
  top: string
  left: string
  driftX: number
  driftY: number
  rotateX: number
  rotateY: number
  rotateZ: number
  orbitRadius: number
  orbitOffset: number
  orbitDuration: number
  scale: number
  blur: string
  title: string
  description: string
  price: string
  category: string
  details: string[]
}

const images: FloatImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80',
    alt: 'Aventurine Chronograph',
    title: 'Aventurine Chronograph',
    description: 'A masterpiece of Swiss horology featuring a deep celestial aventurine dial, 18k rose gold case, and our proprietary moonphase complication.',
    price: '$48,500',
    category: 'Timepieces',
    details: ['Swiss Automatic Movement', '18k Rose Gold Case', '70h Power Reserve', 'Sapphire Crystal', 'Limited Edition'],
    width: 260,
    top: '32%', left: '12%',
    driftX: 4, driftY: -3,
    rotateX: 6, rotateY: -8, rotateZ: 4,
    orbitRadius: 7, orbitOffset: 0, orbitDuration: 3.2,
    scale: 1, blur: 'blur(0px)',
  },
  {
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
    alt: 'Diamond Eternity Ring',
    title: 'Diamond Eternity Ring',
    description: 'A continuous band of ethically sourced diamonds set in platinum, each stone precisely cut to create an unbroken river of light.',
    price: '$32,800',
    category: 'Jewelry',
    details: ['5ct Total Diamond Weight', 'Platinum Setting', 'GIA Certified', 'Handcrafted', 'Eternal Band Design'],
    width: 180, top: '18%', left: '72%',
    driftX: -3.5, driftY: 2.5,
    rotateX: -5, rotateY: 10, rotateZ: -3,
    orbitRadius: 5.5, orbitOffset: 1.2, orbitDuration: 2.8,
    scale: 0.85, blur: 'blur(1px)',
  },
  {
    src: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=450&q=80',
    alt: 'Heritage Leather Tote',
    title: 'Heritage Leather Tote',
    description: 'Full-grain Italian leather aged over six weeks using traditional vegetable-tanning methods. Each bag develops a unique patina over time.',
    price: '$8,900',
    category: 'Leather Goods',
    details: ['Full-Grain Leather', 'Made in Tuscany', 'Brass Hardware', 'Detachable Strap', 'Personalization Available'],
    width: 220, top: '68%', left: '78%',
    driftX: 2.5, driftY: -2,
    rotateX: 8, rotateY: 6, rotateZ: -5,
    orbitRadius: 6.5, orbitOffset: 2.5, orbitDuration: 3.6,
    scale: 0.92, blur: 'blur(0.5px)',
  },
  {
    src: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=350&q=80',
    alt: 'Noir Parfum',
    title: 'Noir Parfum',
    description: 'An olfactory journey through rare ingredients — Oud Assam, Florentine Iris, and Ambergris — blended by our master perfumer in Grasse.',
    price: '$2,400',
    category: 'Fragrance',
    details: ['Eau de Parfum', '50ml / 1.7 fl oz', 'Hand-Blended in Grasse', 'Crystal Flacon', 'Refillable Design'],
    width: 160, top: '75%', left: '22%',
    driftX: -2, driftY: 3.5,
    rotateX: -7, rotateY: -5, rotateZ: 6,
    orbitRadius: 4.5, orbitOffset: 3.8, orbitDuration: 2.5,
    scale: 0.78, blur: 'blur(2px)',
  },
  {
    src: 'https://images.unsplash.com/photo-1515562141589-677c7cb0b859?w=450&q=80',
    alt: 'Gold Pendant Necklace',
    title: 'Gold Pendant Necklace',
    description: 'A sculptural 24k gold pendant suspended on a delicate diamond-set chain. Each piece is hand-fabricated in our Parisian atelier.',
    price: '$18,200',
    category: 'Jewelry',
    details: ['24k Recycled Gold', '0.5ct Diamond Accents', 'Hand-Fabricated', 'Made in Paris', 'Adjustable Chain'],
    width: 200, top: '22%', left: '48%',
    driftX: 3, driftY: 4,
    rotateX: 4, rotateY: -12, rotateZ: -2,
    orbitRadius: 8, orbitOffset: 5.0, orbitDuration: 4.0,
    scale: 0.9, blur: 'blur(0px)',
  },
]

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: randomBetween(1, 2.5),
      opacity: randomBetween(0.15, 0.7),
      delay: randomBetween(0, 4),
      duration: randomBetween(2, 5),
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

function ProductPanel({
  product,
  onClose,
  panelRef,
  contentRef,
}: {
  product: FloatImage
  onClose: () => void
  panelRef: React.RefObject<HTMLDivElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={panelRef}
      className="pointer-events-auto fixed inset-0 z-[60] flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={contentRef}
        className="relative mx-4 flex max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl md:flex-row"
        style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(202,138,4,0.06)' }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/40 hover:text-white"
        >
          <X size={14} />
        </button>

        <div className="w-full md:w-1/2">
          <img
            src={product.src}
            alt={product.alt}
            className="h-72 w-full object-cover md:h-full"
          />
        </div>

        <div className="flex flex-col justify-center gap-5 p-8 md:w-1/2">
          <div>
            <p className="text-xs tracking-widest text-accent uppercase">
              {product.category}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-white">
              {product.title}
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-white/60">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {product.details.map((d) => (
              <span
                key={d}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="font-heading text-2xl font-bold text-white">
              {product.price}
            </span>
            <button className="rounded-full bg-accent px-5 py-2 text-xs font-semibold text-accent-foreground transition-all hover:bg-accent/90">
              Inquire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FloatingHero() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const imgRefs = useRef<HTMLDivElement[]>([])
  const imgInnerRefs = useRef<HTMLDivElement[]>([])
  const glowRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const panelContentRef = useRef<HTMLDivElement | null>(null)
  const timelinesRef = useRef<(gsap.core.Timeline | null)[]>([])
  const orbitProxiesRef = useRef<{ a: number }[]>([])
  const dragStateRef = useRef<{
    active: boolean
    index: number
    startX: number
    startY: number
    originLeft: string
    originTop: string
  }>({ active: false, index: -1, startX: 0, startY: 0, originLeft: '0%', originTop: '0%' })

  const setImgRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) imgRefs.current[i] = el
  }
  const setImgInnerRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) imgInnerRefs.current[i] = el
  }

  const buildImageTimeline = useCallback((index: number) => {
    const el = imgRefs.current[index]
    if (!el) return null
    const img = images[index]
    const tl = gsap.timeline({ paused: true })

    gsap.set(el, { left: img.left, top: img.top, scale: img.scale, opacity: 1 })

    tl.to(el, {
      left: `+=${img.driftX}%`, top: `+=${img.driftY}%`,
      rotationX: img.rotateX, rotationY: img.rotateY, rotationZ: img.rotateZ,
      duration: 4, ease: 'sine.inOut',
    }, 0)

    tl.to(el, {
      left: '50%', top: '50%',
      rotationX: 0, rotationY: 0, rotationZ: 0,
      scale: 1.05, duration: 3.5, ease: 'power2.inOut',
    }, 4)

    const proxy = { a: img.orbitOffset }
    orbitProxiesRef.current[index] = proxy

    tl.to(proxy, {
      a: img.orbitOffset + Math.PI * 12,
      duration: 28, ease: 'none',
      onUpdate: () => {
        if (dragStateRef.current.active && dragStateRef.current.index === index) return
        if (expandedIndex === index) return
        const px = 50 + Math.cos(proxy.a) * img.orbitRadius
        const py = 50 + Math.sin(proxy.a) * img.orbitRadius
        el.style.left = `${px}%`
        el.style.top = `${py}%`
        el.style.transform = `translate(-50%, -50%) rotateX(${Math.sin(proxy.a * 1.5) * 3}deg) rotateY(${Math.cos(proxy.a * 1.3) * 3}deg)`
      },
    }, 8.5)

    return tl
  }, [expandedIndex])

  const startFloating = useCallback(() => {
    timelinesRef.current = images.map((_, i) => buildImageTimeline(i))
    timelinesRef.current.forEach((tl) => tl?.play())
  }, [buildImageTimeline])

  const stopImage = useCallback((index: number) => {
    timelinesRef.current[index]?.pause()
    timelinesRef.current[index]?.kill()
    timelinesRef.current[index] = null
  }, [])

  const resumeImage = useCallback((index: number) => {
    stopImage(index)
    const tl = buildImageTimeline(index)
    timelinesRef.current[index] = tl
    tl?.play()
  }, [buildImageTimeline, stopImage])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 40, scale: 0.95 })
        gsap.to(titleRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out', delay: 1 })
      }
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 20 })
        gsap.to(subtitleRef.current, { opacity: 0.6, y: 0, duration: 1.2, ease: 'power3.out', delay: 1.8 })
      }

      startFloating()
    })

    return () => ctx.revert()
  }, [startFloating])

  // ---- Drag handlers ----
  const handlePointerDown = useCallback((e: React.PointerEvent, index: number) => {
    if (expandedIndex !== null) return
    const el = imgRefs.current[index]
    if (!el) return

    el.setPointerCapture(e.pointerId)
    stopImage(index)

    const rect = el.getBoundingClientRect()
    dragStateRef.current = {
      active: true,
      index,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      originLeft: el.style.left,
      originTop: el.style.top,
    }

    el.style.transition = 'none'
    el.style.left = `${rect.left / window.innerWidth * 100}%`
    el.style.top = `${rect.top / window.innerHeight * 100}%`
    el.style.transform = 'translate(-50%, -50%)'
    el.style.zIndex = '20'
  }, [expandedIndex, stopImage])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragStateRef.current
    if (!drag.active) return
    const el = imgRefs.current[drag.index]
    if (!el) return

    const px = ((e.clientX - drag.startX) / window.innerWidth) * 100
    const py = ((e.clientY - drag.startY) / window.innerHeight) * 100
    el.style.left = `${px}%`
    el.style.top = `${py}%`
    el.style.transform = 'translate(-50%, -50%)'
  }, [])

  const getCornerTarget = useCallback((cx: number, cy: number) => {
    const hw = 50, hh = 50
    if (cx < hw && cy < hh) return { left: '4%', top: '6%', scale: 1.15 }
    if (cx >= hw && cy < hh) return { left: '76%', top: '6%', scale: 1.15 }
    if (cx < hw && cy >= hh) return { left: '4%', top: '74%', scale: 1.15 }
    return { left: '76%', top: '74%', scale: 1.15 }
  }, [])

  const flyToCorner = useCallback((index: number) => {
    const el = imgRefs.current[index]
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = ((rect.left + rect.width / 2) / window.innerWidth) * 100
    const cy = ((rect.top + rect.height / 2) / window.innerHeight) * 100
    const target = getCornerTarget(cx, cy)

    el.style.zIndex = '25'

    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        backdropFilter: 'blur(12px)',
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    gsap.to(el, {
      left: target.left,
      top: target.top,
      scale: target.scale,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => {
        setExpandedIndex(index)
      },
    })

    images.forEach((_, i) => {
      if (i === index) return
      const otherEl = imgRefs.current[i]
      if (!otherEl) return
      gsap.to(otherEl, { opacity: 0.2, scale: 0.8, duration: 0.5, ease: 'power2.out' })
    })
  }, [getCornerTarget])

  const handlePointerUp = useCallback((_e: React.PointerEvent) => {
    const drag = dragStateRef.current
    if (!drag.active) return
    drag.active = false

    const el = imgRefs.current[drag.index]
    if (!el) return

    const rect = el.getBoundingClientRect()
    const cx = (rect.left + rect.width / 2) / window.innerWidth * 100
    const cy = (rect.top + rect.height / 2) / window.innerHeight * 100
    const isNearCorner = cx < 20 || cx > 80 || cy < 15 || cy > 85

    if (isNearCorner) {
      flyToCorner(drag.index)
    } else {
      gsap.to(el, {
        scale: images[drag.index].scale,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          el.style.zIndex = '5'
          resumeImage(drag.index)
        },
      })
    }
  }, [flyToCorner, resumeImage])

  // ---- Close panel ----
  const handleClose = useCallback(() => {
    const index = expandedIndex
    if (index === null) return
    setExpandedIndex(null)

    if (panelRef.current && panelContentRef.current) {
      const panelTl = gsap.timeline()
      panelTl.to(panelContentRef.current.querySelectorAll('.panel-item'), {
        y: 10, opacity: 0, duration: 0.2, stagger: 0.02, ease: 'power2.in',
      })
        .to(panelRef.current, {
          scale: 0.96, opacity: 0, duration: 0.3, ease: 'power2.in',
        }, '-=0.1')
        .set(panelRef.current, { display: 'none' })
    }

    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.in',
      })
    }

    images.forEach((_, i) => {
      if (i === index) return
      const otherEl = imgRefs.current[i]
      if (!otherEl) return
      gsap.to(otherEl, { opacity: 1, scale: images[i].scale, duration: 0.5, ease: 'power2.out' })
    })

    const el = imgRefs.current[index]
    if (el) {
      const img = images[index]
      gsap.to(el, {
        left: img.left,
        top: img.top,
        scale: img.scale,
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
          el.style.zIndex = '5'
          resumeImage(index)
        },
      })
    }
  }, [expandedIndex, resumeImage])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05050A]"
      style={{ perspective: '1200px' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#05050A] to-[#0a0a1a]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/50 via-transparent to-[#0a0a1a]/50" />

      <StarField />

      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(202,138,4,0.15) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Backdrop overlay for expanded state */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-10 opacity-0"
        style={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(5,5,10,0.3)' }}
      />

      <div
        ref={titleRef}
        className="pointer-events-none relative z-10 text-center"
      >
        <h1 className="font-heading text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
          Luxury<br /><span className="text-accent">Redefined</span>
        </h1>
        <p
          ref={subtitleRef}
          className="mx-auto mt-4 max-w-md text-sm text-white/60 md:text-base"
        >
          Timeless craftsmanship meets celestial design.
        </p>
      </div>

      {/* Floating product images */}
      {images.map((img, i) => (
        <div
          key={i}
          ref={setImgRef(i)}
          className="absolute cursor-grab active:cursor-grabbing will-change-transform"
          style={{
            left: img.left,
            top: img.top,
            width: img.width,
            height: img.width * 1.1,
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
            filter: img.blur,
            zIndex: expandedIndex === i ? 25 : 5,
            transition: expandedIndex === i ? 'filter 0.5s ease' : undefined,
          }}
          onPointerDown={(e) => handlePointerDown(e, i)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            ref={setImgInnerRef(i)}
            className="h-full w-full overflow-hidden rounded-2xl border border-white/10"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(202,138,4,0.05)',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover select-none"
              draggable={false}
            />
          </div>
        </div>
      ))}

      {/* Expanded product panel */}
      {expandedIndex !== null && (
        <ProductPanel
          product={images[expandedIndex]}
          onClose={handleClose}
          panelRef={panelRef}
          contentRef={panelContentRef}
        />
      )}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05050A] to-transparent" />
    </section>
  )
}
