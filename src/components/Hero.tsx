import { Heart, Sparkles, BookOpen, ShieldCheck, Star, UserRound } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { siteContentService } from '@/services/site.service'
import { getSiteConfig } from '@/lib/siteStore'
import { useImageUrl } from '@/hooks/useImageUrl'
import { useMouseParallax } from '@/hooks/useMouseParallax'
import { Reveal } from '@/components/effects/Reveal'
import { Spotlight } from '@/components/effects/Spotlight'

type OrbitItem = {
  icon: typeof Heart
  text: string
  angle: number
  rFactor: number
  tilt: number
  scale: number
  variant: 'raspberry' | 'teal' | 'amber'
  depth: string
  float: string
  delay: string
}

export default function Hero() {
  const content = siteContentService.getHero()
  const siteConfig = getSiteConfig()
  const logoUrl = useImageUrl(siteConfig.logoMark) ?? siteConfig.logoMark
  const parallaxRef = useMouseParallax(18)

  // True radial / orbit composition — mathematically balanced around center
  const orbit: OrbitItem[] = [
    { icon: Heart, text: 'بيئة حنونة وآمنة', angle: -38, rFactor: 1.02, tilt: -3, scale: 1, variant: 'raspberry', depth: '1.05', float: 'float-a', delay: '0s' },
    { icon: BookOpen, text: 'قرآن وحروف بفرح', angle: 198, rFactor: 0.97, tilt: 1.8, scale: 0.97, variant: 'teal', depth: '0.9', float: 'float-b', delay: '0.55s' },
    { icon: Star, text: 'ننمّي الثقة والإبداع', angle: 44, rFactor: 1.06, tilt: -1.6, scale: 1.02, variant: 'amber', depth: '1.15', float: 'float-c', delay: '1.05s' },
    { icon: ShieldCheck, text: 'رعاية بكل حب', angle: 148, rFactor: 0.92, tilt: 2, scale: 0.96, variant: 'raspberry', depth: '0.95', float: 'float-a', delay: '0.25s' },
  ]

  return (
    <section
      id="hero"
      ref={parallaxRef as unknown as React.RefObject<HTMLDivElement>}
      className="group/hero relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-28 lg:pb-32 [--spot-x:50%] [--spot-y:50%]"
      aria-labelledby="hero-heading"
      style={{
        background:
          'radial-gradient(900px 500px at 85% 10%, rgba(196,28,99,0.06), transparent 60%), radial-gradient(700px 400px at 10% 85%, rgba(30,106,133,0.05), transparent 60%), linear-gradient(to bottom, #FAF6F0, #FDFBF8)',
      }}
    >
      <Spotlight className="opacity-60" />

      {/* subtle arc + orbs — kept but softened */}
      <div
        aria-hidden
        data-parallax
        data-parallax-depth="0.35"
        className="pointer-events-none absolute -left-40 top-24 hidden h-[420px] w-[420px] rounded-full border-[28px] border-amber-300/20 lg:block will-change-transform"
      />
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-raspberry-100/45 to-amber-100/35 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-10 h-[320px] w-[320px] rounded-full bg-teal-100/35 blur-3xl" />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          {/* Text column — unchanged content */}
          <div className="relative z-10 text-center lg:text-right">
            <Reveal delay={0}>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 text-sm font-semibold text-teal-700 shadow-[0_2px_12px_rgba(23,35,60,0.06)] ring-1 ring-ink-100/80 backdrop-blur">
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

          {/* ===== Premium radial Hero composition ===== */}
          <div className="relative mx-auto w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[560px] lg:mx-0">
            {/* Responsive hero radius — controls orbit distance without clipping */}
            <div
              className="hero-orbit relative mx-auto aspect-square w-full [--hero-r:150px] sm:[--hero-r:182px] lg:[--hero-r:220px] max-w-[400px] sm:max-w-[460px] lg:max-w-[520px] select-none"
              aria-hidden={false}
            >
              {/* central ambient glow — soft studio light */}
              <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[64%] w-[64%] rounded-full bg-gradient-to-br from-raspberry-200/28 via-amber-100/28 to-teal-100/28 blur-[38px]" />
              </div>
              {/* secondary tighter glow */}
              <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[44%] w-[44%] rounded-full bg-white/70 blur-[22px]" />
              </div>

              {/* orbit guide rings — very subtle */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(var(--hero-r)*2+96px)] w-[calc(var(--hero-r)*2+96px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink-200/25"
                style={{ maskImage: 'radial-gradient(circle, black 72%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 72%, transparent 100%)' }}
              />
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(var(--hero-r)*2+34px)] w-[calc(var(--hero-r)*2+34px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-200/20" />

              {/* pulse rings around center */}
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <div className="absolute h-[360px] w-[360px] max-h-[92%] max-w-[92%] rounded-full border border-raspberry-200/25 pulse-ring sm:h-[420px] sm:w-[420px]" />
                <div
                  aria-hidden
                  className="absolute h-[320px] w-[320px] max-h-[82%] max-w-[82%] rounded-full border border-amber-200/25 pulse-ring sm:h-[380px] sm:w-[380px]"
                  style={{ animationDelay: '0.45s' }}
                />
                <div
                  aria-hidden
                  className="absolute h-[280px] w-[280px] max-h-[72%] max-w-[72%] rounded-full border border-teal-200/20 pulse-ring sm:h-[340px] sm:w-[340px]"
                  style={{ animationDelay: '0.9s' }}
                />
              </div>

              {/* subtle radial spokes */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[calc(var(--hero-r)*2+20px)] w-[calc(var(--hero-r)*2+20px)] -translate-x-1/2 -translate-y-1/2 opacity-[0.045]"
                style={{
                  background: `conic-gradient(from 0deg, transparent 0deg, rgba(23,35,60,0.55) 1deg, transparent 2deg, transparent 44deg, rgba(23,35,60,0.55) 45deg, transparent 46deg, transparent 89deg, rgba(23,35,60,0.55) 90deg, transparent 91deg, transparent 134deg, rgba(23,35,60,0.55) 135deg, transparent 136deg, transparent 179deg, rgba(23,35,60,0.55) 180deg, transparent 181deg, transparent 224deg, rgba(23,35,60,0.55) 225deg, transparent 226deg, transparent 269deg, rgba(23,35,60,0.55) 270deg, transparent 271deg, transparent 314deg, rgba(23,35,60,0.55) 315deg, transparent 316deg, transparent 360deg)`,
                }}
              />

              {/* Central premium logo — the star */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* soft contact shadow */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-[88%] h-[34px] w-[72%] -translate-x-1/2 rounded-full bg-ink-900/10 blur-[14px]"
                />
                {/* outer luminous ring */}
                <div
                  aria-hidden
                  className="absolute -inset-[14px] rounded-full bg-gradient-to-br from-white via-white to-cream-50 opacity-90 blur-[1px]"
                />
                <div
                  data-parallax
                  data-parallax-depth="0.55"
                  className="luxury-pulse relative flex h-[218px] w-[218px] items-center justify-center rounded-full bg-white p-6 shadow-[0_24px_56px_rgba(23,35,60,0.12),0_10px_24px_rgba(196,28,99,0.08),0_2px_8px_rgba(23,35,60,0.06),inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-white/90 sm:h-[272px] sm:w-[272px] sm:p-7 lg:h-[300px] lg:w-[300px] lg:p-8 will-change-transform"
                >
                  {/* inner crystal rim + inner shadow */}
                  <div className="absolute inset-[13px] rounded-full bg-gradient-to-br from-white to-cream-50 shadow-[inset_0_1px_10px_rgba(23,35,60,0.07),inset_0_-1px_6px_rgba(255,255,255,0.9)]" aria-hidden />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)]" aria-hidden />
                  {/* pearlescent edge */}
                  <div
                    aria-hidden
                    className="absolute -inset-px rounded-full opacity-60"
                    style={{
                      background: 'conic-gradient(from 220deg at 50% 50%, rgba(196,28,99,0.10), rgba(222,159,53,0.10), rgba(30,106,133,0.10), rgba(196,28,99,0.10))',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      padding: '1.5px',
                    }}
                  />
                  <img
                    src={logoUrl}
                    alt={`شعار ${siteConfig.name}`}
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_4px_14px_rgba(23,35,60,0.10)]"
                    width={280}
                    height={280}
                    loading="eager"
                    fetchPriority="high"
                  />
                  {/* shimmer sweep */}
                  <div aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/hero:opacity-100 group-hover/hero:animate-[shimmer_1.2s_ease] will-change-transform" />
                  </div>
                </div>
              </div>

              {/* Orbiting glass badges — true radial, mathematically positioned */}
              {orbit.map(({ icon: Icon, text, angle, rFactor, tilt, scale, variant, float, delay }) => (
                <div
                  key={text}
                  className="absolute left-1/2 top-1/2 hidden lg:block will-change-transform"
                  style={
                    {
                      // radial placement: rotate -> translate(r) -> counter-rotate
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translate(calc(var(--hero-r) * ${rFactor})) rotate(${-angle + tilt}deg) scale(${scale})`,
                    } as React.CSSProperties
                  }
                >
                  {/* float wrapper — independent so it never overrides radial transform */}
                  <div
                    className={`${float}`}
                    style={{ animationDelay: delay, animationDuration: float === 'float-b' ? '6s' : float === 'float-c' ? '4.7s' : '5.3s' }}
                  >
                    <div
                      className="glass-badge flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
                      style={{
                        background:
                          variant === 'raspberry'
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(253,241,245,0.90))'
                            : variant === 'teal'
                              ? 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(220,238,243,0.90))'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(251,234,208,0.90))',
                        boxShadow:
                          variant === 'raspberry'
                            ? '0 12px 28px rgba(196,28,99,0.13), 0 3px 10px rgba(196,28,99,0.09), inset 0 1px 0 rgba(255,255,255,0.95)'
                            : variant === 'teal'
                              ? '0 12px 28px rgba(30,106,133,0.13), 0 3px 10px rgba(30,106,133,0.09), inset 0 1px 0 rgba(255,255,255,0.95)'
                              : '0 12px 28px rgba(222,159,53,0.13), 0 3px 10px rgba(222,159,53,0.09), inset 0 1px 0 rgba(255,255,255,0.95)',
                      }}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm backdrop-blur ${
                          variant === 'raspberry'
                            ? 'bg-raspberry-500 text-white shadow-[0_4px_14px_rgba(196,28,99,0.28)]'
                            : variant === 'teal'
                              ? 'bg-teal-600 text-white shadow-[0_4px_14px_rgba(30,106,133,0.28)]'
                              : 'bg-amber-500 text-white shadow-[0_4px_14px_rgba(222,159,53,0.28)]'
                        }`}
                      >
                        <Icon size={15} aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-[12.5px] font-bold leading-none tracking-tight text-ink-700">
                        {text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* sm-md orbit — 2 badges only, smaller radius to avoid crowding when stacked */}
              <div className="hidden sm:block lg:hidden">
                {orbit.slice(0, 2).map(({ icon: Icon, text, angle, variant }) => (
                  <div
                    key={text + '-sm'}
                    className="absolute left-1/2 top-1/2 will-change-transform"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translate(calc(var(--hero-r) * 0.96)) rotate(${-angle}deg)`,
                    }}
                  >
                    <div
                      className="glass-badge flex items-center gap-2 rounded-xl px-3 py-2"
                      style={{
                        background:
                          variant === 'raspberry'
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(253,241,245,0.90))'
                            : variant === 'teal'
                              ? 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(220,238,243,0.90))'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(251,234,208,0.90))',
                      }}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${variant === 'raspberry' ? 'bg-raspberry-500 text-white' : variant === 'teal' ? 'bg-teal-600 text-white' : 'bg-amber-500 text-white'}`}
                      >
                        <Icon size={13} aria-hidden />
                      </span>
                      <span className="whitespace-nowrap text-xs font-bold text-ink-700">{text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* decorative 3D micro-orbs on the orbit circumference */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-gradient-to-br from-white to-raspberry-100 shadow-[0_4px_12px_rgba(196,28,99,0.18)] lg:block"
                style={{ transform: 'translate(-50%, -50%) rotate(-78deg) translate(calc(var(--hero-r) * 1.04))' }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-gradient-to-br from-white to-teal-100 shadow-[0_4px_12px_rgba(30,106,133,0.18)] lg:block"
                style={{ transform: 'translate(-50%, -50%) rotate(108deg) translate(calc(var(--hero-r) * 1.06))' }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/70 shadow-[0_2px_8px_rgba(222,159,53,0.35)] blur-[0.2px] lg:block"
                style={{ transform: 'translate(-50%, -50%) rotate(260deg) translate(calc(var(--hero-r) * 1.02))' }}
              />
            </div>

            {/* Mobile simplified — clean, no orbit crowding */}
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:hidden">
              {orbit.slice(0, 3).map(({ icon: Icon, text, variant }) => (
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

            {/* badge caption — below the orbit */}
            {content.badge && (
              <div
                data-parallax
                data-parallax-depth="0.4"
                className="mx-auto mt-4 hidden max-w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink-600 shadow-[0_4px_16px_rgba(23,35,60,0.06)] ring-1 ring-ink-100 sm:flex will-change-transform"
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
