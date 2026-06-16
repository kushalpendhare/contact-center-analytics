# High Level Architecture

## Purpose

The Contact Center Analytics Platform provides AI-powered analytics for customer interactions.

Users upload call recordings which are processed through an event-driven architecture and analyzed using AWS AI services.

---

## Core Components

### Frontend

React application providing:

- User Authentication
- Recording Upload
- Dashboard
- Reporting

---

### API Gateway Service

Responsibilities:

- Route requests
- Authentication validation
- Service aggregation

Technology:

- FastAPI

---

### Ingestion Service

Responsibilities:

- Receive recording metadata
- Manage upload workflow
- Trigger processing events

Technology:

- FastAPI

---

### Analytics Service

Responsibilities:

- Process transcripts
- Invoke AWS Bedrock
- Generate insights

Technology:

- Python

---

### Reporting Service

Responsibilities:

- Dashboard APIs
- Historical reporting
- KPI generation

Technology:

- FastAPI

---

### Authentication Service

Responsibilities:

- User management
- JWT validation
- Cognito integration

Technology:

- FastAPI

---

## AWS Services

- Route53
- CloudFront
- ALB
- EKS
- ECR
- S3
- EventBridge
- SQS
- Lambda
- RDS PostgreSQL
- DynamoDB
- Redis
- Cognito
- Secrets Manager
- CloudWatch
- AWS Bedrock

---

## Deployment Model

GitHub
→ GitHub Actions
→ Container Registry (ECR)
→ ArgoCD
→ Amazon EKS