"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2, ChevronDown, ChevronUp, User, Shield, BookOpen, Users, Calculator } from "lucide-react"

const sampleAccounts = [
  { email: "admin@example.com", role: "ADMIN", name: "Admin", icon: Shield, color: "text-red-500" },
  { email: "manager@example.com", role: "MANAGER", name: "Quản lý", icon: User, color: "text-blue-500" },
  { email: "teacher@example.com", role: "TEACHER", name: "Giáo viên", icon: BookOpen, color: "text-green-500" },
  { email: "ta@example.com", role: "TA", name: "Trợ giảng", icon: Users, color: "text-purple-500" },
  { email: "accountant@example.com", role: "ACCOUNTANT", name: "Kế toán", icon: Calculator, color: "text-orange-500" },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSamples, setShowSamples] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">English Center</span>
          </div>
        </div>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-sm text-destructive text-center">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng nhập
          </Button>
        </form>

        {/* Sample Accounts Section */}
        <div className="mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={() => setShowSamples(!showSamples)}
            className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-medium">Tài khoản demo</span>
            {showSamples ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showSamples && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                Mật khẩu chung: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">admin123</code>
              </p>
              <div className="grid gap-2">
                {sampleAccounts.map((account) => {
                  const Icon = account.icon
                  return (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => {
                        setEmail(account.email)
                        setPassword("admin123")
                        setError("")
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 hover:border-border hover:bg-muted/50 transition-all text-left group"
                    >
                      <div className={`p-1.5 rounded-md bg-muted ${account.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{account.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {account.role}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                      </div>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        Click để điền
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
