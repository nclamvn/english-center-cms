"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface Session {
  id: string
  date: string
  startTime: string
  endTime: string
  mode: string
  room: string | null
  status: string
  class: {
    id: string
    name: string
    course: { name: string }
    branch: { name: string }
  }
  teacher: { id: string; name: string } | null
  stats: {
    totalStudents: number
    markedCount: number
    presentCount: number
    attendanceRate: number
  }
}

export default function AttendancePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchSessions()
  }, [selectedDate])

  const fetchSessions = async () => {
    try {
      const res = await fetch(`/api/sessions?date=${selectedDate}`)
      const data = await res.json()
      setSessions(data)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'secondary'
      case 'IN_PROGRESS': return 'warning'
      case 'COMPLETED': return 'success'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'Sắp diễn ra'
      case 'IN_PROGRESS': return 'Đang học'
      case 'COMPLETED': return 'Đã kết thúc'
      case 'CANCELLED': return 'Đã hủy'
      default: return status
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Điểm danh</h1>
        <p className="text-muted-foreground">
          Chọn buổi học để điểm danh
        </p>
      </div>

      {/* Date selector */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
        >
          Hôm nay
        </Button>
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Không có buổi học nào trong ngày {formatDate(selectedDate)}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link key={session.id} href={`/attendance/${session.id}`}>
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{session.class.name}</h3>
                        <Badge variant={getStatusColor(session.status) as any}>
                          {getStatusLabel(session.status)}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {session.class.course.name}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {session.startTime} - {session.endTime}
                        </div>
                        {session.room && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {session.room}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {session.stats.markedCount}/{session.stats.totalStudents} đã điểm danh
                        </div>
                      </div>

                      {session.stats.totalStudents > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Tỷ lệ có mặt</span>
                            <span>{session.stats.attendanceRate}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${session.stats.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
