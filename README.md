# CMS Trung Tam Anh Ngu

He thong quan ly trung tam Anh ngu theo Blueprint - Mobile-first Operations

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5 (Auth.js)
- **State**: React Server Components + Client Components

## Tinh nang

### 1. Diem danh (Mobile-first)
- UI toi uu cho dien thoai
- 6 trang thai diem danh: Co mat, Di tre, Nghi phep, Nghi KP, Hoc bu, Online
- Luu nhanh (bulk save)
- Ghi chu va dinh kem vi pham

### 2. Checklist Tro giang (Mobile-first)
- Template theo loai buoi hoc (Offline/Online)
- Trang thai: TODO, DONE, BLOCKED
- % hoan thanh theo buoi

### 3. Quan ly Hoc vien
- CRUD hoc vien
- Thong tin phu huynh
- Lich su chuyen can
- Bai tap va diem

### 4. Parent Preview (Public Link)
- Link xem tien do cho phu huynh
- Token bao mat co thoi han
- Read-only, chi xem 1 hoc vien

### 5. Quan ly Leads
- Pipeline Kanban view
- Stage tracking voi lich su
- Assignee va approval status

### 6. Hoc phi
- Tinh phi tu dong theo diem danh
- Billing rules config duoc
- Export bao cao

## Cai dat

### 1. Clone va cai dat dependencies

```bash
npm install
```

### 2. Cau hinh database

Tao database PostgreSQL roi cap nhat file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/english_center?schema=public"
AUTH_SECRET="your-secret-key"
AUTH_URL="http://localhost:3000"
```

### 3. Khoi tao database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed data mau
npm run db:seed
```

### 4. Chay development server

```bash
npm run dev
```

Mo http://localhost:3000

## Tai khoan mac dinh

Sau khi chay seed:

- **Admin**: admin@example.com / admin123
- **Teacher**: teacher@example.com / admin123

## Cau truc thu muc

```
src/
├── app/
│   ├── (auth)/           # Login page
│   ├── (dashboard)/      # Authenticated pages
│   │   ├── attendance/   # Diem danh
│   │   ├── dashboard/    # Trang chu
│   │   ├── leads/        # Quan ly leads
│   │   ├── sessions/     # Checklist tro giang
│   │   └── students/     # Quan ly hoc vien
│   ├── (public)/         # Public pages
│   │   └── p/[token]/    # Parent preview
│   └── api/              # API routes
├── components/
│   ├── layout/           # Sidebar, Header
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── audit.ts          # Audit log helper
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
└── types/
    └── index.ts          # Type definitions
```

## API Endpoints

### Authentication
- POST /api/auth/signin
- POST /api/auth/signout

### Students
- GET /api/students
- POST /api/students
- GET /api/students/[id]
- PATCH /api/students/[id]
- DELETE /api/students/[id]
- POST /api/students/[id]/preview-token

### Sessions
- GET /api/sessions
- POST /api/sessions
- GET /api/sessions/[id]/attendance
- POST /api/sessions/[id]/attendance (bulk save)
- GET /api/sessions/[id]/checklist
- POST /api/sessions/[id]/checklist

### Leads
- GET /api/leads
- POST /api/leads
- POST /api/leads/[id]/stage

### Billing
- POST /api/billing/generate

## Roles & Permissions

| Role | Quyen |
|------|-------|
| ADMIN | Full access |
| MANAGER | Quan ly van hanh (tru settings) |
| TEACHER | Lop minh day + attendance + homework |
| TA | Sessions + attendance |
| ACCOUNTANT | Read students + billing + export |

## Scripts

```bash
npm run dev          # Chay development
npm run build        # Build production
npm run start        # Chay production
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to DB
npm run db:migrate   # Run migrations
npm run db:seed      # Seed data mau
npm run db:studio    # Mo Prisma Studio
```

## License

MIT
