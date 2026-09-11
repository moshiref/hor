import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useScrolled } from '@/hooks/useScrolled'
import { useScrollLock } from '@/hooks/useScrollLock'
import { getSiteConfig } from '@/lib/siteStore'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'
import { Container } from '@/components/ui/Container'

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
      className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${
        isScrolled
          ? 'bg-cream-50/95 shadow-[0_1px_0_0_rgba(23,35,60,0.08)] backdrop-blur'
          : 'bg-cream-50/70 backdrop-blur-sm'
      }`}
    >
      <Container>
        <nav
          aria-label="التنقل الرئيسي"
          className="flex h-[4.5rem] items-center justify-between gap-4 py-3"
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

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {visibleLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-md px-4 py-2 text-[0.95rem] font-medium text-ink-600 transition-colors hover:text-raspberry-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-500"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {header.isVisible && (
            <a
              href={header.ctaHref}
              onClick={(e) => handleNavClick(e, header.ctaHref)}
              className="hidden shrink-0 rounded-full bg-raspberry-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-raspberry-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-700 md:inline-block"
            >
              {header.ctaLabel}
            </a>
          )}

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
              {header.isVisible && (
                <li className="pt-2">
                  <a
                    href={header.ctaHref}
                    onClick={(e) => handleNavClick(e, header.ctaHref)}
                    className="block rounded-full bg-raspberry-500 px-5 py-3 text-center text-base font-bold text-white transition-colors hover:bg-raspberry-600"
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
