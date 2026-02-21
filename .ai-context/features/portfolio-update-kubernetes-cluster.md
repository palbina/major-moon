# Portfolio Update: DevOps Capabilities Showcase

**Type**: Feature
**Date**: 2026-02-21
**Status**: Complete

## Overview

Rebranding and comprehensive content update of the Astro portfolio to clearly reflect a DevOps Engineer identity. Removed generic placeholder content and populated the project showcase with real architecture implementations from the homelab infrastructure (Talos Linux, ArgoCD GitOps, LGTM Observability Stack, and Istio Ambient Mesh).

## Problem/Goal

The previous portfolio template (Jeanine White profile) did not reflect the user's actual capabilities or professional identity as a DevOps Engineer. The goal was to tailor the design aesthetics, meta tags, hero sections, and project showcases to focus specifically on cloud-native automation, Kubernetes architecture, and SRE skills.

## Solution/Implementation

### Design & Theming

- Implemented a "Neon Volt" tech aesthetic by overriding the default CSS variables, emphasizing deep dark backgrounds with electric cyan, purple, and magenta accents.
- Modernized project cards using glassmorphism effects (translucent backgrounds with blur, subtle borders) and interactive hover scaling/shadows.
- Created highly detailed, 8k resolution, isometric 3D illustrations for all projects and the hero section to align perfectly with the new dark-mode tech theme.

### Content Restructuring

- Swept through global components (`Nav.astro`, `Footer.astro`, `MainHead.astro`) to overwrite the "Jeanine White" identity with "Peter | DevOps".
- Scrapped placeholder projects (Bloom Box, H20, Markdown Mystery Tour) and replaced them with four detailed cloud-native infrastructure showcases:
  1. **Kubernetes Homelab Cluster**: Bare-metal Talos Linux implementation with Cilium CNI and Longhorn storage.
  2. **CI/CD Pipeline & Progressive Delivery**: End-to-end automated pipeline using Forgejo Actions, ArgoCD for GitOps, and Argo Rollouts for canary deployments.
  3. **LGTM Observability Stack**: Centralized monitoring structure demonstrating SRE maturity using Loki, Grafana, Tempo, and Prometheus.
  4. **Istio Ambient Mesh**: Advanced networking demonstrating a sidecar-less service mesh implementation utilizing Kubernetes Gateway API, ztunnel, and waypoint proxies.

## Code Changes

- **Files Modified**:
  - `src/components/*`: Updated branding across Nav, Footer, and MainHead. Applied UI upgrades to `PortfolioPreview.astro`.
  - `src/pages/*`: Rewrote hero copy on `index.astro`, `about.astro`, and `work.astro` to reflect DevOps, Linux, and K8s expertise.
  - `src/styles/global.css`: Complete overhaul of the dark theme color palette.
  - `src/content/work/*`: Deleted `*.md` defaults and created 4 new DevOps infrastructure markdown files.
- **Key Changes**: Significant application of CSS structural changes (`backdrop-filter: blur()`, CSS custom variables for neon glowing states) to bring the design up to aggressive modern web standards. Re-referenced new high-fidelity assets in `public/assets/`.

## Key Decisions

- **Focusing on 4 Projects**: Keeping the grid to exactly 4 items (2x2) provides strict visual symmetry on the `/work` page, avoiding a cluttered look and emphasizing quality over quantity.
- **Isometric 3D AI Art**: Eschewed generic stock photos and vector icons for highly coherent, AI-generated technical illustrations that immediately establish a high engineer credibility at first glance.
- **Concrete Source Material**: The new projects aren't placeholders; they are directly sourced from the actual `/home/peter/DEV/HOMELAB-INFRA/` `.gemini/context-docs`, proving real architectural competence.

## Tradeoffs

- **Pros**: The portfolio is now aggressively targeted at cloud-native engineering recruitment/collaboration. The aesthetics immediately scream "DevOps/Infra".
- **Cons**: The specific dark/neon theme might not appeal to every kind of corporate hiring manager, but it specifically targets the tech-forward startup/cloud-native demographic effectively.

## Related Files

- `src/styles/global.css` - Core design system modifications.
- `src/components/PortfolioPreview.astro` - The revamped glassmorphism project card.
- `src/content/work/(kubernetes-cluster|cicd-pipeline|observability-stack|istio-ambient-mesh).md` - The new project content files.

## Testing / Verification

- [x] Local Astro build `npx astro check` passes completely without TS or matching errors.
- [x] Visual verification on localhost:4321 confirming proper hover states, colors, and layout symmetry.
- [x] Validated that all markdown entries match the Zod types described in `src/content.config.ts`.
