import { FloatingHero } from "@/components/ecommerce/FloatingHero"
import { CinematicShowcase } from "@/components/ecommerce/cinematic/CinematicShowcase"
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
      <CinematicShowcase />
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
