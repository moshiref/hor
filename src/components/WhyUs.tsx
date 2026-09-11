import { Check } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { GlassIcon } from '@/components/ui/GlassIcon'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { siteContentService } from '@/services/site.service'

export default function WhyUs() {
  const whyUsContent = siteContentService.getWhyUs()
  const parallaxRef = useMouseParallax(10)
  return (
    <section
      id="why-us"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/whyus relative scroll-mt-20 overflow-hidden bg-cream-50 py-20 sm:py-28"
      aria-labelledby="whyus-heading"
    >
      <Spotlight />
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3.5 py-1 text-xs font-bold tracking-wide text-ink-700 ring-1 ring-ink-200">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-600" aria-hidden />
              مزايانا
            </p>
            <h2 id="whyus-heading" className="font-display bg-gradient-to-l from-ink-800 via-ink-700 to-teal-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {whyUsContent.title}
            </h2>
            <div aria-hidden className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-ink-700 to-teal-400" />
            <p className="mt-4 text-lg leading-relaxed text-ink-600">{whyUsContent.description}</p>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {whyUsContent.features.map((feature, i) => (
            <Reveal key={feature.id} delay={i * 60}>
              <div className="card-luxury group flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
                <GlassIcon variant={i % 3 === 0 ? 'teal' : i % 3 === 1 ? 'raspberry' : 'amber'} size="sm" className="h-9 w-9 rounded-xl">
                  <Check size={18} aria-hidden />
                </GlassIcon>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-800">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{feature.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
