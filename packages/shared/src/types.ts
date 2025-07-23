// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
  tenantRole?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Project types
export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  status: string;
  budget: number;
  spent: number;
  progress: number;
  startDate: Date;
  endDate: Date;
}

export interface CostSummary {
  totalBudget: number;
  totalSpent: number;
  totalCommitted: number;
  remainingBudget: number;
  variance: number;
  variancePercent: number;
}

// File upload types
export interface FileUpload {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
}

// Dashboard types
export interface DashboardStats {
  activeProjects: number;
  totalBudget: number;
  totalSpent: number;
  pendingTasks: number;
  overdueTasks: number;
  recentActivities: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}
