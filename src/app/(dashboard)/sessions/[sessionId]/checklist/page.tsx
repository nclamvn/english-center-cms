"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Check,
  Circle,
  XCircle,
  Save,
  Loader2
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

interface ChecklistItem {
  id: string
  title: string
  order: number
  status: string
  note: string | null
  doneAt: string | null
  user: { id: string; name: string } | null
}

interface SessionData {
  id: string
  date: string
  startTime: string
  endTime: string
  mode: string
  room: string | null
  class: { id: string; name: string }
  checklistItems: ChecklistItem[]
}

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'Chưa làm', icon: Circle, color: 'text-muted-foreground' },
  { value: 'DONE', label: 'Hoàn thành', icon: Check, color: 'text-green-500' },
  { value: 'BLOCKED', label: 'Bị chặn', icon: XCircle, color: 'text-red-500' },
]

export default function ChecklistPage({
  params
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [changedItems, setChangedItems] = useState<Record<string, { status: string; note?: string }>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null)
  const [note, setNote] = useState("")

  useEffect(() => {
    fetchChecklist()
  }, [sessionId])

  const fetchChecklist = async () => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/checklist`)
      const data = await res.json()
      setSession(data)
      setItems(data.checklistItems || [])
    } catch (error) {
      console.error('Error fetching checklist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (item: ChecklistItem, newStatus: string) => {
    if (newStatus === 'BLOCKED') {
      // Open modal for note
      setSelectedItem(item)
      setNote(changedItems[item.id]?.note || item.note || "")
      setModalOpen(true)
    }

    setChangedItems(prev => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        status: newStatus
      }
    }))
  }

  const handleModalSave = () => {
    if (selectedItem) {
      setChangedItems(prev => ({
        ...prev,
        [selectedItem.id]: {
          ...prev[selectedItem.id],
          note
        }
      }))
    }
    setModalOpen(false)
    setSelectedItem(null)
    setNote("")
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const itemsToUpdate = Object.entries(changedItems).map(([id, data]) => ({
        id,
        status: data.status,
        note: data.note
      }))

      const res = await fetch(`/api/sessions/${sessionId}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate })
      })

      if (res.ok) {
        // Refresh data
        fetchChecklist()
        setChangedItems({})
      }
    } catch (error) {
      console.error('Error saving checklist:', error)
    } finally {
      setSaving(false)
    }
  }

  const getItemStatus = (item: ChecklistItem) => {
    return changedItems[item.id]?.status || item.status
  }

  const doneCount = items.filter(item => getItemStatus(item) === 'DONE').length
  const totalCount = items.length
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Checklist trợ giảng</h1>
          <p className="text-sm text-muted-foreground">
            {session?.class.name} | {session && formatDate(session.date)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Tiến độ</span>
            <span className="font-medium">{doneCount}/{totalCount} ({Math.round(progress)}%)</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all",
                progress === 100 ? "bg-green-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filter buttons */}
      <div className="flex gap-2">
        <Badge variant="outline" className="cursor-pointer">
          Tất cả ({totalCount})
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Chưa làm ({items.filter(i => getItemStatus(i) === 'TODO').length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer text-green-600">
          Xong ({doneCount})
        </Badge>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {items.map((item, index) => {
          const currentStatus = getItemStatus(item)
          const StatusIcon = STATUS_OPTIONS.find(s => s.value === currentStatus)?.icon || Circle
          const statusColor = STATUS_OPTIONS.find(s => s.value === currentStatus)?.color

          return (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleStatusChange(item, currentStatus === 'DONE' ? 'TODO' : 'DONE')}
                    className={cn(
                      "mt-0.5 shrink-0 rounded-full p-1 transition-colors",
                      currentStatus === 'DONE' ? "bg-green-100" : "bg-muted"
                    )}
                  >
                    <StatusIcon className={cn("h-5 w-5", statusColor)} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{index + 1}.</span>
                      <p className={cn(
                        "text-sm",
                        currentStatus === 'DONE' && "line-through text-muted-foreground"
                      )}>
                        {item.title}
                      </p>
                    </div>

                    {item.doneAt && item.user && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.user.name} - {new Date(item.doneAt).toLocaleTimeString('vi-VN')}
                      </p>
                    )}

                    {(item.note || changedItems[item.id]?.note) && (
                      <p className="text-xs text-orange-600 mt-1">
                        Ghi chú: {changedItems[item.id]?.note || item.note}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "shrink-0",
                      currentStatus === 'BLOCKED' && "text-red-500"
                    )}
                    onClick={() => handleStatusChange(item, currentStatus === 'BLOCKED' ? 'TODO' : 'BLOCKED')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Fixed Save Button */}
      {Object.keys(changedItems).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t lg:left-64">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lưu thay đổi ({Object.keys(changedItems).length} item)
          </Button>
        </div>
      )}

      {/* Modal for blocked note */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do bị chặn</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Ghi lý do tại sao item này bị chặn..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleModalSave}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
