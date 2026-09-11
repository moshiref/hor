import { Container } from '@/components/ui/Container'
import { getSiteConfig } from '@/lib/siteStore'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'

export default function Footer() {
  const siteConfig = getSiteConfig()
  const footer = siteContentService.getFooter()
  const logoUrl = useImageUrl(siteConfig.logoMark) ?? siteConfig.logoMark
  const year = new Date().getFullYear()
  const visibleLinks = footer.links.filter((l) => l.isVisible !== false).sort((a, b) => a.order - b.order)

  return (
    <footer className="border-t border-ink-100 bg-cream-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        تذييل الموقع
      </h2>
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logoUrl} alt={`شعار ${siteConfig.name}`} className="h-10 w-auto" width={40} height={40} />
              <span className="font-display text-lg font-bold leading-tight text-ink-800">
                {siteConfig.shortName}
                <span className="block text-xs font-medium text-ink-400">{siteConfig.tagline}</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600">
              {footer.description}
            </p>
          </div>

          {/* Links */}
          <nav aria-label="روابط التذييل">
            <h3 className="font-display text-sm font-bold text-ink-800">روابط سريعة</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {visibleLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-600 transition-colors hover:text-raspberry-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold text-ink-800">تواصل</h3>
            <p className="mt-2">
              <bdi dir="ltr" className="text-sm font-bold text-ink-800">
                {siteConfig.contact.phone ?? '0547893386'}
              </bdi>
            </p>
            <a
              href={siteConfig.social.whatsappChannel ?? 'https://wa.me/966547893386'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              واتساب ←
            </a>
          </div>
        </div>

        <div className="border-t border-ink-100 py-6 text-center">
          <p className="text-xs text-ink-400">© {year} {footer.copyright}</p>
        </div>
      </Container>
    </footer>
  )
}
