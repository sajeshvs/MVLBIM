# 🧪 Testing Strategy & Quality Assurance

## Overview
Establish a comprehensive testing framework that ensures the reliability, accuracy, and performance of financial calculations critical to construction project success. Given the high-stakes nature of cost estimation and project control, testing must be exhaustive and automated.

## Testing Pyramid Strategy

### 1. Unit Testing (Foundation - 70%)
```typescript
// Example: BOQ Calculation Unit Tests
describe('BOQCalculationEngine', () => {
  describe('calculateItemAmount', () => {
    it('should calculate simple item amount correctly', () => {
      const item = {
        quantity: 100,
        rate: 25.50,
        markup: 0.15
      };
      
      const result = BOQCalculationEngine.calculateItemAmount(item);
      
      expect(result.baseAmount).toBe(2550.00);
      expect(result.markupAmount).toBe(382.50);
      expect(result.totalAmount).toBe(2932.50);
    });
    
    it('should handle first principles resource breakdown', () => {
      const item = {
        quantity: 10,
        resources: [
          { type: 'labor', quantity: 2, rate: 50, unit: 'hours' },
          { type: 'material', quantity: 100, rate: 1.25, unit: 'kg' },
          { type: 'plant', quantity: 1, rate: 200, unit: 'day' }
        ]
      };
      
      const result = BOQCalculationEngine.calculateFromResources(item);
      
      expect(result.laborCost).toBe(1000); // 10 * 2 * 50
      expect(result.materialCost).toBe(1250); // 10 * 100 * 1.25
      expect(result.plantCost).toBe(2000); // 10 * 1 * 200
      expect(result.totalCost).toBe(4250);
    });
  });
  
  describe('hierarchical resource calculations', () => {
    it('should calculate composite resource correctly', () => {
      const compositeResource = {
        id: 'concrete-crew',
        components: [
          { resourceId: 'foreman', quantity: 1, rate: 75 },
          { resourceId: 'laborer', quantity: 4, rate: 45 },
          { resourceId: 'concrete-pump', quantity: 1, rate: 500 }
        ]
      };
      
      const result = ResourceCalculator.calculateComposite(compositeResource);
      
      expect(result.totalRate).toBe(755); // 75 + (4*45) + 500
    });
  });
});

// Test Configuration
export const testConfig = {
  coverage: {
    statements: 95,
    branches: 90,
    functions: 95,
    lines: 95
  },
  
  performance: {
    calculationTimeout: 100, // ms
    memoryLeakThreshold: '10MB'
  }
};
```

### 2. Integration Testing (25%)
```typescript
// Database Integration Tests
describe('BOQ Integration Tests', () => {
  let testDb: TestDatabase;
  let boqService: BOQService;
  
  beforeEach(async () => {
    testDb = await createTestDatabase();
    boqService = new BOQService(testDb);
  });
  
  afterEach(async () => {
    await testDb.cleanup();
  });
  
  describe('BOQ-Schedule Integration', () => {
    it('should maintain cost-time link when schedule changes', async () => {
      // Create test project with BOQ and schedule
      const project = await createTestProject();
      const boq = await boqService.createBOQ(project.id, testBOQData);
      const schedule = await scheduleService.createSchedule(project.id, testScheduleData);
      
      // Link BOQ items to activities
      await linkingService.linkBOQToActivity(boq.items[0].id, schedule.activities[0].id);
      
      // Modify schedule duration
      await scheduleService.updateActivityDuration(schedule.activities[0].id, 10);
      
      // Verify cost distribution is recalculated
      const updatedForecast = await forecastService.generateCashFlow(project.id);
      expect(updatedForecast.periods).toHaveLength(10);
      expect(updatedForecast.totalCost).toBe(boq.totalAmount);
    });
  });
  
  describe('EVM Integration', () => {
    it('should calculate performance metrics correctly', async () => {
      const project = await createTestProject();
      
      // Set up baseline
      await evmService.setBaseline(project.id, {
        plannedValue: 100000,
        baselineDate: new Date('2025-01-01')
      });
      
      // Record actual costs
      await evmService.recordActualCost(project.id, {
        date: new Date('2025-01-15'),
        amount: 45000
      });
      
      // Record earned value
      await evmService.recordEarnedValue(project.id, {
        date: new Date('2025-01-15'),
        percentage: 40
      });
      
      const metrics = await evmService.calculateMetrics(project.id);
      
      expect(metrics.cpi).toBeCloseTo(0.89, 2); // 40000/45000
      expect(metrics.spi).toBeCloseTo(0.8, 2);   // 40000/50000
    });
  });
});

// API Integration Tests
describe('API Integration', () => {
  it('should handle concurrent BOQ updates', async () => {
    const projectId = 'test-project-1';
    
    // Simulate multiple users editing BOQ simultaneously
    const promises = Array.from({ length: 5 }, (_, i) => 
      request(app)
        .put(`/api/v1/projects/${projectId}/boq/items/item-${i}`)
        .send({ quantity: 100 + i, rate: 25.50 })
        .expect(200)
    );
    
    const results = await Promise.all(promises);
    
    // Verify all updates succeeded and no data corruption
    const boq = await request(app)
      .get(`/api/v1/projects/${projectId}/boq`)
      .expect(200);
    
    expect(boq.body.items).toHaveLength(5);
    expect(boq.body.totalAmount).toBeGreaterThan(0);
  });
});
```

