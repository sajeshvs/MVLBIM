# 🔐 Security & Authentication Architecture

## Overview
Design a comprehensive security framework that meets enterprise construction industry requirements while enabling secure API access and multi-tenant data isolation. Security is critical given the sensitive financial and commercial nature of construction project data.

## Authentication Strategy

### 1. Multi-Factor Authentication (MFA)
```typescript
interface AuthenticationConfig {
  primaryMethods: ['password', 'oauth', 'saml'];
  mfaMethods: ['totp', 'sms', 'email', 'hardware_key'];
  sessionManagement: {
    jwtExpiry: '1h';
    refreshTokenExpiry: '30d';
    concurrentSessions: 5;
    sessionTimeout: '2h';
  };
}
```

**Features:**
- Time-based OTP (TOTP) using authenticator apps
- SMS/Email backup codes
- Hardware security keys (FIDO2/WebAuthn)
- Adaptive authentication based on risk assessment
- Remember device functionality

### 2. Enterprise SSO Integration
```yaml
# SAML 2.0 Configuration
saml:
  providers:
    - name: "Active Directory"
      entityId: "urn:company:ad"
      ssoUrl: "https://adfs.company.com/adfs/ls/"
      certificate: "X509_CERT_DATA"
    
# OAuth 2.0 / OpenID Connect
oauth:
  providers:
    - name: "Microsoft Azure AD"
      clientId: "${AZURE_CLIENT_ID}"
      clientSecret: "${AZURE_CLIENT_SECRET}"
      tenantId: "${AZURE_TENANT_ID}"
```

**Enterprise Features:**
- SAML 2.0 for traditional enterprises
- OpenID Connect for modern cloud providers
- Just-in-time (JIT) user provisioning
- Group/role mapping from identity providers
- Certificate-based authentication

### 3. API Authentication
```typescript
// API Key Management
interface ApiKey {
  id: string;
  name: string;
  permissions: Permission[];
  rateLimit: number;
  expiresAt: Date;
  lastUsed: Date;
  ipWhitelist?: string[];
}

// JWT Structure
interface JWTPayload {
  sub: string;        // User ID
  org: string;        // Organization ID
  role: string;       // User role
  permissions: string[];
  iat: number;
  exp: number;
  jti: string;        // JWT ID for revocation
}
```

## Authorization Framework

### 1. Role-Based Access Control (RBAC)
```sql
-- Roles Hierarchy
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_role_id UUID REFERENCES roles(id),
  organization_id UUID REFERENCES organizations(id),
  is_system_role BOOLEAN DEFAULT false
);

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  resource VARCHAR(100) NOT NULL,    -- 'project', 'boq', 'schedule'
  action VARCHAR(50) NOT NULL,       -- 'create', 'read', 'update', 'delete'
  scope VARCHAR(50) DEFAULT 'own'    -- 'own', 'team', 'project', 'organization'
);

-- Role Permissions
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id),
  permission_id UUID REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);
```

**Predefined Roles:**
- **System Admin**: Full system access
- **Organization Admin**: Full organization access
- **Project Manager**: Project-level management
- **Senior Estimator**: Full estimating access
- **Estimator**: Limited estimating access
- **Quantity Surveyor**: QTO and measurement access
- **Commercial Manager**: Valuations and variations
- **Viewer**: Read-only access

### 2. Attribute-Based Access Control (ABAC)
```typescript
interface AccessPolicy {
  id: string;
  name: string;
  rules: PolicyRule[];
}

interface PolicyRule {
  effect: 'allow' | 'deny';
  subject: AttributeCondition;
  resource: AttributeCondition;
  action: string[];
  condition?: string; // CEL expression
}

// Example: Only allow editing BOQ during estimation phase
const estimationPhasePolicy: PolicyRule = {
  effect: 'allow',
  subject: { role: 'estimator' },
  resource: { type: 'boq', projectPhase: 'estimation' },
  action: ['update'],
  condition: 'resource.status == "draft"'
};
```

### 3. Data-Level Security
```sql
-- Row Level Security (RLS) Policies
CREATE POLICY organization_isolation ON projects
  FOR ALL TO authenticated_users
  USING (organization_id = current_setting('app.current_organization')::UUID);

-- Column Level Security
GRANT SELECT (id, name, description) ON projects TO estimator_role;
GRANT SELECT (id, name, description, total_cost) ON projects TO manager_role;

-- Field-Level Encryption
CREATE TABLE encrypted_commercial_terms (
  id UUID PRIMARY KEY,
  project_id UUID,
  encrypted_data BYTEA, -- PGP encrypted sensitive data
  key_id VARCHAR(100)   -- Reference to encryption key
);
```

