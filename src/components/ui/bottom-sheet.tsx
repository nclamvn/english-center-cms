"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-popover rounded-t-[20px] animate-slide-up",
          "max-h-[90vh] overflow-hidden flex flex-col",
          className
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
            <h3 className="text-heading">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full hover:bg-muted touch-target"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// Sheet action button (for bottom sheet actions)
interface SheetActionProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description?: string
  selected?: boolean
  onClick: () => void
  variant?: "default" | "destructive"
}

export function SheetAction({
  icon: Icon,
  label,
  description,
  selected,
  onClick,
  variant = "default",
}: SheetActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl touch-target",
        "transition-all duration-[180ms]",
        selected
          ? "bg-primary/15 border border-primary"
          : "bg-card hover:bg-muted border border-transparent",
        variant === "destructive" && "text-destructive"
      )}
    >
      <div
        className={cn(
          "p-2.5 rounded-xl",
          selected ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-label">{label}</p>
        {description && (
          <p className="text-caption text-muted-foreground">{description}</p>
        )}
      </div>
      {selected && (
        <div className="h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  )
}
