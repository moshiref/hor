import { ImageOff } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'

function ActivityCard({ item }: { item: ReturnType<typeof siteContentService.getActivities>['items'][number] }) {
  const url = useImageUrl(item.image ?? null)
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-card">
      {url ? (
        <div className="aspect-[4/3] overflow-hidden">
          <img src={url} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        </div>
      ) : (
        <div className="flex aspect-[4/3] flex-col items-center justify-center border border-dashed border-ink-100 bg-cream-50 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink-400">
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
  )
}

export default function Activities() {
  const data = siteContentService.getActivities()
  const visible = data.items.filter((i) => i.isVisible).sort((a, b) => a.order - b.order)

  return (
    <section id="activities" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28" aria-labelledby="activities-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="activities-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{data.description}</p>
        </div>

        {visible.length === 0 ? (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <ImageOff size={28} className="mx-auto text-ink-400" aria-hidden />
            <p className="mt-3 text-sm font-bold text-ink-700">لا توجد أنشطة معروضة حالياً</p>
            <p className="mt-1 text-xs text-ink-400">سيتم عرض الأنشطة عند إضافتها من لوحة التحكم — الوسائط</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
