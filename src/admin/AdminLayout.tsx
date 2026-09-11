import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  GraduationCap,
  UsersRound,
  Settings2,
  FileBarChart,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Home,
  Images,
} from 'lucide-react'
import { useAuth } from '@/admin/auth'
import { getSiteConfig } from '@/lib/siteStore'
import { useImageUrl } from '@/hooks/useImageUrl'

const navGroups = [
  {
    title: 'الرئيسي',
    items: [{ to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'إدارة الموقع',
    items: [{ to: '/admin/settings', label: 'إعدادات الموقع', icon: Settings2 }],
  },
  {
    title: 'الطلبات',
    items: [
      { to: '/admin/students', label: 'طلبات الطلاب', icon: GraduationCap },
      { to: '/admin/staff', label: 'طلبات العاملات', icon: UsersRound },
    ],
  },
  {
    title: 'التقارير والوسائط',
    items: [
      { to: '/admin/reports', label: 'التقارير', icon: FileBarChart },
      { to: '/admin/media', label: 'مكتبة الوسائط', icon: Images },
    ],
  },
]

const breadcrumbMap: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/students': 'طلبات الطلاب',
  '/admin/staff': 'طلبات العاملات',
  '/admin/reports': 'التقارير',
  '/admin/media': 'مكتبة الوسائط',
  '/admin/settings': 'إعدادات الموقع',
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const site = getSiteConfig()

  const handleLogout = () => {
    logout()
    nav('/admin/login', { replace: true })
  }

  const logoUrl = useImageUrl(site.logoMark) ?? site.logoMark
  const currentLabel = breadcrumbMap[loc.pathname] ?? 'لوحة التحكم'

  return (
    <div className="min-h-screen bg-[#F8F9FB]" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-[280px] flex-col border-l border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex h-[64px] items-center gap-3 border-b border-gray-100 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-raspberry-50">
            <img src={logoUrl} alt="" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="font-display text-[13px] font-bold leading-none text-ink-800">{site.shortName}</p>
            <p className="text-[11px] font-medium text-ink-400">لوحة التحكم</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ms-auto rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6">
              <p className="mb-2 px-3 text-[11px] font-bold tracking-widest text-gray-400">{group.title}</p>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                const { to, label, icon: Icon } = item
                const end = (item as { end?: boolean }).end
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-ink-800 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-ink-800'
                      }`
                    }
                  >
                    <Icon size={18} className="shrink-0 opacity-80" />
                    {label}
                  </NavLink>
                )
              })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-cream-50 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-800 text-xs font-bold text-white">م</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-ink-800">مسؤول النظام</p>
              <p className="truncate text-[11px] text-ink-400">admin@hor-alain.local</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-ink-700 transition-colors hover:bg-gray-50"
          >
            <LogOut size={14} />
            تسجيل خروج
          </button>
          <a href="/" className="mt-2 flex items-center justify-center gap-1 text-[11px] font-medium text-ink-400 hover:text-ink-600">
            العودة للموقع <ChevronLeft size={12} />
          </a>
        </div>
      </aside>

      {/* Overlay */}
      {open && <button aria-label="إغلاق الخلفية" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] lg:hidden" />}

      {/* Main */}
      <div className="lg:ms-[280px]">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-[64px] items-center gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur sm:px-6">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-ink-700 shadow-sm hover:bg-gray-50 lg:hidden"
            aria-label="فتح القائمة"
          >
            <Menu size={18} />
          </button>

          <nav aria-label="مسار التنقل" className="hidden items-center gap-1.5 text-xs sm:flex">
            <NavLink to="/" className="flex items-center gap-1 text-gray-400 hover:text-ink-600">
              <Home size={14} />
              الموقع
            </NavLink>
            <ChevronLeft size={12} className="text-gray-300" />
            <span className="font-bold text-ink-800">{currentLabel}</span>
          </nav>
          <span className="font-bold text-ink-800 sm:hidden">{currentLabel}</span>

          <div className="ms-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-600" />
              <span className="text-xs font-bold text-teal-700">النظام نشط</span>
            </div>
            <a
              href="/"
              target="_blank"
              className="hidden rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-ink-700 hover:bg-gray-50 sm:inline-flex"
            >
              معاينة الموقع
            </a>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
