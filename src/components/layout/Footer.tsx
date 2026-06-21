import { Container } from "@/components/layout/Container"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-lg font-semibold">Luxora</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Curated luxury goods for the discerning individual. Every piece
              tells a story.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Collections</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Timepieces
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Jewelry
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Leather Goods
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Fragrance
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Customer Service</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Connect</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Pinterest
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Luxora. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
