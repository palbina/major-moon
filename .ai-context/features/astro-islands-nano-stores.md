# Astro Islands con Nano Stores para i18n

**Type**: Feature
**Date**: 2026-02-24
**Status**: Complete

## Overview
Implementación de Astro Islands con Nano Stores para crear estado compartido entre componentes interactivos y soportar multilingüismo (EN/ES) en el portfolio de DevOps. Incluye Terminal interactiva y demos de CI/CD para demostrar conocimientos de DevOps.

## Problem/Goal
El proyecto tenía islands de React/Preact que no compartían estado de idioma. Al cambiar de inglés a español, los componentes interactivos permanecían en el idioma original. Necesitábamos:
- Compartir estado de idioma entre islands
- Sincronizar el idioma en toda la página
- Mantener el rendimiento óptimo de Astro (cero JS por defecto)
- Demostrar conocimientos de DevOps con componentes interactivos

## Solution/Implementation
Se implementó una arquitectura de estado subterráneo usando Nano Stores:

1. **languageStore.ts**: Store centralizado con el idioma actual y diccionario
2. **LangToggle.tsx**: Botón toggle en el navbar que navega entre EN/ES
3. **Terminal.tsx**: Terminal interactiva con comandos DevOps simulados
4. **ArgoRolloutsSimulator.tsx**: Simulador de estrategias de deployment
5. **GitOpsFlow.tsx**: Diagrama interactivo del flujo GitOps

## Code Changes
- **Files Added**:
  - `src/components/Terminal.tsx` - Terminal interactiva DevOps
  - `src/components/ArgoRolloutsSimulator.tsx` - Simulador de deployments
  - `src/components/GitOpsFlow.tsx` - Flujo GitOps interactivo
  - `src/components/LangToggle.tsx` - Toggle de idioma

- **Files Modified**:
  - `src/pages/work/[...slug].astro` - Demos en página EN
  - `src/pages/es/work/[...slug].astro` - Demos en página ES
  - `src/store/languageStore.ts` - Store con traducciones

- **Dependencies**:
  - `nanostores: ^1.1.0`
  - `@nanostores/preact: ^1.0.0`

## Key Decisions
- **Nano Stores vs React Context**: Agnóstico de framework, <1KB, funciona con islands aisladas
- **client:idle vs client:visible**: Para componentes above-the-fold, no bloquea renderizado inicial
- **Toggle button vs dual links**: Un botón que alterna es más intuitivo
- **4 demos implementadas, 2 seleccionadas**: PipelineVisualizer y DeployTimeline removidos

## Tradeoffs
- **Pros**: 
  - Estado compartido sin sobre-hidratación
  - Rendimiento óptimo (cero JS por defecto)
  - Multilingüismo real en todas las islands
  - Terminal interactiva impressive para portfolio DevOps
  - Demos de CI/CD que demuestran conocimientos
- **Cons**: 
  - Requiere cliente JS para el toggle de idioma
  - Store debe inicializarse en cliente (no SSR)

## Related Files
- `src/store/languageStore.ts` - Store centralizado de idioma
- `src/components/LangToggle.tsx` - Toggle de idioma en navbar
- `src/components/Terminal.tsx` - Terminal interactiva DevOps
- `src/components/ArgoRolloutsSimulator.tsx` - Simulador Argo Rollouts
- `src/components/GitOpsFlow.tsx` - Flujo GitOps interactivo

## Testing / Verification
- [x] Build exitoso: `npm run build`
- [x] Cambios de idioma funcionan en EN y ES
- [x] Terminal responde correctamente a comandos
- [x] Demos de CI/CD aparecen en EN y ES
- [x] Estado compartido entre componentes

## Notes
- Terminal incluye comandos: help, whoami, pwd, ls, cd, cat, mkdir, neofetch, docker, kubectl, git, terraform, helm
- ArgoRolloutsSimulator tiene 3 estrategias: Canary, Blue-Green, Rolling
- GitOpsFlow muestra el flujo completo Commit → Deploy → Verify
- Ambos demos están traducidos completamente al español
- Appecen en la página del proyecto "CI/CD Pipeline & Progressive Delivery"
