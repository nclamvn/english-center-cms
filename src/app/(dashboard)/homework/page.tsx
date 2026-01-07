"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  BookOpen,
  FileText,
  CheckCircle,
  Clock
} from "lucide-react"

export default function HomeworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bài tập</h1>
          <p className="text-muted-foreground">
            Quản lý bài tập và chấm điểm
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Giao bài tập
        </Button>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Bài tập đã giao</TabsTrigger>
          <TabsTrigger value="submissions">Bài nộp</TabsTrigger>
          <TabsTrigger value="templates">Mẫu bài tập</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4">
          <Card>
            <CardContent className="py-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có bài tập nào được giao</p>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Giao bài tập đầu tiên
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Chờ chấm</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  0
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Đã chấm</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  0
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Chưa nộp</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  0
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Chưa có bài nộp nào
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Quản lý mẫu bài tập và rubric chấm điểm</p>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Tạo mẫu bài tập
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
