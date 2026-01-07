import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  Shield,
  ClipboardList,
  BookOpen,
  Settings2,
  Webhook
} from "lucide-react"
import Link from "next/link"

const settingsItems = [
  {
    title: "Cơ sở",
    description: "Quản lý các cơ sở/chi nhánh",
    icon: Building2,
    href: "/settings/branches"
  },
  {
    title: "Nhân sự",
    description: "Quản lý tài khoản nhân viên",
    icon: Users,
    href: "/settings/users"
  },
  {
    title: "Phân quyền",
    description: "Cấu hình roles và permissions",
    icon: Shield,
    href: "/settings/roles"
  },
  {
    title: "Checklist Templates",
    description: "Mẫu checklist cho trợ giảng",
    icon: ClipboardList,
    href: "/settings/checklists"
  },
  {
    title: "Homework Templates",
    description: "Mẫu bài tập và rubric chấm điểm",
    icon: BookOpen,
    href: "/settings/homework"
  },
  {
    title: "Attendance Rules",
    description: "Quy tắc tính điểm danh và học phí",
    icon: Settings2,
    href: "/settings/attendance-rules"
  },
  {
    title: "API & Webhooks",
    description: "API keys và webhook endpoints",
    icon: Webhook,
    href: "/settings/api"
  }
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground">
          Cấu hình hệ thống và quản lý các thiết lập
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
