# 🚀 GETTING STARTED - EVOQ HRMS

Your HRMS application is **ready to run**! Follow these simple steps.

## ✅ Installation & Launch (3 Minutes)

### Step 1: Navigate to Project
```bash
cd D:\HRMS-App
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Visit **http://localhost:3000**

---

## 🎯 What's Built

### ✅ **Complete**
- ✅ Next.js 15 project with TypeScript
- ✅ Dark mode system (light/dark toggle in TopBar)
- ✅ **Sidebar Navigation** with 8 main sections:
  - Dashboard
  - People (Employees, Organization, Documents)
  - Workforce (Attendance, Leave, Shifts, Holidays, Timesheets)
  - Payroll
  - Requests
  - Reports
  - Administration
  - Security

- ✅ **TopBar** with:
  - Logo and company name
  - Search bar
  - Notifications bell (2 sample notifications)
  - Theme toggle (☀️/🌙)
  - User menu with profile, settings, logout

- ✅ **Onboarding Wizard** (7 steps):
  1. Organization Details
  2. HR Settings
  3. Organization Structure
  4. Invite Employees
  5. Policies Configuration
  6. Integrations (optional)
  7. Finish & Go to Dashboard

- ✅ **Authentication**:
  - Login page (demo: admin@evoq.com / password)
  - Signup/Registration
  - Auto-redirects based on auth state

- ✅ **Dashboard** with:
  - 4 KPI cards (Total Employees, Active, On Leave, Probation)
  - 6 Quick Action buttons
  - Organization overview
  - Employee distribution by department
  - Recent announcements
  - All clickable and functional

- ✅ **Mock Data**:
  - 25 realistic employees
  - 7 departments
  - 3 locations
  - Full employee details

---

## 🎨 Design System (HRMS Colors)

All components use the EVOQ design system:
- **Primary Color:** #0B5B47 (Deep Forest Green)
- **All HRMS colors configured** (Action, Hover, Soft, Tint, Surface)
- **Semantic colors:** Success, Warning, Error, Info
- **Dark mode:** Neutral grays, no green in UI chrome
- **Full responsiveness:** Desktop, tablet, mobile

---

## 🔑 Demo Login Credentials

```
Email: admin@evoq.com
Password: password
```

Or create a new account via **Sign Up** button on login page.

---

## 📁 File Structure

```
D:\HRMS-App\
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with all providers
│   ├── page.tsx                 # Home (auto-redirects)
│   ├── login/page.tsx           # Login & Signup
│   ├── onboarding/page.tsx      # 7-step wizard
│   ├── dashboard/page.tsx       # Main dashboard
│   └── globals.css              # Global styles + CSS variables
│
├── context/                      # React Context API
│   ├── AuthContext.tsx          # Auth state management
│   ├── ThemeContext.tsx         # Dark mode system
│   └── EmployeeContext.tsx      # Employee data
│
├── components/                   # React components
│   ├── Sidebar.tsx              # Left navigation menu
│   ├── TopBar.tsx               # Top header bar
│   └── MainLayout.tsx           # Layout wrapper (Sidebar + TopBar)
│
├── lib/                         # Utilities
│   ├── colors.ts                # HRMS color palette
│   └── mockData.ts              # 25 mock employees
│
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── README.md                    # Full documentation
└── .gitignore                   # Git ignore rules
```

---

## 🎯 User Flow

```
1. User visits http://localhost:3000
   ↓
2. Redirected to /login
   ↓
3. Login with: admin@evoq.com / password
   ↓
4. Dashboard loads with all KPIs and quick actions
   ↓
5. Click any navigation item in Sidebar to navigate
   ↓
6. Toggle theme with sun/moon icon in TopBar
   ↓
7. Click user avatar → Profile, Settings, Logout
```

---

## 🌙 Dark Mode

- **Toggle:** Click sun/moon icon in TopBar
- **Auto-detect:** System preference on first visit
- **Persistent:** Saved in localStorage
- **Full support:** All pages and components

---

## 🔗 Navigation Structure

### Sidebar Menu
```
📊 Dashboard → /dashboard
👥 People
  ├── Employees → /people/employees
  ├── Organization → /people/organization
  └── Documents → /people/documents
⏰ Workforce
  ├── Attendance → /workforce/attendance
  ├── Leave → /workforce/leave
  ├── Shifts → /workforce/shifts
  ├── Holidays → /workforce/holidays
  └── Timesheets → /workforce/timesheets
💰 Payroll → /payroll
📋 Requests → /requests
📈 Reports → /reports
⚙️ Administration → /administration
🔒 Security → /security
```

---

## 💻 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

---

## 🎨 Component Examples

All components are pre-built and themed. Use them in your new pages:

```tsx
import { MainLayout } from '@/components/MainLayout'
import { useTheme } from '@/context/ThemeContext'
import { useEmployee } from '@/context/EmployeeContext'

export default function MyPage() {
  const { isDark } = useTheme()
  const { employees } = useEmployee()

  return (
    <MainLayout>
      <h1>My Page</h1>
      <p>Employees: {employees.length}</p>
    </MainLayout>
  )
}
```

---

## 📊 Mock Data Access

```tsx
import { useEmployee } from '@/context/EmployeeContext'

export default function MyPage() {
  const { employees, addEmployee, updateEmployee } = useEmployee()

  // employees = 25 realistic mock employees
  // All employee data is available and fully functional
}
```

---

## 🎯 Next Steps (Build More Pages)

1. **Employee List** - `/people/employees`
2. **Employee Detail** - `/people/employees/[id]`
3. **Employee Create** - `/people/employees/new`
4. **Leave Management** - `/workforce/leave`
5. **Attendance** - `/workforce/attendance`
6. **Payroll** - `/payroll`
7. **Reports** - `/reports`
8. **Administration** - `/administration`

All pages should use `<MainLayout>` wrapper to get Sidebar + TopBar.

---

## ✨ Features Implemented

### Authentication
- ✅ Login page
- ✅ Signup/Registration
- ✅ Auto-redirect based on auth state
- ✅ User profile in TopBar

### Navigation
- ✅ Sidebar with all 8 main sections
- ✅ Sub-menu items (expandable/collapsible)
- ✅ Active state indicators
- ✅ TopBar with branding

### Onboarding
- ✅ 7-step wizard
- ✅ Progress indicator
- ✅ Form validation
- ✅ Finish redirect to dashboard

### Dashboard
- ✅ 4 KPI cards (clickable)
- ✅ 6 Quick action buttons
- ✅ Organization overview
- ✅ Employee distribution chart
- ✅ Announcements section

### Theme System
- ✅ Light & Dark mode
- ✅ System preference detection
- ✅ localStorage persistence
- ✅ Instant toggle

---

## 🚀 Ready to Use!

Your HRMS is **fully functional** and **ready for development**.

1. Run `npm install`
2. Run `npm run dev`
3. Visit http://localhost:3000
4. Login with `admin@evoq.com` / `password`
5. Start building more pages!

---

## 📞 Support

- **TypeScript:** Full type safety enabled
- **Tailwind CSS:** All utilities available
- **Dark Mode:** Built-in, fully functional
- **Responsive:** Mobile, tablet, desktop
- **Mock Data:** 25 employees, ready to use

---

**Status:** ✅ **COMPLETE & READY TO RUN**

**Built with:** Next.js 15 • React 19 • Tailwind CSS • MUI • EVOQ Design System

🎉 Happy building!
