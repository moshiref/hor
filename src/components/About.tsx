import { BookOpen, Bus, Clock3, Eye, Heart, Languages, ShieldCheck, Sparkles, Target, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { GlassIcon } from '@/components/ui/GlassIcon'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'
import { DecorOrbs } from '@/components/effects/DecorOrbs'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { siteContentService } from '@/services/site.service'
import type { FeatureIcon } from '@/types/content'

const iconMap: Record<FeatureIcon, LucideIcon> = {
  'book-open': BookOpen,
  languages: Languages,
  clock: Clock3,
  bus: Bus,
  users: Users,
  shield: ShieldCheck,
  heart: Heart,
  star: Sparkles,
}

const glassVariant: Record<FeatureIcon, 'raspberry' | 'teal' | 'amber' | 'ink'> = {
  'book-open': 'raspberry',
  languages: 'teal',
  clock: 'amber',
  bus: 'teal',
  users: 'ink',
  shield: 'teal',
  heart: 'raspberry',
  star: 'amber',
}

export default function About() {
  const content = siteContentService.getAbout()
  const visibleFeatures = content.features
    .filter((f) => f.isVisible)
    .sort((a, b) => a.order - b.order)
  const parallaxRef = useMouseParallax(12)

  return (
    <section
      id="about"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/about relative scroll-mt-20 overflow-hidden bg-cream-50 py-20 sm:py-28"
      aria-labelledby="about-heading"
    >
      <Spotlight />
      <DecorOrbs
        orbs={[
          { tone: 'amber', size: 70, pos: { top: '12%', left: '-24px' }, depth: 1.2 },
          { tone: 'teal', size: 40, pos: { bottom: '14%', right: '28px' }, depth: 0.7, float: 'float-b' },
          { tone: 'raspberry', size: 22, pos: { top: '30%', right: '60px' }, depth: 1.6, float: 'float-c', blur: true },
        ]}
      />
      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Copy */}
          <Reveal delay={0}>
            <div className="text-center lg:text-right">
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-raspberry-50 px-3.5 py-1 text-xs font-bold tracking-wide text-raspberry-700 ring-1 ring-raspberry-200 lg:ml-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-raspberry-500" aria-hidden />
                من نحن
              </p>
              <h2
                id="about-heading"
                className="font-display relative inline-block bg-gradient-to-l from-raspberry-600 to-amber-500 bg-clip-text pb-2 text-3xl font-bold text-transparent sm:text-4xl"
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
          </Reveal>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleFeatures.map((feature, idx) => {
              const Icon = iconMap[feature.icon] ?? BookOpen
              return (
                <Reveal key={feature.id} delay={idx * 80} className="h-full">
                  <Card className="group flex h-full items-start gap-4" hover>
                    <GlassIcon variant={glassVariant[feature.icon] ?? 'teal'} size="md">
                      <Icon size={22} aria-hidden />
                    </GlassIcon>
                    <span>
                      <span className="block font-display text-base font-semibold text-ink-800">
                        {feature.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-600">
                        {feature.description}
                      </span>
                    </span>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Vision & Mission */}
        {(content.vision || content.mission) && (
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              { key: 'vision', label: 'الرؤية', text: content.vision, Icon: Eye, variant: 'raspberry' as const, accent: 'border-t-raspberry-400' },
              { key: 'mission', label: 'رسالتنا', text: content.mission, Icon: Target, variant: 'teal' as const, accent: 'border-t-teal-400' },
            ]
              .filter((item) => item.text)
              .map(({ key, label, text, Icon, variant, accent }, idx) => (
                <Reveal key={key} delay={idx * 100} className="h-full">
                  <Card className={`h-full border-t-4 text-right ${accent}`} hover>
                    <div className="flex items-center gap-3">
                      <GlassIcon variant={variant} size="md">
                        <Icon size={22} aria-hidden />
                      </GlassIcon>
                      <h3 className="font-display text-xl font-bold text-ink-800">{label}</h3>
                    </div>
                    <p className="mt-4 text-base leading-loose text-ink-600">{text}</p>
                  </Card>
                </Reveal>
              ))}
          </div>
        )}
      </Container>
    </section>
  )
}
