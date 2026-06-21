import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/Container'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        Array.from(textRef.current?.children ?? []),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
      )
        .fromTo(
          Array.from(imagesRef.current?.children ?? []),
          { y: 80, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
          '-=0.4',
        )
        .fromTo(
          bgRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2 },
          '-=0.8',
        )

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          if (imagesRef.current) {
            imagesRef.current.style.transform = `translateY(${progress * 60}px)`
            imagesRef.current.style.opacity = `${1 - progress * 0.4}`
          }
          if (textRef.current) {
            textRef.current.style.transform = `translateY(${progress * -30}px)`
            textRef.current.style.opacity = `${1 - progress * 0.3}`
          }
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent"
      />
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div ref={textRef} className="relative z-10 flex flex-col gap-6">
            <Badge variant="outline" className="w-fit gap-2 border-accent/30 text-accent">
              <Sparkles size={12} />
              New Collection 2026
            </Badge>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Luxury Redefined.
              <br />
              <span className="text-accent">Timeless Design.</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Discover our curated collection of premium timepieces, jewelry,
              leather goods, and fragrances — each piece a testament to
              exceptional craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2">
                Explore Collection <ArrowRight size={16} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/50"
              >
                Watch Film
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-background bg-muted"
                    />
                  ))}
                </div>
                <span>2.4k+ happy clients</span>
              </div>
            </div>
          </div>
          <div ref={imagesRef} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80"
                  alt="Luxury watch"
                  className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-80"
                />
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1515562141589-677c7cb0b859?w=600&q=80"
                  alt="Luxury jewelry"
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-60"
                />
              </div>
              <div className="-mt-8 overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
                  alt="Leather bag"
                  className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-60"
                />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80"
                  alt="Fragrance"
                  className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-80"
                />
              </div>
            </div>
            <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-accent/10 via-transparent to-accent/5 blur-3xl" />
          </div>
        </div>
      </Container>
    </section>
  )
}
