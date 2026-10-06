import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/**
 * Hero3DScene — real-time WebGL scene of glossy "toy" shapes in the brand colours.
 *
 * - Loaded lazily from Hero, so three.js never blocks first paint.
 * - Positions are viewport fractions → layout adapts to any aspect ratio.
 * - Pauses when off-screen or tab hidden; static frame on reduced-motion.
 * - Renders nothing if WebGL is unavailable (Hero's CSS design remains).
 */

type ShapeKind = 'sphere' | 'torus' | 'box' | 'star' | 'capsule' | 'cone'

type ShapeDef = {
  kind: ShapeKind
  color: string
  /** viewport fractions, x: -0.5 (left) … 0.5 (right), y: -0.5 (bottom) … 0.5 (top) */
  fx: number
  fy: number
  z: number
  size: number
  /** shown on narrow (portrait) screens too */
  mobile?: { fx: number; fy: number; size?: number }
}

const RASPBERRY = '#D42F74'
const RASPBERRY_DEEP = '#A9154F'
const AMBER = '#EBA22F'
const TEAL = '#2F8FB0'
const TEAL_DEEP = '#1B6A88'
const CREAM = '#FFF3E2'

// Text sits on the right (RTL) → shapes live around the visual column on the left
// plus a few accents near the outer edges, away from the headline.
// On portrait screens the text spans the full width, so shapes flank the logo below it.
const SHAPES: ShapeDef[] = [
  { kind: 'sphere', color: RASPBERRY, fx: -0.43, fy: 0.3, z: -1, size: 0.75, mobile: { fx: -0.42, fy: -0.1, size: 0.5 } },
  { kind: 'torus', color: AMBER, fx: -0.08, fy: 0.36, z: -0.5, size: 0.62, mobile: { fx: 0.42, fy: -0.18, size: 0.42 } },
  { kind: 'box', color: TEAL, fx: -0.45, fy: -0.22, z: 0.2, size: 0.7, mobile: { fx: -0.38, fy: -0.4, size: 0.45 } },
  { kind: 'star', color: AMBER, fx: -0.05, fy: -0.36, z: 0.6, size: 0.6, mobile: { fx: 0.38, fy: -0.42, size: 0.42 } },
  { kind: 'capsule', color: RASPBERRY_DEEP, fx: -0.3, fy: -0.42, z: -1.5, size: 0.55 },
  { kind: 'sphere', color: TEAL_DEEP, fx: 0.06, fy: -0.3, z: -3, size: 0.42, mobile: { fx: 0.43, fy: 0.44, size: 0.22 } },
  { kind: 'cone', color: TEAL, fx: -0.22, fy: 0.4, z: -2, size: 0.5 },
  { kind: 'sphere', color: CREAM, fx: -0.48, fy: 0.04, z: -2.5, size: 0.38 },
  { kind: 'torus', color: RASPBERRY, fx: 0.46, fy: -0.38, z: -2, size: 0.45 },
  { kind: 'sphere', color: AMBER, fx: 0.47, fy: 0.36, z: -3, size: 0.32 },
  { kind: 'star', color: RASPBERRY, fx: 0.2, fy: -0.44, z: -2.5, size: 0.4 },
]

function makeStarGeometry() {
  const shape = new THREE.Shape()
  const spikes = 5
  const outer = 1
  const inner = 0.48
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / (spikes * 2)) * Math.PI * 2 + Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.12,
    bevelSegments: 6,
    curveSegments: 4,
  })
  geo.center()
  return geo
}

