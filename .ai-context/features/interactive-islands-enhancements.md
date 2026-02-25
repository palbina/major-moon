# Interactive Islands Enhancements: Experience Timeline & Terminal

**Type**: Feature
**Date**: 2026-02-24
**Status**: Complete
**Branch**: master

---

## Overview

Added a new interactive Git-style `ExperienceTimeline` to the About pages and upgraded the Home page `Terminal` island with history navigation (up/down arrows), autocomplete (tab), and modern glassmorphic aesthetics.

---

## Problem / Goal / Context

**What problem are we solving? What's the business goal? What triggered this work?**

The portfolio needed to showcase DevOps expertise not just in content, but in the format and interactive elements themselves. The About page had a static text background, and the Home Terminal lacked native CLI interactions (like retrieving command history or auto-completing).

### Requirements

- Create an interactive experience timeline mimicking a Git commit history graph.
- Update the Home Terminal component to support keyboard shortcuts (Up/Down for history, Tab for autocomplete).
- Improve the visual design of the Terminal using premium glassmorphism principles (blur, gradients, hover states).
- Ensure multi-language support (English/Spanish) using existing Nano Stores infrastructure.

---

## Solution / Implementation

**How did we solve it? What's the technical approach?**

### High-Level Approach

1. **ExperienceTimeline.tsx**: Created a new Preact component simulating a Git commit history. Each job role is represented as a commit node with a hash, that expands to show details when clicked.
2. **Terminal.tsx Upgrade**: Refactored the terminal component to track command history index. Added an `onKeyDown` event listener intercepting `ArrowUp`, `ArrowDown`, and `Tab` keys to provide native CLI-like navigation.
3. **Glassmorphism CSS**: Injected a `<style>` block into `Terminal.tsx` for hover animations, scale effects on window controls, and applied deep gradients with `backdrop-filter: blur()`.
4. **Integration**: Placed `<ExperienceTimeline client:visible />` inside `about.astro` and `es/about.astro`, replacing static paragraphs.

---

## Key Decisions

### Decision 1: Git-style Timeline

- **What we decided**: Visualize the resume/background as a Git commit tree instead of a traditional list.
- **Rationale**: Highly thematic for a DevOps Engineer portfolio, demonstrating creativity and technical alignment.

### Decision 2: Native CLI Keystrokes in Terminal

- **What we decided**: Handle keyboard events within the input to simulate shell behavior.
- **Rationale**: Any developer testing the terminal will naturally try to use UP arrow for previous commands or TAB for autocomplete. Implementing these provides a "wow" factor and a premium UX.

---

## Testing / Verification

- Verified Timeline expansions and language switching.
- Verified Terminal `ArrowUp`, `ArrowDown`, and `Tab` functionality.
- Astro build completed successfully.

---

_This document was generated using the `/update-context` skill. Last updated: 2026-02-24_
