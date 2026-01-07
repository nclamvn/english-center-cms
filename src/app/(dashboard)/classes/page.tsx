"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Users,
  Calendar,
  MapPin,
  ChevronRight,
  GraduationCap,
  Loader2
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Class {
  id: string
  name: string
  startDate: string
  endDate: string | null
  status: string
  course: {
    id: string
    name: string
    level: string | null
  }
  branch: {
    id: string
    name: string
  }
  _count?: {
    enrollments: number
    sessions: number
  }
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes')
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success">Đang mở</Badge>
      case 'COMPLETED':
        return <Badge variant="secondary">Đã kết thúc</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lớp học</h1>
          <p className="text-muted-foreground">
            Quản lý các lớp học
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo lớp mới
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Chưa có lớp học nào</p>
            <Button variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Tạo lớp đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Link key={cls.id} href={`/classes/${cls.id}`}>
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{cls.name}</h3>
                    {getStatusBadge(cls.status)}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {cls.course.name}
                    {cls.course.level && ` - ${cls.course.level}`}
                  </p>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(cls.startDate)}
                        {cls.endDate && ` - ${formatDate(cls.endDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{cls.branch.name}</span>
                    </div>
                    {cls._count && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        <span>{cls._count.enrollments} học viên</span>
                      </div>
                    )}
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
