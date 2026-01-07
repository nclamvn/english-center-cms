# English Center CMS

Hệ thống quản lý trung tâm tiếng Anh - Operating System cho vận hành lớp học.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)

## Features

### Core Modules
- **Điểm danh (Attendance)** - Mobile-first, 6 trạng thái, lock sau 2 giờ, audit log
- **Quản lý học viên (Students)** - Hồ sơ, timeline, parent preview link
- **Quản lý lớp học (Classes)** - Khóa học, buổi học, enrollment
- **Checklist SOP** - Template theo loại buổi, critical gate, SLA
- **Leads Pipeline** - Kanban board, stage history, phân công
- **Học phí (Billing)** - Tính theo buổi học thực tế

### Security & Access Control
- **RBAC** - 5 vai trò: Admin, Manager, Teacher, TA, Accountant
- **Audit Log** - Ghi lại mọi thay đổi quan trọng
- **Session Lock** - Khóa điểm danh sau thời gian quy định
- **Parent Preview Token** - Link read-only với expiry

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Auth | NextAuth v5 (Auth.js) |
| Animation | Framer Motion |
| UI Components | Radix UI |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm / npm / yarn

### Installation

```bash
# Clone repository
git clone https://github.com/nclamvn/english-center-cms.git
cd english-center-cms

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database - PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/english_center?schema=public"

# NextAuth
AUTH_SECRET="generate-a-random-secret-key-here"
AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Security Note:** Never commit `.env` file. Generate `AUTH_SECRET` using:
> ```bash
> openssl rand -base64 32
> ```

## Demo Accounts

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
│   ├── (auth)/           # Auth pages (login)
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── attendance/   # Điểm danh
│   │   ├── billing/      # Học phí
│   │   ├── classes/      # Lớp học
│   │   ├── dashboard/    # Trang chủ
│   │   ├── homework/     # Bài tập
│   │   ├── leads/        # CRM Pipeline
│   │   ├── sessions/     # Buổi học & Checklist
│   │   ├── settings/     # Cài đặt
│   │   └── students/     # Học viên
│   ├── (public)/         # Public pages (parent preview)
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/
│   ├── layout/           # Header, Sidebar
│   └── ui/               # Reusable UI components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── audit.ts          # Audit log helper
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | * | NextAuth endpoints |
| `/api/students` | GET, POST | Student management |
| `/api/students/[id]` | GET, PUT, DELETE | Single student |
| `/api/students/[id]/preview-token` | POST, DELETE | Parent preview token |
| `/api/classes` | GET, POST | Class management |
| `/api/sessions` | GET, POST | Session management |
| `/api/sessions/[id]/attendance` | GET, POST | Attendance |
| `/api/sessions/[id]/attendance/logs` | GET | Attendance history |
| `/api/sessions/[id]/lock` | GET, POST | Session lock |
| `/api/sessions/[id]/checklist` | GET, POST | TA checklist |
| `/api/leads` | GET, POST | Leads pipeline |
| `/api/leads/[id]/stage` | PUT | Update lead stage |
| `/api/billing/generate` | POST | Generate billing |

## Roles & Permissions

| Role | Quyền |
|------|-------|
| ADMIN | Full access |
| MANAGER | Quản lý vận hành (trừ settings) |
| TEACHER | Lớp mình dạy + attendance + homework |
| TA | Sessions + attendance |
| ACCOUNTANT | Read students + billing + export |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Database Schema

### Core Models
- **User** - Staff accounts with RBAC
- **Student** - Student profiles
- **Class** - Class/course instances
- **Session** - Individual class sessions
- **Attendance** - Attendance records (6 statuses)
- **AttendanceLog** - Audit trail for attendance changes

### Supporting Models
- **Role, Permission, UserRole, RolePermission** - RBAC system
- **ChecklistTemplate, SessionChecklistItem** - SOP checklists
- **HomeworkTemplate, HomeworkAssignment, Grading** - Homework system
- **Lead, LeadForm, LeadStageHistory** - CRM pipeline
- **BillingPlan, BillingRecord** - Billing system
- **ParentPreviewToken** - Secure parent access
- **AuditLog** - System-wide audit trail

## Security Considerations

- All API routes are protected with NextAuth session
- RBAC enforced at both API and UI level
- Passwords hashed with bcrypt (10 rounds)
- Parent preview tokens have expiry dates
- Attendance locked after configurable time window
- All sensitive changes logged to AuditLog
- `.env` file excluded from git

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm run start
```

## Roadmap

- [ ] Multi-branch support
- [ ] Advanced reporting dashboard
- [ ] Mobile app (React Native)
- [ ] WhatsApp/Zalo integration
- [ ] Online payment integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with Next.js and Prisma
