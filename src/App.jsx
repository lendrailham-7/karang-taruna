import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute, { FullScreenLoader } from './components/admin/ProtectedRoute'
import Home from './pages/Home'
import Kegiatan from './pages/Kegiatan'
import KegiatanDetail from './pages/KegiatanDetail'
import Anggota from './pages/Anggota'
import NotFound from './pages/NotFound'

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const KegiatanAdmin = lazy(() => import('./pages/admin/KegiatanAdmin'))
const AnggotaAdmin = lazy(() => import('./pages/admin/AnggotaAdmin'))

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            {/* Halaman Publik */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="kegiatan" element={<Kegiatan />} />
              <Route path="kegiatan/:id" element={<KegiatanDetail />} />
              <Route path="anggota" element={<Anggota />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Halaman Admin */}
            <Route path="admin/login" element={<Login />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="kegiatan" element={<KegiatanAdmin />} />
              <Route path="anggota" element={<AnggotaAdmin />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  )
}
