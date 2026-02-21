---
title: Kubernetes Homelab Cluster
publishDate: 2026-02-15 00:00:00
img: /assets/talos-k8s.png
img_alt: A highly detailed 3D isometric representation of an immutable bare metal server cluster
description: |
  A highly available Kubernetes cluster running on bare metal Talos Linux, managed entirely via GitOps with ArgoCD.
tags:
  - Kubernetes
  - Talos Linux
  - Bare Metal
  - Infrastructure as Code
---

> Design and implementation of an immutable, secure, and self-hosted Kubernetes cluster for enterprise-grade home infrastructure.

## Project Overview

This project involved designing and deploying a robust Kubernetes cluster to host various self-hosted services, including full CI/CD pipelines, databases, and monitoring stacks. Taking a modern approach, the cluster runs on **Talos Linux**, an immutable operating system designed specifically for Kubernetes.

### Key Features

- **Immutable Infrastructure**: Built on Talos Linux, ensuring a read-only file system, no SSH access, and declarative API-first management.
- **GitOps Ecosystem**: Managed entirely through Git using ArgoCD (`App of Apps` pattern), ensuring version-controlled and reproducible infrastructure.
- **High Availability**: Multi-node Control Plane with highly available etcd running on fast NVMe storage.
- **Advanced Networking**: Cilium acting as the CNI (Container Network Interface) replacing kube-proxy, providing eBPF-based high-performance networking and security policies.
- **Distributed Storage**: Longhorn implemented for replicated, highly available block storage across all nodes.

### Technologies Used

- Talos Linux
- Kubernetes (v1.35+)
- Cilium (eBPF CNI)
- ArgoCD
- Longhorn Storage

This project demonstrates the ability to architect, deploy, and manage a "Day 2" ready Kubernetes cluster, treating bare-metal servers with the same operational maturity as public cloud infrastructure.
