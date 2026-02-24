---
title: Istio Ambient Mesh
publishDate: 2026-02-18 00:00:00
img: /assets/istio-mesh.png
img_alt: Representación isométrica 3D altamente detallada de una red service mesh con nodos proxy brillantes
description: |
  Implementación de una service mesh sin sidecars que proporciona seguridad Zero-Trust, mTLS y gestión avanzada de tráfico.
tags:
  - Infraestructura
  - Service Mesh
  - Istio
  - Seguridad
---

> Implementación de una service mesh transparente y sin sidecars para asegurar y enrutar el tráfico de forma segura a través de una moderna flota de Kubernetes.

## Resumen del Proyecto

A medida que las arquitecturas de microservicios escalan, gestionar el tráfico, el cifrado y la observabilidad se vuelve complejo. Este proyecto documenta la transición y la implementación de **Istio en modo Ambient**, proporcionando todos los beneficios de una service mesh sin la sobrecarga de los proxies sidecar tradicionales.

### Características Principales

- **Arquitectura sin Sidecars**: Utiliza `ztunnel` a nivel de nodo para tráfico L4 y proxies `waypoint` a nivel de namespace para tráfico L7, reduciendo drásticamente el consumo de memoria por pod.
- **Cifrado Global mTLS Estricto**: Asegura que toda comunicación de pod a pod esté encriptada por defecto (Zero-Trust) y autenticada mediante identidades SPIFFE.
- **Gestión de Tráfico Progresiva**: Aprovecha la nueva Kubernetes Gateway API (`HTTPRoute`) para dividir el tráfico de forma dinámica, integrándose perfectamente con Argo Rollouts para los despliegues canary.
- **Observabilidad Profunda**: Rastrea automáticamente las cabeceras (headers), proporcionando información valiosa sobre el rendimiento de la mesh y la latencia de las peticiones mediante Kiali y Tempo.

### Tecnologías Utilizadas

- Istio (Modo Ambient)
- Kubernetes Gateway API
- Integración Cilium CNI
- Jaeger & Kiali (Telemetría)

Este proyecto hace énfasis en la seguridad de redes moderna y muestra cómo adoptar arquitecturas cloud-native de vanguardia que priorizan tanto el rendimiento como las posturas seguras por defecto.
