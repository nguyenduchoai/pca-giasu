# CLAUDE.md — AI Agent Guide for OYLG Native EzyPlatform

This repository is a **100% pure EzyPlatform** multi-module project (`oylg-sdk`, `oylg-admin-plugin`, `oylg-web-plugin`, `oylg-theme`) implementing the **All Your Life (OYLG)** platform specified in [`DAC_TA_NEN_TANG_OYLG.md`](./DAC_TA_NEN_TANG_OYLG.md).

---

## 1. Mandatory Skills & Architectural Rules

1. **EzyPlatform Inventory-First & SSOT (`ezyplatform-skills`)**:
   - Reuse EzyPlatform Core (`ezy_users`, `ezy_user_meta`, `ezy_admins`, `ezy_settings`, `ezy_medias`, `SettingService`) and Official Market Plugins (`ezyarticle`, `ecommerce`, `ezypayment`, `ezylogin`, `ezysupport`, `ezymail`).
   - Keep 100% of `@Entity`, `@EzyRepository`, and shared business services in `oylg-sdk`.
   - Note that `<proc>none</proc>` is configured in `pom.xml`, so write explicit getters/setters in Java classes rather than relying on Lombok annotation processing.
   - Because EzyPlatform runs on **Java 1.8**, all non-ASCII Vietnamese strings in `src/main/resources/messages/messages*.properties` MUST use `\uXXXX` Unicode escapes.
2. **Unslop Interface Craft (`.agents/skills/unslop/SKILL.md`)**:
   - **Direction**: Calm, scholarly, quietly warm.
   - **Color**: Warm paper ramp (`#F7F4EE` / `#FDFBF7` / `#EFE9DF` / `#1F1B16`) for Public, Parent, and Student views; Graphite ramp (`#FAFAFA` / `#FFFFFF` / `#171717`, sidebar `#121213`) for Coach, Operations, Studio, and Executive workspaces; **one accent** `#C84B31` (terracotta).
   - **Strict bans**: Zero hue gradients, zero gradient text, zero colored shadows/blobs, zero decorative emojis, zero ALL-CAPS tracked labels, zero font weights above `600`.
   - **Typography**: `'Be Vietnam Pro'` (`400`, `500`, `600`) + `'JetBrains Mono'` (`tabular-nums` on all prices, counts, codes, and metrics).

---

## 2. Unified SSOT Pricing & Core Domain Invariants

- **Base Session Price (`oylg_base_session_price` in `ezy_settings`)**: `200,000 VND / 90m session`.
- **Canonical Packages (`oylg_service_packages`)**:
  - `PKG-T1-CAREER`: `1,800,000 VND` (2 sessions)
  - `PKG-T12-COACH`: `4,500,000 VND` (12 sessions)
  - `PKG-T3-TUTOR-6M`: `13,980,000 VND` (48 sessions / 6 months, `-7%` commitment discount)
- **Curriculum Split**: `60%` root-gap remediation (lower-grade prerequisites) / `40%` current-grade mastery.
- **2-Tier Commission (`M18`)**: `DTHH = max(firstPayment, sixMonthContractValue)`, strictly 2 tiers (`10%` Rep + `5%` Leader or `15%` Leader direct), `PAY_AS_COLLECTED`, 14-day refund hold & clawback.
- **Safety & DLP Guardrails (`OylgGuardrailService`)**: Masks numeric & Vietnamese word-spelled phone numbers and Zalo/social links; triggers `RED_URGENT` `M14` safety flags (`111 / 115`) on self-harm/abuse crisis signals.

---

## 3. Build, Export & Verify Commands

```bash
# Build all 4 modules and export to $EZYPLATFORM_HOME
bash export.sh

# Fast sync when only editing HTML/CSS/JS/properties in oylg-theme
cp -R oylg-theme/src/main/resources/* .ezy-runtime/ezyplatform/ezyplatform/web/themes/oylg/resources/
(cd oylg-theme/src/main/resources && zip -q -r ../../../../.ezy-runtime/ezyplatform/ezyplatform/web/themes/oylg/lib/oylg-theme-1.0.0.jar .)
```