### 3. End-to-End Testing (5%)
```typescript
// Playwright E2E Tests
import { test, expect } from '@playwright/test';

test.describe('Complete Estimating Workflow', () => {
  test('should complete full estimation process', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid=email]', 'estimator@company.com');
    await page.fill('[data-testid=password]', 'password');
    await page.click('[data-testid=login-button]');
    
    // Create new project
    await page.click('[data-testid=new-project]');
    await page.fill('[data-testid=project-name]', 'Highway Extension Project');
    await page.selectOption('[data-testid=project-type]', 'infrastructure');
    await page.click('[data-testid=create-project]');
    
    // Import BOQ from Excel
    await page.click('[data-testid=import-boq]');
    await page.setInputFiles('[data-testid=file-upload]', 'test-data/sample-boq.xlsx');
    await page.click('[data-testid=import-confirm]');
    
    await expect(page.locator('[data-testid=boq-table]')).toBeVisible();
    await expect(page.locator('[data-testid=boq-item]')).toHaveCount(50);
    
    // Edit rate for an item using first principles
    await page.click('[data-testid=boq-item]:first-child');
    await page.click('[data-testid=edit-rate]');
    
    // Add labor resource
    await page.click('[data-testid=add-resource]');
    await page.selectOption('[data-testid=resource-type]', 'labor');
    await page.fill('[data-testid=resource-quantity]', '8');
    await page.fill('[data-testid=resource-rate]', '45');
    await page.click('[data-testid=add-resource-confirm]');
    
    // Verify calculation
    await expect(page.locator('[data-testid=calculated-rate]')).toHaveText('$360.00');
    
    // Create project schedule
    await page.click('[data-testid=planning-tab]');
    await page.click('[data-testid=create-schedule]');
    
    // Add activities
    await page.click('[data-testid=add-activity]');
    await page.fill('[data-testid=activity-name]', 'Site Preparation');
    await page.fill('[data-testid=activity-duration]', '5');
    
    // Link BOQ to schedule
    await page.click('[data-testid=link-boq-schedule]');
    await page.dragAndDrop('[data-testid=boq-item]:first-child', '[data-testid=activity]:first-child');
    
    // Verify time-money link
    await page.click('[data-testid=forecasting-tab]');
    await expect(page.locator('[data-testid=cash-flow-chart]')).toBeVisible();
    
    // Generate final estimate
    await page.click('[data-testid=generate-estimate]');
    await page.selectOption('[data-testid=markup-type]', 'percentage');
    await page.fill('[data-testid=markup-value]', '15');
    await page.click('[data-testid=calculate-final]');
    
    // Verify final totals
    await expect(page.locator('[data-testid=final-amount]')).toContainText('$');
    await expect(page.locator('[data-testid=markup-amount]')).toContainText('$');
  });
});

// Mobile E2E Tests
test.describe('Mobile Take-Off Workflow', () => {
  test.use({ viewport: { width: 768, height: 1024 } });
  
  test('should perform quantity takeoff on tablet', async ({ page }) => {
    await page.goto('/projects/1/takeoff');
    
    // Upload drawing
    await page.click('[data-testid=upload-drawing]');
    await page.setInputFiles('[data-testid=drawing-upload]', 'test-data/plan.pdf');
    
    // Wait for drawing to load
    await expect(page.locator('[data-testid=drawing-viewer]')).toBeVisible();
    
    // Select measurement tool
    await page.click('[data-testid=area-tool]');
    
    // Perform measurement (simulate touch points)
    const viewer = page.locator('[data-testid=drawing-viewer]');
    await viewer.click({ position: { x: 100, y: 100 } });
    await viewer.click({ position: { x: 200, y: 100 } });
    await viewer.click({ position: { x: 200, y: 200 } });
    await viewer.click({ position: { x: 100, y: 200 } });
    await viewer.dblclick({ position: { x: 100, y: 100 } }); // Close polygon
    
    // Verify measurement
    await expect(page.locator('[data-testid=measurement-area]')).toContainText('10,000 sq ft');
    
    // Assign to BOQ item
    await page.selectOption('[data-testid=boq-item-select]', 'concrete-slab');
    await page.click('[data-testid=assign-measurement]');
    
    // Verify BOQ update
    await expect(page.locator('[data-testid=boq-quantity]')).toHaveText('10,000');
  });
});
```

