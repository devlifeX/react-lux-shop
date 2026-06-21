import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Truck, Sparkles } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Container } from "@/components/layout/Container"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const steps = [
  { id: "design", title: "Design & Concept", text: "Each piece begins as a hand-drawn sketch in our Milanese atelier, where master designers translate centuries of tradition into contemporary forms." },
  { id: "materials", title: "Material Selection", text: "Only the finest materials pass our rigorous standards — ethically sourced gemstones, precious metals, and the world's most coveted leathers." },
  { id: "crafting", title: "Artisan Crafting", text: "Our master artisans devote hundreds of hours to each piece, employing techniques passed down through generations." },
  { id: "quality", title: "Quality Assurance", text: "Every Luxora piece undergoes 72 hours of meticulous inspection and testing before receiving our seal of excellence." },
]

const tabs = [
  { value: "timepieces", label: "Timepieces", image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80" },
  { value: "jewelry", label: "Jewelry", image: "https://images.unsplash.com/photo-1515562141589-677c7cb0b859?w=600&q=80" },
  { value: "leather", label: "Leather", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
]

export function ProductShowcase() {
  const sectionRef = useScrollReveal<HTMLElement>({ scrub: 1 })
  return (
    <section ref={sectionRef} className="py-20">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4">
              The Luxora Difference
            </Badge>
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Craftsmanship That
              <br />
              <span className="text-accent">Tells a Story</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              From the ateliers of Switzerland to the workshops of Florence,
              every Luxora piece represents generations of mastery.
            </p>

            <Accordion type="single" collapsible className="mt-8 w-full">
              {steps.map((step) => (
                <AccordionItem key={step.id} value={step.id}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {step.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {step.text}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="gap-2">
                Explore Our Process <ArrowRight size={14} />
              </Button>
              <Button variant="outline" className="gap-2 border-border/50">
                Book a Consultation
              </Button>
            </div>

            <div className="mt-8 flex gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield size={14} className="text-accent" />
                Lifetime Warranty
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck size={14} className="text-accent" />
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles size={14} className="text-accent" />
                Authenticity Card
              </div>
            </div>
          </div>

          <div>
            <Tabs defaultValue="timepieces">
              <TabsList className="mb-4">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={tab.image}
                      alt={tab.label}
                      className="h-[500px] w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </Container>
    </section>
  )
}
