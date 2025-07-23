# Infrastructure

This directory contains Infrastructure as Code (IaC) configurations for deploying the Construction Cost Platform.

## Structure

- `docker/` - Docker configurations for development and production
- `terraform/` - Terraform configurations for AWS infrastructure
- `kubernetes/` - Kubernetes manifests for container orchestration
- `scripts/` - Deployment and utility scripts

## Quick Start

### Development with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

```bash
# Initialize Terraform
cd terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

## Services

- **Database**: PostgreSQL 14 with read replicas
- **Cache**: Redis for session and application caching
- **API**: Fastify backend with auto-scaling
- **Web**: Next.js frontend with CDN
- **Storage**: S3-compatible object storage
- **Monitoring**: CloudWatch, Prometheus, Grafana
