# CLAUDE.md — AI Agent Onboarding & Development Guide for OYLG Platform

This file provides context, architectural invariants, and development workflows for AI coding assistants (Claude Code, Cursor, Antigravity, Windsurf, GitHub Copilot) working on the **All Your Life (OYLG)** platform.

---

## 1. Domain & Business Rules (Must Preserve)

Always refer to [`DAC_TA_NEN_TANG_OYLG.md`](./DAC_TA_NEN_TANG_OYLG.md) for the complete specification of the 21 subsystems (`M01`–`M21`). Key business rules implemented in code:

1. **3-Tier Educational & Companion Ecosystem**:
   - **Tier 1 (Career Guidance — `B1–B4`)**: RIASEC + Ikigai career discovery, personal strengths & roadmap.
   - **Tier 2 (Life Coaching — 3 Aspects)**: Knowledge (`Kiến thức`), Mental Wellbeing (`Tinh thần`), Physical Health (`Thể chất`). Psychological assessments (`B3`) have **2 display layers**: full clinical/internal metrics for Coaches/Experts vs. supportive, non-alarming summaries for Parents.
   - **Tier 3 (Academic Gap-Filling — `60/40 Curriculum`)**: Adaptive Knowledge Tracing steps backward to lower grades (`Lớp N -> N-1 -> N-2`) when a student misses a prerequisite, allocating **60% root-gap remediation** and **40% current-grade mastery**.
2. **Dynamic Pricing Matrix (`B6` — `packages/shared/src/pricing-engine.ts`)**:
   - `Session Price = BasePrice × ExpertTier (1.0 | 1.3 | 1.7) × GradeLevel (0.8 | 1.0 | 1.2 | 1.4) × Modality (ONLINE_ZOOM 1.0 | CENTER_OFFLINE 1.2 | HOME_1ON1 1.5) × ClassSize (ONE_ON_ONE 1.0 | GROUP_3_5 0.6 | GROUP_6_10 0.35) × (1 - DurationDiscount)`.
   - Parents can switch modalities per session (`Zoom ↔ Trung tâm ↔ Tại nhà`), and the session wallet automatically recalculates the credit ratio.
3. **2-Tier Legal Sales Commission (`PAY_AS_COLLECTED` — `packages/shared/src/commission-engine.ts`)**:
   - Strictly 2 tiers (`Direct Sales` + `Team Override`), calculated on `DTHH = max(FirstInstallment, 6MonthContractValue)`, paid only as cash is collected (`PAY_AS_COLLECTED`), with automatic clawback if a parent exercises the **14-day refund guarantee**.
4. **Real-Time Safety & Anti-Bypass Guardrails (`packages/shared/src/guardrail-engine.ts`)**:
   - **PII Anonymization**: Strips student names, phone numbers, emails, and addresses (`[HS-2026-0089]`) before sending prompts to external LLMs.
   - **Anti-Off-Platform Contact Masking**: Masks phone numbers (including Vietnamese spelled-out numbers like `"không chín không..."`) and Zalo/Telegram links in chat/lesson logs.
   - **M14 Psychological Safety Trigger**: Detects self-harm/abuse crisis keywords and immediately raises a critical safety alert with Vietnam child protection hotlines (`111` / `115`).

---

## 2. Repository Structure & File Map

### A. Next.js 15 + TypeScript Monorepo (`apps/web` & `packages/*`)
- `packages/shared/src/`:
  - `pricing-engine.ts`: B6 dynamic pricing matrix & modality conversion.
  - `commission-engine.ts`: 2-tier `PAY_AS_COLLECTED` commission & 14-day refund clawback.
  - `curriculum-engine.ts`: Backward prerequisite graph traversal & 60/40 session planner.
  - `guardrail-engine.ts`: PII scrubber, Vietnamese phone/Zalo masker, M14 crisis detector.
  - `__tests__/engines.test.ts`: 18 Vitest unit tests covering all 4 engines.
- `packages/database/prisma/schema.prisma`: Complete multi-tenant Prisma schema for `M01`–`M21`.
- `apps/web/src/`:
  - `lib/platform-store.tsx`: React Context + `localStorage` state store managing products, cart, orders, VietQR checkout, 14-day refunds, student cases, bookings, 60s lesson logs, boarding logs, and CMS page fragments.
  - `components/AppShell.tsx`: Shared navigation header (Role Switcher across all 6 portals) and education-focused footer.
  - `app/page.tsx` & `app/pages/[slug]/page.tsx`: Storefront, 3-step package checkout modal, and 1-1 consultation booking.
  - `app/parent/page.tsx` & `components/ParentCompanionWorkspace.tsx`: Parent portal, session wallet, modality switcher, and 24/7 AI CSKH assistant.
  - `app/student/page.tsx` & `components/StudentAdaptiveWorkspace.tsx`: Age-adaptive student portal (Primary `Lớp 1–5` vs. Secondary/High School `Lớp 6–12`), adaptive testing, 60/40 daily tasks, and `B3` mood check-in.
  - `app/coach/page.tsx`, `app/coach/sessions/page.tsx`, `components/CoachExpertWorkspace.tsx`: 4D Knowledge Heatmap, Human-in-the-Loop AI Copilot, and 60-second lesson log with live guardrails.
  - `app/operations/sales/page.tsx`, `app/operations/boarding/page.tsx`, `components/SalesCareBoardingWorkspace.tsx`: CRM lead intake, 2-tier commission calculator, and QR pickup verification kiosk.
  - `app/admin/page.tsx`, `app/ezyadmin/page.tsx`, `app/ezyadmin/page-fragments/page.tsx`, `app/studio/page.tsx`: Executive dashboard, B6 pricing simulator, group class activation, EzyAdmin CMS page fragments editor, and B1–B4 question studio.

### B. EzyPlatform Java Modules (`oylg-*`)
- `oylg-sdk`: Shared Java entities (`OylgLearningCase`, `OylgSafetyFlag`), repositories, services (`OylgPricingService`, `OylgCommissionService`, `OylgGuardrailService`), and `scripts/scripts.sql`.
- `oylg-admin-plugin`: EzyPlatform Admin plugin (`:9090`) providing `/oylg/dashboard` and fragment management.
- `oylg-web-plugin`: EzyPlatform Web plugin providing REST APIs (`/api/v1/oylg/ecommerce/*`) for cart, VietQR checkout, and consultation booking.
- `oylg-theme`: EzyPlatform Web Thymeleaf theme (`:18080`):
  - `src/main/resources/templates/page.html`: Main storefront & multi-role interactive template.
  - `src/main/resources/templates/fragments/header.html` & `footer.html`: Header & footer fragments.
  - `src/main/resources/messages/messages*.properties`: **Must use Java 8 `\uXXXX` Unicode escapes** for all non-ASCII Vietnamese characters because Java 1.8 `ResourceBundle` reads `.properties` files as `ISO-8859-1`.

---

## 3. Common Development Commands

```bash
# Run unit tests for core business engines
pnpm test

# Start Next.js development server
pnpm dev

# Build Next.js production bundle
pnpm --filter @oylg/web build

# Sync compiled Tailwind v4 CSS from Next.js into EzyPlatform oylg-theme
cat apps/web/.next/static/css/*.css > oylg-theme/src/main/resources/static/css/style.css

# Typography note:
# Always use 'Be Vietnam Pro' and 'Plus Jakarta Sans' for headings (.font-editorial) and body text.
# Avoid 'Georgia' or 'Newsreader' as they lack full Vietnamese compound diacritic glyphs on macOS.
```
