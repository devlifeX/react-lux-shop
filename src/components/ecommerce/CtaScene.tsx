import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'

gsap.registerPlugin(ScrollTrigger)

export function CtaScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      })

      tl.fromTo(
        Array.from(contentRef.current?.children ?? []),
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      )

      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1 },
          '-=0.5',
        )
      }

      if (buttonRef.current) {
        tl.fromTo(
          buttonRef.current,
          { y: 40, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          '-=0.3',
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-48"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background" />

      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
      />

      <Container className="relative z-10">
        <div ref={contentRef} className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-accent">
            <Sparkles size={14} />
            <span>Bespoke Luxury Since 2026</span>
          </div>

          <h2 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">
            Ready to Own a
            <br />
            <span className="text-accent">Masterpiece?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">
            Every piece is curated, authenticated, and delivered with a
            certificate of excellence. Complimentary shipping worldwide.
          </p>

          <div ref={buttonRef} className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gap-2 px-8 text-base">
              Book a Consultation <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/50 px-8 text-base"
            >
              View Catalog
            </Button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Free shipping &bull; 30-day returns &bull; Lifetime authenticity guarantee
          </p>
        </div>
      </Container>
    </section>
  )
}
