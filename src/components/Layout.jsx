import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ConfigNotice from './ConfigNotice'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ConfigNotice />
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
