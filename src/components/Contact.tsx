import { MessageCircle, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { getSiteConfig } from '@/lib/siteStore'
import { siteContentService } from '@/services/site.service'

export default function Contact() {
  const siteConfig = getSiteConfig()
  const contactSection = siteContentService.getContact()
  const rawPhone = siteConfig.contact.phone ?? '0547893386'
  // Display with LTR isolate to avoid RTL flipping
  const displayPhone = rawPhone

  const parallaxRef = useMouseParallax(10)
  return (
    <section
      id="contact"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/contact relative scroll-mt-20 overflow-hidden bg-cream-50 py-20 sm:py-28"
      aria-labelledby="contact-heading"
    >
      <Spotlight />
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="contact-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
              {contactSection.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">{contactSection.description}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="card-luxury mx-auto mt-10 max-w-xl rounded-3xl border border-ink-100 bg-white p-8 shadow-card sm:p-10">
          <div className="text-center">
            <p className="text-sm font-medium text-ink-400">{contactSection.phoneLabel}</p>
            <p className="mt-2 flex items-center justify-center gap-2">
              <Phone size={20} className="text-teal-600" aria-hidden />
              {/* bdi + dir ltr prevents RTL mirroring of numbers */}
              <bdi dir="ltr" className="font-display text-2xl font-bold tracking-wide text-ink-800">
                {displayPhone}
              </bdi>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={siteConfig.social.whatsappChannel ?? 'https://wa.me/966547893386'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            >
              <MessageCircle size={20} aria-hidden />
              {contactSection.whatsappButtonLabel}
            </a>
            <a
              href={`tel:+${(siteConfig.contact.phone ?? '0547893386').replace(/^0/, '966')}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink-700 px-8 py-3.5 text-base font-bold text-ink-700 transition-colors hover:bg-ink-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-700"
            >
              <Phone size={18} aria-hidden />
              {contactSection.callButtonLabel}
            </a>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
            يتم فتح واتساب مباشرة على الرقم الموحد. لا يتم جمع أي بيانات عبر هذه الروابط.
          </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
