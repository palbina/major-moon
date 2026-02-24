---
title: Pipeline CI/CD & Entrega Progresiva
publishDate: 2026-02-16 00:00:00
img: /assets/gitops-pipeline.png
img_alt: Representación isométrica 3D altamente detallada de un pipeline de software CI/CD
description: |
  Un pipeline GitOps integral de principio a fin, que incluye pruebas automatizadas, compilaciones de Docker y Argo Rollouts para despliegues Canary.
tags:
  - CI/CD
  - GitOps
  - Argo Rollouts
  - GitHub Actions
---

> Diseño de un pipeline de entrega de nivel empresarial que lleva el código desde un commit directamente a un clúster de Kubernetes en producción sin tiempo de inactividad (zero downtime).

## Resumen del Proyecto

Este proyecto se centra en la experiencia del desarrollador y en la fiabilidad de la entrega de software. Establece un pipeline de CI/CD completo, aprovechando una instancia autohospedada de Forgejo para el control de código fuente y la ejecución de la Integración Continua (CI), combinado con ArgoCD para el Despliegue Continuo (CD).

### Características Principales

- **Flujo de Trabajo CI Automatizado**: Cada push activa una Forgejo Action que ejecuta linters, lleva a cabo pruebas unitarias (Pytest/Jest), construye una imagen Docker y la envía a GHCR.
- **GitOps basado en Pull**: ArgoCD supervisa activamente el repositorio de infraestructura y sincroniza automáticamente los manifiestos al clúster al detectar nuevas etiquetas de imagen.
- **Entrega Progresiva (Canary)**: Implementa Argo Rollouts para realizar despliegues Canary. Las nuevas versiones reciben un pequeño porcentaje del tráfico (ej. 10%) antes de la promoción total.
- **Análisis Automatizado**: Integrado con Prometheus para realizar `AnalysisRuns` automatizados durante la fase Canary. Si las tasas de error se disparan, el despliegue se revierte automáticamente.

### Tecnologías Utilizadas

- Forgejo & Forgejo Actions (CI)
- GitHub Container Registry (GHCR)
- ArgoCD (Motor de CD)
- Argo Rollouts (Entrega Progresiva)
- Prometheus (Métricas de Análisis)

Este proyecto resalta la capacidad de crear vías seguras y automatizadas hacia producción, reduciendo significativamente el riesgo de los lanzamientos a través de despliegues observables e incrementales.
