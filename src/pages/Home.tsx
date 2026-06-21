import { FloatingHero } from "@/components/ecommerce/FloatingHero"
import { FeaturedCarousel } from "@/components/ecommerce/FeaturedCarousel"
import { CategoryBento } from "@/components/ecommerce/CategoryBento"
import { ProductGrid } from "@/components/ecommerce/ProductGrid"
import { ProductShowcase } from "@/components/ecommerce/ProductShowcase"
import { ProductSpotlight } from "@/components/ecommerce/ProductSpotlight"
import { Testimonials } from "@/components/ecommerce/Testimonials"
import { PricingSection } from "@/components/ecommerce/PricingSection"
import { CtaScene } from "@/components/ecommerce/CtaScene"

export function Home() {
  return (
    <>
      <FloatingHero />
      <FeaturedCarousel />
      <CategoryBento />
      <ProductGrid />
      <ProductShowcase />
      <ProductSpotlight />
      <Testimonials />
      <PricingSection />
      <CtaScene />
    </>
  )
}
