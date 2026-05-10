import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

// Public — static imports (small, always needed)
import { Landing } from '@/pages/public/Landing'
import { Login } from '@/pages/public/Login'

// Public — lazy (rarely visited)
const Register = lazy(() => import('@/pages/public/Register').then(m => ({ default: m.Register })))
const AuthCallback = lazy(() => import('@/pages/public/AuthCallback').then(m => ({ default: m.AuthCallback })))
const CompleteInvitation = lazy(() => import('@/pages/public/CompleteInvitation').then(m => ({ default: m.CompleteInvitation })))
const ForgotPassword = lazy(() => import('@/pages/public/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
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
const Billing = lazy(() => import('@/pages/dashboard/Billing').then(m => ({ default: m.Billing })))
const Settings = lazy(() => import('@/pages/dashboard/Settings').then(m => ({ default: m.Settings })))
const Profile = lazy(() => import('@/pages/dashboard/Profile').then(m => ({ default: m.Profile })))
const Onboarding = lazy(() => import('@/pages/dashboard/Onboarding').then(m => ({ default: m.Onboarding })))

// Client portal — lazy
const ClientPortal = lazy(() => import('@/pages/client-portal/ClientPortal').then(m => ({ default: m.ClientPortal })))
const ClientApproval = lazy(() => import('@/pages/client-portal/ClientApproval').then(m => ({ default: m.ClientApproval })))

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
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/complete-invitation" element={<CompleteInvitation />} />
          <Route path="/recuperar-password" element={<ForgotPassword />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/estado" element={<Status />} />
          <Route path="/contacto" element={<Contact />} />

          {/* Onboarding — requiere auth, sin layout */}
          <Route element={<ProtectedRoute allowedRoles={['admin_agency']} />}>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>

          {/* Backoffice — requiere auth */}
          <Route element={<ProtectedRoute allowedRoles={['admin_agency', 'team_member']} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/accounts/:id" element={<AccountDetail />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/library" element={<Library />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/team" element={<Team />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Portal cliente */}
          <Route element={<ProtectedRoute allowedRoles={['client', 'admin_agency', 'team_member']} />}>
            <Route element={<ClientLayout />}>
              <Route path="/portal" element={<ClientPortal />} />
              <Route path="/portal/pieces/:id" element={<ClientApproval />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
