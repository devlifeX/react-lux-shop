import { useState } from "react"
import { LiquidGlassNav } from "@/components/layout/LiquidGlassNav"
import { Footer } from "@/components/layout/Footer"
import { Home } from "@/pages/Home"
import { CartDrawer } from "@/components/ecommerce/CartDrawer"

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <LiquidGlassNav onCartOpen={() => setCartOpen(true)} />
      <main className="flex-1">
        <Home />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}