## Data Protection & Privacy

### 1. Encryption Strategy
```yaml
# Encryption Configuration
encryption:
  at_rest:
    database: "AES-256-GCM"
    files: "AES-256-GCM"
    backups: "AES-256-GCM"
  
  in_transit:
    api: "TLS 1.3"
    database: "TLS 1.2+"
    internal: "mTLS"
  
  key_management:
    provider: "AWS KMS" # or Azure Key Vault, HashiCorp Vault
    rotation: "90 days"
    escrow: true
```

**Sensitive Data Handling:**
- PII encryption with separate keys
- Commercial terms encryption
- Payment information tokenization
- Secure key rotation procedures
- Hardware Security Module (HSM) integration

### 2. Data Loss Prevention (DLP)
```typescript
interface DLPPolicy {
  name: string;
  rules: DLPRule[];
  actions: DLPAction[];
}

interface DLPRule {
  dataType: 'financial' | 'personal' | 'commercial';
  pattern: RegExp;
  threshold: number;
}

// Example: Prevent sharing of detailed cost breakdowns
const costDataProtection: DLPPolicy = {
  name: "Cost Data Protection",
  rules: [{
    dataType: 'financial',
    pattern: /\$[\d,]+\.\d{2}/g,
    threshold: 10 // Alert if >10 financial values in export
  }],
  actions: ['block', 'audit', 'notify_admin']
};
```

## Security Monitoring & Compliance

### 1. Audit Logging
```sql
-- Enhanced Audit Log
CREATE TABLE security_audit_log (
  id UUID PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  user_id UUID,
  organization_id UUID,
  ip_address INET,
  user_agent TEXT,
  resource_type VARCHAR(100),
  resource_id UUID,
  action VARCHAR(50),
  outcome VARCHAR(20), -- 'success', 'failure', 'blocked'
  risk_score INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Queries
SELECT user_id, COUNT(*) as failed_logins
FROM security_audit_log 
WHERE event_type = 'login_attempt' 
  AND outcome = 'failure'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY user_id
HAVING COUNT(*) > 5;
```

### 2. Threat Detection
```typescript
interface ThreatDetectionRule {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  conditions: ThreatCondition[];
  actions: ThreatAction[];
}

// Example: Suspicious data access pattern
const dataExfiltrationRule: ThreatDetectionRule = {
  name: "Bulk Data Export",
  description: "User downloading large amounts of financial data",
  severity: 'high',
  conditions: [{
    metric: 'export_volume',
    threshold: '1000 records',
    timeWindow: '10 minutes'
  }],
  actions: ['block_user', 'notify_admin', 'require_mfa']
};
```

### 3. Compliance Frameworks
```yaml
# SOC 2 Type II Controls
soc2_controls:
  access_control:
    - user_access_reviews: "quarterly"
    - privileged_access_monitoring: "real-time"
    - session_management: "automated_timeout"
  
  data_protection:
    - encryption_validation: "daily"
    - backup_verification: "weekly"
    - data_retention: "policy_based"

# ISO 27001 Requirements
iso27001:
  risk_management:
    - risk_assessments: "annual"
    - vulnerability_scans: "monthly"
    - penetration_testing: "annual"
  
  incident_response:
    - response_plan: "documented"
    - escalation_procedures: "defined"
    - recovery_testing: "quarterly"
```

## API Security

### 1. Rate Limiting & DDoS Protection
```typescript
interface RateLimitConfig {
  global: {
    requests: 10000;
    window: '1h';
  };
  
  authenticated: {
    requests: 1000;
    window: '1h';
  };
  
  api_key: {
    requests: 5000;
    window: '1h';
  };
  
  sensitive_endpoints: {
    '/api/v1/export/*': {
      requests: 10;
      window: '1h';
    };
  };
}
```

### 2. API Security Headers
```typescript
// Security Middleware
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};
```

