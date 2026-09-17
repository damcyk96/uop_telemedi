import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/layout/AppShell'
import { RouteBoundary } from '@/layout/RouteBoundary'

const ReferralsPage = lazy(() => import('@/features/referrals/ReferralsPage'))
const NewReferralPage = lazy(() => import('@/features/referrals/NewReferralPage'))
const EmployeesPage = lazy(() => import('@/features/employees/EmployeesPage'))
const FactorsPage = lazy(() => import('@/features/exposure/FactorsPage'))
const TemplatesPage = lazy(() => import('@/features/templates/TemplatesPage'))
const UsersPage = lazy(() => import('@/features/users/UsersPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/skierowania" replace />} />
        <Route
          path="/skierowania"
          element={<RouteBoundary><ReferralsPage /></RouteBoundary>}
        />
        <Route
          path="/skierowania/nowe"
          element={<RouteBoundary><NewReferralPage /></RouteBoundary>}
        />
        <Route
          path="/pracownicy"
          element={<RouteBoundary><EmployeesPage /></RouteBoundary>}
        />
        <Route
          path="/czynniki"
          element={<RouteBoundary><FactorsPage /></RouteBoundary>}
        />
        <Route
          path="/szablony"
          element={<RouteBoundary><TemplatesPage /></RouteBoundary>}
        />
        <Route
          path="/uzytkownicy"
          element={<RouteBoundary><UsersPage /></RouteBoundary>}
        />
      </Route>
      <Route path="*" element={<Navigate to="/skierowania" replace />} />
    </Routes>
  )
}
