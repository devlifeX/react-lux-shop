import { ShoppingBag, Search, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/Container"
import { AnimatedNav } from "@/components/ecommerce/AnimatedNav"
import { useCartStore } from "@/store/cart-store"

interface NavbarProps {
  onCartOpen: () => void
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const [navOpen, setNavOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-4 mt-4">
          <nav className="rounded-2xl border border-border/50 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <Container>
              <div className="flex items-center justify-between">
                <a
                  href="/"
                  className="font-heading text-xl font-bold tracking-tight"
                >
                  Luxora
                </a>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" aria-label="Search">
                    <Search size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open cart"
                    onClick={onCartOpen}
                    className="relative"
                  >
                    <ShoppingBag size={18} />
                    {itemCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Menu"
                    onClick={() => setNavOpen(true)}
                  >
                    {navOpen ? <X size={18} /> : <Menu size={18} />}
                  </Button>
                </div>
              </div>
            </Container>
          </nav>
        </div>
      </header>

      <AnimatedNav open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  )
}