## Specialized Testing Requirements

### 1. Financial Calculation Testing
```typescript
// Property-Based Testing for Financial Calculations
import fc from 'fast-check';

describe('Financial Calculation Properties', () => {
  test('rate calculations should be commutative and associative', () => {
    fc.assert(fc.property(
      fc.array(fc.record({
        quantity: fc.float({ min: 0.1, max: 1000 }),
        rate: fc.float({ min: 0.01, max: 1000 })
      }), { minLength: 1, maxLength: 10 }),
      (resources) => {
        const total1 = resources.reduce((sum, r) => sum + (r.quantity * r.rate), 0);
        const shuffled = [...resources].sort(() => Math.random() - 0.5);
        const total2 = shuffled.reduce((sum, r) => sum + (r.quantity * r.rate), 0);
        
        expect(total1).toBeCloseTo(total2, 2);
      }
    ));
  });
  
  test('markup calculations should preserve ratios', () => {
    fc.assert(fc.property(
      fc.float({ min: 100, max: 100000 }),
      fc.float({ min: 0.01, max: 0.5 }),
      (baseAmount, markupRate) => {
        const result = applyMarkup(baseAmount, markupRate);
        const calculatedRate = (result.totalAmount - result.baseAmount) / result.baseAmount;
        
        expect(calculatedRate).toBeCloseTo(markupRate, 4);
      }
    ));
  });
});

// Precision Testing for Currency Calculations
describe('Currency Precision', () => {
  test('should maintain precision in complex calculations', () => {
    const scenarios = [
      { qty: 1/3, rate: 3.33, expected: 1.11 },
      { qty: 7, rate: 142.857142857, expected: 1000 },
      { qty: 0.1, rate: 999.99, expected: 99.999 }
    ];
    
    scenarios.forEach(({ qty, rate, expected }) => {
      const result = calculateAmount(qty, rate);
      expect(result).toBeCloseTo(expected, 2);
    });
  });
});
```

### 2. Performance Testing
```typescript
// Load Testing Configuration
export const loadTestConfig = {
  scenarios: {
    boq_editing: {
      executor: 'ramping-vus',
      options: {
        stages: [
          { duration: '5m', target: 50 },   // Ramp up
          { duration: '30m', target: 50 },  // Stay at 50 users
          { duration: '5m', target: 100 },  // Ramp to 100
          { duration: '30m', target: 100 }, // Stay at 100
          { duration: '5m', target: 0 }     // Ramp down
        ]
      },
      env: { SCENARIO: 'boq_editing' }
    },
    
    calculation_heavy: {
      executor: 'constant-vus',
      options: {
        vus: 20,
        duration: '10m'
      },
      env: { SCENARIO: 'heavy_calculations' }
    }
  },
  
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
    calculation_time: ['p(99)<1000']  // 99% calculations under 1s
  }
};

// K6 Load Test Script
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function() {
  const scenario = __ENV.SCENARIO;
  
  if (scenario === 'boq_editing') {
    testBOQEditing();
  } else if (scenario === 'heavy_calculations') {
    testHeavyCalculations();
  }
}

function testBOQEditing() {
  // Login
  const loginResponse = http.post('https://api.mvlbim.com/auth/login', {
    email: 'test@example.com',
    password: 'password'
  });
  
  check(loginResponse, { 'login successful': (r) => r.status === 200 });
  
  const token = loginResponse.json('token');
  const headers = { Authorization: `Bearer ${token}` };
  
  // Update BOQ item
  const updateResponse = http.put(
    'https://api.mvlbim.com/api/v1/projects/test-project/boq/items/item-1',
    JSON.stringify({
      quantity: Math.random() * 1000,
      rate: Math.random() * 100
    }),
    { headers }
  );
  
  check(updateResponse, {
    'update successful': (r) => r.status === 200,
    'calculation completed': (r) => r.json('calculatedAmount') > 0
  });
  
  sleep(1);
}
```

