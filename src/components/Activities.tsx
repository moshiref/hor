import { ImageOff } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'

function ActivityCard({ item, index }: { item: ReturnType<typeof siteContentService.getActivities>['items'][number]; index: number }) {
  const url = useImageUrl(item.image ?? null)
  return (
    <Reveal delay={index * 70}>
      <div className="card-luxury group relative overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
        {url ? (
          <div className="aspect-[4/3] overflow-hidden">
            <img src={url} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" loading="lazy" />
          </div>
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center border-b border-dashed border-ink-100 bg-cream-50 p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink-400 shadow-sm">
              <ImageOff size={22} aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink-700">{item.title}</p>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-display text-sm font-bold text-ink-800">{item.title}</h3>
          {item.description && <p className="mt-1 text-xs leading-relaxed text-ink-600">{item.description}</p>}
        </div>
      </div>
    </Reveal>
  )
}

export default function Activities() {
  const data = siteContentService.getActivities()
  const visible = data.items.filter((i) => i.isVisible).sort((a, b) => a.order - b.order)
  const parallaxRef = useMouseParallax(10)

  return (
    <section
      id="activities"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/activities relative scroll-mt-20 overflow-hidden bg-cream-50 py-20 sm:py-28"
      aria-labelledby="activities-heading"
    >
      <Spotlight />
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-bold tracking-wide text-teal-700 ring-1 ring-teal-200">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              أنشطة وفعاليات
            </p>
            <h2 id="activities-heading" className="font-display bg-gradient-to-l from-teal-600 via-teal-600 to-raspberry-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {data.title}
            </h2>
            <div aria-hidden className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-teal-400 to-amber-300" />
            <p className="mt-4 text-lg leading-relaxed text-ink-600">{data.description}</p>
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <Reveal delay={120}>
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
              <ImageOff size={28} className="mx-auto text-ink-400" aria-hidden />
              <p className="mt-3 text-sm font-bold text-ink-700">لا توجد أنشطة معروضة حالياً</p>
              <p className="mt-1 text-xs text-ink-400">سيتم عرض الأنشطة عند إضافتها من لوحة التحكم — الوسائط</p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, i) => (
              <ActivityCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
