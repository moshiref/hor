import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Programs from './components/Programs'
import Activities from './components/Activities'
import Schedule from './components/Schedule'
import WhyUs from './components/WhyUs'
import StudentRegistration from './components/StudentRegistration'
import StaffRegistration from './components/StaffRegistration'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'

import { lazy, Suspense, useEffect, useState } from 'react'
import AdminLayout from '@/admin/AdminLayout'
import ProtectedRoute from '@/admin/ProtectedRoute'
import Login from '@/admin/pages/Login'
import { getSections, hydrateCmsFromSupabase } from '@/lib/siteStore'

const Dashboard = lazy(() => import('@/admin/pages/Dashboard'))
const Students = lazy(() => import('@/admin/pages/Students'))
const Staff = lazy(() => import('@/admin/pages/Staff'))
const Reports = lazy(() => import('@/admin/pages/Reports'))
const Settings = lazy(() => import('@/admin/pages/Settings'))
const MediaLibrary = lazy(() => import('@/admin/pages/MediaLibrary'))

function PublicSite() {
  const [sections, setSections] = useState(() => getSections())

  useEffect(() => {
    hydrateCmsFromSupabase().then(() => setSections(getSections()))
  }, [])

  const orderMap: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" />,
    about: <About key="about" />,
    programs: <Programs key="programs" />,
    activities: <Activities key="activities" />,
    schedule: <Schedule key="schedule" />,
    whyUs: <WhyUs key="whyUs" />,
    registration: <StudentRegistration key="registration" />,
    staffRegistration: <StaffRegistration key="staffRegistration" />,
    location: <Location key="location" />,
    contact: <Contact key="contact" />,
  }

  const renderSections = () => {
    return sections
      .filter((s) => s.isVisible)
      .sort((a, b) => a.order - b.order)
      .map((s) => orderMap[s.key])
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <main>{renderSections()}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<div className="p-8 text-center text-ink-400">جارٍ التحميل...</div>}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="students"
          element={
            <Suspense fallback={<div className="p-8 text-center">جارٍ التحميل...</div>}>
              <Students />
            </Suspense>
          }
        />
        <Route
          path="staff"
          element={
            <Suspense fallback={<div className="p-8 text-center">جارٍ التحميل...</div>}>
              <Staff />
            </Suspense>
          }
        />
        <Route
          path="reports"
          element={
            <Suspense fallback={<div className="p-8 text-center">جارٍ التحميل...</div>}>
              <Reports />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<div className="p-8 text-center">جارٍ التحميل...</div>}>
              <Settings />
            </Suspense>
          }
        />
        <Route
          path="media"
          element={
            <Suspense fallback={<div className="p-8 text-center">جارٍ التحميل...</div>}>
              <MediaLibrary />
            </Suspense>
          }
        />
      </Route>
      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}
