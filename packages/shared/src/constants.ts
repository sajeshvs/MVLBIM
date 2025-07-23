// Application constants

// API Configuration
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  TENANTS: '/tenants',
  PROJECTS: '/projects',
  PHASES: '/phases',
  CATEGORIES: '/categories',
  COST_ITEMS: '/cost-items',
  TASKS: '/tasks',
  DOCUMENTS: '/documents',
  ACTIVITIES: '/activities',
  DASHBOARD: '/dashboard',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  PROJECT_NOT_FOUND: 'Project not found',
  TENANT_NOT_FOUND: 'Tenant not found',
  DUPLICATE_EMAIL: 'Email already exists',
  DUPLICATE_PROJECT_CODE: 'Project code already exists',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_DELETED: 'Project deleted successfully',
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  COST_ITEM_CREATED: 'Cost item created successfully',
  COST_ITEM_UPDATED: 'Cost item updated successfully',
  COST_ITEM_DELETED: 'Cost item deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_RESET: 'Password reset successful',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  ALLOWED_EXTENSIONS: [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.txt',
    '.csv',
  ],
} as const;

// JWT Configuration
export const JWT = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
} as const;

// Database
export const DATABASE = {
  CONNECTION_TIMEOUT: 10000,
  QUERY_TIMEOUT: 30000,
  MAX_CONNECTIONS: 10,
} as const;

// Cache
export const CACHE = {
  TTL: {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
  },
  KEYS: {
    USER_SESSION: 'user:session:',
    PROJECT_DATA: 'project:data:',
    DASHBOARD_STATS: 'dashboard:stats:',
    TENANT_CONFIG: 'tenant:config:',
  },
} as const;

// Email Templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  PROJECT_INVITATION: 'project-invitation',
  TASK_ASSIGNMENT: 'task-assignment',
  BUDGET_ALERT: 'budget-alert',
  WEEKLY_REPORT: 'weekly-report',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// Project Status Colors
export const STATUS_COLORS = {
  PLANNING: '#6b7280',
  ACTIVE: '#10b981',
  ON_HOLD: '#f59e0b',
  COMPLETED: '#3b82f6',
  CANCELED: '#ef4444',
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  LOW: '#6b7280',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  URGENT: '#ef4444',
} as const;

// Task Status Colors
export const TASK_STATUS_COLORS = {
  NOT_STARTED: '#6b7280',
  IN_PROGRESS: '#3b82f6',
  COMPLETED: '#10b981',
  ON_HOLD: '#f59e0b',
  CANCELED: '#ef4444',
} as const;

// Cost Status Colors
export const COST_STATUS_COLORS = {
  PLANNED: '#6b7280',
  APPROVED: '#3b82f6',
  ORDERED: '#f59e0b',
  RECEIVED: '#10b981',
  INVOICED: '#8b5cf6',
  PAID: '#059669',
} as const;

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

// Tenant Roles
export const TENANT_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  ESTIMATOR: 'ESTIMATOR',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER',
} as const;

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm',
} as const;

// Currency Codes
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD',
  JPY: 'JPY',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9-]+$/,
  PROJECT_CODE: /^[A-Z0-9-]+$/,
} as const;

// Feature Flags
export const FEATURES = {
  MULTI_TENANT: true,
  REAL_TIME_UPDATES: true,
  ADVANCED_REPORTING: true,
  MOBILE_APP: false,
  AI_INSIGHTS: false,
  INTEGRATION_API: true,
} as const;
