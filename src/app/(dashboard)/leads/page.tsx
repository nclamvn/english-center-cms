"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Phone,
  Mail,
  Calendar,
  User,
  ChevronRight,
  Loader2
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Lead {
  id: string
  parentName: string
  phone: string
  studentName: string | null
  email: string | null
  note: string | null
  source: string | null
  stage: string
  approvalStatus: string
  createdAt: string
  assignee: { id: string; name: string } | null
  stageHistory: {
    fromStage: string | null
    toStage: string
    changedAt: string
    changer: { name: string } | null
  }[]
}

const STAGES = [
  { value: 'NEW', label: 'Mới', color: 'bg-gray-500' },
  { value: 'CONTACTED', label: 'Đã liên hệ', color: 'bg-blue-500' },
  { value: 'TEST_SCHEDULED', label: 'Hẹn test', color: 'bg-yellow-500' },
  { value: 'TEST_DONE', label: 'Đã test', color: 'bg-orange-500' },
  { value: 'OFFER_SENT', label: 'Đã gửi offer', color: 'bg-purple-500' },
  { value: 'WON', label: 'Thành công', color: 'bg-green-500' },
  { value: 'LOST', label: 'Thất bại', color: 'bg-red-500' },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [stageFilter, setStageFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [stageChangeOpen, setStageChangeOpen] = useState(false)
  const [newStage, setNewStage] = useState("")
  const [stageNote, setStageNote] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [stageFilter])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (stageFilter !== 'all') params.set('stage', stageFilter)
      const res = await fetch(`/api/leads?${params}`)
      const data = await res.json()
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStageChange = async () => {
    if (!selectedLead || !newStage) return

    setUpdating(true)
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage, note: stageNote })
      })

      if (res.ok) {
        setStageChangeOpen(false)
        setDetailOpen(false)
        fetchLeads()
      }
    } catch (error) {
      console.error('Error updating stage:', error)
    } finally {
      setUpdating(false)
      setNewStage("")
      setStageNote("")
    }
  }

  const getStageBadge = (stage: string) => {
    const s = STAGES.find(x => x.value === stage)
    return (
      <Badge className={`${s?.color || 'bg-gray-500'} text-white`}>
        {s?.label || stage}
      </Badge>
    )
  }

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="success">Đã duyệt</Badge>
      case 'REJECTED': return <Badge variant="destructive">Từ chối</Badge>
      default: return <Badge variant="warning">Chờ duyệt</Badge>
    }
  }

  // Group leads by stage for Kanban-like view
  const leadsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.value] = leads.filter(l => l.stage === stage.value)
    return acc
  }, {} as Record<string, Lead[]>)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Quản lý leads và pipeline</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm lead
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {STAGES.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline View */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto">
          {STAGES.map(stage => (
            <div key={stage.value} className="min-w-[250px]">
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${stage.color} text-white`}>{stage.label}</Badge>
                <span className="text-sm text-muted-foreground">
                  {leadsByStage[stage.value]?.length || 0}
                </span>
              </div>
              <div className="space-y-2">
                {leadsByStage[stage.value]?.map(lead => (
                  <Card
                    key={lead.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => {
                      setSelectedLead(lead)
                      setDetailOpen(true)
                    }}
                  >
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm truncate">{lead.parentName}</h3>
                      {lead.studentName && (
                        <p className="text-xs text-muted-foreground truncate">
                          HS: {lead.studentName}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {getApprovalBadge(lead.approvalStatus)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(lead.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lead Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLead.parentName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStageBadge(selectedLead.stage)}
                  {getApprovalBadge(selectedLead.approvalStatus)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selectedLead.phone}
                  </div>
                  {selectedLead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedLead.email}
                    </div>
                  )}
                  {selectedLead.studentName && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {selectedLead.studentName}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(selectedLead.createdAt)}
                  </div>
                </div>

                {selectedLead.note && (
                  <div>
                    <p className="text-sm font-medium mb-1">Ghi chú</p>
                    <p className="text-sm text-muted-foreground">{selectedLead.note}</p>
                  </div>
                )}

                {/* Stage History */}
                <div>
                  <p className="text-sm font-medium mb-2">Lịch sử xử lý</p>
                  <div className="space-y-2">
                    {selectedLead.stageHistory.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                          {new Date(h.changedAt).toLocaleString('vi-VN')}
                        </span>
                        {h.fromStage && (
                          <>
                            <span>{STAGES.find(s => s.value === h.fromStage)?.label}</span>
                            <ChevronRight className="h-3 w-3" />
                          </>
                        )}
                        <span className="font-medium">
                          {STAGES.find(s => s.value === h.toStage)?.label}
                        </span>
                        {h.changer && (
                          <span className="text-muted-foreground">({h.changer.name})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewStage(selectedLead.stage)
                    setStageChangeOpen(true)
                  }}
                >
                  Chuyển trạng thái
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Stage Change Dialog */}
      <Dialog open={stageChangeOpen} onOpenChange={setStageChangeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chuyển trạng thái lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={newStage} onValueChange={setNewStage}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái mới" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Ghi chú (không bắt buộc)"
              value={stageNote}
              onChange={(e) => setStageNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStageChangeOpen(false)}>Hủy</Button>
            <Button onClick={handleStageChange} disabled={updating || !newStage}>
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
