import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import gsap from "gsap"
import { ShoppingBag, Search, Menu, X, ChevronRight } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import LiquidGlassCanvas, {
  type LiquidGlassCanvasHandle,
} from "@/components/ui/liquid-glass-canvas"
import { useGlassTextContrast } from "@/hooks/use-glass-text-contrast"

interface LiquidGlassNavProps {
  onCartOpen: () => void
}

const navItems = [
  { label: "Collection", href: "#collection" },
  { label: "Timepieces", href: "#timepieces" },
  { label: "Jewelry", href: "#jewelry" },
  { label: "Leather", href: "#leather" },
  { label: "Fragrance", href: "#fragrance" },
]

export function LiquidGlassNav({ onCartOpen }: LiquidGlassNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  const headerRef = useRef<HTMLElement>(null)
  const glassRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<LiquidGlassCanvasHandle>(null)
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const menuOverlayRef = useRef<HTMLDivElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const menuTlRef = useRef<gsap.core.Timeline | null>(null)
  const navHeightRef = useRef(0)

  useGlassTextContrast(glassRef, menuOpen)

  const updateMouseFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const glass = glassRef.current
      const canvas = canvasRef.current
      if (!glass || !canvas) return
      const rect = glass.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      canvas.setMouse(
        Math.max(0, Math.min(1, x)),
        Math.max(0, Math.min(1, y)),
      )
    },
    [],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updateMouseFromEvent(e)
    },
    [updateMouseFromEvent],
  )

  const handleMouseLeave = useCallback(() => {
    canvasRef.current?.setMouse(0.5, 0.5)
  }, [])

  const handleNavItemHover = useCallback(
    (index: number, hovering: boolean) => {
      const el = navItemRefs.current[index]
      const glass = glassRef.current
      const canvas = canvasRef.current
      if (!el || !glass || !canvas) return

      const glassRect = glass.getBoundingClientRect()
      const itemRect = el.getBoundingClientRect()
      const x =
        (itemRect.left + itemRect.width / 2 - glassRect.left) / glassRect.width
      const y =
        (itemRect.top + itemRect.height / 2 - glassRect.top) / glassRect.height

      canvas.setHoverInfluence(index, x, y, hovering ? 1 : 0)

      if (hovering) {
        canvas.triggerRipple(x, y, 0.6)

        navItemRefs.current.forEach((other, i) => {
          if (i === index || !other) return
          const otherRect = other.getBoundingClientRect()
          const ox =
            (otherRect.left + otherRect.width / 2 - glassRect.left) /
            glassRect.width
          const oy =
            (otherRect.top + otherRect.height / 2 - glassRect.top) /
            glassRect.height
          const dist = Math.abs(x - ox)
          const influence = Math.max(0, 0.3 - dist * 0.4)
          canvas.setHoverInfluence(i, ox, oy, influence)
        })
      } else {
        navItemRefs.current.forEach((_, i) => {
          canvas.setHoverInfluence(i, 0, 0, 0)
        })
      }
    },
    [],
  )

  const handleNavItemClick = useCallback(
    (index: number) => {
      const el = navItemRefs.current[index]
      const glass = glassRef.current
      const canvas = canvasRef.current
      if (!el || !glass || !canvas) return

      const glassRect = glass.getBoundingClientRect()
      const itemRect = el.getBoundingClientRect()
      const x =
        (itemRect.left + itemRect.width / 2 - glassRect.left) / glassRect.width
      const y =
        (itemRect.top + itemRect.height / 2 - glassRect.top) / glassRect.height

      canvas.triggerRipple(x, y, 1.0)
    },
    [],
  )

  const openMobileMenu = useCallback(() => {
    const glass = glassRef.current
    const overlay = menuOverlayRef.current
    const items = menuItemsRef.current
    const closeBtn = closeBtnRef.current
    if (!glass || !overlay || !items || !closeBtn) return

    navHeightRef.current = glass.offsetHeight
    setMenuOpen(true)

    const targetHeight = Math.min(window.innerHeight * 0.72, 460)

    if (menuTlRef.current) menuTlRef.current.kill()
    const tl = gsap.timeline()
    menuTlRef.current = tl

    tl.set(overlay, { display: "block" })
    tl.set(glass, { borderRadius: "24px" })

    tl.to(
      glass,
      {
        height: targetHeight,
        duration: 0.16,
        ease: "power4.out",
      },
      0,
    )

    tl.to(
      overlay,
      {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      },
      0,
    )

    tl.to(
      closeBtn,
      {
        opacity: 1,
        duration: 0.15,
        ease: "power2.out",
      },
      0.12,
    )

    tl.fromTo(
      Array.from(items.children),
      {
        opacity: 0,
        y: 8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.04,
        ease: "power2.out",
      },
      0.15,
    )

    tl.play()
  }, [])

  const closeMobileMenu = useCallback(() => {
    const glass = glassRef.current
    const overlay = menuOverlayRef.current
    const items = menuItemsRef.current
    const closeBtn = closeBtnRef.current
    if (!glass || !overlay || !items || !closeBtn) return

    if (menuTlRef.current) menuTlRef.current.kill()
    const tl = gsap.timeline({
      onComplete: () => setMenuOpen(false),
    })
    menuTlRef.current = tl

    tl.to(
      Array.from(items.children),
      {
        opacity: 0,
        y: -6,
        duration: 0.12,
        stagger: 0.02,
        ease: "power2.in",
      },
      0,
    )

    tl.to(
      closeBtn,
      {
        opacity: 0,
        duration: 0.1,
        ease: "power2.in",
      },
      0,
    )

    tl.to(
      glass,
      {
        height: navHeightRef.current,
        duration: 0.16,
        ease: "power4.out",
      },
      0.1,
    )

    tl.set(glass, { borderRadius: "9999px" })

    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      },
      0.15,
    )

    tl.set(overlay, { display: "none" })

    tl.play()
  }, [])

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      const glass = glassRef.current
      if (!glass) return
      const rect = glass.getBoundingClientRect()
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        updateMouseFromEvent(e)
      }
    }
    window.addEventListener("mousemove", handleGlobalMove)
    return () => window.removeEventListener("mousemove", handleGlobalMove)
  }, [updateMouseFromEvent])

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <div className="mx-3 mt-3 sm:mx-4 sm:mt-4">
          <div
            ref={glassRef}
            className="liquid-glass-container liquid-glass-edge liquid-glass-iridescent-edge glass-text relative rounded-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <LiquidGlassCanvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full rounded-[inherit]"
            />

            <div className="liquid-glass-border pointer-events-none absolute inset-0 rounded-[inherit]" />

            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-[inherit]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
              }}
            />

            {/* Nav content */}
            <div
              className="relative z-10 flex items-center justify-between px-5 py-2.5"
              style={{ fontFamily: "var(--font-glass)" }}
            >
              <a
                href="/"
                className="font-heading text-lg font-bold tracking-tight"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              >
                Luxora
              </a>

              <nav className="hidden items-center gap-0.5 lg:flex">
                {navItems.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href}
                    ref={(el) => {
                      navItemRefs.current[i] = el
                    }}
                    className="glass-nav-link relative cursor-pointer rounded-full px-4 py-2 text-sm font-medium opacity-70 transition-opacity duration-200 hover:opacity-100"
                    onMouseEnter={() => handleNavItemHover(i, true)}
                    onMouseLeave={() => handleNavItemHover(i, false)}
                    onClick={() => handleNavItemClick(i)}
                  >
                    <span className="relative z-10">{item.label}</span>
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-0.5">
                <button
                  className="glass-action-btn"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
                <button
                  className="glass-action-btn relative"
                  aria-label="Open cart"
                  onClick={onCartOpen}
                >
                  <ShoppingBag size={18} />
                  {itemCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                      {itemCount}
                    </span>
                  )}
                </button>
                <button
                  className="glass-action-btn lg:hidden"
                  aria-label="Open menu"
                  onClick={openMobileMenu}
                >
                  <Menu size={18} />
                </button>
              </div>
            </div>

            {/* Mobile menu panel */}
            <div
              ref={menuPanelRef}
              className="relative z-10"
              style={{ display: menuOpen ? "block" : "none" }}
            >
              <button
                ref={closeBtnRef}
                onClick={closeMobileMenu}
                className="absolute right-4 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10"
                aria-label="Close menu"
                style={{ opacity: 0 }}
              >
                <X size={16} />
              </button>

              <div
                ref={menuItemsRef}
                className="flex flex-col gap-1 px-5 pb-6 pt-2"
              >
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      closeMobileMenu()
                      setTimeout(() => {
                        const el = document.querySelector(item.href)
                        el?.scrollIntoView({ behavior: "smooth" })
                      }, 300)
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3.5 text-2xl font-light tracking-tight transition-colors duration-200 hover:bg-white/5"
                  >
                    <span className="opacity-70 transition-opacity group-hover:opacity-100">
                      {item.label}
                    </span>
                    <ChevronRight
                      size={20}
                      className="opacity-30 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-60"
                    />
                  </a>
                ))}
              </div>

              <div className="px-5 pb-5 text-xs opacity-30">
                Luxora — Luxury Ecommerce
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 z-40"
        style={{ display: "none", opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      </div>
    </>
  )
}
