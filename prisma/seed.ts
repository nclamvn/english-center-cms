import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Permissions
  const modules = ['dashboard', 'students', 'classes', 'sessions', 'attendance', 'homework', 'billing', 'leads', 'settings', 'reports']
  const actions = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT']

  const permissions = []
  for (const module of modules) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: { module_action: { module, action } },
        update: {},
        create: { module, action, description: `${action} ${module}` }
      })
      permissions.push(permission)
    }
  }
  console.log(`Created ${permissions.length} permissions`)

  // Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Quan tri vien he thong' }
  })

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: { name: 'MANAGER', description: 'Quan ly co so / Giao vu' }
  })

  const teacherRole = await prisma.role.upsert({
    where: { name: 'TEACHER' },
    update: {},
    create: { name: 'TEACHER', description: 'Giao vien' }
  })

  const taRole = await prisma.role.upsert({
    where: { name: 'TA' },
    update: {},
    create: { name: 'TA', description: 'Tro giang' }
  })

  const accountantRole = await prisma.role.upsert({
    where: { name: 'ACCOUNTANT' },
    update: {},
    create: { name: 'ACCOUNTANT', description: 'Ke toan' }
  })

  console.log('Created roles: ADMIN, MANAGER, TEACHER, TA, ACCOUNTANT')

  // Assign all permissions to ADMIN
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: permission.id }
    })
  }
  console.log('Assigned all permissions to ADMIN')

  // Assign permissions to MANAGER (all except settings)
  const managerPermissions = permissions.filter(p => p.module !== 'settings' || p.action === 'VIEW')
  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: managerRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: managerRole.id, permissionId: permission.id }
    })
  }

  // Assign permissions to TEACHER
  const teacherModules = ['dashboard', 'students', 'classes', 'sessions', 'attendance', 'homework']
  const teacherPermissions = permissions.filter(p =>
    teacherModules.includes(p.module) && ['VIEW', 'UPDATE'].includes(p.action)
  )
  for (const permission of teacherPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: teacherRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: teacherRole.id, permissionId: permission.id }
    })
  }

  // Assign permissions to TA
  const taModules = ['dashboard', 'students', 'sessions', 'attendance']
  const taPermissions = permissions.filter(p =>
    taModules.includes(p.module) && ['VIEW', 'UPDATE'].includes(p.action)
  )
  for (const permission of taPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: taRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: taRole.id, permissionId: permission.id }
    })
  }

  // Assign permissions to ACCOUNTANT
  const accountantModules = ['dashboard', 'students', 'classes', 'billing', 'reports']
  const accountantPermissions = permissions.filter(p =>
    accountantModules.includes(p.module) && ['VIEW', 'EXPORT'].includes(p.action)
  ).concat(permissions.filter(p =>
    p.module === 'billing' && ['VIEW', 'CREATE', 'UPDATE', 'EXPORT'].includes(p.action)
  ))
  for (const permission of accountantPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: accountantRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: accountantRole.id, permissionId: permission.id }
    })
  }

  console.log('Assigned permissions to roles')

  // Create Branch
  const branch = await prisma.branch.upsert({
    where: { id: 'main-branch' },
    update: {},
    create: {
      id: 'main-branch',
      name: 'Co so Chinh',
      address: '123 Nguyen Hue, Quan 1, TP.HCM',
      phone: '028-1234-5678',
      status: 'ACTIVE'
    }
  })
  console.log('Created main branch')

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      phone: '0909-123-456',
      status: 'ACTIVE',
      branchId: branch.id
    }
  })

  // Assign ADMIN role to admin user
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id }
  })
  console.log('Created admin user: admin@example.com / admin123')

  // Create sample Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      name: 'Nguyen Van Giao',
      email: 'teacher@example.com',
      password: hashedPassword,
      phone: '0909-111-222',
      status: 'ACTIVE',
      branchId: branch.id
    }
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: teacherUser.id, roleId: teacherRole.id } },
    update: {},
    create: { userId: teacherUser.id, roleId: teacherRole.id }
  })
  console.log('Created teacher user: teacher@example.com / admin123')

  // Create sample Manager
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: 'Tran Thi Quan Ly',
      email: 'manager@example.com',
      password: hashedPassword,
      phone: '0909-222-333',
      status: 'ACTIVE',
      branchId: branch.id
    }
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: managerUser.id, roleId: managerRole.id } },
    update: {},
    create: { userId: managerUser.id, roleId: managerRole.id }
  })
  console.log('Created manager user: manager@example.com / admin123')

  // Create sample TA
  const taUser = await prisma.user.upsert({
    where: { email: 'ta@example.com' },
    update: {},
    create: {
      name: 'Le Van Tro Giang',
      email: 'ta@example.com',
      password: hashedPassword,
      phone: '0909-333-444',
      status: 'ACTIVE',
      branchId: branch.id
    }
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: taUser.id, roleId: taRole.id } },
    update: {},
    create: { userId: taUser.id, roleId: taRole.id }
  })
  console.log('Created TA user: ta@example.com / admin123')

  // Create sample Accountant
  const accountantUser = await prisma.user.upsert({
    where: { email: 'accountant@example.com' },
    update: {},
    create: {
      name: 'Pham Thi Ke Toan',
      email: 'accountant@example.com',
      password: hashedPassword,
      phone: '0909-444-555',
      status: 'ACTIVE',
      branchId: branch.id
    }
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: accountantUser.id, roleId: accountantRole.id } },
    update: {},
    create: { userId: accountantUser.id, roleId: accountantRole.id }
  })
  console.log('Created accountant user: accountant@example.com / admin123')

  // Create Course
  const course = await prisma.course.upsert({
    where: { id: 'english-basic' },
    update: {},
    create: {
      id: 'english-basic',
      name: 'Tieng Anh Co Ban',
      level: 'Beginner',
      description: 'Khoa hoc tieng Anh danh cho nguoi moi bat dau',
      status: 'ACTIVE'
    }
  })
  console.log('Created sample course')

  // Create Class
  const classItem = await prisma.class.upsert({
    where: { id: 'class-001' },
    update: {},
    create: {
      id: 'class-001',
      courseId: course.id,
      branchId: branch.id,
      name: 'Lop A1-2024',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-15'),
      status: 'ACTIVE'
    }
  })
  console.log('Created sample class')

  // Create Checklist Template
  await prisma.checklistTemplate.upsert({
    where: { id: 'offline-checklist' },
    update: {},
    create: {
      id: 'offline-checklist',
      name: 'Checklist buoi hoc Offline',
      sessionMode: 'OFFLINE',
      itemsJson: [
        { title: 'Mo cua phong hoc truoc 15 phut', order: 1 },
        { title: 'Kiem tra may chieu/TV', order: 2 },
        { title: 'Kiem tra dieu hoa/quat', order: 3 },
        { title: 'Chuan bi tai lieu phat', order: 4 },
        { title: 'Ghi danh sach hoc vien vang mat', order: 5 },
        { title: 'Thu gon phong sau buoi hoc', order: 6 }
      ],
      status: 'ACTIVE'
    }
  })

  await prisma.checklistTemplate.upsert({
    where: { id: 'online-checklist' },
    update: {},
    create: {
      id: 'online-checklist',
      name: 'Checklist buoi hoc Online',
      sessionMode: 'ONLINE',
      itemsJson: [
        { title: 'Kiem tra ket noi internet', order: 1 },
        { title: 'Mo phong Zoom truoc 10 phut', order: 2 },
        { title: 'Gui link phong cho hoc vien', order: 3 },
        { title: 'Kiem tra micro va camera', order: 4 },
        { title: 'Chuan bi tai lieu chia se man hinh', order: 5 },
        { title: 'Ghi lai recording (neu can)', order: 6 }
      ],
      status: 'ACTIVE'
    }
  })
  console.log('Created checklist templates')

  // Create Homework Template
  await prisma.homeworkTemplate.upsert({
    where: { id: 'vocab-template' },
    update: {},
    create: {
      id: 'vocab-template',
      title: 'Bai tap tu vung',
      description: 'Hoc thuoc tu vung moi va lam bai tap',
      rubricJson: {
        criteria: [
          { id: 'accuracy', name: 'Do chinh xac', maxScore: 40, description: 'Dung chinh ta va nghia' },
          { id: 'completion', name: 'Hoan thanh', maxScore: 30, description: 'Lam du cac cau' },
          { id: 'effort', name: 'No luc', maxScore: 30, description: 'The hien su co gang' }
        ]
      },
      maxScore: 100,
      status: 'ACTIVE'
    }
  })
  console.log('Created homework template')

  // Create Lead Form
  await prisma.leadForm.upsert({
    where: { id: 'default-form' },
    update: {},
    create: {
      id: 'default-form',
      name: 'Form dang ky tu van',
      branchId: branch.id,
      fieldsJson: [
        { name: 'parentName', label: 'Ho ten phu huynh', type: 'text', required: true },
        { name: 'phone', label: 'So dien thoai', type: 'phone', required: true },
        { name: 'studentName', label: 'Ho ten hoc sinh', type: 'text', required: true },
        { name: 'studentAge', label: 'Tuoi hoc sinh', type: 'number', required: false },
        { name: 'note', label: 'Ghi chu', type: 'textarea', required: false }
      ],
      status: 'ACTIVE'
    }
  })
  console.log('Created lead form')

  // Create Billing Plan
  await prisma.billingPlan.upsert({
    where: { id: 'plan-001' },
    update: {},
    create: {
      id: 'plan-001',
      classId: classItem.id,
      pricePerSession: 150000, // 150,000 VND
      rulesJson: {
        presentCountsAs: 1,
        lateCountsAs: 1,
        absentExcusedCountsAs: 0,
        absentUnexcusedCountsAs: 1,
        makeupCountsAs: 0,
        onlineCountsAs: 1
      },
      status: 'ACTIVE'
    }
  })
  console.log('Created billing plan')

  // Create sample students
  const students = [
    { fullName: 'Nguyen Van An', gender: 'MALE', phone: '0901-000-001' },
    { fullName: 'Tran Thi Binh', gender: 'FEMALE', phone: '0901-000-002' },
    { fullName: 'Le Hoang Cuong', gender: 'MALE', phone: '0901-000-003' },
    { fullName: 'Pham My Dung', gender: 'FEMALE', phone: '0901-000-004' },
    { fullName: 'Vo Minh Em', gender: 'MALE', phone: '0901-000-005' }
  ]

  for (let i = 0; i < students.length; i++) {
    const student = await prisma.student.upsert({
      where: { id: `student-${i + 1}` },
      update: {},
      create: {
        id: `student-${i + 1}`,
        fullName: students[i].fullName,
        gender: students[i].gender,
        phone: students[i].phone,
        status: 'ACTIVE',
        dob: new Date(2010, i, 15)
      }
    })

    // Enroll in class
    await prisma.enrollment.upsert({
      where: { classId_studentId: { classId: classItem.id, studentId: student.id } },
      update: {},
      create: {
        classId: classItem.id,
        studentId: student.id,
        status: 'ACTIVE',
        joinedAt: new Date()
      }
    })
  }
  console.log('Created 5 sample students and enrolled them')

  // Create sample session
  const session = await prisma.session.upsert({
    where: { classId_date: { classId: classItem.id, date: new Date() } },
    update: {},
    create: {
      classId: classItem.id,
      date: new Date(),
      startTime: '09:00',
      endTime: '11:00',
      mode: 'OFFLINE',
      room: 'Phong 101',
      teacherId: teacherUser.id,
      status: 'SCHEDULED'
    }
  })
  console.log('Created sample session for today')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
