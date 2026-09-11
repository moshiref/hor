import { Heart, Sparkles, BookOpen, ShieldCheck, Star, UserRound } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { siteContentService } from '@/services/site.service'
import { getSiteConfig } from '@/lib/siteStore'
import { useImageUrl } from '@/hooks/useImageUrl'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'

export default function Hero() {
  const content = siteContentService.getHero()
  const siteConfig = getSiteConfig()
  const logoUrl = useImageUrl(siteConfig.logoMark) ?? siteConfig.logoMark
  const parallaxRef = useMouseParallax(18)

  // عبارات تحفيزية للبطاقات العائمة
  const badges = [
    { icon: Heart, text: 'بيئة حنونة وآمنة', pos: '-top-2 -right-2 sm:top-1 sm:-right-6', variant: 'raspberry' as const, anim: 'float-a' },
    { icon: BookOpen, text: 'قرآن وحروف بفرح', pos: 'top-[42%] -left-3 sm:-left-8', variant: 'teal' as const, anim: 'float-b' },
    { icon: Star, text: 'ننمّي الثقة والإبداع', pos: '-bottom-1 right-6 sm:-bottom-2 sm:right-10', variant: 'amber' as const, anim: 'float-c' },
    { icon: ShieldCheck, text: 'رعاية بكل حب', pos: 'bottom-[18%] -right-1 sm:-right-5', variant: 'raspberry' as const, anim: 'float-a' },
  ]

  return (
    <section
      id="hero"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/hero relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pb-32 [--spot-x:50%] [--spot-y:50%]"
      aria-labelledby="hero-heading"
      style={{ background: 'radial-gradient(900px 500px at 85% 10%, rgba(196,28,99,0.06), transparent 60%), radial-gradient(700px 400px at 10% 85%, rgba(30,106,133,0.05), transparent 60%), linear-gradient(to bottom, #FAF6F0, #FDFBF8)' }}
    >
      <Spotlight className="opacity-60" />

      {/* Decorative arc — parallax layer */}
      <div
        aria-hidden
        data-parallax
        data-parallax-depth="0.35"
        className="pointer-events-none absolute -left-40 top-24 hidden h-[420px] w-[420px] rounded-full border-[28px] border-amber-300/30 lg:block will-change-transform"
      />
      {/* soft orbs */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-raspberry-100/50 to-amber-100/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-10 h-[320px] w-[320px] rounded-full bg-teal-100/40 blur-3xl" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Text column */}
          <div className="relative z-10 text-center lg:text-right">
            <Reveal delay={0}>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-teal-700 shadow-sm ring-1 ring-ink-100 backdrop-blur">
                <UserRound size={16} aria-hidden />
                {content.eyebrow}
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 pulse-dot inline-block" aria-hidden />
              </p>
            </Reveal>

            <Reveal delay={90}>
              <h1
                id="hero-heading"
                className="font-display bg-gradient-to-l from-raspberry-500 via-amber-500 to-teal-600 bg-clip-text text-4xl font-bold leading-[1.15] text-transparent sm:text-5xl lg:text-[3.6rem]"
              >
                {content.title}
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mx-auto mt-6 max-w-lg text-[1.06rem] leading-relaxed text-ink-600 lg:mx-0">
                {content.description}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start">
                <ButtonLink
                  href={content.primaryCta.href}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto shadow-[0_8px_20px_rgba(196,28,99,0.24)] hover:shadow-[0_12px_28px_rgba(196,28,99,0.30)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {content.primaryCta.label}
                </ButtonLink>
                <ButtonLink
                  href={content.secondaryCta.href}
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto hover:-translate-y-0.5 transition-transform duration-300"
                >
                  {content.secondaryCta.label}
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {/* Interactive Logo Circle — replaces static image */}
          <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[460px] lg:max-w-none lg:mx-0">
            {/* central glow */}
            <div aria-hidden className="absolute inset-0 flex items-center justify-center">
              <div className="h-[360px] w-[360px] rounded-full bg-gradient-to-br from-raspberry-200/30 via-amber-100/30 to-teal-100/30 blur-[42px]" />
            </div>

            {/* pulse rings */}
            <div className="relative flex aspect-square items-center justify-center p-8 sm:p-10">
              <div aria-hidden className="absolute inset-6 rounded-full border border-raspberry-200/30 pulse-ring" />
              <div aria-hidden className="absolute inset-10 rounded-full border border-amber-200/30 pulse-ring" style={{ animationDelay: '0.45s' }} />
              <div aria-hidden className="absolute inset-[3.2rem] rounded-full border border-teal-200/20 pulse-ring" style={{ animationDelay: '0.9s' }} />

              {/* luxury white circle with logo */}
              <div
                data-parallax
                data-parallax-depth="0.55"
                className="luxury-pulse relative flex h-[260px] w-[260px] items-center justify-center rounded-full bg-white p-7 sm:h-[300px] sm:w-[300px] sm:p-8 will-change-transform"
              >
                {/* inner crystal rim */}
                <div className="absolute inset-[14px] rounded-full bg-gradient-to-br from-white to-cream-50 shadow-[inset_0_1px_8px_rgba(23,35,60,0.06)]" aria-hidden />
                <div className="absolute inset-0 rounded-full ring-1 ring-white/80" aria-hidden />
                <img
                  src={logoUrl}
                  alt={`شعار ${siteConfig.name}`}
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(23,35,60,0.08)]"
                  width={280}
                  height={280}
                  loading="eager"
                  fetchPriority="high"
                />
                {/* subtle shimmer sweep on hover */}
                <div aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/hero:opacity-100 group-hover/hero:animate-[shimmer_1.2s_ease] will-change-transform" />
                </div>
              </div>

              {/* Floating Glass Badges */}
              {badges.map(({ icon: Icon, text, pos, variant, anim }) => (
                <div
                  key={text}
                  data-parallax
                  data-parallax-depth={variant === 'teal' ? '0.9' : variant === 'amber' ? '1.15' : '1.0'}
                  className={`glass-badge absolute ${pos} ${anim} hidden sm:flex items-center gap-2 rounded-2xl px-3.5 py-2.5 will-change-transform`}
                  style={{
                    background:
                      variant === 'raspberry'
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(253,241,245,0.88))'
                        : variant === 'teal'
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(220,238,243,0.88))'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(251,234,208,0.88))',
                  }}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm ${
                      variant === 'raspberry'
                        ? 'bg-raspberry-500 text-white shadow-[0_4px_12px_rgba(196,28,99,0.25)]'
                        : variant === 'teal'
                          ? 'bg-teal-600 text-white shadow-[0_4px_12px_rgba(30,106,133,0.25)]'
                          : 'bg-amber-500 text-white shadow-[0_4px_12px_rgba(222,159,53,0.25)]'
                    }`}
                  >
                    <Icon size={16} aria-hidden />
                  </span>
                  <span className="whitespace-nowrap text-xs font-bold leading-none text-ink-700">{text}</span>
                </div>
              ))}
            </div>

            {/* mobile badges row — shows below circle on small screens */}
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:hidden">
              {badges.slice(0, 3).map(({ icon: Icon, text, variant }) => (
                <span
                  key={text}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ring-1 ${
                    variant === 'raspberry'
                      ? 'bg-raspberry-50 text-raspberry-700 ring-raspberry-200/50'
                      : variant === 'teal'
                        ? 'bg-teal-50 text-teal-700 ring-teal-200/50'
                        : 'bg-amber-50 text-amber-700 ring-amber-200/50'
                  }`}
                >
                  <Icon size={13} aria-hidden />
                  {text}
                </span>
              ))}
            </div>

            {/* Sparkles badge retained as bottom caption */}
            {content.badge && (
              <div
                data-parallax
                data-parallax-depth="0.4"
                className="mx-auto mt-4 hidden max-w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-600 shadow-card ring-1 ring-ink-100 sm:flex will-change-transform"
              >
                <Sparkles size={14} className="text-amber-500" aria-hidden />
                {content.badge.text}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
