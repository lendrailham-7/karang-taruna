import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Kegiatan from './pages/Kegiatan'
import KegiatanDetail from './pages/KegiatanDetail'
import Anggota from './pages/Anggota'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="kegiatan" element={<Kegiatan />} />
            <Route path="kegiatan/:id" element={<KegiatanDetail />} />
            <Route path="anggota" element={<Anggota />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  )
}
