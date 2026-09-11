import { Check } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { siteContentService } from '@/services/site.service'

export default function WhyUs() {
  const whyUsContent = siteContentService.getWhyUs()
  return (
    <section id="why-us" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28" aria-labelledby="whyus-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="whyus-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
            {whyUsContent.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{whyUsContent.description}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {whyUsContent.features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Check size={18} aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-ink-800">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
