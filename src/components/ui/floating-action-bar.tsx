"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Loader2, Save, RotateCcw, AlertTriangle } from "lucide-react"

interface FloatingActionBarProps {
  visible: boolean
  onSave: () => void
  onUndo?: () => void
  saving?: boolean
  saveLabel?: string
  undoLabel?: string
  issueCount?: number
  progress?: { current: number; total: number }
  className?: string
}

export function FloatingActionBar({
  visible,
  onSave,
  onUndo,
  saving = false,
  saveLabel = "Lưu",
  undoLabel = "Hoàn tác",
  issueCount,
  progress,
  className,
}: FloatingActionBarProps) {
  if (!visible) return null

  return (
    <div
      className={cn(
        "floating-bar animate-slide-up",
        "safe-area-bottom",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Progress indicator */}
        {progress && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {progress.current}/{progress.total}
            </span>
          </div>
        )}

        {/* Issue indicator */}
        {issueCount !== undefined && issueCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-status-blocked/15 rounded-full">
            <AlertTriangle className="h-3.5 w-3.5 text-status-blocked" />
            <span className="text-xs font-medium text-status-blocked">
              {issueCount}
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Undo button */}
        {onUndo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={saving}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">{undoLabel}</span>
          </Button>
        )}

        {/* Save button */}
        <Button
          onClick={onSave}
          disabled={saving}
          size="lg"
          className="gap-2 min-w-[120px]"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveLabel}
          {progress && (
            <span className="sm:hidden">
              ({progress.current}/{progress.total})
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

// Simple variant for forms
interface SimpleFloatingBarProps {
  visible: boolean
  onSave: () => void
  onCancel?: () => void
  saving?: boolean
  saveLabel?: string
  cancelLabel?: string
}

export function SimpleFloatingBar({
  visible,
  onSave,
  onCancel,
  saving = false,
  saveLabel = "Lưu thay đổi",
  cancelLabel = "Hủy",
}: SimpleFloatingBarProps) {
  if (!visible) return null

  return (
    <div className="floating-bar animate-slide-up">
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            {cancelLabel}
          </Button>
        )}
        <Button onClick={onSave} disabled={saving} className="gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saveLabel}
        </Button>
      </div>
    </div>
  )
}
