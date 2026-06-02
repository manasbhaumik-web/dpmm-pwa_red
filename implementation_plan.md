# Implementation Plan - Automated Membership Management & B2B Networking Platform

This plan details the addition of required cloud-native features, simulated databases, data cleansing automation, administrative override features, and member workspaces for the SSM Membership PWA.

## Proposed Changes

We will introduce deep database simulations and refine both user workspaces in `antigravity-pwa/`.

---

### 1. Database & Simulation Layer
#### [MODIFY] [mockData.js](file:///C:/Users/Manas/.gemini/antigravity/scratch/antigravity-pwa/src/data/mockData.js)
* **Normalized Database Simulation**:
  - Model a relational state in memory: `MEMBERS` table (representing 209 clean corporate profiles) and `PAYMENTS` table (containing multi-year receipts, including flattened records from 2022-2030).
  - Add standard DDL SQL schema structure and Row-Level Security (RLS) definitions to showcase how the Supabase schema works.
* **Backend Automation Simulators**:
  - `cleanseAndStandardizeData(raw)`: Routine to standardize dates to ISO 8601, format Malaysian phone formats to `+601...`, and map multi-year spreadsheet fees.
  - `triggerWebhookChargeSuccessful(memberId, amount, year)`: Webhook handler simulating a `charge.successful` gateway event, which updates the `PAYMENTS` database, flips status to "Aktif", and recalculates expiry dates.

---

### 2. Tier 1: Administrative Panel
#### [MODIFY] [AdminDashboard.jsx](file:///C:/Users/Manas/.gemini/antigravity/scratch/antigravity-pwa/src/components/admin/AdminDashboard.jsx)
* **Executive Dashboard**:
  - Add background system health status widgets (Supabase connection active, webhook status, storage utilization, database row-count, memory footprint).
* **Verification Queue**:
  - Enhance approve routine to increment membership ID (No. Ahli like `AG-2026-0210`) and display welcome credentials (simulated generated password and login details) in a clean modal.
* **Global Membership Registry (Full CRUD)**:
  - Add "Add New Member" button/form.
  - Add "Edit Member Profile" edit modal.
  - Add "Delete Member Profile" action.
* **Financial Ledger & Override Facility**:
  - Add a dedicated **Financial Ledger** sub-tab tracking payment logs.
  - Implement a **Manual Override** form allowing admins to log offline payments (cash/cheque) and customize the membership validity/expiry period.
* **Supabase Console Viewer**:
  - Add a schema browser toggle so admins can view the raw simulated SQL DDL and RLS rules.

---

### 3. Tier 2: Member Workspace
#### [MODIFY] [MemberPortal.jsx](file:///C:/Users/Manas/.gemini/antigravity/scratch/antigravity-pwa/src/components/member/MemberPortal.jsx)
* **Context-Aware Alert Banners**:
  - Add a **T-Interval Simulator Bar** at the top of the Member view for testing (buttons for `T-30 Alert`, `T-14 Alert`, `T-0 Alert / Expired`, `Aktif / No Alert`) to show how the context-aware warning banners react.
* **My Business Profile Form (New Section)**:
  - Add a new tab: "My Business Profile".
  - Multi-step form updating organization profile metadata.
  - **PDPA Protection Banner**: Highlight that sensitive personal information (like personal IC numbers) is strictly isolated and protected under Supabase RLS.
  - **Document Vault**: Simulated drag-and-drop file upload for SSM documents with realistic upload spinners and checkmark feedback.
* **Subscriptions Portal & Receipt Download**:
  - Hook payment success directly into receipt ledger update, enabling immediate download of simulated PDF receipts (generating custom transaction IDs).

---

## Verification Plan

### Automated/Manual Verification Steps
1. **Interactive Review**: Open Vite local application in browser.
2. **Admin Flow**:
   - Check the **System Health** widget in executive dashboard.
   - Go to **Verification Queue**, approve a pending applicant, and verify that it displays a generated password and credentials.
   - Go to **Master Directory**, add a member, edit their profile, and delete a profile to verify complete CRUD capabilities.
   - Go to **Financial Ledger**, record an offline cash payment, and verify that the payment history is updated.
3. **Member Flow**:
   - Log in as a member. Use the **T-Interval Simulator Bar** to test alert banners at 30 days, 14 days, and 0 days (expired state).
   - Go to **My Business Profile** tab, edit details, drag-and-drop a new SSM file, verify PDPA safety banner is visible.
   - Go to **Subscriptions Portal**, choose FPX payment and complete it, verify that receipt history receives the new transaction log, and click "Download Receipt (PDF)" to trigger receipt download.
4. **Backend Automation Webhook**:
   - Verify simulated webhook trigger from the admin control panel.
