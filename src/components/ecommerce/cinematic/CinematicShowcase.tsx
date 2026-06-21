import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { products } from "@/data/products"
import { useCartStore } from "@/store/cart-store"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import {
  useCinematicCarousel,
  computeCardPlacement,
} from "@/hooks/use-cinematic-carousel"
import { CinematicBackground } from "./CinematicBackground"
import CinematicProductCard, {
  type CinematicProductCardHandle,
} from "./CinematicProductCard"
import ParticleTransition, {
  type ParticleTransitionHandle,
} from "./ParticleTransition"

gsap.registerPlugin(ScrollTrigger)

const titleText = "Amazing Deals"

export function CinematicShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  const cardRefs = useRef<(CinematicProductCardHandle | null)[]>([])
  const particleRef = useRef<ParticleTransitionHandle>(null)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [prevActive, setPrevActive] = useState(0)
  const [entered, setEntered] = useState(false)

  const addItem = useCartStore((s) => s.addItem)

  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  const carouselProducts = useMemo(() => products.slice(0, 6), [])
  const count = carouselProducts.length

  const cardWidth = isMobile ? 250 : isTablet ? 300 : 340
  const cardHeight = isMobile ? 360 : isTablet ? 420 : 480
  const cardSpacing = isMobile ? 200 : isTablet ? 270 : 320

  const handleSettle = useCallback(
    (index: number) => {
      cardRefs.current.forEach((cardRef, i) => {
        if (!cardRef) return
        if (i === index) {
          cardRef.playEntrance()
        }
      })
    },
    [],
  )

  const carousel = useCinematicCarousel({
    count,
    cardSpacing,
    wheelThreshold: 50,
    onSettle: handleSettle,
  })

  useEffect(() => {
    cardRefs.current.forEach((ref, i) => {
      if (i === carousel.activeIndex && ref) {
        ref.resetContent()
      }
    })
  }, [carousel.activeIndex])

  const handleTransitionStart = useCallback(
    (newActive: number) => {
      if (newActive === prevActive) return
      setPrevActive(newActive)

      const stage = stageRef.current
      const particle = particleRef.current
      if (!stage || !particle) return

      const rect = stage.getBoundingClientRect()
      particle.burst(rect.width / 2, rect.height / 2)

      cardRefs.current.forEach((ref, i) => {
        if (i === newActive && ref) {
          ref.resetContent()
        }
      })
    },
    [prevActive],
  )

  useEffect(() => {
    if (carousel.isTransitioning) {
      handleTransitionStart(carousel.activeIndex)
    }
  }, [carousel.isTransitioning, carousel.activeIndex, handleTransitionStart])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".title-char")
        gsap.set(chars, { y: 100, opacity: 0, rotationX: -80 })
      }
      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { y: 20, opacity: 0 })
      }
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { y: 20, opacity: 0 })
      }
      if (navRef.current) {
        gsap.set(navRef.current, { y: 20, opacity: 0 })
      }
      if (dotsRef.current) {
        gsap.set(dotsRef.current, { opacity: 0 })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
        onComplete: () => {
          setEntered(true)
          cardRefs.current[carousel.activeIndex]?.playEntrance()
        },
      })

      tl.to(eyebrowRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      })

      tl.to(
        titleRef.current?.querySelectorAll(".title-char") ?? [],
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power4.out",
        },
        "-=0.3",
      )

      tl.to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      )

      tl.to(
        navRef.current,
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3",
      )

      tl.to(
        dotsRef.current,
        { opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.3",
      )
    })

    return () => ctx.revert()
  }, [])

  const titleChars = useMemo(() => titleText.split(""), [])

  const handleAddToCart = useCallback(
    (product: (typeof products)[number]) => {
      addItem(product)
    },
    [addItem],
  )

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#05050a]"
      style={{ perspective: "1400px" }}
    >
      <CinematicBackground
        activeIndex={carousel.activeIndex}
        total={count}
      />

      <div className="relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <div
            ref={eyebrowRef}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent backdrop-blur-md"
          >
            <Sparkles size={12} />
            <span>Curated Collection</span>
          </div>

          <h2
            ref={titleRef}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            style={{ perspective: 300 }}
          >
            {titleChars.map((char, i) => (
              <span
                key={i}
                className="title-char inline-block will-change-transform"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </span>
            ))}
            <span className="cinematic-shimmer-text ml-3 inline-block">
              .
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="mx-auto mt-4 max-w-lg text-sm text-white/50 sm:text-base"
          >
            Step into our luxury showroom. Discover timepieces, jewelry, and
            fragrances curated for the extraordinary.
          </p>
        </div>

        {/* Navigation arrows */}
        <div
          ref={navRef}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <button
            onClick={carousel.prev}
            disabled={carousel.isTransitioning}
            className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors duration-200 hover:border-accent/40 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous product"
          >
            <ChevronLeft
              size={18}
              className="text-white/70 transition-colors group-hover:text-accent"
            />
          </button>
          <button
            onClick={carousel.next}
            disabled={carousel.isTransitioning}
            className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors duration-200 hover:border-accent/40 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next product"
          >
            <ChevronRight
              size={18}
              className="text-white/70 transition-colors group-hover:text-accent"
            />
          </button>
        </div>

        {/* Carousel stage */}
        <div
          ref={stageRef}
          className="relative mx-auto flex w-full items-center justify-center overflow-visible touch-none"
          style={{
            height: cardHeight + 40,
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
          onPointerDown={carousel.onPointerDown}
          onPointerMove={carousel.onPointerMove}
          onPointerUp={carousel.onPointerUp}
          onPointerCancel={carousel.onPointerCancel}
          onWheel={carousel.onWheel}
          onPointerEnter={() => setHoveredIndex(carousel.activeIndex)}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <ParticleTransition ref={particleRef} />

          {carouselProducts.map((product, i) => {
            const placement = computeCardPlacement(
              i,
              carousel.position,
              count,
              cardSpacing,
              isMobile ? 1.5 : 2.5,
            )
            const isActive = i === carousel.activeIndex

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() =>
                  setHoveredIndex(isActive ? carousel.activeIndex : null)
                }
                style={{
                  pointerEvents: placement.visible ? "auto" : "none",
                }}
              >
                <CinematicProductCard
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  product={product}
                  placement={placement}
                  isActive={isActive}
                  isHovered={hoveredIndex === i}
                  cardWidth={cardWidth}
                  cardHeight={cardHeight}
                  onAddToCart={handleAddToCart}
                />
              </div>
            )
          })}
        </div>

        {/* Progress dots */}
        <div
          ref={dotsRef}
          className="mt-6 flex items-center justify-center gap-2"
        >
          {carouselProducts.map((_, i) => {
            const isActive = i === carousel.activeIndex
            return (
              <button
                key={i}
                onClick={() =>
                  carousel.goTo(
                    carousel.position + (i - carousel.activeIndex),
                    i > carousel.activeIndex ? 1 : -1,
                  )
                }
                className="group relative cursor-pointer py-2"
                aria-label={`Go to product ${i + 1}`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    isActive
                      ? "w-8 bg-accent"
                      : "w-1.5 bg-white/20 group-hover:bg-white/40"
                  }`}
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Active product info bar */}
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-4 text-center">
          <span className="text-xs text-white/40">
            {String(carousel.activeIndex + 1).padStart(2, "0")}
          </span>
          <div className="h-px w-12 bg-white/15" />
          <span className="text-xs text-white/40">
            {String(count).padStart(2, "0")}
          </span>
          <div className="h-px w-12 bg-white/15" />
          <span className="text-xs font-medium text-accent">
            {carouselProducts[carousel.activeIndex]?.category}
          </span>
        </div>
      </div>

      {/* Hint text */}
      {entered && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/20">
            Scroll &middot; Drag &middot; Swipe to explore
          </p>
        </div>
      )}
    </section>
  )
}
