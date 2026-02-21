---
title: CI/CD Pipeline & Progressive Delivery
publishDate: 2026-02-16 00:00:00
img: /assets/gitops-pipeline.png
img_alt: A highly detailed 3D isometric representation of a CI/CD software pipeline
description: |
  A complete end-to-end GitOps pipeline featuring automated testing, Docker builds, and Argo Rollouts for Canary deployments.
tags:
  - CI/CD
  - GitOps
  - Argo Rollouts
  - GitHub Actions
---

> Designing an enterprise-grade delivery pipeline that takes code from a commit directly to a production Kubernetes cluster with zero downtime.

## Project Overview

This project focuses on the developer experience and the reliability of software delivery. It establishes a complete CI/CD pipeline leveraging a self-hosted Forgejo instance for source control and CI execution, coupled with ArgoCD for continuous deployment.

### Key Features

- **Automated CI Workflow**: Every push triggers a Forgejo Action that runs linters, executes unit tests (Pytest/Jest), builds a Docker image, and pushes it to GHCR.
- **Pull-Based GitOps**: ArgoCD actively monitors the infrastructure repository and automatically synchronizes manifests to the cluster upon detecting new image tags.
- **Progressive Delivery (Canary)**: Implements Argo Rollouts to perform Canary deployments. New versions receive a small percentage of traffic (e.g., 10%) before full promotion.
- **Automated Analysis**: Integrated with Prometheus to perform automated `AnalysisRuns` during the Canary phase. If error rates spike, the deployment automatically rolls back.

### Technologies Used

- Forgejo & Forgejo Actions (CI)
- GitHub Container Registry (GHCR)
- ArgoCD (CD Engine)
- Argo Rollouts (Progressive Delivery)
- Prometheus (Analysis Metrics)

This project highlights the ability to create safe, automated pathways to production, significantly reducing the risk of releases through observable, incremental rollouts.
