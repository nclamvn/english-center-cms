"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  Users,
  Link as LinkIcon,
  Copy,
  Check,
  Loader2
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface StudentDetail {
  id: string
  fullName: string
  dob: string | null
  gender: string | null
  phone: string | null
  email: string | null
  status: string
  notes: string | null
  enrollments: {
    id: string
    status: string
    class: {
      id: string
      name: string
      course: { name: string }
      branch: { name: string }
    }
  }[]
  studentParents: {
    parent: {
      id: string
      fullName: string
      phone: string | null
      email: string | null
    }
    relationship: string | null
  }[]
  attendances: {
    id: string
    status: string
    session: {
      date: string
      class: { name: string }
    }
  }[]
  submissions: {
    id: string
    status: string
    assignment: {
      template: { title: string }
    }
    grading: {
      totalScore: number
      feedback: string | null
    } | null
  }[]
  previewTokens: {
    token: string
    expiresAt: string
  }[]
}

export default function StudentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false)
  const [generatingToken, setGeneratingToken] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/students/${id}`)
      if (res.ok) {
        const data = await res.json()
        setStudent(data)
        if (data.previewTokens?.[0]) {
          setPreviewUrl(`${window.location.origin}/p/${data.previewTokens[0].token}`)
        }
      }
    } catch (error) {
      console.error('Error fetching student:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePreviewToken = async () => {
    setGeneratingToken(true)
    try {
      const res = await fetch(`/api/students/${id}/preview-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresInDays: 30 })
      })
      if (res.ok) {
        const data = await res.json()
        setPreviewUrl(`${window.location.origin}${data.previewUrl}`)
        setTokenDialogOpen(true)
      }
    } catch (error) {
      console.error('Error generating token:', error)
    } finally {
      setGeneratingToken(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(previewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success">Đang học</Badge>
      case 'PAUSED': return <Badge variant="warning">Tạm nghỉ</Badge>
      case 'QUIT': return <Badge variant="secondary">Đã nghỉ</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'PRESENT': return <Badge variant="success">Có mặt</Badge>
      case 'LATE': return <Badge variant="warning">Đi trễ</Badge>
      case 'ABSENT_EXCUSED': return <Badge variant="info">Nghỉ phép</Badge>
      case 'ABSENT_UNEXCUSED': return <Badge variant="destructive">Nghỉ KP</Badge>
      case 'MAKEUP': return <Badge className="bg-purple-500">Học bù</Badge>
      case 'ONLINE': return <Badge className="bg-blue-500">Online</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không tìm thấy học viên</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{student.fullName}</h1>
            {getStatusBadge(student.status)}
          </div>
        </div>
        <Button variant="outline" onClick={generatePreviewToken} disabled={generatingToken}>
          {generatingToken ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LinkIcon className="mr-2 h-4 w-4" />
          )}
          Link phụ huynh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="attendance">Chuyên cần</TabsTrigger>
          <TabsTrigger value="homework">Bài tập</TabsTrigger>
          <TabsTrigger value="billing">Học phí</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {student.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {student.phone}
                </div>
              )}
              {student.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {student.email}
                </div>
              )}
              {student.dob && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(student.dob)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Lớp đang học
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa đăng ký lớp nào</p>
              ) : (
                <div className="space-y-2">
                  {student.enrollments.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{e.class.name}</p>
                        <p className="text-xs text-muted-foreground">{e.class.course.name}</p>
                      </div>
                      <Badge variant={e.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {e.status === 'ACTIVE' ? 'Đang học' : e.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Phụ huynh
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.studentParents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có thông tin phụ huynh</p>
              ) : (
                <div className="space-y-2">
                  {student.studentParents.map((sp, idx) => (
                    <div key={idx} className="p-2 bg-muted rounded-lg">
                      <p className="font-medium">{sp.parent.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {sp.relationship} | {sp.parent.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Lịch sử điểm danh
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.attendances.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có dữ liệu điểm danh</p>
              ) : (
                <div className="space-y-2">
                  {student.attendances.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{formatDate(a.session.date)}</p>
                        <p className="text-xs text-muted-foreground">{a.session.class.name}</p>
                      </div>
                      {getAttendanceBadge(a.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Bài tập đã nộp
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có bài tập nào</p>
              ) : (
                <div className="space-y-2">
                  {student.submissions.map(s => (
                    <div key={s.id} className="p-2 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{s.assignment.template.title}</p>
                        <Badge variant={s.grading ? 'success' : 'warning'}>
                          {s.grading ? `${s.grading.totalScore} điểm` : 'Chưa chấm'}
                        </Badge>
                      </div>
                      {s.grading?.feedback && (
                        <p className="text-xs text-muted-foreground mt-1">{s.grading.feedback}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4 mt-4">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Tính năng đang phát triển
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Token Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link xem cho phụ huynh</DialogTitle>
            <DialogDescription>
              Chia sẻ link này cho phụ huynh để theo dõi tiến độ học tập của con. Link sẽ hết hạn sau 30 ngày.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <input
              type="text"
              value={previewUrl}
              readOnly
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setTokenDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