function makeGeometry(kind: ShapeKind): THREE.BufferGeometry {
  switch (kind) {
    case 'sphere':
      return new THREE.SphereGeometry(1, 48, 48)
    case 'torus':
      return new THREE.TorusGeometry(0.8, 0.32, 32, 72)
    case 'box':
      return new RoundedBoxGeometry(1.4, 1.4, 1.4, 6, 0.28)
    case 'star':
      return makeStarGeometry()
    case 'capsule':
      return new THREE.CapsuleGeometry(0.5, 0.9, 12, 32)
    case 'cone':
      return new THREE.ConeGeometry(0.85, 1.5, 48, 1)
  }
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

export default function Hero3DScene({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount || !hasWebGL()) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.toneMappingExposure = 0.95
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 16)

    scene.add(new THREE.HemisphereLight(0xfff4e8, 0xc9dbe6, 0.6))
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(-4, 6, 8)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xffd9ea, 0.8)
    rim.position.set(6, -3, -4)
    scene.add(rim)

    const root = new THREE.Group()
    scene.add(root)

    const geometries = new Map<ShapeKind, THREE.BufferGeometry>()
    const materials: THREE.Material[] = []

    type Item = {
      mesh: THREE.Mesh
      def: ShapeDef
      phase: number
      spin: THREE.Vector3
      delay: number
      base: THREE.Vector3
      scale: number
      visible: boolean
    }
    const items: Item[] = SHAPES.map((def, i) => {
      let geo = geometries.get(def.kind)
      if (!geo) {
        geo = makeGeometry(def.kind)
        geometries.set(def.kind, geo)
      }
      const mat = new THREE.MeshPhysicalMaterial({
        color: def.color,
        roughness: def.color === CREAM ? 0.35 : 0.22,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.15,
        sheenColor: new THREE.Color('#ffffff'),
        envMapIntensity: 0.75,
      })
      materials.push(mat)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      mesh.scale.setScalar(0.0001)
      root.add(mesh)
      return {
        mesh,
        def,
        phase: i * 1.37,
        spin: new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.3),
        delay: 0.15 + i * 0.07,
        base: new THREE.Vector3(),
        scale: def.size,
        visible: true,
      }
    })

    // Lay shapes out in viewport fractions so they hug the edges at any size
    const layout = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const portrait = w / h < 0.95
      const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      const visW = visH * camera.aspect
      // keep shapes a sensible size relative to the shorter side
      const unit = Math.min(visW, visH) / 7
      for (const it of items) {
        const m = portrait ? it.def.mobile : undefined
        it.visible = !portrait || !!m
        const fx = m?.fx ?? it.def.fx
        const fy = m?.fy ?? it.def.fy
        const depthScale = (camera.position.z - it.def.z) / camera.position.z
        it.base.set(fx * visW * depthScale, fy * visH * depthScale, it.def.z)
        it.scale = (m?.size ?? it.def.size) * unit
        it.mesh.visible = it.visible
      }
    }
    layout()
    const ro = new ResizeObserver(layout)
    ro.observe(mount)

    // Pointer → gentle scene tilt
    const pointer = { x: 0, y: 0 }
    const eased = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (!coarse && !reduced) window.addEventListener('pointermove', onPointer, { passive: true })

    const timer = new THREE.Timer()
    let raf = 0
    let running = false
    let shown = false

    // own time accumulator so pausing off-screen doesn't replay the intro
    let t = 0
    const render = () => {
      timer.update()
      t += Math.min(timer.getDelta(), 0.05)
      eased.x += (pointer.x - eased.x) * 0.04
      eased.y += (pointer.y - eased.y) * 0.04
      root.rotation.y = eased.x * 0.12
      root.rotation.x = eased.y * 0.08
      // subtle scroll drift for depth while leaving the hero
      const scrollK = Math.min(window.scrollY / Math.max(mount.clientHeight, 1), 1.2)

      for (const it of items) {
        if (!it.visible) continue
        const intro = reduced ? 1 : Math.min(Math.max((t - it.delay) / 0.9, 0), 1)
        const s = it.scale * (intro > 0 ? easeOutBack(intro) : 0.0001)
        it.mesh.scale.setScalar(Math.max(s, 0.0001))
        const bob = reduced ? 0 : Math.sin(t * 0.9 + it.phase) * 0.22
        it.mesh.position.set(
          it.base.x + (reduced ? 0 : Math.cos(t * 0.5 + it.phase) * 0.08),
          it.base.y + bob + scrollK * (1.5 + it.def.z * -0.4),
          it.base.z,
        )
        if (!reduced) {
          it.mesh.rotation.x += it.spin.x * 0.01
          it.mesh.rotation.y += it.spin.y * 0.01
          it.mesh.rotation.z += it.spin.z * 0.01
        }
      }
      renderer.render(scene, camera)
      if (!shown) {
        shown = true
        setReady(true)
      }
    }

    const loop = () => {
      render()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      timer.update() // discard the paused gap
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    let inView = true
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView && !document.hidden) start()
      else stop()
    })
    io.observe(mount)
    const onVis = () => (document.hidden || !inView ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    if (reduced) render()
    else start()

    const onLost = (e: Event) => {
      e.preventDefault()
      stop()
    }
    renderer.domElement.addEventListener('webglcontextlost', onLost)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onPointer)
      renderer.domElement.removeEventListener('webglcontextlost', onLost)
      geometries.forEach((g) => g.dispose())
      materials.forEach((m) => m.dispose())
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`pointer-events-none transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  )
}
