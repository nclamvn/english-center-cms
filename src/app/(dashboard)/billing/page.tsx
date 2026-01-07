"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Download
} from "lucide-react"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Học phí</h1>
          <p className="text-muted-foreground">
            Tính phí và quản lý công nợ
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Tính phí tháng này
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng phải thu</CardDescription>
            <CardTitle className="text-2xl">0 VND</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Đã thu</CardDescription>
            <CardTitle className="text-2xl text-green-600">0 VND</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Công nợ</CardDescription>
            <CardTitle className="text-2xl text-red-600">0 VND</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tỷ lệ thu</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              0%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="charges">
        <TabsList>
          <TabsTrigger value="charges">Phí phải thu</TabsTrigger>
          <TabsTrigger value="payments">Lịch sử thanh toán</TabsTrigger>
          <TabsTrigger value="plans">Billing Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="charges" className="mt-4">
          <Card>
            <CardContent className="py-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Chưa có phí nào được tính. Chọn kỳ và nhấn "Tính phí" để tạo hóa đơn.
              </p>
              <Button variant="outline">
                Tính phí kỳ hiện tại
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Chưa có giao dịch thanh toán nào
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Billing Plans theo lớp</CardTitle>
              <CardDescription>
                Cấu hình giá mỗi buổi và quy tắc tính phí cho từng lớp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Chưa có billing plan nào
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
