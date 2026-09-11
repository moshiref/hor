import { Bus, Clock3, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { GlassIcon } from '@/components/ui/GlassIcon'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { siteContentService } from '@/services/site.service'

export default function Schedule() {
  const scheduleContent = siteContentService.getSchedule()
  const parallaxRef = useMouseParallax(10)
  return (
    <section
      id="schedule"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/schedule relative scroll-mt-20 overflow-hidden bg-white py-20 sm:py-28"
      aria-labelledby="schedule-heading"
    >
      <Spotlight />
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold tracking-wide text-amber-700 ring-1 ring-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
              المواعيد والفترات
            </p>
            <h2 id="schedule-heading" className="font-display bg-gradient-to-l from-amber-600 via-amber-500 to-raspberry-500 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {scheduleContent.title}
            </h2>
            <div aria-hidden className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-amber-400 to-raspberry-400" />
            <p className="mt-4 text-lg leading-relaxed text-ink-600">{scheduleContent.description}</p>
          </div>
        </Reveal>

        {/* Two periods + two extras — mobile-first, very clear */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {scheduleContent.periods.map((period, i) => (
            <Reveal key={period.id} delay={i * 90}>
              <Card padding="lg" hover className="group text-center md:text-right">
                <div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
                  <GlassIcon variant="teal" size="md">
                    <Clock3 size={22} aria-hidden />
                  </GlassIcon>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-800">{period.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-teal-600">{period.time}</p>
                    <p className="mt-1 text-sm text-ink-600">{period.note}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal delay={180}>
            <Card padding="lg" hover className="group flex items-start gap-4">
              <GlassIcon variant="amber" size="md">
                <MapPin size={22} aria-hidden />
              </GlassIcon>
              <div>
                <h3 className="font-display text-base font-bold text-ink-800">{scheduleContent.extras[0].title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{scheduleContent.extras[0].description}</p>
              </div>
            </Card>
          </Reveal>
          <Reveal delay={260}>
            <Card padding="lg" hover className="group flex items-start gap-4">
              <GlassIcon variant="raspberry" size="md">
                <Bus size={22} aria-hidden />
              </GlassIcon>
              <div>
                <h3 className="font-display text-base font-bold text-ink-800">{scheduleContent.extras[1].title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{scheduleContent.extras[1].description}</p>
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
