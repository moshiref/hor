import { Bus, Clock3, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card, CardIcon } from '@/components/ui/Card'
import { siteContentService } from '@/services/site.service'

export default function Schedule() {
  const scheduleContent = siteContentService.getSchedule()
  return (
    <section id="schedule" className="scroll-mt-20 bg-white py-20 sm:py-28" aria-labelledby="schedule-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="schedule-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
            {scheduleContent.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{scheduleContent.description}</p>
        </div>

        {/* Two periods + two extras — mobile-first, very clear */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {scheduleContent.periods.map((period) => (
            <Card key={period.id} padding="lg" className="text-center md:text-right">
              <div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
                <CardIcon className="bg-teal-100 text-teal-700">
                  <Clock3 size={22} aria-hidden />
                </CardIcon>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-800">{period.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-teal-600">{period.time}</p>
                  <p className="mt-1 text-sm text-ink-600">{period.note}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card padding="lg" className="flex items-start gap-4">
            <CardIcon className="bg-amber-100 text-amber-600">
              <MapPin size={22} aria-hidden />
            </CardIcon>
            <div>
              <h3 className="font-display text-base font-bold text-ink-800">{scheduleContent.extras[0].title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{scheduleContent.extras[0].description}</p>
            </div>
          </Card>
          <Card padding="lg" className="flex items-start gap-4">
            <CardIcon className="bg-raspberry-50 text-raspberry-600">
              <Bus size={22} aria-hidden />
            </CardIcon>
            <div>
              <h3 className="font-display text-base font-bold text-ink-800">{scheduleContent.extras[1].title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{scheduleContent.extras[1].description}</p>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  )
}
