# EVOQ HRMS - Human Resource Management System

A complete, modern HRMS built with **Next.js 15**, **React 19**, **Tailwind CSS**, and **Material-UI**, featuring the EVOQ design system with full light/dark mode support.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd D:\HRMS-App
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Features Implemented

### ✅ Phase 1: Foundation
- [x] Next.js 15 project setup
- [x] Dark mode system with localStorage persistence
- [x] EVOQ design system integration (HRMS: #0B5B47 green)
- [x] Responsive Sidebar navigation with 8 main sections
- [x] TopBar with search, notifications, theme toggle, user menu
- [x] Main Layout component

### ✅ Phase 2: Onboarding Wizard
- [x] Welcome screen
- [x] 7-step setup wizard:
  1. Organization Details (Company name, industry, size, country, timezone, currency)
  2. HR Settings (Work week, hours, leave year, payroll cycle)
  3. Organization Structure (Departments, designations, locations)
  4. Invite Employees (Manual or CSV upload)
  5. Policies (Leave, attendance, shift, overtime)
  6. Integrations (Google, Microsoft, Slack, Teams, Payroll)
  7. Finish & Go to Dashboard
- [x] Progress bar with step indicator

### ✅ Phase 3: Authentication
- [x] Login page with demo credentials
- [x] Signup/Registration for new users
- [x] Auto-redirect to dashboard if authenticated
- [x] User profile in TopBar with logout

### ✅ Phase 4: Dashboard
- [x] KPI cards (Total Employees, Active, On Leave, Probation)
- [x] Quick Action buttons (Add Employee, Mark Attendance, Leave Requests, Payroll, Reports, Settings)
- [x] Organization Overview (Department count, Locations count)
- [x] Employee Distribution by Department chart
- [x] Recent Announcements
- [x] Clickable KPI cards linking to relevant pages

### ✅ Navigation Structure
```
Dashboard (📊)
People (👥)
  ├── Employees
  ├── Organization
  └── Documents
Workforce (⏰)
  ├── Attendance
  ├── Leave
  ├── Shifts
  ├── Holidays
  └── Timesheets
Payroll (💰)
Requests (📋)
Reports (📈)
Administration (⚙️)
Security (🔒)
```

## 🎨 Design System

### Colors
- **Primary:** #0B5B47 (HRMS Deep Green)
- **Action:** #0F7C63
- **Hover:** #24A576
- **Success:** #10B981
- **Warning:** #F59E0B
- **Error:** #EF4444

### Dark Mode
- Fully supported across all components
- Auto-detects system preference
- User preference saved in localStorage
- Neutral grays only (no green in text/buttons)

## 📊 Mock Data

**25 Realistic Employees** including:
- 1 CEO
- 9 Department Managers
- 15 Regular Staff across 7 departments
- Distributed across 3 locations (Bangalore, Delhi, Mumbai)

**Departments:**
HR, Finance, Sales, Marketing, Operations, Support, IT

**Employee Statuses:**
- Active (20)
- On Leave (2)
- Probation (2)
- Inactive (1)

## 🗂️ Project Structure

```
D:\HRMS-App\
├── app\
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home (redirects to login/dashboard)
│   ├── login\page.tsx          # Login & Signup
│   ├── onboarding\page.tsx     # 7-step wizard
│   ├── dashboard\page.tsx      # Main dashboard
│   └── globals.css             # Global styles
├── context\
│   ├── AuthContext.tsx         # Authentication state
│   ├── ThemeContext.tsx        # Dark mode
│   └── EmployeeContext.tsx     # Employee data
├── components\
│   ├── Sidebar.tsx             # Left navigation
│   ├── TopBar.tsx              # Top header bar
│   └── MainLayout.tsx          # Layout wrapper
├── lib\
│   ├── colors.ts               # HRMS color palette
│   └── mockData.ts             # 25 employees + orgs
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## 🔐 Demo Credentials

**Email:** `admin@evoq.com`  
**Password:** `password`

Or create a new account via signup.

## 🌙 Dark Mode

Click the sun/moon icon in the TopBar to toggle dark mode. Your preference is automatically saved.

## 📱 Responsive Design

- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 📦 Technologies Used

- **Framework:** Next.js 15.0.3
- **UI Library:** React 19.0.0
- **Styling:** Tailwind CSS 3.4.14
- **Component Library:** Material-UI 6.1.6
- **Icons:** Phosphor Icons 2.1.10
- **Charts:** Recharts 2.13.3
- **Language:** TypeScript 5.6.3

## 🚧 What's Next

The following pages are ready to be built with sample components:
- [ ] Employee List with filters and bulk actions
- [ ] Employee Detail view with audit log
- [ ] Employee Create/Edit forms
- [ ] Leave management and approval workflow
- [ ] Attendance tracking
- [ ] Payroll processing
- [ ] Reports and analytics
- [ ] Administration settings
- [ ] Security and audit logs

## 💡 Tips

1. **Add New Pages:** Create files in `app/` following Next.js App Router convention
2. **Use MainLayout:** Wrap pages with `<MainLayout>` to get Sidebar + TopBar
3. **Access Data:** Use `useEmployee()` hook to access 25 mock employees
4. **Theme-Aware:** Use `useTheme()` to get `isDark` boolean for conditional styling
5. **Navigate:** Use Next.js `<Link>` for internal navigation

## 🎯 Quick Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Material-UI](https://mui.com)

---

**Version:** 1.0.0  
**Built with:** Next.js 15 + React 19 + Tailwind CSS + MUI  
**Design System:** EVOQ v1.0
