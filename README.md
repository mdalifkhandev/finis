# Finis

Finis is a role-based React Native app built with Expo Router for construction, field operations, inventory, payroll, tasks, chat, and quotation workflows.

The project currently includes three role experiences:
- Admin
- Worker
- Manager

## Overview
Finis is organized around separate app experiences for different user roles:
- Admin: company, projects, tasks, payroll, inventory, chat, and profile flows
- Worker: home, tasks, chat, profile, and worker support/settings flows
- Manager: home, projects, tasks, inventory, chat, and dynamic quote builder flow

The app uses file-based routing with Expo Router and NativeWind for UI styling.

## Main Features
### Admin
- Dashboard and role-based home flow
- Company profile and project overview
- Assigned projects
- Project details, analysis, team, task, and documents
- Create and edit project flows
- Floor and room setup
- Geofencing UI
- Payroll calendar, payroll summary, and pay stub screens
- Inventory overview and stock update flow
- Admin profile, personal info, edit profile, and change password

### Worker
- Worker home and task flow
- View task and task details screens
- Worker profile
- Worker settings/help/legal screens
- Worker chat flow

### Manager
- Manager dashboard
- Projects and tasks tabs
- Inventory and chat tabs
- Quotes builder with 3 steps:
  1. Client and project details
  2. Dynamic service selection from combination-based catalogs
  3. Final review with discount, PDF generation, and email actions

## Quotes Flow
The manager quotes module supports the following exact combinations:
- New Build - Residential - House
- New Build - Residential - Apartment
- New Build - Commercial - House
- New Build - Commercial - Apartment
- Renovations - Residential - House
- Renovations - Residential - Apartment
- Renovations - Commercial - House
- Renovations - Commercial - Apartment

Step 2 is data-driven and loads services based on the selected combination. The quote flow also supports:
- Separate quantity and unit selection
- Item-level unit pricing
- Dynamic subtotals
- Custom item addition
- Final quote review
- Discount modal
- Quote PDF generation
- Quote email action

## Tech Stack
- Expo SDK 54
- React 19
- React Native 0.81
- Expo Router
- NativeWind
- TypeScript
- Expo Image Picker
- Expo Document Picker
- Expo Location
- Expo Print
- Expo Sharing
- Expo Mail Composer
- React Native PDF
- React Native WebView
- React Native UI Datepicker

## Project Structure
```text
app/
  (auth)/
  (tab)/                # Admin tabs
  manager/              # Manager tabs
  worker/               # Worker tabs
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

## Routing Notes
- `app/(tab)` is the admin tab layout
- `app/worker` is the worker tab layout
- `app/manager` is the manager tab layout
- `app/screens/auth/roleselect.tsx` is the development-only role selection screen

## App Entry Flow
Current startup flow:
1. `app/index.tsx`
2. splash screen image
3. redirect to `/screens/auth/privacy`
4. auth flow
5. development-only role selection screen

## Development Notes
The role selection screen is currently used for development and UI testing. Once backend-based authentication and role assignment are connected, the app can route directly by authenticated role.

## Setup
Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npx expo start
```

Run on Android:

```bash
npx expo run:android
```

Run on iOS:

```bash
npx expo run:ios
```

Run lint:

```bash
npm run lint
```

Type check:

```bash
npx tsc --noEmit
```

## Assets and App Icon
App configuration is managed in `app.json`.
Important assets include:
- `assets/images/icon.png`
- `assets/images/splash-icon.png`

After changing launcher icon assets, rebuild the app to see the updated icon.

## Notes
- This repository currently focuses on frontend flows and mocked business data in several modules.
- Some flows are already structured to be replaced by backend data later, especially the manager quotes module.
- The project contains custom role-based UI implementations rather than a single shared navigation shell.
