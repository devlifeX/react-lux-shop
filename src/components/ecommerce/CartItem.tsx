import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/store/cart-store"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-medium">
              {item.product.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              ${item.product.price.toLocaleString()} each
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.product.id)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity(item.product.id, -1)}
            >
              <Minus size={12} />
            </Button>
            <span
              className={cn(
                "flex h-7 w-8 items-center justify-center text-sm font-medium tabular-nums",
              )}
            >
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => onUpdateQuantity(item.product.id, 1)}
            >
              <Plus size={12} />
            </Button>
          </div>
          <span className="font-heading text-sm font-bold tabular-nums">
            ${(item.product.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
