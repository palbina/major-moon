---
title: Observabilidad LGTM Stack
publishDate: 2026-02-17 00:00:00
img: /assets/observability-stack.png
img_alt: Representación isométrica 3D altamente detallada de un panel de observabilidad y hub central de métricas
description: |
  Una pila de monitorización exhaustiva basada en el patrón LGTM (Loki, Grafana, Tempo, Prometheus) para registros, métricas y trazas unificadas.
tags:
  - Observabilidad
  - Prometheus
  - Grafana
  - Distributed Tracing
---

> Creación de un panel de control unificado ("single pane of glass") para monitorear la salud del clúster, el rendimiento de las aplicaciones y eventos de seguridad.

## Resumen del Proyecto

Ejecutar un clúster en producción requiere una visibilidad profunda. Este proyecto implementa todo un stack completo de observabilidad basado en el patrón LGTM de código abierto, proporcionando una correlación fluida entre métricas, logs (registros) y trazas distribuidas.

### Características Principales

- **Registro Centralizado (Loki)**: Agrega registros desde todos los pods empleando Promtail, lo que permite consultas de bitácoras extremadamente rápidas a través de etiquetas en todo el clúster.
- **Métricas y Alertas (Prometheus)**: Recopila métricas de nodos, pods y aplicaciones predeterminadas. Alertmanager está configurado para enviar instantáneamente notificaciones críticas (por ejemplo, presión de nodos, CrashLoopBackOffs) a un canal dedicado en Telegram.
- **Trazas Distribuidas (Tempo)**: Almacena las trazas respaldadas por SeaweedFS (almacenamiento compatible con S3), lo cual permite a los desarrolladores analizar la latencia de las aplicaciones y los flujos de peticiones mediante Jaeger operando bajo la malla de servicios Istio.
- **Correlación de Datos**: Diferentes paneles en Grafana están configurados con campos derivados (derived fields), lo cual permite a los ingenieros saltar intuitivamente de un pico en una métrica directamente a los respectivos logs de la aplicación, para finalmente ubicar la traza exacta que está originando problemas en la latencia.

### Tecnologías Utilizadas

- Prometheus & Alertmanager
- Grafana (Paneles de control)
- Loki / Promtail (Logs/Bitácoras)
- Tempo / Jaeger (Trazas)
- Telemetría de Istio

Esta arquitectura demuestra un gran dominio de los fundamentos de Ingeniería de Fiabilidad del Sitio (SRE), ayudando a garantizar que cuando ocurran incidentes, el tiempo medio de resolución (MTTR) se mantenga en el nivel más bajo posible.