### 3. Security Testing
```typescript
// Security Test Suite
describe('Security Tests', () => {
  describe('SQL Injection Prevention', () => {
    const maliciousInputs = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'/*",
      "'; INSERT INTO users VALUES('hacker','password'); --"
    ];
    
    maliciousInputs.forEach(input => {
      test(`should handle malicious input: ${input}`, async () => {
        const response = await request(app)
          .get('/api/v1/projects')
          .query({ search: input })
          .expect(400);
        
        expect(response.body.error).toMatch(/invalid input/i);
      });
    });
  });
  
  describe('Authentication Tests', () => {
    test('should reject invalid JWT tokens', async () => {
      await request(app)
        .get('/api/v1/projects')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(401);
    });
    
    test('should enforce rate limiting', async () => {
      const promises = Array.from({ length: 1001 }, () =>
        request(app).post('/api/v1/auth/login').send({
          email: 'test@example.com',
          password: 'wrong'
        })
      );
      
      const responses = await Promise.all(promises);
      const rateLimited = responses.filter(r => r.status === 429);
      
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });
});
```

## Data Quality Testing

### 1. Migration Testing
```typescript
// Database Migration Tests
describe('Data Migration Tests', () => {
  test('should migrate legacy data without loss', async () => {
    // Create legacy data structure
    const legacyData = await createLegacyProject({
      boq: legacyBOQStructure,
      resources: legacyResourceStructure
    });
    
    // Run migration
    await runMigration('legacy_to_v2');
    
    // Verify data integrity
    const migratedProject = await findProject(legacyData.id);
    
    expect(migratedProject.boq.totalAmount).toBe(legacyData.boq.totalAmount);
    expect(migratedProject.resources).toHaveLength(legacyData.resources.length);
    
    // Verify calculations still work
    const recalculated = await recalculateProject(migratedProject.id);
    expect(recalculated.totalAmount).toBeCloseTo(migratedProject.boq.totalAmount, 2);
  });
});

// Data Validation Tests
describe('Data Validation', () => {
  test('should validate BOQ import data', async () => {
    const invalidBOQ = {
      items: [
        { quantity: -10, rate: 100 },  // Negative quantity
        { quantity: 'invalid', rate: 50 }, // Non-numeric quantity
        { quantity: 100 } // Missing rate
      ]
    };
    
    const validation = await validateBOQData(invalidBOQ);
    
    expect(validation.valid).toBe(false);
    expect(validation.errors).toHaveLength(3);
    expect(validation.errors[0].field).toBe('items[0].quantity');
    expect(validation.errors[0].message).toMatch(/must be positive/);
  });
});
```

### 2. Business Rule Testing
```typescript
// Business Logic Tests
describe('Construction Business Rules', () => {
  test('should enforce project phase constraints', async () => {
    const project = await createProject({ phase: 'tendering' });
    
    // Should allow BOQ editing during tendering
    await expect(updateBOQItem(project.id, { quantity: 100 })).resolves.not.toThrow();
    
    // Change to construction phase
    await updateProjectPhase(project.id, 'construction');
    
    // Should prevent BOQ editing during construction
    await expect(updateBOQItem(project.id, { quantity: 200 })).rejects.toThrow('Cannot modify BOQ during construction');
  });
  
  test('should calculate retention correctly', async () => {
    const valuation = {
      grossAmount: 100000,
      retentionRate: 0.05,
      previousRetention: 2000
    };
    
    const result = calculateRetention(valuation);
    
    expect(result.currentRetention).toBe(3000); // 5% of cumulative
    expect(result.retentionDeduction).toBe(1000); // New retention only
  });
});
```

## Automated Quality Gates

### 1. Pre-Commit Hooks
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-json
      - id: check-yaml
      - id: check-merge-conflict

  - repo: local
    hooks:
      - id: eslint
        name: ESLint
        entry: npm run lint
        language: node
        types: [javascript, typescript]
        
      - id: unit-tests
        name: Unit Tests
        entry: npm run test:unit
        language: node
        pass_filenames: false
        
      - id: security-scan
        name: Security Scan
        entry: npm audit --audit-level high
        language: node
        pass_filenames: false
