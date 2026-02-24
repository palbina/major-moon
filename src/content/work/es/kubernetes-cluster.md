---
title: Clúster Kubernetes Homelab
publishDate: 2026-02-15 00:00:00
img: /assets/talos-k8s.png
img_alt: Representación isométrica 3D altamente detallada de un clúster de servidores bare metal inmutable
description: |
  Un clúster Kubernetes de alta disponibilidad que se ejecuta sobre servidores bare metal con Talos Linux, gestionado completamente mediante GitOps con ArgoCD.
tags:
  - Kubernetes
  - Talos Linux
  - Bare Metal
  - Infraestructura como Código
---

> Diseño e implementación de un clúster Kubernetes inmutable, seguro y autohospedado para una infraestructura doméstica de nivel empresarial.

## Resumen del Proyecto

Este proyecto consistió en diseñar y desplegar un clúster Kubernetes robusto para alojar diversos servicios self-hosted, incluyendo pipelines CI/CD completos, bases de datos y stacks de monitorización. Empleando un enfoque moderno, el clúster se ejecuta sobre **Talos Linux**, un sistema operativo inmutable diseñado específicamente para Kubernetes.

### Características Principales

- **Infraestructura Inmutable**: Construido sobre Talos Linux, lo que garantiza un sistema de archivos de solo lectura, acceso sin SSH y una gestión declarativa centrada en su API.
- **Ecosistema GitOps**: Gestionado en su totalidad a través de Git utilizando ArgoCD (patrón `App of Apps`), garantizando una infraestructura reproducible controlada mediante versiones.
- **Alta Disponibilidad**: Nodo de control multinodo con una base de datos etcd de alta disponibilidad ejecutándose en almacenamiento rápido NVMe.
- **Redes Avanzadas**: Uso de Cilium como CNI (Container Network Interface) en reemplazo de kube-proxy, el cual proporciona redes de alto rendimiento y políticas de seguridad basadas en eBPF.
- **Almacenamiento Distribuido**: Implementación de Longhorn para el almacenamiento de bloques replicado y de alta disponibilidad a través de todos los nodos.

### Tecnologías Utilizadas

- Talos Linux
- Kubernetes (v1.35+)
- Cilium (CNI eBPF)
- ArgoCD
- Longhorn Storage

Este proyecto demuestra la capacidad de diseñar, desplegar y administrar un clúster Kubernetes listo para operaciones avanzadas ("Day 2"), tratando a los servidores bare-metal con la misma madurez operativa que la infraestructura de la nube pública.
