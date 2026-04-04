# Finis

Finis is a role-based construction operations mobile app built with Expo, React Native, Expo Router, and NativeWind.

The app currently covers three user experiences:
- Admin
- Worker
- Manager

It is focused on frontend workflows for project management, tasks, inventory, payroll, geofencing, chat, profile management, and quotation building.

## Why Finis Was Built
Finis was built to reduce day-to-day operational friction between office teams and field teams in construction work.

Construction teams often deal with disconnected workflows across projects, tasks, inventory, payroll, field communication, and quotations. Finis brings these workflows into one mobile app so each role can work from the same system with role-specific access and screens.

A major goal of the app is to make project coordination faster, reduce manual follow-up, improve visibility into field work, and help sales or management teams generate structured quotations more efficiently.

## Problems It Solves
Finis is intended to solve these business and workflow problems:
- project and company information being spread across different places
- admin, manager, and worker workflows being disconnected
- task assignment and tracking being too manual
- inventory stock updates not being reflected quickly
- payroll scheduling and summary flow being fragmented
- field documents and activity records not being centrally accessible
- quotation generation taking too much time
- service pricing and work item selection not being standardized
- client-facing quote output being inconsistent
- role-specific users not having a focused workflow inside one app

## Current Scope
This repository is primarily frontend-focused.

Some modules already behave like backend-ready flows, but many business workflows still use mock data.

Examples:
- manager quotes use combination-based mock catalogs
- task, team, and inventory screens include local interactive state
- role selection is currently development-only

## Role Experiences
### Admin
Admin can access:
- Home dashboard
- Company tab
- Chat tab
- Payroll tab
- Inventory tab
- Company profile and project flows
- Assigned projects
- Project details, project analysis, team, task, and documents
- Create and edit project flows
- Floor and room setup
- Geofencing
- Payroll summary and pay stub
- Admin profile and settings-style flows

Admin tab layout lives in:
- `app/(tab)/_layout.tsx`

### Worker
Worker can access:
- Home
- Tasks
- Chat
- Profile
- Worker support/settings/legal screens
- View task
- Worker task details

Worker tab layout lives in:
- `app/worker/_layout.tsx`

### Manager
Manager can access:
- Home
- Projects
- Tasks
- Inventory
- Chat
- Quotes

Manager tab layout lives in:
- `app/manager/_layout.tsx`

## Quotes Module
The manager quotes module is one of the main structured flows in the app.

### Step Flow
1. Client information and project setup
2. Service selection from a dynamic catalog
3. Final review with discount, PDF, and email actions

### Supported Combinations
The quote flow currently supports these exact combinations:
- New Build - Residential - House
- New Build - Residential - Apartment
- New Build - Commercial - House
- New Build - Commercial - Apartment
- Renovations - Residential - House
- Renovations - Residential - Apartment
- Renovations - Commercial - House
- Renovations - Commercial - Apartment

### Current Quote Behavior
- project type, property type, and unit type are selected separately
- step 2 loads a catalog from a backend-like mock structure
- quantity and unit of measurement are separate
- item subtotal is based on quantity × selected unit price
- custom items can be added manually
- final review supports discount
- quote PDF can be generated
- quote email action can be triggered

### Quote Files
Main quote-related files:
- `components/manager/ManagerQuotesScreen.tsx`
- `components/manager/quotes/QuoteBuilderForm.tsx`
- `components/manager/quotes/QuoteWorkItemsStep.tsx`
- `components/manager/quotes/QuoteFinalReviewStep.tsx`
- `components/manager/quotes/quoteMockData.ts`
- `components/manager/quotes/quoteWorkState.ts`
- `components/manager/quotes/quotePdf.ts`
- `components/manager/quotes/AddCustomQuoteItemModal.tsx`
- `components/manager/quotes/ApplyDiscountModal.tsx`

## Main Modules
### Authentication
Relevant routes:
- `app/(auth)/login.tsx`
- `app/(auth)/signup.tsx`
- `app/(auth)/forgot-password.tsx`
- `app/(auth)/new-password.tsx`
- `app/(auth)/verification-code.tsx`
- `app/screens/auth/welcome.tsx`
- `app/screens/auth/privacy.tsx`
- `app/screens/auth/location.tsx`
- `app/screens/auth/roleselect.tsx`

### Company / Project
Relevant routes include:
- `app/screens/company/profile.tsx`
- `app/screens/company/assignedprojects.tsx`
- `app/screens/company/projectdetails.tsx`
- `app/screens/company/projectinfo.tsx`
- `app/screens/company/projectanalysis.tsx`
- `app/screens/company/team.tsx`
- `app/screens/company/task.tsx`
- `app/screens/company/taskdetails.tsx`
- `app/screens/company/documents.tsx`
- `app/screens/company/projectdocuments.tsx`
- `app/screens/company/contacts.tsx`
- `app/screens/company/createproject.tsx`
- `app/screens/company/editproject.tsx`
- `app/screens/company/floorplan.tsx`
- `app/screens/company/geofencing.tsx`

