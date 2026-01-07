import { prisma } from './prisma'

interface AuditLogParams {
  actorId?: string | null
  entity: string
  entityId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  before?: Record<string, any> | null
  after?: Record<string, any> | null
}

export async function createAuditLog({
  actorId,
  entity,
  entityId,
  action,
  before,
  after
}: AuditLogParams) {
  // Remove sensitive fields
  const sanitize = (obj: Record<string, any> | null | undefined) => {
    if (!obj) return null
    const { password, ...rest } = obj
    return rest
  }

  await prisma.auditLog.create({
    data: {
      actorId,
      entity,
      entityId,
      action,
      diffJson: {
        before: sanitize(before),
        after: sanitize(after)
      }
    }
  })
}

// Get audit logs for an entity
export async function getAuditLogs(entity: string, entityId: string) {
  return prisma.auditLog.findMany({
    where: { entity, entityId },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}
