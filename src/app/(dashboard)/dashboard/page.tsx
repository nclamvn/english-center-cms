"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActionCard, CompactActionCard, IssueCard } from "@/components/ui/action-card"
import { SessionStatusPill } from "@/components/ui/status-pill"
import {
  Calendar,
  Clock,
  Users,
  GraduationCap,
  ClipboardCheck,
  UserPlus,
  ChevronRight,
  Bell,
  Play,
  BookOpen,
  X
} from "lucide-react"

interface DashboardData {
  nextSession: {
    id: string
    date: string
    startTime: string
    endTime: string
    status: string
    class: { id: string; name: string; course: { name: string } }
    stats: { totalStudents: number; markedCount: number }
  } | null
  todayStats: {
    totalSessions: number
    completedSessions: number
    pendingChecklists: number
    absentStudents: number
  }
  weekStats: {
    totalStudents: number
    activeClasses: number
    newLeads: number
  }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData>({
    nextSession: null,
    todayStats: { totalSessions: 0, completedSessions: 0, pendingChecklists: 0, absentStudents: 0 },
    weekStats: { totalStudents: 0, activeClasses: 0, newLeads: 0 }
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch today's sessions
      const today = new Date().toISOString().split('T')[0]
      const sessionsRes = await fetch(`/api/sessions?date=${today}`)
      const sessions = await sessionsRes.json()

      // Find next session (scheduled or in progress)
      const nextSession = Array.isArray(sessions) ? sessions.find((s: any) =>
        s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS'
      ) || null : null

      // Calculate stats
      const totalSessions = Array.isArray(sessions) ? sessions.length : 0
      const completedSessions = Array.isArray(sessions)
        ? sessions.filter((s: any) => s.status === 'COMPLETED').length
        : 0

      setData({
        nextSession,
        todayStats: {
          totalSessions,
          completedSessions,
          pendingChecklists: 0,
          absentStudents: 0,
        },
        weekStats: {
          totalStudents: 0,
          activeClasses: 0,
          newLeads: 0,
        }
      })
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Chào buổi sáng"
    if (hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  const getTimeUntil = (startTime: string) => {
    const now = new Date()
    const [hours, minutes] = startTime.split(':').map(Number)
    const sessionTime = new Date()
    sessionTime.setHours(hours, minutes, 0)

    const diff = sessionTime.getTime() - now.getTime()
    if (diff < 0) return "Đang diễn ra"

    const minsUntil = Math.floor(diff / 60000)
    if (minsUntil < 60) return `${minsUntil} phút nữa`
    const hoursUntil = Math.floor(minsUntil / 60)
    return `${hoursUntil}h ${minsUntil % 60}p nữa`
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 skeleton w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 skeleton rounded-xl" />
          <div className="h-48 skeleton rounded-xl" />
        </div>
        <div className="h-32 skeleton rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 safe-bottom">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title">
            {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'bạn'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      {/* Primary Action Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Next Class Card */}
        {data.nextSession ? (
          <Link href={`/attendance/${data.nextSession.id}`}>
            <Card className="card-interactive h-full border-primary/20 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-primary/15 rounded-xl">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  <SessionStatusPill status={data.nextSession.status} />
                </div>

                <h3 className="text-heading mb-1">{data.nextSession.class.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {data.nextSession.class.course.name}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {data.nextSession.startTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {data.nextSession.stats.totalStudents}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {getTimeUntil(data.nextSession.startTime)}
                  </span>
                </div>

                <Button className="w-full mt-4 gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Bắt đầu điểm danh
                </Button>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Card className="h-full">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div className="p-3 bg-muted rounded-full mb-3">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Không có buổi học nào hôm nay
              </p>
              <Link href="/sessions">
                <Button variant="ghost" size="sm" className="mt-3 gap-1">
                  Xem lịch <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Issues Card */}
        <IssueCard
          issues={[
            { icon: ClipboardCheck, label: "Checklist chưa hoàn thành", count: data.todayStats.pendingChecklists, variant: "warning" },
            { icon: X, label: "Nghỉ không phép", count: data.todayStats.absentStudents, variant: "destructive" },
          ]}
          onClick={() => {}}
        />
      </div>

      {/* Today Overview */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-label font-semibold mb-4">Tổng quan hôm nay</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1.5 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">Buổi học:</span>
              <span className="font-medium">
                {data.todayStats.completedSessions}/{data.todayStats.totalSessions} hoàn thành
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1.5 bg-muted rounded-lg">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground">Checklist:</span>
              <span className="font-medium">
                {data.todayStats.pendingChecklists === 0
                  ? "Đã hoàn thành"
                  : `${data.todayStats.pendingChecklists} đang chờ`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/students">
          <CompactActionCard
            icon={Users}
            label="Học viên"
            value={data.weekStats.totalStudents || "—"}
          />
        </Link>
        <Link href="/classes">
          <CompactActionCard
            icon={GraduationCap}
            label="Lớp học"
            value={data.weekStats.activeClasses || "—"}
          />
        </Link>
        <Link href="/leads">
          <CompactActionCard
            icon={UserPlus}
            label="Leads mới"
            value={data.weekStats.newLeads || "—"}
          />
        </Link>
        <Link href="/homework">
          <CompactActionCard
            icon={BookOpen}
            label="Bài tập"
            value="—"
          />
        </Link>
      </div>

      {/* Quick Links */}
      <div className="grid gap-3">
        <Link href="/students">
          <ActionCard
            icon={Users}
            title="Quản lý học viên"
            subtitle="Xem và quản lý thông tin học viên"
            action="Xem"
          />
        </Link>
        <Link href="/leads">
          <ActionCard
            icon={UserPlus}
            title="Pipeline Leads"
            subtitle="Theo dõi và chuyển đổi khách hàng tiềm năng"
            action="Xem"
          />
        </Link>
      </div>
    </div>
  )
}
