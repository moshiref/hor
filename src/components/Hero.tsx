import { Sparkles, UserRound } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'

export default function Hero() {
  const content = siteContentService.getHero()
  const heroSrc = useImageUrl(content.image.src) ?? content.image.src

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pb-32"
      aria-labelledby="hero-heading"
    >
      {/* Decorative arc — brand element, not content */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 hidden h-[420px] w-[420px] rounded-full border-[28px] border-amber-300/40 lg:block"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Text column — appears first, so it sits on the right in RTL */}
          <div className="relative z-10 text-center lg:text-right">
            <p className="mb-4 inline-flex items-center gap-2 text-base font-semibold text-teal-600">
              <UserRound size={18} aria-hidden />
              {content.eyebrow}
            </p>

            <h1
              id="hero-heading"
              className="font-display bg-gradient-to-l from-raspberry-500 via-amber-500 to-teal-600 bg-clip-text text-4xl font-bold leading-[1.15] text-transparent sm:text-5xl lg:text-6xl"
            >
              {content.title}
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-ink-600 lg:mx-0">
              {content.description}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start">
              <ButtonLink
                href={content.primaryCta.href}
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                {content.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={content.secondaryCta.href}
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
              >
                {content.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          {/* Image column */}
          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-ink-100 sm:max-w-lg lg:max-w-none">
              <img
                src={heroSrc}
                alt={content.image.alt}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
                width={600}
                height={750}
              />
            </div>
            {content.badge && (
              <div className="absolute -bottom-5 -right-4 hidden items-center gap-2 rounded-2xl bg-cream-50 px-5 py-3 shadow-lg sm:flex">
                <Sparkles size={20} className="text-amber-500" aria-hidden />
                <span className="font-display text-sm font-semibold text-ink-700">
                  {content.badge.text}
                </span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
