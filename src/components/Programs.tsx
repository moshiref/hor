import { BookOpen, Heart, Languages, Sparkles, Users, ShieldCheck, Clock3, Bus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { GlassIcon } from '@/components/ui/GlassIcon'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'
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

function ProgramCard({ program, iconMap, index }: { program: ReturnType<typeof siteContentService.getPrograms>['programs'][number]; iconMap: Record<FeatureIcon, LucideIcon>; index: number }) {
  const imageUrl = useImageUrl((program as unknown as { image?: string }).image ?? null)
  const Icon = iconMap[program.icon] ?? BookOpen
  return (
    <Reveal delay={index * 70}>
      <Card padding="lg" hover className="group flex flex-col overflow-hidden">
        {imageUrl ? (
          <div className="-mx-6 -mt-6 mb-4 aspect-[16/10] overflow-hidden bg-cream-50">
            <img src={imageUrl} alt={program.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
          </div>
        ) : (
          <GlassIcon variant={glassVariant[program.icon] ?? 'raspberry'} size="md">
            <Icon size={22} aria-hidden />
          </GlassIcon>
        )}
        <h3 className="mt-3 font-display text-lg font-bold text-ink-800">{program.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{program.description}</p>
      </Card>
    </Reveal>
  )
}

export default function Programs() {
  const programsContent = siteContentService.getPrograms()
  const parallaxRef = useMouseParallax(10)
  return (
    <section
      id="programs"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/programs relative scroll-mt-20 overflow-hidden bg-white py-20 sm:py-28"
      aria-labelledby="programs-heading"
    >
      <Spotlight />
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="programs-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
              {programsContent.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">{programsContent.description}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programsContent.programs.map((program, i) => (
            <ProgramCard key={program.id} program={program} iconMap={iconMap} index={i} />
          ))}
        </div>
      </Container>
    </section>
  )
}