### 3. Input Validation & Sanitization
```typescript
interface ValidationSchema {
  boqItem: {
    quantity: {
      type: 'number';
      minimum: 0;
      maximum: 1000000;
    };
    description: {
      type: 'string';
      maxLength: 500;
      sanitize: 'html';
    };
  };
}

// SQL Injection Prevention
const parameterizedQuery = `
  SELECT * FROM boq_items 
  WHERE project_id = $1 
    AND description ILIKE $2
    AND organization_id = $3
`;
```

## Infrastructure Security

### 1. Network Security
```yaml
# VPC Configuration
vpc:
  cidr: "10.0.0.0/16"
  
  subnets:
    public:
      - "10.0.1.0/24"  # Load balancers
      - "10.0.2.0/24"  # NAT gateways
    
    private:
      - "10.0.10.0/24" # Application servers
      - "10.0.11.0/24" # Application servers
    
    database:
      - "10.0.20.0/24" # Database servers
      - "10.0.21.0/24" # Database servers

# Security Groups
security_groups:
  web_tier:
    ingress:
      - port: 443
        source: "0.0.0.0/0"
        protocol: "tcp"
  
  app_tier:
    ingress:
      - port: 8080
        source: "sg-web-tier"
        protocol: "tcp"
  
  database_tier:
    ingress:
      - port: 5432
        source: "sg-app-tier"
        protocol: "tcp"
```

### 2. Container Security
```dockerfile
# Secure Base Image
FROM node:18-alpine AS base
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Security scanning
FROM base AS security-scan
COPY package*.json ./
RUN npm audit --audit-level moderate

# Production image
FROM base AS runner
USER nextjs
EXPOSE 3000
ENV NODE_ENV production
```

## Incident Response

### 1. Security Incident Classification
```typescript
enum IncidentSeverity {
  LOW = 'low',           // Minor policy violation
  MEDIUM = 'medium',     // Unauthorized access attempt
  HIGH = 'high',         // Data breach suspected
  CRITICAL = 'critical'  // Active data exfiltration
}

interface SecurityIncident {
  id: string;
  severity: IncidentSeverity;
  category: string;
  description: string;
  affectedResources: string[];
  detectedAt: Date;
  containedAt?: Date;
  resolvedAt?: Date;
  assignedTo: string;
}
```

### 2. Automated Response Actions
```typescript
const automaticResponses = {
  'brute_force_attack': [
    'block_ip_address',
    'disable_user_account',
    'notify_security_team'
  ],
  
  'data_exfiltration': [
    'revoke_api_keys',
    'force_password_reset',
    'enable_enhanced_monitoring',
    'notify_legal_team'
  ],
  
  'privilege_escalation': [
    'revoke_elevated_permissions',
    'audit_user_activities',
    'notify_admin'
  ]
};
```

## Implementation Timeline

### Phase 1: Foundation (Months 1-2)
- [ ] Basic authentication system with JWT
- [ ] RBAC implementation
- [ ] Database RLS policies
- [ ] Security audit logging
- [ ] Rate limiting

### Phase 2: Enterprise Features (Months 3-4)
- [ ] SSO integration (SAML/OAuth)
- [ ] MFA implementation
- [ ] API key management
- [ ] Advanced threat detection
- [ ] Compliance reporting

### Phase 3: Advanced Security (Months 5-6)
- [ ] ABAC policy engine
- [ ] DLP implementation
- [ ] Advanced monitoring
- [ ] Incident response automation
- [ ] Security testing automation

## Compliance & Certifications

### Target Certifications
- [ ] **SOC 2 Type II** - Security, availability, confidentiality
- [ ] **ISO 27001** - Information security management
- [ ] **GDPR Compliance** - Data protection regulation
- [ ] **CCPA Compliance** - California privacy regulation
- [ ] **PIPEDA Compliance** - Canadian privacy law

### Industry-Specific Requirements
- [ ] **Construction Industry Standards**
- [ ] **Financial Data Protection**
- [ ] **Multi-jurisdictional Compliance**
- [ ] **Cross-border Data Transfer**

## Testing & Validation

### Security Testing Strategy
- [ ] Automated security scanning (SAST/DAST)
- [ ] Penetration testing (quarterly)
- [ ] Vulnerability assessments
- [ ] Code security reviews
- [ ] Social engineering tests

### Monitoring & Metrics
- [ ] Failed authentication attempts
- [ ] API security violations
- [ ] Data access patterns
- [ ] Privilege escalation attempts
- [ ] Compliance policy violations

This comprehensive security architecture ensures enterprise-grade protection while maintaining usability and compliance with industry standards.
