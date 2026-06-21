import { useState, useMemo } from "react"
import { Container } from "@/components/layout/Container"
import { ProductCard, ProductCardSkeleton } from "./ProductCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { products, categories } from "@/data/products"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const sectionRef = useScrollReveal<HTMLElement>({ scrub: 1 })

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products
    return products.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  const handleCategoryChange = (id: string) => {
    setIsLoading(true)
    setActiveCategory(id)
    setTimeout(() => setIsLoading(false), 400)
  }

  return (
    <section ref={sectionRef} className="py-20">
      <Container>
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4">
            Collection
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Curated For You
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each piece selected for its exceptional craftsmanship and timeless
            design.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat.id)}
              className="transition-all duration-200"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addItem}
                />
              ))}
        </div>
      </Container>
    </section>
  )
}
