# Learning Project Rules

This is not a code generation project.

This is a learning project intended to help the project owner gain hands-on experience with:

* AWS
* Terraform
* Docker
* Kubernetes
* GitHub Actions
* ArgoCD
* FastAPI
* React
* PostgreSQL
* Redis
* Microservices
* Cloud Architecture
* SaaS Design
* AI Integration

Before making significant changes:

1. Explain WHY the change is needed.
2. Explain HOW the change fits into the architecture.
3. Explain WHAT files will be modified.
4. Explain the expected outcome.
5. Avoid large refactors without approval.
6. Prefer incremental implementation.
7. Do not blindly generate code.
8. Do not introduce unnecessary complexity.
9. Optimize for learning and understanding.
10. Assume the project owner is building this as a portfolio project and wants to understand every component.

Response Style:

* Keep explanations concise.
* Focus on implementation.
* Avoid repeating project goals in every response.
* Explain only the information relevant to the current task.
* Prefer feature-based delivery over excessive scaffolding.

Preferred Workflow:

Goal
↓
Files To Change
↓
Code
↓
Test
↓
Commit

Not:

Goal
↓
Long Theory
↓
Long Architecture Discussion
↓
Code

When proposing changes, always explain the impact on:

* Local Development
* Docker
* Future AWS Deployment
* Future Kubernetes Deployment

The objective is to learn production-grade engineering practices while building a real SaaS platform.
# AI Contact Center Engineering Platform

## Project Vision

Build a cloud-native SaaS platform for Contact Center Engineers, Architects, Operations Teams, and Consultants.

The platform does NOT replace Genesys, Cisco UCCE, Webex Contact Center, NICE, Five9, Amazon Connect, or other contact center platforms.

Instead, it acts as an engineering productivity and operations platform that helps users perform secondary tasks such as:

* SIP troubleshooting
* Call flow analysis
* AI-assisted IVR generation
* Genesys Architect flow generation
* Cisco CVP/VXML generation
* Recording analysis
* Transcript analysis
* AI summaries
* Compliance validation
* Reporting
* Documentation generation
* Migration assistance
* Knowledge management

Analytics is only one module of the platform.

---

# Current Development Phase

Phase 1: Local MVP Foundation

Current objective:

Build a working local application using:

* React
* FastAPI
* PostgreSQL
* Redis
* Docker Compose

before moving to AWS.

---

# Technology Stack

Frontend

* React
* TypeScript
* Vite

Backend

* FastAPI
* SQLAlchemy
* Alembic

Database

* PostgreSQL

Cache

* Redis

Containers

* Docker
* Docker Compose

Future

* AWS
* Terraform
* EKS
* ArgoCD
* GitHub Actions
* Bedrock
* EventBridge
* SQS
* Lambda
* Cognito

---

# Repository Structure

contact-center-analytics/

applications/

* frontend
* api-gateway
* auth-service
* analytics-service
* ingestion-service
* reporting-service

terraform/
kubernetes/
helm/
argocd/
docs/

---

# Current Backend Status

Working:

* FastAPI API Gateway
* PostgreSQL connectivity
* Redis connectivity
* SQLAlchemy
* Alembic
* Project CRUD foundation

Current Business Entity:

Project

Project fields:

* id
* name
* platform
* customer

Current API:

GET /projects

POST /projects

Current API Gateway Structure:

src/

core/

* config.py
* database.py
* redis_client.py

models/

* base.py
* project.py
* call.py

schemas/

* project.py

services/

* project_service.py

routers/

* projects.py

---

# Current Frontend Status

Working:

* React application
* Project page
* Project creation
* Project listing
* FastAPI integration

Planned Pages:

* Dashboard
* Projects
* SIP Analysis
* Recordings
* AI Assistant
* Reports
* Settings

---

# Architecture Principles

Always follow:

1. Cloud-native architecture
2. Event-driven design
3. API-first design
4. Infrastructure as Code
5. Docker-first development
6. AWS best practices
7. Production-grade patterns
8. Microservice-friendly structure
9. Clean code
10. Separation of concerns

---

# Data Model Direction

Projects are the top-level entity.

Future structure:

Tenant
└── Projects
├── SIP Traces
├── Recordings
├── Transcripts
├── AI Analysis
├── Reports
├── Architect Flows
└── Knowledge Articles

All future modules should attach to Projects.

Avoid designing around Calls as the primary entity.

Projects are the platform root object.

---

# Coding Rules

1. Reuse existing project structure.
2. Do not create duplicate architecture patterns.
3. Prefer service layer over business logic in routers.
4. Use SQLAlchemy ORM.
5. Use Alembic migrations.
6. Keep code production-ready.
7. Keep code simple and maintainable.
8. Explain file changes before major refactoring.
9. Do not introduce unnecessary frameworks.
10. Prefer incremental changes.

---

# Current Priority

Build the SaaS UI foundation.

Next likely tasks:

* Sidebar navigation
* Main layout
* Dashboard page
* Project detail page
* PUT /projects/{id}
* DELETE /projects/{id}
* Project management UI

Focus on delivering working features rather than excessive scaffolding.
