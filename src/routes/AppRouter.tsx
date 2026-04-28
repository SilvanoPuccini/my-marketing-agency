import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ClientLayout } from '@/components/layout/ClientLayout'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

import { Landing } from '@/pages/public/Landing'
import { Login } from '@/pages/public/Login'
import { Dashboard } from '@/pages/dashboard/Dashboard'
import { Accounts } from '@/pages/dashboard/Accounts'
import { Calendar } from '@/pages/dashboard/Calendar'
import { Library } from '@/pages/dashboard/Library'
import { Reports } from '@/pages/dashboard/Reports'
import { Team } from '@/pages/dashboard/Team'
import { Billing } from '@/pages/dashboard/Billing'
import { Settings } from '@/pages/dashboard/Settings'
import { Profile } from '@/pages/dashboard/Profile'
import { ClientPortal } from '@/pages/client-portal/ClientPortal'
import { ClientApproval } from '@/pages/client-portal/ClientApproval'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Backoffice — requiere auth */}
        <Route element={<ProtectedRoute allowedRoles={['admin_agency', 'team_member']} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
