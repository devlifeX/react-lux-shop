import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import { Container } from "@/components/layout/Container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { products } from "@/data/products"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
export function FeaturedCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const sectionRef = useScrollReveal<HTMLElement>({ scrub: 1 })
  const [canScrollRight, setCanScrollRight] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  const featured = products.filter((p) => p.featured)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section ref={sectionRef} className="py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <Badge variant="outline" className="mb-4">
              Featured
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Editor's Pick
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our most coveted pieces this season.
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              disabled={!canScrollLeft}
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              disabled={!canScrollRight}
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-6 overflow-x-auto pb-4"
        >
          {featured.map((product) => (
            <div
              key={product.id}
              className="group w-72 shrink-0 overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-3 bottom-3 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => addItem(product)}
                  >
                    <ShoppingBag size={14} />
                    Add to Cart
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold">{product.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-heading text-lg font-bold">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
