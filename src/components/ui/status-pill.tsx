"use client"

import { cn } from "@/lib/utils"
import { Check, Clock, X, RotateCcw, Monitor, AlertTriangle, Circle } from "lucide-react"

export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT_EXCUSED"
  | "ABSENT_UNEXCUSED"
  | "MAKEUP"
  | "ONLINE"
  | "BLOCKED"
  | "PENDING"

interface StatusPillProps {
  status: AttendanceStatus | string
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

const statusConfig: Record<string, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  bgClass: string
  textClass: string
}> = {
  PRESENT: {
    label: "Có mặt",
    icon: Check,
    bgClass: "bg-status-present",
    textClass: "text-status-present",
  },
  LATE: {
    label: "Đi trễ",
    icon: Clock,
    bgClass: "bg-status-late",
    textClass: "text-status-late",
  },
  ABSENT_EXCUSED: {
    label: "Nghỉ phép",
    icon: X,
    bgClass: "bg-status-absent",
    textClass: "text-status-absent",
  },
  ABSENT_UNEXCUSED: {
    label: "Nghỉ KP",
    icon: X,
    bgClass: "bg-status-absent",
    textClass: "text-status-absent",
  },
  MAKEUP: {
    label: "Học bù",
    icon: RotateCcw,
    bgClass: "bg-status-makeup",
    textClass: "text-status-makeup",
  },
  ONLINE: {
    label: "Online",
    icon: Monitor,
    bgClass: "bg-status-online",
    textClass: "text-status-online",
  },
  BLOCKED: {
    label: "Bị chặn",
    icon: AlertTriangle,
    bgClass: "bg-status-blocked",
    textClass: "text-status-blocked",
  },
  PENDING: {
    label: "Chưa điểm danh",
    icon: Circle,
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
}

export function StatusPill({
  status,
  size = "md",
  showIcon = true,
  className
}: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.PENDING
  const Icon = config.icon

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }

  return (
    <span
      className={cn(
        "status-pill",
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(
        size === "sm" && "h-3 w-3",
        size === "md" && "h-3.5 w-3.5",
        size === "lg" && "h-4 w-4"
      )} />}
      <span>{config.label}</span>
    </span>
  )
}

// Session Status Pill (different from attendance)
export type SessionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

const sessionStatusConfig: Record<string, {
  label: string
  bgClass: string
  textClass: string
}> = {
  SCHEDULED: {
    label: "Sắp diễn ra",
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "Đang học",
    bgClass: "bg-status-online",
    textClass: "text-status-online",
  },
  COMPLETED: {
    label: "Đã kết thúc",
    bgClass: "bg-status-present",
    textClass: "text-status-present",
  },
  CANCELLED: {
    label: "Đã hủy",
    bgClass: "bg-status-absent",
    textClass: "text-status-absent",
  },
}

export function SessionStatusPill({
  status,
  className
}: {
  status: SessionStatus | string
  className?: string
}) {
  const config = sessionStatusConfig[status] || sessionStatusConfig.SCHEDULED

  return (
    <span
      className={cn(
        "status-pill",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      {status === "IN_PROGRESS" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      <span>{config.label}</span>
    </span>
  )
}

// Lead Stage Pill
export type LeadStage = "NEW" | "CONTACTED" | "TEST_SCHEDULED" | "TEST_DONE" | "OFFER_SENT" | "WON" | "LOST"

const leadStageConfig: Record<string, {
  label: string
  bgClass: string
  textClass: string
}> = {
  NEW: { label: "Mới", bgClass: "bg-muted", textClass: "text-muted-foreground" },
  CONTACTED: { label: "Đã liên hệ", bgClass: "bg-status-online", textClass: "text-status-online" },
  TEST_SCHEDULED: { label: "Hẹn test", bgClass: "bg-status-late", textClass: "text-status-late" },
  TEST_DONE: { label: "Đã test", bgClass: "bg-status-blocked", textClass: "text-status-blocked" },
  OFFER_SENT: { label: "Đã gửi offer", bgClass: "bg-status-makeup", textClass: "text-status-makeup" },
  WON: { label: "Thành công", bgClass: "bg-status-present", textClass: "text-status-present" },
  LOST: { label: "Thất bại", bgClass: "bg-status-absent", textClass: "text-status-absent" },
}

export function LeadStagePill({
  stage,
  className
}: {
  stage: LeadStage | string
  className?: string
}) {
  const config = leadStageConfig[stage] || leadStageConfig.NEW

  return (
    <span
      className={cn(
        "status-pill",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span>{config.label}</span>
    </span>
  )
}
