// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  role: 'user' | 'analyst' | 'admin';
  isActive: boolean;
  lastLogin: string;
  profilePicture?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      threatAlerts: boolean;
      systemUpdates: boolean;
    };
    dashboard: {
      widgets: string[];
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
}

// Threat Types
export interface Threat {
  _id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'malware' | 'phishing' | 'ddos' | 'data_breach' | 'insider_threat' | 'vulnerability' | 'other';
  status: 'active' | 'investigating' | 'resolved' | 'false_positive' | 'closed';
  source: string;
  ipAddress?: string;
  location?: string;
  detectedBy: User;
  resolvedBy?: User;
  detectedAt: string;
  resolvedAt?: string;
  resolution?: string;
  notes?: string;
  additionalData: Record<string, any>;
  tags: string[];
  riskScore: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high' | 'critical';
  affectedSystems: string[];
  indicators: {
    type: 'ip' | 'domain' | 'url' | 'file_hash' | 'email' | 'other';
    value: string;
    description?: string;
  }[];
  timeline: {
    timestamp: string;
    action: string;
    performedBy: User;
    details?: string;
  }[];
  attachments: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
    uploadedBy: User;
  }[];
  relatedThreats: string[];
  escalation: {
    escalated: boolean;
    escalatedAt?: string;
    escalatedTo?: User;
    reason?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
  phone: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'support' | 'sales' | 'partnership' | 'security' | 'other';
  assignedTo?: User;
  submittedAt: string;
  resolvedAt?: string;
  notes?: string;
  response?: string;
  attachments: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
  }[];
  followUp: {
    required: boolean;
    scheduledAt?: string;
    completed: boolean;
    notes?: string;
  };
  source: 'website' | 'email' | 'phone' | 'social_media' | 'referral' | 'other';
  ipAddress?: string;
  userAgent?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Dashboard Types
export interface DashboardStats {
  overview: {
    totalThreats: number;
    activeThreats: number;
    resolvedThreats: number;
    falsePositives: number;
    totalUsers: number;
    monthlyChange: number;
  };
  trends: {
    threatTrends: Array<{
      _id: {
        year: number;
        month: number;
        day: number;
      };
      count: number;
    }>;
    severityDistribution: Array<{
      _id: string;
      count: number;
      percentage: string;
    }>;
    typeDistribution: Array<{
      _id: string;
      count: number;
    }>;
    topSources: Array<{
      _id: string;
      count: number;
    }>;
  };
  performance: {
    responseTime: {
      avgResponseTime: number;
      minResponseTime: number;
      maxResponseTime: number;
    };
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
  phone: string;
}

export interface ThreatFormData {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'malware' | 'phishing' | 'ddos' | 'data_breach' | 'insider_threat' | 'vulnerability' | 'other';
  source: string;
  ipAddress?: string;
  location?: string;
  additionalData?: Record<string, any>;
}

// Filter Types
export interface ThreatFilters {
  page?: number;
  limit?: number;
  severity?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface ContactFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Theme Types
export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  filterable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: T) => void;
  rowKey?: keyof T | string;
}
