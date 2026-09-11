export type ImageSpecKey = 'logo' | 'hero' | 'program' | 'activity' | 'banner'

export type ImageSpec = {
  key: ImageSpecKey
  label: string
  description: string
  aspect: number | null // null = free (contain)
  display: 'cover' | 'contain'
  minWidth: number
  minHeight: number
  targetWidth: number
  targetHeight: number
  maxSizeKB: number
  maxWidth: number
  maxHeight: number
}

export const imageSpecs: Record<ImageSpecKey, ImageSpec> = {
  logo: {
    key: 'logo',
    label: 'الشعار',
    description: 'يحافظ على أبعاده الأصلية — لا تمدد — حد أقصى 400×200',
    aspect: null,
    display: 'contain',
    minWidth: 120,
    minHeight: 40,
    targetWidth: 400,
    targetHeight: 200,
    maxSizeKB: 200,
    maxWidth: 400,
    maxHeight: 200,
  },
  hero: {
    key: 'hero',
    label: 'صورة Hero',
    description: 'نسبة 4:5 عمودية — Responsive مع cover بدون تشويه',
    aspect: 4 / 5,
    display: 'cover',
    minWidth: 600,
    minHeight: 750,
    targetWidth: 800,
    targetHeight: 1000,
    maxSizeKB: 450,
    maxWidth: 1200,
    maxHeight: 1500,
  },
  program: {
    key: 'program',
    label: 'صورة برنامج',
    description: 'نسبة 16:10 موحدة لكل البطاقات — قص احترافي',
    aspect: 16 / 10,
    display: 'cover',
    minWidth: 400,
    minHeight: 250,
    targetWidth: 640,
    targetHeight: 400,
    maxSizeKB: 350,
    maxWidth: 800,
    maxHeight: 500,
  },
  activity: {
    key: 'activity',
    label: 'صورة نشاط',
    description: 'نسبة 4:3 موحدة داخل المعرض — Grid متناسق',
    aspect: 4 / 3,
    display: 'cover',
    minWidth: 400,
    minHeight: 300,
    targetWidth: 600,
    targetHeight: 450,
    maxSizeKB: 350,
    maxWidth: 900,
    maxHeight: 675,
  },
  banner: {
    key: 'banner',
    label: 'بانر',
    description: 'نسبة 16:9 — للبنرات العريضة',
    aspect: 16 / 9,
    display: 'cover',
    minWidth: 800,
    minHeight: 450,
    targetWidth: 1200,
    targetHeight: 675,
    maxSizeKB: 450,
    maxWidth: 1600,
    maxHeight: 900,
  },
}

export function getSpec(key: ImageSpecKey): ImageSpec {
  return imageSpecs[key]
}

export function formatDimensions(w: number, h: number): string {
  return `${w} × ${h}`
}