### Inventory
Relevant routes:
- `app/(tab)/inventory.tsx`
- `app/screens/inventory/add.tsx`

Related components:
- `components/inventory/InventoryScreen.tsx`
- `components/inventory/AddInventoryScreen.tsx`
- `components/inventory/UpdateInventoryModal.tsx`
- `components/inventory/inventoryStore.ts`

### Payroll
Relevant routes:
- `app/(tab)/payroll.tsx`
- `app/screens/payroll/summary.tsx`
- `app/screens/payroll/paystub.tsx`

Related components:
- `components/payroll/SchedulingPayrollScreen.tsx`
- `components/payroll/PayrollCalendarCard.tsx`
- `components/payroll/PayrollSummaryScreen.tsx`
- `components/payroll/PayStubScreen.tsx`

### Chat
Relevant routes:
- `app/(tab)/chat.tsx`
- `app/screens/chat/conversation.tsx`
- `app/worker/chat.tsx`
- `app/manager/chat.tsx`

### Profile
Admin profile routes:
- `app/screens/profile/index.tsx`
- `app/screens/profile/personalinfo.tsx`
- `app/screens/profile/edit.tsx`
- `app/screens/profile/changepassword.tsx`

Worker profile routes:
- `app/worker/profile.tsx`
- `app/screens/worker/personalinfo.tsx`
- `app/screens/worker/edit_profile.tsx`
- `app/screens/worker/change_password.tsx`

## Tech Stack
Core stack:
- Expo SDK 54
- React 19
- React Native 0.81
- TypeScript
- Expo Router
- NativeWind

Important libraries used in this project:
- `expo-image-picker`
- `expo-document-picker`
- `expo-location`
- `expo-print`
- `expo-sharing`
- `expo-mail-composer`
- `react-native-pdf`
- `react-native-webview`
- `react-native-ui-datepicker`
- `react-native-safe-area-context`

## Native / Interactive Features
The app currently includes these native or semi-native capabilities:
- image picking
- document picking
- PDF generation
- PDF preview
- document preview routing
- email composer integration
- share sheet integration
- Android intent-based external open flow for local documents
- geolocation access for map/geofence-related UI

## Project Structure
```text
app/
  (auth)/
  (tab)/                # Admin tab layout
  manager/              # Manager tab layout
  worker/               # Worker tab layout
  screens/
    auth/
    chat/
    company/
    inventory/
    payroll/
    profile/
    worker/
components/
  auth/
  chat/
  common/
  company/
  home/
  inventory/
  manager/
  payroll/
  profile/
assets/
shims/
```

## App Entry Flow
Current app entry flow:
1. `app/index.tsx`
2. splash image screen
3. redirect to `/screens/auth/privacy`
4. auth-related screens
5. development role selector
6. role-based navigation shell

## Development Role Selection
The screen:
- `app/screens/auth/roleselect.tsx`

is currently used for development and manual UI testing.

Once backend-based authentication and role assignment are connected, the app can skip this screen and route directly to the correct role layout.

## Requirements
Recommended local setup:
- Node.js 20+
- npm
- Android Studio for Android emulator/builds
- Xcode for iOS builds on macOS

## Setup
Install dependencies:

```bash
npm install
```

Start Expo dev server:

```bash
npx expo start
```

Run Android:

```bash
npx expo run:android
```

Run iOS:

```bash
npx expo run:ios
```

Run web:

```bash
npx expo start --web
```

Run lint:

```bash
npm run lint
```

Run TypeScript check:

```bash
npx tsc --noEmit
```

## Build / Asset Notes
- App configuration is managed in `app.json`
- Main app icon is in `assets/images/icon.png`
- Splash-related image is in `assets/images/splash-icon.png`
- After changing launcher icon assets, rebuild the app to see the updated launcher icon

## Known Limitations
Current limitations in the repo:
- several modules still use mock data
- role routing is development-oriented, not backend-auth-driven
- some flows are UI-complete but not API-complete
- manager quotes are catalog-driven locally, not from a real backend yet
- some business rules are represented as frontend assumptions for now

## Backend-Ready Areas
These parts are already structured so backend integration is easier later:
- manager quotes catalog selection
- role-based navigation separation
- inventory update flow
- task status updates
- profile avatar update flow

## Suggested Next Backend Integrations
Recommended backend work order:
1. auth + role assignment
2. quotes catalog API
3. project and task APIs
4. inventory stock API
5. payroll data API
6. chat backend / realtime messaging

## Notes for Contributors
- Keep role-based flows isolated by route layout
- Prefer reusing components instead of duplicating whole screens
- Keep data-driven structures in modules like quotes and inventory so backend integration stays clean
- When changing app icon or some native package behavior, rebuild the app instead of relying only on hot reload
