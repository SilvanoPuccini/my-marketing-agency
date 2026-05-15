import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { ROUTES } from '@/routes/routes.config'

// Public — static imports (small, always needed)
import { Landing } from '@/pages/public/Landing'
import { Login } from '@/pages/public/Login'

// Public — lazy (rarely visited)
const Register = lazy(() => import('@/pages/public/Register').then(m => ({ default: m.Register })))
const AuthCallback = lazy(() => import('@/pages/public/AuthCallback').then(m => ({ default: m.AuthCallback })))
const CompleteInvitation = lazy(() => import('@/pages/public/CompleteInvitation').then(m => ({ default: m.CompleteInvitation })))
const ForgotPassword = lazy(() => import('@/pages/public/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('@/pages/public/ResetPassword').then(m => ({ default: m.ResetPassword })))
const Privacy = lazy(() => import('@/pages/public/Privacy').then(m => ({ default: m.Privacy })))
const Terms = lazy(() => import('@/pages/public/Terms').then(m => ({ default: m.Terms })))
const Status = lazy(() => import('@/pages/public/Status').then(m => ({ default: m.Status })))
const Contact = lazy(() => import('@/pages/public/Contact').then(m => ({ default: m.Contact })))
const NotFound = lazy(() => import('@/pages/public/NotFound').then(m => ({ default: m.NotFound })))

// Dashboard — lazy (code split per page)
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const Accounts = lazy(() => import('@/pages/dashboard/Accounts').then(m => ({ default: m.Accounts })))
const AccountDetail = lazy(() => import('@/pages/dashboard/AccountDetail').then(m => ({ default: m.AccountDetail })))
const Calendar = lazy(() => import('@/pages/dashboard/Calendar').then(m => ({ default: m.Calendar })))
const Library = lazy(() => import('@/pages/dashboard/Library').then(m => ({ default: m.Library })))
const Reports = lazy(() => import('@/pages/dashboard/Reports').then(m => ({ default: m.Reports })))
const Team = lazy(() => import('@/pages/dashboard/Team').then(m => ({ default: m.Team })))
const TeamMember = lazy(() => import('@/pages/dashboard/TeamMember').then(m => ({ default: m.TeamMember })))
const Billing = lazy(() => import('@/pages/dashboard/Billing').then(m => ({ default: m.Billing })))
const Settings = lazy(() => import('@/pages/dashboard/Settings').then(m => ({ default: m.Settings })))
const Profile = lazy(() => import('@/pages/dashboard/Profile').then(m => ({ default: m.Profile })))
const Onboarding = lazy(() => import('@/pages/dashboard/Onboarding').then(m => ({ default: m.Onboarding })))

// Client portal — lazy
const ClientPortal = lazy(() => import('@/pages/client-portal/ClientPortal').then(m => ({ default: m.ClientPortal })))
const ClientHistory = lazy(() => import('@/pages/client-portal/ClientHistory').then(m => ({ default: m.ClientHistory })))
const ClientReports = lazy(() => import('@/pages/client-portal/ClientReports').then(m => ({ default: m.ClientReports })))
const ClientApproval = lazy(() => import('@/pages/client-portal/ClientApproval').then(m => ({ default: m.ClientApproval })))
const ClientProfile = lazy(() => import('@/pages/client-portal/ClientProfile').then(m => ({ default: m.ClientProfile })))

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--fg-3)', fontSize: 14 }}>
      Cargando...
    </div>
  )
}


export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Publicas */}
          <Route path={ROUTES.HOME} element={<Landing />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
          <Route path={ROUTES.COMPLETE_INVITATION} element={<CompleteInvitation />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.PRIVACY} element={<Privacy />} />
          <Route path={ROUTES.TERMS} element={<Terms />} />
          <Route path={ROUTES.STATUS} element={<Status />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />

          {/* Onboarding — requiere auth, sin layout */}
          <Route element={<ProtectedRoute allowedRoles={['admin_agency']} />}>
            <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
          </Route>

          {/* Backoffice — requiere auth */}
          <Route element={<ProtectedRoute allowedRoles={['admin_agency', 'manager', 'creator', 'team_member']} />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.ACCOUNTS} element={<Accounts />} />
              <Route path={ROUTES.ACCOUNT_DETAIL} element={<AccountDetail />} />
              <Route path={ROUTES.CALENDAR} element={<Calendar />} />
              <Route path={ROUTES.LIBRARY} element={<Library />} />
              <Route path={ROUTES.REPORTS} element={<Reports />} />
              <Route path={ROUTES.TEAM} element={<Team />} />
              <Route path={ROUTES.TEAM_MEMBER} element={<TeamMember />} />
              <Route path={ROUTES.BILLING} element={<Billing />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Route>
          </Route>

          {/* Portal cliente — solo rol client */}
          <Route element={<ProtectedRoute allowedRoles={['client']} />}>
            <Route element={<ClientLayout />}>
              <Route path={ROUTES.PORTAL.ROOT} element={<ClientPortal />} />
              <Route path={ROUTES.PORTAL.HISTORY} element={<ClientHistory />} />
              <Route path={ROUTES.PORTAL.REPORTS} element={<ClientReports />} />
              <Route path={ROUTES.PORTAL.PIECE} element={<ClientApproval />} />
              <Route path={ROUTES.PORTAL.PROFILE} element={<ClientProfile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
