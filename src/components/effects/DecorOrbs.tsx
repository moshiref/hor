/**
 * DecorOrbs — glossy CSS "3D" spheres for section edges.
 * Outer node is driven by useMouseParallax ([data-parallax]); inner node floats,
 * so the two transforms never fight. Desktop only, sits outside the content column.
 */
type Tone = 'raspberry' | 'amber' | 'teal'

const TONES: Record<Tone, { light: string; base: string; dark: string; glow: string }> = {
  raspberry: { light: '#F7A3C6', base: '#D42F74', dark: '#8E0F43', glow: 'rgba(196,28,99,0.35)' },
  amber: { light: '#FCE0A8', base: '#EBA22F', dark: '#A86A10', glow: 'rgba(222,159,53,0.35)' },
  teal: { light: '#A8DCEC', base: '#2F8FB0', dark: '#154E66', glow: 'rgba(30,106,133,0.35)' },
}

export type Orb = {
  tone: Tone
  size: number
  /** CSS position, e.g. { top: '10%', left: '-40px' } */
  pos: React.CSSProperties
  depth?: number
  float?: 'float-a' | 'float-b' | 'float-c'
  blur?: boolean
}

export function DecorOrbs({ orbs }: { orbs: Orb[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden xl:block">
      {orbs.map((o, i) => {
        const t = TONES[o.tone]
        return (
          <div
            key={i}
            data-parallax
            data-parallax-depth={o.depth ?? 1}
            className="absolute will-change-transform transition-transform duration-500 ease-out"
            style={o.pos}
          >
            <div className={o.float ?? 'float-a'}>
              <div
                className="rounded-full"
                style={{
                  width: o.size,
                  height: o.size,
                  filter: o.blur ? 'blur(2px)' : undefined,
                  opacity: o.blur ? 0.7 : 1,
                  background: `radial-gradient(circle at 32% 28%, #fff 0%, rgba(255,255,255,0.9) 5%, ${t.light} 20%, ${t.base} 58%, ${t.dark} 100%)`,
                  boxShadow: `0 ${o.size * 0.35}px ${o.size * 0.6}px -${o.size * 0.25}px ${t.glow}, inset -${o.size * 0.08}px -${o.size * 0.1}px ${o.size * 0.25}px rgba(0,0,0,0.12)`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
