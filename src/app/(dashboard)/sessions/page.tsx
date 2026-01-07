"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Clock,
  MapPin,
  Users,
  Calendar,
  ClipboardCheck,
  Loader2
} from "lucide-react"
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
  }
  teacher: { id: string; name: string } | null
  stats: {
    totalStudents: number
    markedCount: number
  }
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchSessions()
  }, [selectedDate])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions?date=${selectedDate}`)
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Badge variant="secondary">Sắp diễn ra</Badge>
      case 'IN_PROGRESS': return <Badge variant="warning">Đang học</Badge>
      case 'COMPLETED': return <Badge variant="success">Đã kết thúc</Badge>
      case 'CANCELLED': return <Badge variant="destructive">Đã hủy</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buổi học</h1>
          <p className="text-muted-foreground">Quản lý lịch buổi học</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo buổi học
        </Button>
      </div>

      {/* Date selector */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
        >
          Hôm nay
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Không có buổi học nào trong ngày {formatDate(selectedDate)}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{session.class.name}</h3>
                      {getStatusBadge(session.status)}
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
                        {session.stats.markedCount}/{session.stats.totalStudents}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/attendance/${session.id}`}>
                      <Button size="sm" variant="outline">
                        <ClipboardCheck className="h-4 w-4 mr-1" />
                        Điểm danh
                      </Button>
                    </Link>
                    <Link href={`/sessions/${session.id}/checklist`}>
                      <Button size="sm" variant="outline">
                        Checklist
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
