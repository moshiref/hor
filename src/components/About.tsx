import { BookOpen, Bus, Clock3, Languages, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card, CardIcon } from '@/components/ui/Card'
import { siteContentService } from '@/services/site.service'
import type { FeatureIcon } from '@/types/content'

const iconMap: Record<FeatureIcon, LucideIcon> = {
  'book-open': BookOpen,
  languages: Languages,
  clock: Clock3,
  bus: Bus,
  users: Users,
  shield: BookOpen,
  heart: Users,
  star: BookOpen,
}

export default function About() {
  const content = siteContentService.getAbout()
  const visibleFeatures = content.features
    .filter((f) => f.isVisible)
    .sort((a, b) => a.order - b.order)

  return (
    <section id="about" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28" aria-labelledby="about-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Copy */}
          <div className="text-center lg:text-right">
            <h2
              id="about-heading"
              className="font-display relative inline-block pb-2 text-3xl font-bold text-raspberry-600 sm:text-4xl"
            >
              {content.title}
              <span
                aria-hidden
                className="absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-gradient-to-l from-raspberry-400 to-amber-300 lg:left-auto lg:right-0 lg:translate-x-0"
              />
            </h2>
            {content.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={idx === 0 ? 'mt-5 text-lg leading-loose text-ink-600' : 'mt-4 text-lg leading-loose text-ink-600'}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleFeatures.map((feature) => {
              const Icon = iconMap[feature.icon] ?? BookOpen
              return (
                <Card key={feature.id} className="flex items-start gap-4">
                  <CardIcon>
                    <Icon size={22} aria-hidden />
                  </CardIcon>
                  <span>
                    <span className="block font-display text-base font-semibold text-ink-800">
                      {feature.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-600">
                      {feature.description}
                    </span>
                  </span>
                </Card>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
