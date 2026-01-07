# Project Handover - English Center CMS

> Đọc file này để tiếp tục công việc từ session trước.

## Project Overview

**Tên dự án:** English Center CMS - Hệ thống quản lý trung tâm tiếng Anh

**Repository:** https://github.com/nclamvn/english-center-cms

**Tech Stack:**
- Next.js 16.1 (App Router) + TypeScript
- Tailwind CSS 4 + Radix UI
- Prisma 5 + PostgreSQL
- NextAuth v5 (Auth.js)
- Framer Motion

## Current Status

### Completed Features

| Module | Status | Notes |
|--------|--------|-------|
| Landing Page | ✅ Done | SaaS-style với Framer Motion, dark theme |
| Authentication | ✅ Done | NextAuth v5, credentials provider |
| RBAC System | ✅ Done | 5 roles: Admin, Manager, Teacher, TA, Accountant |
| Dashboard Layout | ✅ Done | Sidebar + Header, collapse toggle, user menu ở bottom |
| Student Management | ✅ Done | CRUD, parent preview link với token |
| Class Management | ✅ Done | Basic CRUD |
| Session Management | ✅ Done | Sessions với teacher, TA assignment |
| Attendance System | ✅ Done | 6 statuses, bulk save, lock after 2h, audit log |
| Attendance Lock | ✅ Done | Auto-lock, manual unlock với reason |
| Attendance History | ✅ Done | View change logs |
| Checklist SOP | ✅ Done | Template theo session mode (Offline/Online) |
| Leads Pipeline | ✅ Done | Kanban view, stage history |
| Billing | ✅ Done | Calculate by attendance rules |
| Parent Preview | ✅ Done | Public read-only link với token + expiry |

### Database Seeded Data

- 5 user accounts (admin, manager, teacher, ta, accountant)
- 1 branch (Cơ sở Chính)
- 1 course (Tiếng Anh Cơ Bản)
- 1 class (Lớp A1-2024)
- 5 students enrolled
- 1 session for today
- Checklist templates (Offline + Online)
- Homework template, Lead form, Billing plan

### Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | ADMIN |
| manager@example.com | admin123 | MANAGER |
| teacher@example.com | admin123 | TEACHER |
| ta@example.com | admin123 | TA |
| accountant@example.com | admin123 | ACCOUNTANT |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page với demo accounts hint
│   ├── (dashboard)/           # Protected pages
│   │   ├── attendance/        # Điểm danh (list + detail)
│   │   ├── billing/           # Học phí
│   │   ├── classes/           # Lớp học
│   │   ├── dashboard/         # Home
│   │   ├── homework/          # Bài tập
│   │   ├── leads/             # CRM Pipeline
│   │   ├── sessions/          # Buổi học + Checklist
│   │   ├── settings/          # Cài đặt
│   │   └── students/          # Học viên
│   ├── (public)/p/[token]/    # Parent preview
│   ├── api/                   # API routes
│   └── page.tsx               # Landing page
├── components/
│   ├── layout/                # sidebar.tsx, header.tsx
│   └── ui/                    # UI components
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── audit.ts               # Audit log helper
│   ├── prisma.ts              # Prisma client
│   └── utils.ts               # Utilities
└── types/                     # TypeScript definitions
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema |
| `prisma/seed.ts` | Seed data |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/components/layout/sidebar.tsx` | Main navigation |
| `src/app/(dashboard)/attendance/[sessionId]/page.tsx` | Attendance detail page |
| `src/app/api/sessions/[id]/attendance/route.ts` | Attendance API |
| `src/app/api/sessions/[id]/lock/route.ts` | Session lock API |

## Recent Changes (Last Session)

1. **Sidebar Update:**
   - User info moved to bottom of sidebar
   - Collapse toggle moved to top (next to logo)
   - Logo + name hidden when collapsed

2. **Login Page:**
   - Added demo accounts section
   - Quick-fill buttons for each role

3. **README + Security:**
   - Comprehensive README with docs
   - Added .env.example
   - Verified no secrets in code

## Pending Tasks / Roadmap

### Sprint 2: Session Summary (Planned)
- [ ] Session summary khi kết thúc buổi học
- [ ] Stats: present/late/absent counts
- [ ] Export attendance report

### Sprint 3: Student Timeline (Planned)
- [ ] Timeline view cho từng học viên
- [ ] Attendance history + homework + notes
- [ ] Red flags / warnings

### Sprint 4: Checklist SOP Enhancement (Planned)
- [ ] Critical gate (block kết thúc session)
- [ ] SLA warnings
- [ ] Reviewer approval

### Sprint 5: Teacher Workspace (Planned)
- [ ] "My Classes" quick access
- [ ] Today's sessions overview
- [ ] Pending tasks

### Sprint 6: Polish (Planned)
- [ ] Loading states, error handling
- [ ] Mobile responsive refinements
- [ ] Performance optimization

## Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run dev -- -p 3001   # Start on different port

# Database
npm run db:push          # Push schema changes
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Build
npm run build            # Build for production
npm run start            # Start production server
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Notes

- NextAuth v5 uses `auth()` instead of `getServerSession()`
- Attendance auto-locks 2 hours after session end time
- Parent preview tokens have 30-day expiry by default
- All attendance changes are logged to AttendanceLog

---

**Last Updated:** 2026-01-07
**Last Session Focus:** Security check, README, sidebar layout
