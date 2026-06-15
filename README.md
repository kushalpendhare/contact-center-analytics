# AWS Cloud-Native Contact Center Analytics Platform

## Overview

The AWS Cloud-Native Contact Center Analytics Platform is a production-style cloud-native application designed to simulate a modern contact center analytics solution.

The platform enables users to upload customer call recordings, automatically process them through event-driven workflows, perform AI-powered analysis using AWS services, and generate operational insights through dashboards and reports.

This project is being built as a hands-on learning initiative to gain practical experience with AWS, Kubernetes, Terraform, GitOps, DevOps, Cloud Security, Observability, and AI integration.

---

## Project Objectives

- Build a real-world cloud-native application
- Learn AWS architecture and service integration
- Implement Infrastructure as Code using Terraform
- Deploy workloads on Kubernetes (EKS)
- Implement GitOps using ArgoCD
- Create CI/CD pipelines using GitHub Actions
- Implement event-driven architecture
- Integrate AWS Bedrock for AI-powered analytics
- Implement monitoring, logging, and alerting
- Build a portfolio-grade project

---

## Planned Architecture

```text
User
 |
 v
CloudFront
 |
Frontend (React)
 |
API Gateway Service
 |
+-----------------------------+
| Kubernetes (Amazon EKS)     |
|                             |
| Ingestion Service           |
| Analytics Service           |
| Reporting Service           |
| Auth Service                |
+-----------------------------+
 |
 +----> S3
 |
 +----> EventBridge
 |
 +----> SQS
 |
 +----> Lambda
 |
 +----> DynamoDB
 |
 +----> PostgreSQL (RDS)
 |
 +----> Redis (ElastiCache)
 |
 +----> AWS Bedrock
```

---

## Technology Stack

### Cloud

- AWS

### Infrastructure as Code

- Terraform

### Containerization

- Docker

### Container Orchestration

- Kubernetes
- Amazon EKS

### GitOps

- ArgoCD

### CI/CD

- GitHub Actions

### Backend

- FastAPI
- Python

### Frontend

- React
- TypeScript

### Databases

- PostgreSQL
- Redis
- DynamoDB

### Messaging & Events

- EventBridge
- SQS
- SNS

### AI Services

- AWS Bedrock

### Monitoring

- CloudWatch
- Prometheus
- Grafana

---

## Repository Structure

```text
contact-center-analytics/

├── applications/
├── terraform/
├── kubernetes/
├── helm/
├── argocd/
├── docs/
├── scripts/
├── tests/
└── .github/
```

---

## Project Roadmap

### Phase 0 - Foundation

- [x] Project Charter
- [x] Repository Structure
- [ ] Development Environment
- [ ] GitHub Actions Setup

### Phase 1 - Core Application

- [ ] FastAPI Backend
- [ ] React Frontend
- [ ] PostgreSQL Integration
- [ ] Dockerization

### Phase 2 - Kubernetes

- [ ] Local Kubernetes Deployment
- [ ] Helm Charts
- [ ] ArgoCD

### Phase 3 - AWS Infrastructure

- [ ] VPC
- [ ] EKS
- [ ] RDS
- [ ] S3
- [ ] ECR

### Phase 4 - Event Driven Processing

- [ ] EventBridge
- [ ] SQS
- [ ] Lambda
- [ ] Metadata Pipeline

### Phase 5 - AI Analytics

- [ ] AWS Bedrock Integration
- [ ] Call Summaries
- [ ] Sentiment Analysis
- [ ] Agent Performance Insights

### Phase 6 - Production Readiness

- [ ] Monitoring
- [ ] Logging
- [ ] Security Hardening
- [ ] Cost Optimization

---

## Status

Current Phase: Foundation

Project Start: 2026

Author: Kushal Pendhare