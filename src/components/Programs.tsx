import { BookOpen, Heart, Languages, Sparkles, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card, CardIcon } from '@/components/ui/Card'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'
import type { FeatureIcon } from '@/types/content'

const iconMap: Record<FeatureIcon, LucideIcon> = {
  'book-open': BookOpen,
  languages: Languages,
  clock: BookOpen,
  bus: BookOpen,
  users: Users,
  shield: BookOpen,
  heart: Heart,
  star: Sparkles,
}

function ProgramCard({ program, iconMap }: { program: ReturnType<typeof siteContentService.getPrograms>['programs'][number]; iconMap: Record<FeatureIcon, LucideIcon> }) {
  const imageUrl = useImageUrl((program as unknown as { image?: string }).image ?? null)
  const Icon = iconMap[program.icon] ?? BookOpen
  return (
    <Card padding="lg" hover className="flex flex-col overflow-hidden">
      {imageUrl ? (
        <div className=" -mx-6 -mt-6 mb-4 aspect-[16/10] overflow-hidden bg-cream-50">
          <img src={imageUrl} alt={program.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
      ) : (
        <CardIcon className="bg-raspberry-50 text-raspberry-600">
          <Icon size={22} aria-hidden />
        </CardIcon>
      )}
      <h3 className="mt-2 font-display text-lg font-bold text-ink-800">{program.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{program.description}</p>
    </Card>
  )
}

export default function Programs() {
  const programsContent = siteContentService.getPrograms()
  return (
    <section id="programs" className="scroll-mt-20 bg-white py-20 sm:py-28" aria-labelledby="programs-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="programs-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
            {programsContent.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{programsContent.description}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programsContent.programs.map((program) => (
            <ProgramCard key={program.id} program={program} iconMap={iconMap} />
          ))}
        </div>
      </Container>
    </section>
  )
}
