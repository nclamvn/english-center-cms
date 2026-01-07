"use client"

import { useState, useEffect, use, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StatusPill, AttendanceStatus } from "@/components/ui/status-pill"
import { BottomSheet, SheetAction } from "@/components/ui/bottom-sheet"
import { FloatingActionBar } from "@/components/ui/floating-action-bar"
import {
  ArrowLeft,
  Check,
  Clock,
  X,
  RotateCcw,
  Monitor,
  Search,
  Loader2,
  Lock,
  History,
  Unlock
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

interface Student {
  id: string
  fullName: string
  phone: string | null
  avatar: string | null
}

interface Attendance {
  id?: string
  studentId: string
  status: AttendanceStatus
  lateMinutes: number | null
  note: string | null
}

interface SessionData {
  id: string
  date: string
  startTime: string
  endTime: string
  mode: string
  room: string | null
  status: string
  isLocked: boolean
  lockedAt: string | null
  lockReason: string | null
  shouldAutoLock: boolean
  class: {
    id: string
    name: string
  }
}

interface AttendanceLogEntry {
  id: string
  studentName: string
  action: string
  previousStatus: string | null
  newStatus: string
  changedBy: string
  changedAt: string
}

const ATTENDANCE_OPTIONS = [
  { value: 'PRESENT' as AttendanceStatus, label: 'Có mặt', icon: Check },
  { value: 'LATE' as AttendanceStatus, label: 'Đi trễ', icon: Clock },
  { value: 'ABSENT_EXCUSED' as AttendanceStatus, label: 'Nghỉ phép', icon: X },
  { value: 'ABSENT_UNEXCUSED' as AttendanceStatus, label: 'Nghỉ KP', icon: X },
  { value: 'MAKEUP' as AttendanceStatus, label: 'Học bù', icon: RotateCcw },
  { value: 'ONLINE' as AttendanceStatus, label: 'Online', icon: Monitor },
]

const LATE_CHIPS = [5, 10, 15]

export default function AttendanceSessionPage({
  params
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [students, setStudents] = useState<{ student: Student; attendance: Attendance | null }[]>([])
  const [attendanceState, setAttendanceState] = useState<Record<string, Attendance>>({})
  const [originalState, setOriginalState] = useState<Record<string, Attendance>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Bottom sheet state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [tempStatus, setTempStatus] = useState<AttendanceStatus | null>(null)
  const [lateMinutes, setLateMinutes] = useState<number | null>(null)
  const [note, setNote] = useState("")

  // History sheet state
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyLogs, setHistoryLogs] = useState<AttendanceLogEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Unlock modal state
  const [unlockOpen, setUnlockOpen] = useState(false)
  const [unlockReason, setUnlockReason] = useState("")
  const [unlocking, setUnlocking] = useState(false)

  useEffect(() => {
    fetchAttendance()
  }, [sessionId])

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/attendance`)
      const data = await res.json()
      setSession(data.session)
      setStudents(data.students)

      // Initialize attendance state from existing data
      const initialState: Record<string, Attendance> = {}
      data.students.forEach((s: any) => {
        if (s.attendance) {
          initialState[s.student.id] = {
            studentId: s.student.id,
            status: s.attendance.status as AttendanceStatus,
            lateMinutes: s.attendance.lateMinutes,
            note: s.attendance.note
          }
        }
      })
      setAttendanceState(initialState)
      setOriginalState(initialState)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/attendance/logs`)
      const logs = await res.json()
      setHistoryLogs(logs)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleUnlock = async () => {
    if (!unlockReason.trim()) return
    setUnlocking(true)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlock', reason: unlockReason })
      })
      if (res.ok) {
        setUnlockOpen(false)
        setUnlockReason("")
        fetchAttendance() // Refresh data
      }
    } catch (error) {
      console.error('Error unlocking:', error)
    } finally {
      setUnlocking(false)
    }
  }

  // Quick toggle: Tap = PRESENT ↔ PENDING
  const handleTap = (student: Student) => {
    if (session?.isLocked) {
      setError("Buổi học đã bị khóa. Không thể chỉnh sửa.")
      setTimeout(() => setError(null), 3000)
      return
    }

    const currentStatus = attendanceState[student.id]?.status

    if (!currentStatus || currentStatus === 'PENDING') {
      setAttendanceState(prev => ({
        ...prev,
        [student.id]: {
          studentId: student.id,
          status: 'PRESENT',
          lateMinutes: null,
          note: null
        }
      }))
    } else if (currentStatus === 'PRESENT') {
      setAttendanceState(prev => {
        const newState = { ...prev }
        delete newState[student.id]
        return newState
      })
    } else {
      openStatusSheet(student)
    }
  }

  const openStatusSheet = (student: Student) => {
    if (session?.isLocked) {
      setError("Buổi học đã bị khóa. Không thể chỉnh sửa.")
      setTimeout(() => setError(null), 3000)
      return
    }

    setSelectedStudent(student)
    const current = attendanceState[student.id]
    setTempStatus(current?.status || null)
    setLateMinutes(current?.lateMinutes || null)
    setNote(current?.note || "")
    setSheetOpen(true)
  }

  const handleStatusSelect = (status: AttendanceStatus) => {
    setTempStatus(status)
    if (status !== 'LATE') {
      setLateMinutes(null)
    }
  }

  const handleSheetConfirm = () => {
    if (selectedStudent && tempStatus) {
      setAttendanceState(prev => ({
        ...prev,
        [selectedStudent.id]: {
          studentId: selectedStudent.id,
          status: tempStatus,
          lateMinutes: tempStatus === 'LATE' ? lateMinutes : null,
          note: note || null
        }
      }))
    }
    closeSheet()
  }

  const closeSheet = () => {
    setSheetOpen(false)
    setSelectedStudent(null)
    setTempStatus(null)
    setLateMinutes(null)
    setNote("")
  }

  const handleUndo = () => {
    setAttendanceState(originalState)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const attendances = Object.values(attendanceState)
      const res = await fetch(`/api/sessions/${sessionId}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendances })
      })

      if (res.ok) {
        router.push('/attendance')
      } else {
        const data = await res.json()
        setError(data.error || 'Có lỗi xảy ra')
        setTimeout(() => setError(null), 5000)
      }
    } catch (error) {
      console.error('Error saving attendance:', error)
      setError('Không thể lưu điểm danh')
      setTimeout(() => setError(null), 5000)
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(s =>
    s.student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const markedCount = Object.keys(attendanceState).length
  const totalCount = students.length
  const hasChanges = JSON.stringify(attendanceState) !== JSON.stringify(originalState)

  const issueCount = Object.values(attendanceState).filter(
    a => a.status === 'ABSENT_UNEXCUSED' || a.status === 'BLOCKED'
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-28 safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-title truncate">{session?.class.name}</h1>
            {session?.isLocked && (
              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
          <p className="text-caption text-muted-foreground">
            {session && formatDate(session.date)} • {session?.startTime}
            {session?.room && ` • ${session.room}`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            fetchHistory()
            setHistoryOpen(true)
          }}
        >
          <History className="h-5 w-5" />
        </Button>
      </div>

      {/* Lock Warning Banner */}
      {session?.isLocked && (
        <Card className="border-status-late/30 bg-status-late/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-status-late shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Buổi học đã bị khóa</p>
                <p className="text-caption text-muted-foreground">
                  {session.lockReason || 'Không thể chỉnh sửa điểm danh'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUnlockOpen(true)}
                className="shrink-0"
              >
                <Unlock className="h-4 w-4 mr-1" />
                Mở khóa
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Toast */}
      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-3">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Tiến độ điểm danh</span>
            <span className="font-semibold">{markedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (markedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm học viên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Gesture hint */}
      {!session?.isLocked && (
        <p className="text-caption text-muted-foreground text-center">
          Chạm = Có mặt • Giữ = Chọn trạng thái
        </p>
      )}

      {/* Student List */}
      <div className="space-y-2">
        {filteredStudents.map(({ student }) => (
          <StudentCard
            key={student.id}
            student={student}
            attendance={attendanceState[student.id]}
            onTap={() => handleTap(student)}
            onLongPress={() => openStatusSheet(student)}
            disabled={session?.isLocked}
          />
        ))}
      </div>

      {/* Status Selection Sheet */}
      <BottomSheet
        open={sheetOpen}
        onClose={closeSheet}
        title={selectedStudent?.fullName}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {ATTENDANCE_OPTIONS.map((option) => (
              <SheetAction
                key={option.value}
                icon={option.icon}
                label={option.label}
                selected={tempStatus === option.value}
                onClick={() => handleStatusSelect(option.value)}
              />
            ))}
          </div>

          {tempStatus === 'LATE' && (
            <div className="space-y-2">
              <label className="text-label text-muted-foreground">Số phút trễ</label>
              <div className="flex gap-2">
                {LATE_CHIPS.map((min) => (
                  <button
                    key={min}
                    onClick={() => setLateMinutes(min)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                      lateMinutes === min
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    +{min} phút
                  </button>
                ))}
              </div>
              <Input
                type="number"
                placeholder="Hoặc nhập số phút..."
                value={lateMinutes || ""}
                onChange={(e) => setLateMinutes(e.target.value ? parseInt(e.target.value) : null)}
                className="mt-2"
              />
            </div>
          )}

          {(tempStatus === 'ABSENT_EXCUSED' || tempStatus === 'ABSENT_UNEXCUSED' || tempStatus === 'MAKEUP') && (
            <div className="space-y-2">
              <label className="text-label text-muted-foreground">Ghi chú</label>
              <Textarea
                placeholder="Lý do nghỉ, ghi chú..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleSheetConfirm}
            disabled={!tempStatus}
          >
            Xác nhận
          </Button>
        </div>
      </BottomSheet>

      {/* History Sheet */}
      <BottomSheet
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Lịch sử thay đổi"
      >
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : historyLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có lịch sử thay đổi
            </p>
          ) : (
            historyLogs.map((log) => (
              <div key={log.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{log.studentName}</span>
                  <span className="text-caption text-muted-foreground">
                    {new Date(log.changedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-caption">
                  {log.previousStatus && (
                    <>
                      <StatusPill status={log.previousStatus as AttendanceStatus} size="sm" />
                      <span className="text-muted-foreground">→</span>
                    </>
                  )}
                  <StatusPill status={log.newStatus as AttendanceStatus} size="sm" />
                </div>
                <p className="text-caption text-muted-foreground mt-1">
                  bởi {log.changedBy}
                </p>
              </div>
            ))
          )}
        </div>
      </BottomSheet>

      {/* Unlock Sheet */}
      <BottomSheet
        open={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        title="Mở khóa buổi học"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Nhập lý do mở khóa để tiếp tục chỉnh sửa điểm danh.
            Hành động này sẽ được ghi lại.
          </p>
          <Textarea
            placeholder="Lý do mở khóa..."
            value={unlockReason}
            onChange={(e) => setUnlockReason(e.target.value)}
            rows={3}
          />
          <Button
            className="w-full"
            size="lg"
            onClick={handleUnlock}
            disabled={!unlockReason.trim() || unlocking}
          >
            {unlocking ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Unlock className="h-4 w-4 mr-2" />
            )}
            Xác nhận mở khóa
          </Button>
        </div>
      </BottomSheet>

      {/* Floating Action Bar */}
      {!session?.isLocked && (
        <FloatingActionBar
          visible={hasChanges || markedCount > 0}
          onSave={handleSave}
          onUndo={hasChanges ? handleUndo : undefined}
          saving={saving}
          saveLabel="Lưu điểm danh"
          progress={{ current: markedCount, total: totalCount }}
          issueCount={issueCount > 0 ? issueCount : undefined}
        />
      )}
    </div>
  )
}

// Student Card with gesture support
interface StudentCardProps {
  student: Student
  attendance?: Attendance
  onTap: () => void
  onLongPress: () => void
  disabled?: boolean
}

function StudentCard({ student, attendance, onTap, onLongPress, disabled }: StudentCardProps) {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
    setIsPressed(true)

    longPressTimer.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
    }, 400)
  }, [onLongPress, disabled])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled) return
    setIsPressed(false)

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
      onTap()
    }
  }, [onTap, disabled])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPos.current) return

    const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.current.x)
    const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.current.y)

    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      setIsPressed(false)
    }
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    onTap()
  }, [onTap, disabled])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    onLongPress()
  }, [onLongPress, disabled])

  const status = attendance?.status || 'PENDING'
  const isMarked = attendance && status !== 'PENDING'

  return (
    <div
      className={cn(
        "p-4 bg-card rounded-xl border border-border",
        "transition-all duration-150 select-none",
        "touch-target",
        !disabled && "cursor-pointer",
        disabled && "opacity-60",
        isPressed && "scale-[0.98] bg-muted",
        isMarked && "border-primary/30"
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-11 w-11 rounded-full flex items-center justify-center font-semibold text-lg",
          "transition-colors duration-150",
          isMarked
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground"
        )}>
          {student.fullName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-label font-medium truncate">{student.fullName}</h3>
          {attendance?.lateMinutes && (
            <p className="text-caption text-status-late">
              Trễ {attendance.lateMinutes} phút
            </p>
          )}
          {attendance?.note && (
            <p className="text-caption text-muted-foreground truncate">
              {attendance.note}
            </p>
          )}
        </div>

        <StatusPill status={status} size="md" />
      </div>
    </div>
  )
}
