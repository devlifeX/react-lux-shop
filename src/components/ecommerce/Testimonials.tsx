import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const testimonials = [
  {
    name: "Laura Shouse",
    rating: 5,
    quote:
      "When I discovered Luxora, I knew my standards had found their match. The Aventurine Chronograph I purchased exceeds every expectation — the craftsmanship is simply unparalleled.",
    role: "Collector",
  },
  {
    name: "James Whitfield",
    rating: 5,
    quote:
      "The attention to detail in every piece is remarkable. I've purchased three items from Luxora and each one arrived with a personal note and impeccable packaging. Truly white-glove service.",
    role: "CEO, Whitfield & Co.",
  },
  {
    name: "Samantha Lee",
    rating: 4,
    quote:
      "The Celestial Gold Pendant is absolutely breathtaking. The diamond catches light in ways I didn't think possible. Will definitely be a returning customer.",
    role: "Fashion Editor",
  },
  {
    name: "Marcus Rivera",
    rating: 5,
    quote:
      "As a watch collector with over 20 timepieces, I can confidently say the Skeleton Open-Heart is one of the finest additions to my collection. Exceptional value for its tier.",
    role: "Horology Enthusiast",
  },
]

const features = [
  "51K Happy customers",
  "4.7 Avg ratings",
  "6-month satisfaction guarantee",
  "Complimentary gift wrapping",
]

export function Testimonials() {
  const sectionRef = useScrollReveal<HTMLElement>({ scrub: 1 })
  const [current, setCurrent] = useState(0)
  const t = testimonials[current]

  const next = () => setCurrent((p) => (p + 1) % testimonials.length)
  const prev = () =>
    setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)

  return (
    <section ref={sectionRef} className="py-20">
      <Container>
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Trusted by
              <br />
              <span className="text-accent">Discerning Clients</span>
            </h2>

            <div className="mt-6 space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-accent"
                  />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="fill-accent text-accent"
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                4.7 out of 5
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(Math.round(t.rating))].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-accent text-accent"
                />
              ))}
            </div>
            <blockquote className="text-lg leading-relaxed text-foreground/90">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={prev}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={next}
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === current
                      ? "w-4 bg-accent"
                      : "w-1.5 bg-muted-foreground/30",
                  )}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
