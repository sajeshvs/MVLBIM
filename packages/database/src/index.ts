export * from '@prisma/client';
export { PrismaClient } from '@prisma/client';

// Re-export types for convenience
export type {
  User,
  Tenant,
  TenantMember,
  Project,
  Phase,
  Category,
  CostItem,
  CostRevision,
  Task,
  Document,
  Activity,
  UserRole,
  UserStatus,
  TenantRole,
  ProjectStatus,
  ProjectType,
  PhaseStatus,
  CostItemType,
  CostStatus,
  TaskStatus,
  Priority,
  DocumentType,
  ActivityType,
} from '@prisma/client';
