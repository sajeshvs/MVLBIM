import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  tenantSlug: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  code: z.string().min(1, 'Project code is required'),
  type: z.enum(['CONSTRUCTION', 'RENOVATION', 'INFRASTRUCTURE', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL']),
  budget: z.number().positive('Budget must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').default('USD'),
  location: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// Cost item validation schemas
export const createCostItemSchema = z.object({
  name: z.string().min(1, 'Cost item name is required'),
  description: z.string().optional(),
  code: z.string().optional(),
  type: z.enum(['MATERIAL', 'LABOR', 'EQUIPMENT', 'SUBCONTRACTOR', 'OTHER']),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  unitCost: z.number().positive('Unit cost must be positive'),
  categoryId: z.string().cuid('Invalid category ID'),
  phaseId: z.string().cuid('Invalid phase ID').optional(),
  notes: z.string().optional(),
});

export const updateCostItemSchema = createCostItemSchema.partial();

// Task validation schemas
export const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().int().positive().optional(),
  assignedTo: z.string().cuid('Invalid user ID').optional(),
  phaseId: z.string().cuid('Invalid phase ID').optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELED']).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  actualHours: z.number().int().positive().optional(),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search and filter validation
export const searchSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  type: z.string().min(1, 'File type is required'),
  size: z.number().positive('File size must be positive').max(50 * 1024 * 1024, 'File size must be less than 50MB'),
});

// Category validation
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  code: z.string().min(1, 'Category code is required'),
  description: z.string().optional(),
  parentId: z.string().cuid('Invalid parent category ID').optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Phase validation
export const createPhaseSchema = z.object({
  name: z.string().min(1, 'Phase name is required'),
  description: z.string().optional(),
  order: z.number().int().positive('Order must be positive'),
  budget: z.number().positive('Budget must be positive').optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const updatePhaseSchema = createPhaseSchema.partial().extend({
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELED']).optional(),
});

// Export type inference helpers
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateCostItemInput = z.infer<typeof createCostItemSchema>;
export type UpdateCostItemInput = z.infer<typeof updateCostItemSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreatePhaseInput = z.infer<typeof createPhaseSchema>;
export type UpdatePhaseInput = z.infer<typeof updatePhaseSchema>;
