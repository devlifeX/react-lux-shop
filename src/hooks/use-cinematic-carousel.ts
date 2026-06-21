import { useRef, useState, useCallback, useEffect } from "react"
import gsap from "gsap"

export interface CinematicCarouselState {
  position: number
  activeIndex: number
  isDragging: boolean
  isTransitioning: boolean
  direction: 1 | -1
  next: () => void
  prev: () => void
  goTo: (target: number, dir?: 1 | -1) => void
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onPointerCancel: (e: React.PointerEvent) => void
  onWheel: (e: React.WheelEvent) => void
}

interface UseCinematicCarouselOptions {
  count: number
  cardSpacing?: number
  wheelThreshold?: number
  onSettle?: (index: number) => void
}

export function useCinematicCarousel({
  count,
  cardSpacing = 300,
  wheelThreshold = 60,
  onSettle,
}: UseCinematicCarouselOptions): CinematicCarouselState {
  const [position, setPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<1 | -1>(1)

  const proxyRef = useRef({ p: 0 })
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startPos: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    pointerId: -1,
  })
  const wheelAccumRef = useRef(0)
  const wheelLockRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const onSettleRef = useRef(onSettle)
  const transitioningRef = useRef(false)
  const lastSettledRef = useRef(0)

  useEffect(() => {
    onSettleRef.current = onSettle
  }, [onSettle])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
  }, [])

  const updatePosition = useCallback(() => {
    setPosition(proxyRef.current.p)
  }, [])

  const fireSettle = useCallback(() => {
    const idx =
      (((Math.round(proxyRef.current.p) % count) + count) % count) | 0
    if (idx !== lastSettledRef.current) {
      lastSettledRef.current = idx
      onSettleRef.current?.(idx)
    }
  }, [count])

  const snapToNearest = useCallback(
    (velocity = 0) => {
      if (tweenRef.current) tweenRef.current.kill()

      const predicted = proxyRef.current.p + velocity * 0.18
      const target = Math.round(predicted)

      if (target !== Math.round(proxyRef.current.p)) {
        setDirection(target > proxyRef.current.p ? 1 : -1)
      }

      transitioningRef.current = true
      setIsTransitioning(true)

      const duration = reducedMotionRef.current ? 0.25 : 0.85
      const ease = reducedMotionRef.current ? "power2.out" : "power3.out"

      tweenRef.current = gsap.to(proxyRef.current, {
        p: target,
        duration,
        ease,
        onUpdate: updatePosition,
        onComplete: () => {
          transitioningRef.current = false
          setIsTransitioning(false)
          proxyRef.current.p = target
          updatePosition()
          fireSettle()
        },
      })
    },
    [updatePosition, fireSettle],
  )

  const goTo = useCallback(
    (target: number, dir?: 1 | -1) => {
      if (tweenRef.current) tweenRef.current.kill()

      const computedDir = dir ?? (target > proxyRef.current.p ? 1 : -1)
      setDirection(computedDir as 1 | -1)

      transitioningRef.current = true
      setIsTransitioning(true)

      const duration = reducedMotionRef.current ? 0.3 : 1.0
      const ease = "power3.inOut"

      tweenRef.current = gsap.to(proxyRef.current, {
        p: target,
        duration,
        ease,
        onUpdate: updatePosition,
        onComplete: () => {
          transitioningRef.current = false
          setIsTransitioning(false)
          proxyRef.current.p = target
          updatePosition()
          fireSettle()
        },
      })
    },
    [updatePosition, fireSettle],
  )

  const next = useCallback(() => {
    if (transitioningRef.current) return
    goTo(Math.round(proxyRef.current.p) + 1, 1)
  }, [goTo])

  const prev = useCallback(() => {
    if (transitioningRef.current) return
    goTo(Math.round(proxyRef.current.p) - 1, -1)
  }, [goTo])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (tweenRef.current) tweenRef.current.kill()
    transitioningRef.current = false
    setIsTransitioning(false)
    setIsDragging(true)
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startPos: proxyRef.current.p,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
      pointerId: e.pointerId,
    }
    try {
      ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    } catch {
      /* noop */
    }
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.active) return
      const now = performance.now()
      const dx = e.clientX - dragRef.current.lastX
      const dt = Math.max(now - dragRef.current.lastTime, 1)
      dragRef.current.velocity = (dx / dt) * 16
      dragRef.current.lastX = e.clientX
      dragRef.current.lastTime = now

      const delta = (e.clientX - dragRef.current.startX) / cardSpacing
      proxyRef.current.p = dragRef.current.startPos - delta
      updatePosition()
    },
    [cardSpacing, updatePosition],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      setIsDragging(false)
      try {
        ;(e.currentTarget as Element).releasePointerCapture(
          dragRef.current.pointerId,
        )
      } catch {
        /* noop */
      }
      snapToNearest(dragRef.current.velocity)
    },
    [snapToNearest],
  )

  const onPointerCancel = useCallback(
    () => {
      if (!dragRef.current.active) return
      dragRef.current.active = false
      setIsDragging(false)
      snapToNearest(0)
    },
    [snapToNearest],
  )

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (transitioningRef.current || wheelLockRef.current) return
      wheelAccumRef.current += e.deltaY
      if (Math.abs(wheelAccumRef.current) > wheelThreshold) {
        const dir: 1 | -1 = wheelAccumRef.current > 0 ? 1 : -1
        wheelAccumRef.current = 0
        wheelLockRef.current = true
        goTo(Math.round(proxyRef.current.p) + dir, dir)
        setTimeout(() => {
          wheelLockRef.current = false
        }, 700)
      }
    },
    [wheelThreshold, goTo],
  )

  useEffect(() => {
    return () => {
      if (tweenRef.current) tweenRef.current.kill()
    }
  }, [])

  const activeIndex =
    (((Math.round(position) % count) + count) % count) | 0

  return {
    position,
    activeIndex,
    isDragging,
    isTransitioning,
    direction,
    next,
    prev,
    goTo,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheel,
  }
}

export function getCardOffset(
  cardIndex: number,
  position: number,
  count: number,
): number {
  let offset = cardIndex - position
  const half = count / 2
  while (offset > half) offset -= count
  while (offset < -half) offset += count
  return offset
}

export interface CardPlacement {
  offset: number
  x: number
  scale: number
  opacity: number
  blur: number
  translateZ: number
  zIndex: number
  visible: boolean
}

export function computeCardPlacement(
  cardIndex: number,
  position: number,
  count: number,
  cardSpacing: number,
  maxVisible: number = 2.5,
): CardPlacement {
  const offset = getCardOffset(cardIndex, position, count)
  const absOffset = Math.abs(offset)

  const visible = absOffset <= maxVisible + 0.5

  const x = offset * cardSpacing
  const scale = Math.max(0.5, 1 - absOffset * 0.13)
  const opacity = Math.max(0, 1 - absOffset * 0.35)
  const blur = Math.min(absOffset * 3, 8)
  const translateZ = -absOffset * 120
  const zIndex = Math.round(100 - absOffset * 10)

  return { offset, x, scale, opacity, blur, translateZ, zIndex, visible }
}
