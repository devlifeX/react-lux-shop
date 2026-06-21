import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import gsap from "gsap"
import { ShoppingBag, Star, ArrowRight } from "lucide-react"
import type { Product } from "@/data/products"
import type { CardPlacement } from "@/hooks/use-cinematic-carousel"

export interface CinematicProductCardHandle {
  playEntrance: () => void
  resetContent: () => void
}

interface CinematicProductCardProps {
  product: Product
  placement: CardPlacement
  isActive: boolean
  isHovered: boolean
  cardWidth: number
  cardHeight: number
  onAddToCart: (product: Product) => void
}

const CinematicProductCard = forwardRef<
  CinematicProductCardHandle,
  CinematicProductCardProps
>(function CinematicProductCard(
  {
    product,
    placement,
    isActive,
    isHovered,
    cardWidth,
    cardHeight,
    onAddToCart,
  },
  ref,
) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const ratingRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const extraDetailsRef = useRef<HTMLDivElement>(null)

  const driftTlRef = useRef<gsap.core.Tween | null>(null)
  const hoverTlRef = useRef<gsap.core.Tween | null>(null)
  const entranceTlRef = useRef<gsap.core.Timeline | null>(null)
  const [added, setAdded] = useState(false)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const setInitialHidden = () => {
    if (categoryRef.current)
      gsap.set(categoryRef.current, { x: -20, opacity: 0 })
    if (titleRef.current)
      gsap.set(titleRef.current.children, { y: 40, opacity: 0, rotationX: -60 })
    if (descRef.current)
      gsap.set(descRef.current, { y: 15, opacity: 0 })
    if (priceRef.current)
      gsap.set(priceRef.current, { y: 30, opacity: 0 })
    if (badgeRef.current)
      gsap.set(badgeRef.current, { scale: 0, opacity: 0 })
    if (ratingRef.current)
      gsap.set(ratingRef.current, { opacity: 0, y: 10 })
    if (ctaRef.current)
      gsap.set(ctaRef.current, { y: 20, opacity: 0 })
  }

  const playEntrance = () => {
    if (entranceTlRef.current) entranceTlRef.current.kill()

    const tl = gsap.timeline()
    entranceTlRef.current = tl

    setInitialHidden()

    tl.to(imageRef.current, {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
    })

    tl.to(
      categoryRef.current,
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.3",
    )

    tl.to(
      titleRef.current?.children ?? [],
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: "power3.out",
      },
      "-=0.3",
    )

    tl.to(
      descRef.current,
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.4",
    )

    tl.to(
      ratingRef.current,
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      "-=0.3",
    )

    tl.to(
      priceRef.current,
      { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" },
      "-=0.3",
    )

    if (discount > 0) {
      tl.to(
        badgeRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
        },
        "-=0.35",
      )
    }

    tl.to(
      ctaRef.current,
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      "-=0.3",
    )
  }

  const resetContent = () => {
    if (entranceTlRef.current) {
      entranceTlRef.current.kill()
      entranceTlRef.current = null
    }
    setInitialHidden()
  }

  useImperativeHandle(ref, () => ({ playEntrance, resetContent }), [])

  useEffect(() => {
    const img = imageRef.current
    if (!img) return

    if (isActive) {
      gsap.set(img, { scale: 1.08, opacity: 0.4, filter: "blur(8px)" })

      if (driftTlRef.current) driftTlRef.current.kill()
      driftTlRef.current = gsap.to(img, {
        rotation: 1.5,
        x: 4,
        y: -3,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    } else {
      if (driftTlRef.current) {
        driftTlRef.current.kill()
        driftTlRef.current = null
      }
      gsap.set(img, { scale: 1, opacity: 1, filter: "blur(0px)", rotation: 0, x: 0, y: 0 })
    }

    return () => {
      if (driftTlRef.current) {
        driftTlRef.current.kill()
        driftTlRef.current = null
      }
    }
  }, [isActive])

  useEffect(() => {
    const imgWrap = imageWrapRef.current
    const glow = glowRef.current
    const extra = extraDetailsRef.current
    if (!imgWrap || !glow) return

    if (hoverTlRef.current) hoverTlRef.current.kill()

    if (isHovered && isActive) {
      hoverTlRef.current = gsap.to(imgWrap, {
        y: -12,
        scale: 1.03,
        duration: 0.5,
        ease: "power3.out",
      })
      gsap.to(glow, { opacity: 0.7, scale: 1.15, duration: 0.5, ease: "power3.out" })
      if (extra) gsap.to(extra, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" })
    } else {
      hoverTlRef.current = gsap.to(imgWrap, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      })
      gsap.to(glow, { opacity: isActive ? 0.4 : 0, scale: 1, duration: 0.4, ease: "power3.out" })
      if (extra) gsap.to(extra, { opacity: 0, y: 8, duration: 0.3, ease: "power3.in" })
    }

    return () => {
      if (hoverTlRef.current) {
        hoverTlRef.current.kill()
        hoverTlRef.current = null
      }
    }
  }, [isHovered, isActive])

  useEffect(() => {
    return () => {
      if (entranceTlRef.current) entranceTlRef.current.kill()
      if (driftTlRef.current) driftTlRef.current.kill()
      if (hoverTlRef.current) hoverTlRef.current.kill()
    }
  }, [])

  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const titleChars = product.name.split("")

  return (
    <div
      ref={cardRef}
      className="absolute left-1/2 top-1/2 will-change-transform preserve-3d"
      style={{
        width: cardWidth,
        height: cardHeight,
        transform: `translate(-50%, -50%) translateX(${placement.x}px) translateZ(${placement.translateZ}px) scale(${placement.scale})`,
        opacity: placement.visible ? placement.opacity : 0,
        filter: `blur(${placement.blur}px)`,
        zIndex: placement.zIndex,
        pointerEvents: placement.visible && placement.opacity > 0.3 ? "auto" : "none",
        transition: "filter 0.3s ease, opacity 0.3s ease",
      }}
    >
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-8 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(202,138,4,0.25) 0%, rgba(202,138,4,0.08) 40%, transparent 70%)",
          opacity: isActive ? 0.4 : 0,
          filter: "blur(20px)",
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Card body */}
      <div
        className={`relative h-full w-full overflow-hidden rounded-2xl preserve-3d ${
          isActive ? "glass-card-active" : "glass-card"
        }`}
        style={{
          boxShadow: isActive
            ? "0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(202,138,4,0.08), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Image section */}
        <div
          ref={imageWrapRef}
          className="relative overflow-hidden"
          style={{ height: "62%" }}
        >
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover select-none"
            draggable={false}
            loading="lazy"
          />
          {/* Gradient overlay on image bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(5,5,10,0.7) 100%)",
            }}
          />

          {/* Discount badge */}
          {discount > 0 && (
            <div
              ref={badgeRef}
              className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-xs font-bold text-accent backdrop-blur-md"
            >
              <span>-{discount}%</span>
            </div>
          )}

          {/* Category label */}
          <span
            ref={categoryRef}
            className="absolute bottom-3 left-4 text-[11px] font-medium uppercase tracking-widest text-accent"
          >
            {product.category}
          </span>
        </div>

        {/* Content section */}
        <div
          ref={contentRef}
          className="flex h-[38%] flex-col justify-between p-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div>
            <h3
              ref={titleRef}
              className="font-display text-lg font-bold leading-tight text-white"
              style={{ perspective: 200 }}
            >
              {titleChars.map((char, i) => (
                <span
                  key={i}
                  className="inline-block will-change-transform"
                  style={{
                    whiteSpace: char === " " ? "pre" : "normal",
                  }}
                >
                  {char}
                </span>
              ))}
            </h3>

            <p
              ref={descRef}
              className="mt-1 line-clamp-1 text-xs text-white/50"
            >
              {product.description}
            </p>

            <div ref={ratingRef} className="mt-1.5 flex items-center gap-1">
              <Star size={11} className="fill-accent text-accent" />
              <span className="text-xs font-medium text-white/80">
                {product.rating}
              </span>
              <span className="text-xs text-white/40">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div ref={priceRef} className="flex flex-col">
              <span className="font-display text-xl font-bold text-white">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-white/35 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <div ref={ctaRef}>
              <button
                onClick={handleAdd}
                className="group/btn flex cursor-pointer items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent backdrop-blur-md transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBag size={13} />
                {added ? "Added" : "Add"}
                <ArrowRight
                  size={12}
                  className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Extra details (hover) */}
        <div
          ref={extraDetailsRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-2 gap-2 border-t border-white/5 bg-black/40 px-4 py-2 opacity-0 backdrop-blur-md"
        >
          {["Free Shipping", "Authentic", "Warranty"].map((d) => (
            <span
              key={d}
              className="text-[10px] font-medium text-white/60"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})

export default CinematicProductCard