```

### 2. CI Quality Gates
```yaml
# Quality Gate Configuration
quality_gates:
  code_coverage:
    minimum: 90
    trend: "no_decrease"
  
  security_rating: "A"
  
  maintainability_rating: "A"
  
  reliability_rating: "A"
  
  technical_debt_ratio:
    maximum: "5%"
  
  duplicated_lines_density:
    maximum: "3%"
  
  cyclomatic_complexity:
    maximum: 15
    
  cognitive_complexity:
    maximum: 15

# SonarQube Configuration
sonar:
  exclusions:
    - "**/*.test.ts"
    - "**/*.spec.ts"
    - "**/test-utils/**"
  
  coverage:
    exclusions:
      - "**/types/**"
      - "**/constants/**"
      - "**/mocks/**"
```

## Test Data Management

### 1. Test Data Factory
```typescript
// Test Data Factory
export class TestDataFactory {
  static createProject(overrides?: Partial<Project>): Project {
    return {
      id: faker.datatype.uuid(),
      name: faker.company.companyName() + ' Project',
      code: faker.random.alphaNumeric(8).toUpperCase(),
      client: faker.company.companyName(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      baseCurrency: 'USD',
      ...overrides
    };
  }
  
  static createBOQItem(overrides?: Partial<BOQItem>): BOQItem {
    return {
      id: faker.datatype.uuid(),
      code: faker.random.alphaNumeric(6),
      description: faker.lorem.sentence(),
      unit: faker.helpers.arrayElement(['m3', 'm2', 'linear m', 'each']),
      quantity: faker.datatype.number({ min: 1, max: 1000 }),
      rate: faker.datatype.number({ min: 10, max: 500, precision: 0.01 }),
      ...overrides
    };
  }
  
  static createResource(type: ResourceType, overrides?: Partial<Resource>): Resource {
    const baseRates = {
      labor: { min: 25, max: 100 },
      material: { min: 1, max: 50 },
      plant: { min: 100, max: 2000 },
      subcontractor: { min: 500, max: 10000 }
    };
    
    return {
      id: faker.datatype.uuid(),
      code: faker.random.alphaNumeric(8),
      name: `${type} ${faker.lorem.word()}`,
      type,
      unit: getUnitForResourceType(type),
      baseRate: faker.datatype.number({
        min: baseRates[type].min,
        max: baseRates[type].max,
        precision: 0.01
      }),
      ...overrides
    };
  }
}

// Realistic Test Scenarios
export const testScenarios = {
  smallResidential: {
    projectValue: 500000,
    boqItems: 50,
    activities: 25,
    duration: 120
  },
  
  commercialBuilding: {
    projectValue: 5000000,
    boqItems: 200,
    activities: 100,
    duration: 365
  },
  
  infrastructureProject: {
    projectValue: 50000000,
    boqItems: 1000,
    activities: 500,
    duration: 1095
  }
};
```

### 2. Environment Management
```typescript
// Test Environment Configuration
export const testEnvironments = {
  unit: {
    database: ':memory:',
    redis: 'redis-mock',
    features: ['all'],
    timeout: 5000
  },
  
  integration: {
    database: 'postgresql://test:test@localhost:5432/mvlbim_test',
    redis: 'redis://localhost:6379/1',
    features: ['all'],
    timeout: 30000
  },
  
  e2e: {
    baseUrl: 'http://localhost:3000',
    database: 'postgresql://test:test@localhost:5432/mvlbim_e2e',
    timeout: 60000,
    retries: 2
  }
};
```

## Performance Benchmarking

### 1. Calculation Performance Tests
```typescript
// Performance Benchmarks
describe('Performance Benchmarks', () => {
  test('should calculate large BOQ within time limit', async () => {
    const largeBOQ = TestDataFactory.createLargeBOQ(10000); // 10k items
    
    const startTime = performance.now();
    const result = await BOQCalculationEngine.calculateTotal(largeBOQ);
    const endTime = performance.now();
    
    const calculationTime = endTime - startTime;
    
    expect(calculationTime).toBeLessThan(5000); // Under 5 seconds
    expect(result.totalAmount).toBeGreaterThan(0);
  });
  
  test('should handle concurrent calculations efficiently', async () => {
    const calculations = Array.from({ length: 100 }, () =>
      BOQCalculationEngine.calculateItemAmount(TestDataFactory.createBOQItem())
    );
    
    const startTime = performance.now();
    await Promise.all(calculations);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(1000); // Under 1 second for 100 calculations
  });
});
```

This comprehensive testing strategy ensures the reliability and accuracy required for construction financial management while maintaining development velocity through automation.
