import { ShoppingBag, Star, Shield, Truck, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Container } from "@/components/layout/Container"
import ShaderBackground from "@/components/ui/shader-background"
import { ImageSwiper } from "@/components/ui/image-swiper"
import { useCartStore } from "@/store/cart-store"
import { products } from "@/data/products"
import { useState } from "react"
import { cn } from "@/lib/utils"

const heroProduct = products.find((p) => p.id === "p1")!

const specs = [
  { label: "Movement", value: "Swiss Automatic" },
  { label: "Case", value: "18k Rose Gold" },
  { label: "Dial", value: "Aventurine" },
  { label: "Water Resistance", value: "100m" },
  { label: "Power Reserve", value: "70 Hours" },
  { label: "Crystal", value: "Sapphire" },
]

const perks = [
  { icon: Shield, text: "2-year warranty" },
  { icon: Truck, text: "Free insured shipping" },
  { icon: RotateCcw, text: "30-day returns" },
]

export function ProductSpotlight() {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(heroProduct)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <section className="relative isolate overflow-hidden py-24 md:py-32 bg-[#0a0a1a]">
      <ShaderBackground className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a1a]/20 via-transparent to-[#0a0a1a]/30" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />

      <Container className="relative z-10 text-white">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-4 border-accent/30 text-accent">
            Featured Timepiece
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
            The{" "}
            <span className="text-accent">Aventurine Chronograph</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Where celestial artistry meets precision engineering.
          </p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="flex justify-center">
            <ImageSwiper
              images={heroProduct.images.join(',')}
              cardWidth={320}
              cardHeight={420}
              className="mx-auto"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-accent text-accent" />
                  <span className="text-sm font-medium">
                    {heroProduct.rating}
                  </span>
                </div>
                <span className="text-sm text-white/60">
                  ({heroProduct.reviewCount} reviews)
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-white/60">
                {heroProduct.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <p className="text-xs text-white/50">{spec.label}</p>
                  <p className="text-sm font-medium">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              {perks.map((perk) => (
                <div key={perk.text} className="flex items-center gap-1.5">
                  <perk.icon size={14} className="text-accent" />
                  {perk.text}
                </div>
              ))}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl font-bold">
                ${heroProduct.price.toLocaleString()}
              </span>
              {heroProduct.originalPrice && (
                <>
                  <span className="text-lg text-white/40 line-through">
                    ${heroProduct.originalPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Save{" "}
                    {Math.round(
                      (1 - heroProduct.price / heroProduct.originalPrice) * 100,
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className={cn(
                  "flex-1 gap-2 transition-all duration-300",
                  added && "bg-green-600 hover:bg-green-600",
                )}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white">
                Book a Viewing
              </Button>
            </div>

            <p className="text-xs text-white/50">
              Free worldwide shipping &bull; Authenticity certificate included
              &bull; Limited edition of 500 pieces
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
