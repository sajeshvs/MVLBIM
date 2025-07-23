# Construction Cost Platform (CCP)

A modern, cloud-native construction cost management and project control platform built with a monorepo architecture.

## 🏗️ Architecture

This project is built as a monorepo using:
- **PNPM** for package management
- **TurboRepo** for build orchestration
- **TypeScript** for type safety
- **Prisma** for database management
- **Next.js** for the web frontend
- **Fastify** for the API backend

## 📁 Project Structure

```
.
├── apps/
│   ├── api/          # Fastify backend API
│   └── web/          # Next.js frontend
├── packages/
│   ├── database/     # Prisma schema and utilities
│   ├── shared/       # Shared types and utilities
│   ├── ui-components/ # Reusable UI components
│   └── tsconfig/     # Shared TypeScript configurations
├── infrastructure/   # IaC and deployment configs
└── docs/            # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PNPM 8+
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ccp

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
pnpm db:migrate
pnpm db:seed

# Start development servers
pnpm dev
```

This will start:
- API server on http://localhost:3001
- Web frontend on http://localhost:3000

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages and apps
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with initial data

### Database Management

```bash
# Generate Prisma client
pnpm --filter @ccp/database generate

# Create migration
pnpm --filter @ccp/database migrate

# Reset database
pnpm --filter @ccp/database reset
```

## 📚 Key Features

- **Multi-tenant** project management
- **Real-time** cost tracking and updates
- **Advanced** reporting and analytics
- **Role-based** access control
- **API-first** architecture
- **Cloud-native** deployment
- **Mobile-responsive** design

## 🏢 Target Users

- **General Contractors** - Project oversight and cost control
- **Subcontractors** - Progress tracking and billing
- **Project Managers** - Resource planning and scheduling
- **Cost Consultants** - Analysis and forecasting
- **Owners/Developers** - Budget monitoring and reporting

## 🔐 Security

- JWT-based authentication
- Role-based authorization
- Data encryption at rest and in transit
- SOC 2 Type II compliance ready
- GDPR/CCPA compliant data handling

## 📈 Scalability

- Microservices architecture
- Horizontal scaling support
- CDN integration
- Database sharding ready
- Multi-region deployment

## 🤝 Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.