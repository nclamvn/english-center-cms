// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT_EXCUSED: 'ABSENT_EXCUSED',
  ABSENT_UNEXCUSED: 'ABSENT_UNEXCUSED',
  MAKEUP: 'MAKEUP',
  ONLINE: 'ONLINE'
} as const

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]

// Session Mode
export const SESSION_MODE = {
  OFFLINE: 'OFFLINE',
  ONLINE: 'ONLINE'
} as const

export type SessionMode = typeof SESSION_MODE[keyof typeof SESSION_MODE]

// Session Status
export const SESSION_STATUS = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS]

// Lead Stages
export const LEAD_STAGE = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  TEST_SCHEDULED: 'TEST_SCHEDULED',
  TEST_DONE: 'TEST_DONE',
  OFFER_SENT: 'OFFER_SENT',
  WON: 'WON',
  LOST: 'LOST'
} as const

export type LeadStage = typeof LEAD_STAGE[keyof typeof LEAD_STAGE]

// Approval Status
export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS]

// Checklist Status
export const CHECKLIST_STATUS = {
  TODO: 'TODO',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED'
} as const

export type ChecklistStatus = typeof CHECKLIST_STATUS[keyof typeof CHECKLIST_STATUS]

// Submission Status
export const SUBMISSION_STATUS = {
  NOT_ASSIGNED: 'NOT_ASSIGNED',
  ASSIGNED: 'ASSIGNED',
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED',
  COMPLETED: 'COMPLETED',
  MISSING: 'MISSING'
} as const

export type SubmissionStatus = typeof SUBMISSION_STATUS[keyof typeof SUBMISSION_STATUS]

// Charge Status
export const CHARGE_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  CANCELLED: 'CANCELLED'
} as const

export type ChargeStatus = typeof CHARGE_STATUS[keyof typeof CHARGE_STATUS]

// Entity Status
export const ENTITY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const

export type EntityStatus = typeof ENTITY_STATUS[keyof typeof ENTITY_STATUS]

// Student Status
export const STUDENT_STATUS = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  QUIT: 'QUIT'
} as const

export type StudentStatus = typeof STUDENT_STATUS[keyof typeof STUDENT_STATUS]

// Enrollment Status
export const ENROLLMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
  PAUSED: 'PAUSED'
} as const

export type EnrollmentStatus = typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS]

// Gender
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
} as const

export type Gender = typeof GENDER[keyof typeof GENDER]

// Relationship
export const RELATIONSHIP = {
  FATHER: 'FATHER',
  MOTHER: 'MOTHER',
  GUARDIAN: 'GUARDIAN',
  OTHER: 'OTHER'
} as const

export type Relationship = typeof RELATIONSHIP[keyof typeof RELATIONSHIP]

// Permissions
export const MODULES = [
  'dashboard',
  'students',
  'classes',
  'sessions',
  'attendance',
  'homework',
  'billing',
  'leads',
  'settings',
  'reports'
] as const

export type Module = typeof MODULES[number]

export const ACTIONS = [
  'VIEW',
  'CREATE',
  'UPDATE',
  'DELETE',
  'APPROVE',
  'EXPORT'
] as const

export type Action = typeof ACTIONS[number]

// Default Roles
export const DEFAULT_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER', // Quan ly co so / Giao vu
  TEACHER: 'TEACHER',
  TA: 'TA', // Tro giang
  ACCOUNTANT: 'ACCOUNTANT', // Ke toan
} as const

export type DefaultRole = typeof DEFAULT_ROLES[keyof typeof DEFAULT_ROLES]

// Billing Rules Interface
export interface BillingRules {
  presentCountsAs: number
  lateCountsAs: number
  absentExcusedCountsAs: number
  absentUnexcusedCountsAs: number
  makeupCountsAs: number
  onlineCountsAs: number
}

// Rubric Interface
export interface RubricCriteria {
  id: string
  name: string
  maxScore: number
  description?: string
}

export interface Rubric {
  criteria: RubricCriteria[]
}

// Checklist Item Interface
export interface ChecklistItem {
  title: string
  order: number
  slaMinutes?: number
}

// Lead Form Field Interface
export interface LeadFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'textarea'
  required: boolean
  options?: string[]
}

// UTM Interface
export interface UTMData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}
