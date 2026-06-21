import { useEffect, useMemo, useRef } from "react"
import gsap from "gsap"

interface CinematicBackgroundProps {
  activeIndex: number
  total: number
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function CinematicBackground({
  activeIndex,
  total,
}: CinematicBackgroundProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)
  const blob3Ref = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${randomBetween(0, 100)}%`,
        top: `${randomBetween(0, 100)}%`,
        size: randomBetween(1, 3),
        delay: randomBetween(0, 8),
        duration: randomBetween(8, 18),
        dx: `${randomBetween(-80, 80)}px`,
        dy: `${randomBetween(-120, 60)}px`,
        opacity: randomBetween(0.15, 0.6),
      })),
    [],
  )

  useEffect(() => {
    const container = parallaxRef.current
    if (!container) return

    const xTo1 = gsap.quickTo(blob1Ref.current, "x", { duration: 1.5, ease: "power3" })
    const yTo1 = gsap.quickTo(blob1Ref.current, "y", { duration: 1.5, ease: "power3" })
    const xTo2 = gsap.quickTo(blob2Ref.current, "x", { duration: 2, ease: "power3" })
    const yTo2 = gsap.quickTo(blob2Ref.current, "y", { duration: 2, ease: "power3" })
    const gridX = gsap.quickTo(gridRef.current, "x", { duration: 1.2, ease: "power3" })
    const gridY = gsap.quickTo(gridRef.current, "y", { duration: 1.2, ease: "power3" })

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const cx = (e.clientX - rect.left - rect.width / 2) / rect.width
      const cy = (e.clientY - rect.top - rect.height / 2) / rect.height
      xTo1(cx * 40)
      yTo1(cy * 40)
      xTo2(cx * -25)
      yTo2(cy * -25)
      gridX(cx * 15)
      gridY(cy * 15)
    }

    container.addEventListener("mousemove", handleMove)
    return () => container.removeEventListener("mousemove", handleMove)
  }, [])

  useEffect(() => {
    if (!blob1Ref.current || !blob2Ref.current || !blob3Ref.current) return
    const hue = (activeIndex / Math.max(total, 1)) * 60
    gsap.to(blob1Ref.current, {
      filter: `hue-rotate(${hue}deg)`,
      duration: 1.2,
      ease: "power2.inOut",
    })
    gsap.to(blob3Ref.current, {
      filter: `hue-rotate(${hue - 30}deg)`,
      duration: 1.2,
      ease: "power2.inOut",
    })
  }, [activeIndex, total])

  return (
    <div ref={parallaxRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080812] via-[#05050a] to-[#0a0a16]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c1a]/60 via-transparent to-[#0c0c1a]/60" />

      {/* Animated gradient blobs */}
      <div
        ref={blob1Ref}
        className="absolute left-[15%] top-[10%] h-[500px] w-[500px] rounded-full opacity-50 animate-cinematic-blob"
        style={{
          background:
            "radial-gradient(circle, rgba(202,138,4,0.18) 0%, rgba(180,120,20,0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        ref={blob2Ref}
        className="absolute right-[10%] top-[30%] h-[450px] w-[450px] rounded-full opacity-40 animate-cinematic-blob"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(67,56,202,0.06) 40%, transparent 70%)",
          filter: "blur(70px)",
          animationDelay: "-6s",
        }}
      />
      <div
        ref={blob3Ref}
        className="absolute bottom-[5%] left-[40%] h-[400px] w-[400px] rounded-full opacity-30 animate-cinematic-blob"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,182,0.1) 0%, rgba(190,24,93,0.04) 40%, transparent 70%)",
          filter: "blur(80px)",
          animationDelay: "-12s",
        }}
      />

      {/* Subtle grid for depth */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-accent"
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                animation: `cinematic-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
                "--dx": p.dx,
                "--dy": p.dy,
                boxShadow: "0 0 4px rgba(202,138,4,0.4)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Twinkling stars */}
      {particles.slice(0, 20).map((p) => (
        <div
          key={`star-${p.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${randomBetween(0, 100)}%`,
            top: `${randomBetween(0, 100)}%`,
            width: 1.5,
            height: 1.5,
            animation: `cinematic-twinkle ${randomBetween(2, 5)}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,10,0.4) 75%, rgba(5,5,10,0.85) 100%)",
        }}
      />

      {/* Top and bottom fade for seamless section blending */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#05050a] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05050a] to-transparent" />
    </div>
  )
}
