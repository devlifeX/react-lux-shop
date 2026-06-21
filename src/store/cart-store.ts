import { create } from "zustand"
import type { Product } from "@/data/products"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, delta: number) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

const STORAGE_KEY = "luxora-cart"

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadFromStorage(),

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id,
      )
      let newItems: CartItem[]
      if (existing) {
        newItems = state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      } else {
        newItems = [...state.items, { product, quantity: 1 }]
      }
      saveToStorage(newItems)
      return { items: newItems }
    })
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => item.product.id !== productId,
      )
      saveToStorage(newItems)
      return { items: newItems }
    })
  },

  updateQuantity: (productId, delta) => {
    set((state) => {
      const newItems = state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0)
      saveToStorage(newItems)
      return { items: newItems }
    })
  },

  setQuantity: (productId, quantity) => {
    set((state) => {
      const newItems =
        quantity <= 0
          ? state.items.filter((item) => item.product.id !== productId)
          : state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item,
            )
      saveToStorage(newItems)
      return { items: newItems }
    })
  },

  clearCart: () => {
    saveToStorage([])
    set({ items: [] })
  },

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  subtotal: () =>
    get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
}))
