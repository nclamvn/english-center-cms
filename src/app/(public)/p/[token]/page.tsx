import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ClipboardCheck, BookOpen, Calendar, TrendingUp } from "lucide-react"
import { formatDate } from "@/lib/utils"

async function getStudentByToken(token: string) {
  const previewToken = await prisma.parentPreviewToken.findUnique({
    where: { token },
    include: {
      student: {
        include: {
          enrollments: {
            where: { status: 'ACTIVE' },
            include: {
              class: {
                include: { course: true }
              }
            }
          },
          attendances: {
            orderBy: { session: { date: 'desc' } },
            take: 20,
            include: {
              session: {
                include: { class: true }
              }
            }
          },
          submissions: {
            orderBy: { submittedAt: 'desc' },
            take: 10,
            include: {
              assignment: {
                include: { template: true }
              },
              grading: true
            }
          }
        }
      }
    }
  })

  if (!previewToken) return null
  if (previewToken.status !== 'ACTIVE') return null
  if (new Date(previewToken.expiresAt) < new Date()) return null

  return previewToken.student
}

export default async function ParentPreviewPage({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const student = await getStudentByToken(token)

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <p className="text-lg font-medium mb-2">Link không hợp lệ</p>
            <p className="text-sm text-muted-foreground">
              Link xem này đã hết hạn hoặc không tồn tại. Vui lòng liên hệ trung tâm để nhận link mới.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate stats
  const totalSessions = student.attendances.length
  const presentSessions = student.attendances.filter(a =>
    ['PRESENT', 'LATE', 'ONLINE'].includes(a.status)
  ).length
  const attendanceRate = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0

  const getAttendanceBadge = (status: string) => {
    switch (status) {
      case 'PRESENT': return <Badge className="bg-green-500">Có mặt</Badge>
      case 'LATE': return <Badge className="bg-yellow-500">Đi trễ</Badge>
      case 'ABSENT_EXCUSED': return <Badge className="bg-orange-500">Nghỉ phép</Badge>
      case 'ABSENT_UNEXCUSED': return <Badge className="bg-red-500">Nghỉ KP</Badge>
      case 'MAKEUP': return <Badge className="bg-purple-500">Học bù</Badge>
      case 'ONLINE': return <Badge className="bg-blue-500">Online</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-muted/50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {student.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold">{student.fullName}</h1>
                {student.enrollments.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {student.enrollments.map(e => e.class.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <ClipboardCheck className="h-4 w-4" />
                <span className="text-xs">Chuyên cần</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{attendanceRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Buổi đã học</span>
              </div>
              <p className="text-2xl font-bold">{totalSessions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Classes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Lớp đang học
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.enrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa đăng ký lớp</p>
            ) : (
              <div className="space-y-2">
                {student.enrollments.map(e => (
                  <div key={e.id} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">{e.class.name}</p>
                    <p className="text-xs text-muted-foreground">{e.class.course.name}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Chuyên cần gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.attendances.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
            ) : (
              <div className="space-y-2">
                {student.attendances.slice(0, 10).map(a => (
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

        {/* Homework */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Bài tập
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có bài tập</p>
            ) : (
              <div className="space-y-2">
                {student.submissions.map(s => (
                  <div key={s.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{s.assignment.template.title}</p>
                      {s.grading ? (
                        <Badge className="bg-green-500">{s.grading.totalScore} điểm</Badge>
                      ) : (
                        <Badge variant="warning">Chưa chấm</Badge>
                      )}
                    </div>
                    {s.grading?.feedback && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Nhận xét: {s.grading.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground py-4">
          English Center CMS - Powered by Vibecode
        </p>
      </div>
    </div>
  )
}
