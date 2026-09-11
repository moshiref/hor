import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useScrolled } from '@/hooks/useScrolled'
import { useScrollLock } from '@/hooks/useScrollLock'
import { getSiteConfig } from '@/lib/siteStore'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'
import { Container } from '@/components/ui/Container'

const STAFF_HREF = '#staff-registration'
const STAFF_LABEL = 'التقديم كعاملة رعاية طفولة'

export default function Navbar() {
  const siteConfig = getSiteConfig()
  const logoUrl = useImageUrl(siteConfig.logoMark) ?? siteConfig.logoMark
  const [isOpen, setIsOpen] = useState(false)
  const isScrolled = useScrolled(8)

  useScrollLock(isOpen)

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    setIsOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navigation = siteContentService.getNavigation()
  const header = siteContentService.getHeader()
  const visibleLinks = navigation.filter((l) => l.isVisible !== false).sort((a, b) => a.order - b.order)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-ink-100/70 bg-cream-50/92 shadow-[0_1px_0_0_rgba(23,35,60,0.06),0_8px_28px_rgba(23,35,60,0.07)] backdrop-blur-xl supports-[backdrop-filter]:bg-cream-50/80'
          : 'border-transparent bg-cream-50/60 backdrop-blur-md'
      }`}
    >
      <Container>
        <nav
          aria-label="التنقل الرئيسي"
          className="flex h-[4.5rem] items-center justify-between gap-3 py-3"
        >
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-raspberry-500"
          >
            <img
              src={logoUrl}
              alt={`شعار ${siteConfig.name}`}
              className="h-11 w-auto sm:h-12"
              width={48}
              height={48}
            />
            <span className="font-display text-lg font-semibold leading-tight text-ink-800 sm:text-xl">
              {siteConfig.shortName}
              <span className="block text-[0.65rem] font-medium tracking-tight text-ink-400">
                {siteConfig.tagline}
              </span>
            </span>
          </a>

          {/* Desktop nav — premium hover */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {visibleLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-ink-600 transition-all duration-200 hover:bg-white hover:text-ink-800 hover:shadow-sm hover:ring-1 hover:ring-ink-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-500"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2.5 md:flex">
            {/* Primary header CTA — subtle */}
            {header.isVisible && (
              <a
                href={header.ctaHref}
                onClick={(e) => handleNavClick(e, header.ctaHref)}
                className="hidden shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink-700 shadow-sm ring-1 ring-ink-200 transition-all hover:bg-ink-50 hover:ring-ink-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-700 xl:inline-block"
              >
                {header.ctaLabel}
              </a>
            )}

            {/* Featured Staff CTA — luxury gradient + live dot */}
            <a
              href={STAFF_HREF}
              onClick={(e) => handleNavClick(e, STAFF_HREF)}
              className="group relative inline-flex shrink-0 items-center gap-2.5 rounded-full bg-gradient-to-l from-raspberry-500 via-raspberry-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(196,28,99,0.28),0_2px_8px_rgba(222,159,53,0.18)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_28px_rgba(196,28,99,0.34),0_4px_12px_rgba(222,159,53,0.22)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-600"
            >
              {/* live pulse dot */}
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" aria-hidden />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white/60 shadow-[0_0_8px_rgba(52,211,153,0.7)] pulse-dot" aria-hidden />
              </span>
              {STAFF_LABEL}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-gradient-to-l from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-500 md:hidden"
          >
            {isOpen ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
          </button>
        </nav>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`grid overflow-hidden bg-cream-50 transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden border-t border-ink-100">
          <Container>
            <ul className="flex flex-col gap-1 py-4">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-ink-50 hover:text-raspberry-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {/* Mobile Staff CTA — featured */}
              <li className="pt-3">
                <a
                  href={STAFF_HREF}
                  onClick={(e) => handleNavClick(e, STAFF_HREF)}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-raspberry-500 to-amber-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-[0_8px_20px_rgba(196,28,99,0.25)]"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white/60" />
                  </span>
                  {STAFF_LABEL} — مفتوح الآن
                </a>
              </li>
              {header.isVisible && (
                <li className="pt-2">
                  <a
                    href={header.ctaHref}
                    onClick={(e) => handleNavClick(e, header.ctaHref)}
                    className="block rounded-full bg-white px-5 py-3 text-center text-base font-bold text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ink-50"
                  >
                    {header.ctaLabel}
                  </a>
                </li>
              )}
            </ul>
          </Container>
        </div>
      </div>
    </header>
  )
}
