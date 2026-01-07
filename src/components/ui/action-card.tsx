"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight, AlertTriangle } from "lucide-react"

interface ActionCardProps {
  title: string
  subtitle?: string
  badge?: string | number
  badgeVariant?: "default" | "warning" | "success" | "destructive"
  icon?: React.ComponentType<{ className?: string }>
  action?: string
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

export function ActionCard({
  title,
  subtitle,
  badge,
  badgeVariant = "default",
  icon: Icon,
  action,
  onClick,
  className,
  children,
}: ActionCardProps) {
  const Wrapper = onClick ? "button" : "div"

  const badgeClasses = {
    default: "bg-muted text-muted-foreground",
    warning: "bg-status-late/15 text-status-late",
    success: "bg-status-present/15 text-status-present",
    destructive: "bg-status-absent/15 text-status-absent",
  }

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "w-full p-5 bg-card rounded-xl border border-border text-left",
        onClick && "card-interactive cursor-pointer",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-2.5 bg-primary/15 rounded-xl shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-label font-semibold truncate">{title}</h3>
            {badge !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full",
                  badgeClasses[badgeVariant]
                )}
              >
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-caption text-muted-foreground mt-0.5 truncate">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-3">{children}</div>}
        </div>

        {action && onClick && (
          <div className="flex items-center gap-1 text-primary text-sm font-medium shrink-0">
            <span>{action}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </Wrapper>
  )
}

// Compact action card for dashboard
interface CompactActionCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  onClick?: () => void
  className?: string
}

export function CompactActionCard({
  icon: Icon,
  label,
  value,
  trend,
  onClick,
  className,
}: CompactActionCardProps) {
  const Wrapper = onClick ? "button" : "div"

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "p-4 bg-card rounded-xl border border-border text-left",
        onClick && "card-interactive cursor-pointer",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-lg">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-caption text-muted-foreground">{label}</p>
          <p className="text-title font-bold">{value}</p>
        </div>
      </div>
    </Wrapper>
  )
}

// Issue card for dashboard
interface IssueCardProps {
  issues: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    count: number
    variant: "warning" | "destructive"
  }[]
  onClick?: () => void
  className?: string
}

export function IssueCard({ issues, onClick, className }: IssueCardProps) {
  const totalIssues = issues.reduce((sum, i) => sum + i.count, 0)

  if (totalIssues === 0) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 bg-card rounded-xl border border-border text-left card-interactive",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-status-blocked" />
          <span className="text-label font-semibold">Cần xử lý</span>
        </div>
        <span className="px-2 py-0.5 bg-status-blocked/15 text-status-blocked text-xs font-medium rounded-full">
          {totalIssues}
        </span>
      </div>

      <div className="space-y-2">
        {issues.map((issue, idx) => {
          if (issue.count === 0) return null
          const Icon = issue.icon
          return (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <Icon
                className={cn(
                  "h-3.5 w-3.5",
                  issue.variant === "warning"
                    ? "text-status-late"
                    : "text-status-absent"
                )}
              />
              <span className="text-muted-foreground">{issue.label}</span>
              <span className="font-medium">{issue.count}</span>
            </div>
          )
        })}
      </div>
    </button>
  )
}
