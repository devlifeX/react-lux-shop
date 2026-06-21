import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Container } from "@/components/layout/Container"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    name: "Timepieces",
    description: "Swiss precision meets artistic design",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    span: "lg:col-span-2 lg:row-span-2",
    height: "h-80 md:h-96",
  },
  {
    name: "Jewelry",
    description: "Handcrafted elegance",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    span: "lg:col-span-2",
    height: "h-48 md:h-56",
  },
  {
    name: "Leather Goods",
    description: "Italian full-grain leather",
    image:
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
    span: "lg:col-span-2",
    height: "h-48 md:h-56",
  },
  {
    name: "Fragrance",
    description: "Captivating olfactory journeys",
    image:
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
    span: "lg:col-span-2 lg:col-start-2",
    height: "h-48 md:h-56",
  },
]

export function CategoryBento() {
  const sectionRef = useScrollReveal<HTMLElement>({
    from: { y: 80, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
    scrub: 1,
  })

  return (
    <section ref={sectionRef} className="py-20">
      <Container>
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4">
            Categories
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Explore Our World
          </h2>
          <p className="mt-3 text-muted-foreground">
            Four distinct universes of luxury craftsmanship.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className={`group relative overflow-hidden rounded-2xl ${cat.span} ${cat.height} cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl font-bold text-white md:text-2xl">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-white/70">{cat.description}</p>
              </div>
              <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                <ArrowRight size={14} className="text-white" />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
