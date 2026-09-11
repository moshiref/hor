import { Navigation } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { getSiteConfig } from '@/lib/siteStore'
import { siteContentService } from '@/services/site.service'

export default function Location() {
  const siteConfig = getSiteConfig()
  const locSection = siteContentService.getLocationSection()
  const mapsUrl = siteConfig.location.googleMapsUrl ?? 'https://maps.google.com/?q=21.399221,39.302299'
  const lat = siteConfig.location.lat ?? 21.399221
  const lng = siteConfig.location.lng ?? 39.302299

  const embedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`

  return (
    <section id="location" className="scroll-mt-20 bg-white py-20 sm:py-28" aria-labelledby="location-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="location-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
            {locSection.title}
          </h2>
          <p className="mt-3 text-sm text-ink-400">{locSection.helperText}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-ink-100 bg-ink-50 shadow-card">
          <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
            <iframe
              title="خريطة موقع مركز حور العين"
              src={embedSrc}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink-800 px-8 py-3.5 text-base font-bold text-white transition-colors hover:bg-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-800"
          >
            <Navigation size={18} aria-hidden />
            {locSection.buttonLabel}
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-ink-400">
          يمكن تحديث رابط الخريطة الدقيق لاحقًا من لوحة التحكم دون تعديل الكود.
        </p>
      </Container>
    </section>
  )
}
