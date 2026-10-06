import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ImageOff, Play, X } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { useScrollLock } from '@/hooks/useScrollLock'
import { siteContentService } from '@/services/site.service'
import { useImageUrl } from '@/hooks/useImageUrl'
import { demoActivities } from '@/data/site-content'
import { cn } from '@/lib/utils'
import type { ActivityItem } from '@/types/cms'

/** Muted looping preview that only plays while on screen. */
function PreviewVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      className={className}
    />
  )
}

function ActivityCard({
  item,
  index,
  featured,
  onOpen,
}: {
  item: ActivityItem
  index: number
  featured: boolean
  onOpen: (item: ActivityItem) => void
}) {
  const url = useImageUrl(item.image ?? null)
  const hasVideo = !!item.video
  const hasMedia = hasVideo || !!url

  const media = hasVideo ? (
    <PreviewVideo
      src={item.videoPreview ?? item.video!}
      poster={url ?? undefined}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
    />
  ) : url ? (
    <img
      src={url}
      alt={item.title}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      loading="lazy"
    />
  ) : null

  return (
    <Reveal delay={index * 70} className={cn('h-full', featured && 'sm:col-span-2 lg:row-span-2')}>
      {hasMedia ? (
        <button
          type="button"
          onClick={() => hasVideo && onOpen(item)}
          disabled={!hasVideo}
          aria-label={hasVideo ? `تشغيل فيديو: ${item.title}` : item.title}
          className={cn(
            'card-luxury group relative block h-full w-full overflow-hidden rounded-3xl border border-white/60 bg-ink-800 text-right shadow-card disabled:cursor-default',
            featured ? 'aspect-[4/3] lg:aspect-auto lg:min-h-[480px]' : 'aspect-[4/3]',
          )}
        >
          {media}
          {/* legibility gradient */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />

          {hasVideo && (
            <span
              aria-hidden
              className={cn(
                'absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/25 text-white ring-1 ring-white/50 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-raspberry-500/90 group-hover:ring-raspberry-300',
                // the featured tile is tall enough on desktop to centre the button above the caption
                featured && 'lg:left-1/2 lg:top-1/2 lg:h-20 lg:w-20 lg:-translate-x-1/2 lg:-translate-y-1/2',
              )}
            >
              <span className="absolute inset-0 rounded-full pulse-ring ring-2 ring-white/40" />
              <Play className={cn('h-5 w-5 translate-x-[-1px] fill-current', featured && 'lg:h-7 lg:w-7')} />
            </span>
          )}

          <span className={cn('absolute inset-x-0 bottom-0 block', featured ? 'p-6 sm:p-8' : 'p-5')}>
            <span
              className={cn(
                'block font-display font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]',
                featured ? 'text-2xl sm:text-3xl' : 'text-lg',
              )}
            >
              {item.title}
            </span>
            {item.description && (
              <span className={cn('mt-1.5 block leading-relaxed text-white/85', featured ? 'max-w-md text-base' : 'text-sm')}>
                {item.description}
              </span>
            )}
          </span>
        </button>
      ) : (
        <div className="card-luxury group relative h-full overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
          <div className="flex aspect-[4/3] flex-col items-center justify-center border-b border-dashed border-ink-100 bg-cream-50 p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ink-400 shadow-sm">
              <ImageOff size={22} aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink-700">{item.title}</p>
          </div>
          {item.description && <p className="p-4 text-xs leading-relaxed text-ink-600">{item.description}</p>}
        </div>
      )}
    </Reveal>
  )
}

function VideoLightbox({ item, onClose }: { item: ActivityItem; onClose: () => void }) {
  const poster = useImageUrl(item.image ?? null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useScrollLock(true)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-900/85 p-4 backdrop-blur-sm animate-[reveal-up_300ms_ease]"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute -top-12 left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition hover:bg-white/25"
        >
          <X size={20} />
        </button>
        <video
          src={item.video}
          poster={poster ?? undefined}
          controls
          autoPlay
          playsInline
          className="aspect-video w-full rounded-2xl bg-black shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
        />
        <div className="mt-4 text-right text-white">
          <p className="font-display text-xl font-bold">{item.title}</p>
          {item.description && <p className="mt-1 text-sm text-white/75">{item.description}</p>}
        </div>
      </div>
    </div>
  )
}

export default function Activities() {
  const data = siteContentService.getActivities()
  const visible = data.items.filter((i) => i.isVisible).sort((a, b) => a.order - b.order)
  // Until the center adds its own media, show the demo reel instead of an empty state
  const items = visible.length > 0 ? visible : demoActivities
  const parallaxRef = useMouseParallax(10)
  const [open, setOpen] = useState<ActivityItem | null>(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <section
      id="activities"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/activities relative scroll-mt-20 overflow-hidden bg-cream-50 py-20 sm:py-28"
      aria-labelledby="activities-heading"
    >
      <Spotlight />
      <Container className="relative z-10">
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ActivityCard key={item.id} item={item} index={i} featured={i === 0 && items.length >= 3} onOpen={setOpen} />
          ))}
        </div>
      </Container>

      {open && createPortal(<VideoLightbox item={open} onClose={close} />, document.body)}
    </section>
  )
}
