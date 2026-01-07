"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  ClipboardCheck,
  CalendarCheck,
  FileText,
  Gauge,
  Lock,
  Workflow,
  LineChart,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      <span className="h-1.5 w-1.5 rounded-full bg-[#6D6AFF]" />
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  href = "#demo",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D6AFF] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(109,106,255,0.35)] ring-1 ring-white/10 transition hover:translate-y-[-1px] hover:bg-[#7D7AFF] active:translate-y-0"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}

function SecondaryButton({
  children,
  href = "#features",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/8 hover:translate-y-[-1px] active:translate-y-0"
    >
      {children}
      <Sparkles className="h-4 w-4 text-white/70" />
    </a>
  );
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(109,106,255,0.22),transparent_55%),radial-gradient(700px_circle_at_85%_15%,rgba(34,197,94,0.14),transparent_55%),radial-gradient(700px_circle_at_70%_90%,rgba(6,182,212,0.12),transparent_55%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-white">{value}</div>
        <div className="text-xs text-white/60">{label}</div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          {icon}
        </div>
        <div>
          <div className="text-base font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-white/70">{desc}</div>
        </div>
      </div>
    </GlassCard>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="text-xs font-semibold tracking-widest text-white/60">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto my-14 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(109,106,255,0.22),transparent_50%),radial-gradient(900px_circle_at_90%_10%,rgba(34,197,94,0.12),transparent_55%),radial-gradient(900px_circle_at_70%_95%,rgba(6,182,212,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_22%,transparent_78%,rgba(255,255,255,0.03))]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      {/* Top nav */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <Sparkles className="h-5 w-5 text-[#6D6AFF]" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">English Center OS</div>
              <div className="text-xs text-white/60">Attendance • SOP • Parent preview</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a className="hover:text-white" href="#features">
              Tính năng
            </a>
            <a className="hover:text-white" href="#workflows">
              Vận hành
            </a>
            <a className="hover:text-white" href="#security">
              Bảo mật
            </a>
            <a className="hover:text-white" href="#pricing">
              Gói dịch vụ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8 md:inline-flex"
            >
              Đăng nhập
            </Link>
            <PrimaryButton href="#demo">Đăng ký trải nghiệm</PrimaryButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <div>
              <Badge>Operating System vận hành trung tâm anh ngữ • 2026-ready</Badge>
              <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
                Quản lý lớp học{" "}
                <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  nhanh – chuẩn – minh bạch
                </span>
                .
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                Mobile-first cho <b>điểm danh</b> & <b>checklist trợ giảng</b>, theo dõi{" "}
                <b>bài tập</b>, <b>tính học phí theo buổi</b>, phụ huynh có{" "}
                <b>preview link</b> xem tiến độ bất kỳ lúc nào.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton href="#demo">Nhận link demo</PrimaryButton>
                <SecondaryButton href="#features">Xem điểm khác biệt</SecondaryButton>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Stat
                  label="Điểm danh < 30s / lớp"
                  value="Mobile-first"
                  icon={<Gauge className="h-5 w-5 text-white/80" />}
                />
                <Stat
                  label="Checklist có gate & SLA"
                  value="SOP Engine"
                  icon={<ClipboardCheck className="h-5 w-5 text-white/80" />}
                />
                <Stat
                  label="Token + expiry"
                  value="Parent Preview"
                  icon={<ShieldCheck className="h-5 w-5 text-white/80" />}
                />
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-white/60">
                <div className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Audit log • RBAC
                </div>
                <div className="inline-flex items-center gap-2">
                  <Workflow className="h-4 w-4" /> API-ready • Webhooks
                </div>
              </div>
            </div>

            {/* "Product preview" mock */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fade}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <GlassCard className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Live session • A2 (18:00)</div>
                  <span className="rounded-full bg-[#22C55E]/15 px-3 py-1 text-xs font-semibold text-[#22C55E] ring-1 ring-white/10">
                    12/25 marked
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  {[
                    { name: "Nguyễn An", status: "Present", color: "text-[#22C55E]", bg: "bg-[#22C55E]/12" },
                    { name: "Trần Minh", status: "Late 5'", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/12" },
                    { name: "Lê Vy", status: "Online", color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/12" },
                    { name: "Phạm Nam", status: "Absent KP", color: "text-[#EF4444]", bg: "bg-[#EF4444]/12" },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-white/5 ring-1 ring-white/10" />
                        <div>
                          <div className="text-sm font-semibold">{s.name}</div>
                          <div className="text-xs text-white/60">Tap / swipe để đổi trạng thái</div>
                        </div>
                      </div>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-white/10", s.bg, s.color)}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="text-xs text-white/70">
                    Floating action bar • <span className="text-white">Unsaved changes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10">
                      Undo
                    </button>
                    <button className="rounded-lg bg-[#6D6AFF] px-3 py-2 text-xs font-semibold text-white hover:bg-[#7D7AFF]">
                      Save ✓
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </section>

        <Divider />

        {/* Logos / trust */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 sm:flex-row">
            <div className="text-sm text-white/70">
              Thiết kế cho vận hành thực chiến: giáo vụ • giáo viên • trợ giảng • kế toán
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">RBAC</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Audit Log</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Mobile-first</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">API-ready</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Parent preview</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 pb-6 pt-14 sm:px-6 sm:pt-16">
          <SectionHeader
            eyebrow="CORE VALUE"
            title="Tập trung vào 2 việc quan trọng nhất: điểm danh & SOP vận hành"
            subtitle="Không phải một admin panel nhàm chán. Đây là Operating System giúp trung tâm chạy đều, chuẩn, minh bạch — ngay cả khi thay người."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<CalendarCheck className="h-5 w-5 text-white/80" />}
              title="Điểm danh mobile-first"
              desc="Swipe/tap nhanh, 6 trạng thái chuẩn, bulk save, chống sửa sai bằng lock & audit."
            />
            <Feature
              icon={<ClipboardCheck className="h-5 w-5 text-white/80" />}
              title="Checklist trợ giảng = SOP Engine"
              desc="Template theo loại buổi, SLA, critical gate. Không còn 'tick cho có'."
            />
            <Feature
              icon={<FileText className="h-5 w-5 text-white/80" />}
              title="Theo dõi bài tập & chấm theo rubric"
              desc="Giao–nộp–chấm–hoàn thành rõ ràng, timeline học viên minh bạch."
            />
            <Feature
              icon={<Users className="h-5 w-5 text-white/80" />}
              title="Parent Preview link"
              desc="Link read-only token + expiry. Phụ huynh tự xem tiến độ khi cần."
            />
            <Feature
              icon={<LineChart className="h-5 w-5 text-white/80" />}
              title="Leads pipeline & stage history"
              desc="Kanban theo stage, phân công xử lý, trace ai làm đến đâu."
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5 text-white/80" />}
              title="RBAC + Audit Log"
              desc="Phân quyền rõ ràng. Mọi thay đổi quan trọng đều có dấu vết."
            />
          </div>
        </section>

        <Divider />

        {/* Workflows */}
        <section id="workflows" className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
          <SectionHeader
            eyebrow="WORKFLOWS"
            title="Thiết kế theo dòng chảy vận hành, không phải theo menu"
            subtitle="Mở dashboard → biết ngay buổi nào sắp bắt đầu, việc nào cần làm, vấn đề nào cần xử lý."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Gauge className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <div className="text-base font-semibold">Command Center Dashboard</div>
                  <p className="mt-1 text-sm text-white/70">
                    Hôm nay có lớp nào? lớp nào đang có issue? ai đang chờ bạn xử lý? Tất cả gói trong 1 màn.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {[
                      "Next class card → vào thẳng điểm danh",
                      "Issues card → checklist blocked / absent KP / vi phạm",
                      "My classes → truy cập nhanh theo vai trò",
                    ].map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-white/60" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <Workflow className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <div className="text-base font-semibold">Dữ liệu gắn trách nhiệm</div>
                  <p className="mt-1 text-sm text-white/70">
                    Từ attendance → billing; từ checklist → chất lượng. Mọi thứ thống nhất bằng audit log.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {[
                      "Attendance lock sau X giờ (config)",
                      "Checklist critical gate trước khi end session",
                      "Timeline học viên để can thiệp sớm",
                    ].map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-white/60" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        <Divider />

        {/* Security */}
        <section id="security" className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
          <SectionHeader
            eyebrow="SECURITY"
            title="Bảo mật & kiểm soát dữ liệu như một SaaS nghiêm túc"
            subtitle="Tối ưu cho vận hành trung tâm: đúng người – đúng dữ liệu – đúng thời điểm."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<ShieldCheck className="h-5 w-5 text-white/80" />}
              title="RBAC chuẩn vai trò"
              desc="Admin/Quản lý/Giáo vụ/Giáo viên/Trợ giảng/Kế toán — scope theo lớp/cơ sở."
            />
            <Feature
              icon={<Lock className="h-5 w-5 text-white/80" />}
              title="Attendance lock"
              desc="Khóa điểm danh sau X giờ. Unlock phải có lý do & audit log."
            />
            <Feature
              icon={<Globe className="h-5 w-5 text-white/80" />}
              title="Parent token"
              desc="Token dài + expiry + revoke/rotate. Link chỉ read-only đúng 1 học viên."
            />
          </div>
        </section>

        <Divider />

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
          <SectionHeader
            eyebrow="PRICING"
            title="Gói dịch vụ linh hoạt theo quy mô trung tâm"
            subtitle="Bạn có thể chỉnh nội dung/giá tùy mô hình kinh doanh. Mình thiết kế sẵn theo chuẩn SaaS: rõ ràng – minh bạch – dễ chốt."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "Từ 1 cơ sở",
                desc: "Dành cho trung tâm nhỏ muốn chuẩn hóa vận hành ngay.",
                items: [
                  "Attendance mobile-first",
                  "Checklist trợ giảng",
                  "Học viên + parent preview",
                  "Leads pipeline cơ bản",
                ],
                cta: "Nhận demo",
                highlight: false,
              },
              {
                name: "Pro",
                price: "Chuẩn vận hành",
                desc: "Tối ưu cho đội ngũ giáo viên/TA và quản lý chất lượng.",
                items: [
                  "RBAC + Audit log đầy đủ",
                  "Attendance lock + taxonomy",
                  "SOP checklist gate & SLA",
                  "Timeline học viên",
                  "Ops dashboard cho quản lý",
                ],
                cta: "Đăng ký trải nghiệm",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Nhiều cơ sở",
                desc: "Dành cho chuỗi trung tâm hoặc mô hình franchise.",
                items: [
                  "Multi-branch + phân quyền nâng cao",
                  "Báo cáo vận hành theo cơ sở",
                  "API/Webhooks đồng bộ dữ liệu",
                  "SLA hỗ trợ & tuỳ biến",
                ],
                cta: "Liên hệ tư vấn",
                highlight: false,
              },
            ].map((p, idx) => (
              <GlassCard
                key={idx}
                className={cn(
                  "p-6",
                  p.highlight && "ring-1 ring-[#6D6AFF]/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{p.name}</div>
                  {p.highlight && (
                    <span className="rounded-full bg-[#6D6AFF]/15 px-3 py-1 text-xs font-semibold text-[#B9B8FF] ring-1 ring-white/10">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-3 text-2xl font-semibold">{p.price}</div>
                <div className="mt-2 text-sm text-white/70">{p.desc}</div>
                <ul className="mt-5 space-y-2 text-sm text-white/75">
                  {p.items.map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-white/60" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <a
                    href="#demo"
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition",
                      p.highlight
                        ? "bg-[#6D6AFF] text-white hover:bg-[#7D7AFF]"
                        : "border border-white/12 bg-white/5 text-white/90 hover:bg-white/8"
                    )}
                  >
                    {p.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <Divider />

        {/* Demo / Lead */}
        <section id="demo" className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
          <SectionHeader
            eyebrow="GET STARTED"
            title="Nhận demo + tư vấn triển khai theo vận hành của trung tâm bạn"
            subtitle="Để tiết kiệm thời gian, chỉ cần để lại thông tin. Mình sẽ gửi link demo & lộ trình triển khai phù hợp."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <GlassCard className="p-6">
              <div className="text-base font-semibold">Đăng ký nhanh</div>
              <p className="mt-2 text-sm text-white/70">
                Form này chỉ để demo landing. Bạn có thể nối vào API leads của CMS sau.
              </p>

              <form className="mt-5 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-white/60">Họ tên</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-0 focus:border-[#6D6AFF]/50"
                      placeholder="VD: Trần Quỳnh"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Số điện thoại</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-0 focus:border-[#6D6AFF]/50"
                      placeholder="VD: 09xx..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60">Tên trung tâm</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none ring-0 focus:border-[#6D6AFF]/50"
                    placeholder="VD: ABC English"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-white/60">Số cơ sở</label>
                    <select className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#6D6AFF]/50">
                      <option className="bg-[#0B0F1A]" value="1">1 cơ sở</option>
                      <option className="bg-[#0B0F1A]" value="2">2–3 cơ sở</option>
                      <option className="bg-[#0B0F1A]" value="4">4+ cơ sở</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/60">Nhu cầu ưu tiên</label>
                    <select className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#6D6AFF]/50">
                      <option className="bg-[#0B0F1A]" value="ops">Vận hành lớp</option>
                      <option className="bg-[#0B0F1A]" value="parent">Phụ huynh</option>
                      <option className="bg-[#0B0F1A]" value="billing">Học phí</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D6AFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7D7AFF]"
                >
                  Gửi thông tin <ArrowRight className="h-4 w-4" />
                </button>

                <div className="text-xs text-white/50">
                  Bằng cách gửi thông tin, bạn đồng ý nhận liên hệ tư vấn (có thể huỷ bất kỳ lúc nào).
                </div>
              </form>
            </GlassCard>

            <div className="grid gap-4">
              <GlassCard className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <Phone className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Triển khai nhanh</div>
                    <div className="text-xs text-white/60">Setup & onboarding theo SOP trung tâm</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {[
                    "Chuẩn hóa attendance & checklist theo quy trình hiện tại",
                    "Seed dữ liệu lớp/học viên, phân quyền theo vai trò",
                    "Đào tạo giáo viên/TA dùng mobile trong 30 phút",
                  ].map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-white/60" />
                      {t}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <Mail className="h-5 w-5 text-white/80" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Hỗ trợ & nâng cấp</div>
                    <div className="text-xs text-white/60">Roadmap vận hành xuất sắc (Ops Excellence)</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/75">
                  {[
                    "Attendance lock + reason taxonomy + summary",
                    "SOP gate checklist + SLA + reviewer",
                    "Weekly ops review dashboard cho quản lý",
                  ].map((t, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-white/60" />
                      {t}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="text-sm text-white/70">
                <span className="font-semibold text-white">English Center OS</span> — vận hành chuẩn, minh bạch, mobile-first.
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                <a className="hover:text-white" href="#features">Tính năng</a>
                <span className="text-white/20">•</span>
                <a className="hover:text-white" href="#pricing">Gói dịch vụ</a>
                <span className="text-white/20">•</span>
                <a className="hover:text-white" href="#demo">Demo</a>
                <span className="text-white/20">•</span>
                <Link className="hover:text-white" href="/login">Đăng nhập</Link>
              </div>
            </div>
            <div className="mt-6 text-xs text-white/40">
              © {new Date().getFullYear()} English Center OS. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
