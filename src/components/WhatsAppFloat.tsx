import { getSiteConfig } from '@/lib/siteStore'

/**
 * Floating WhatsApp Button — ثابت في أسفل يمين الشاشة
 * - لا يغطي المحتوى: bottom-5 right-5 مع مسافة آمنة
 * - z-[60] فوق Navbar (z-50) وتحت الـ modals إن وجدت
 * - حركة ظهور خفيفة فقط (fade+scale) بدون تكرار
 * - قابل للتحكم من siteConfig.whatsappFloating (Admin → إعدادات الموقع → WhatsApp)
 */
export default function WhatsAppFloat() {
  const cfg = getSiteConfig().whatsappFloating

  if (!cfg.enabled) return null

  const phone = cfg.phone.replace(/^0+/, '').replace(/^\+/, '')
  const baseUrl = `https://wa.me/${phone}`
  const href = cfg.defaultMessage ? `${baseUrl}?text=${encodeURIComponent(cfg.defaultMessage)}` : baseUrl

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2"
      aria-hidden={false}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={cfg.hoverText}
        title={cfg.hoverText}
        className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#20BD5A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:h-[60px] sm:w-[60px]"
        style={{ animation: 'waFadeIn 0.35s ease-out' }}
      >
        {/* Tooltip — يظهر عند Hover/Focus فقط، بدون JS */}
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-1/2 right-full me-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-ink-800 px-4 py-2 text-sm font-medium text-white shadow-md group-hover:inline-flex group-focus-visible:inline-flex"
        >
          {cfg.hoverText}
        </span>

        {/* WhatsApp SVG — رسمي وخفيف */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-7 w-7 sm:h-8 sm:w-8"
          fill="currentColor"
        >
          <path d="M19.05 4.94A9.91 9.91 0 0 0 12.02 2C6.6 2 2.2 6.41 2.2 11.83c0 1.73.45 3.42 1.31 4.91L2 22l5.41-1.42a9.86 9.86 0 0 0 4.61 1.17h.01c5.42 0 9.83-4.41 9.83-9.83 0-2.63-1.02-5.1-2.81-6.98Zm-7.03 15.2h-.01a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-3.21.84.86-3.13-.2-.32a8.1 8.1 0 0 1-1.26-4.39c0-4.49 3.66-8.14 8.16-8.14 2.18 0 4.22.85 5.76 2.39a8.09 8.09 0 0 1 2.39 5.75c0 4.49-3.66 8.15-8.16 8.15Zm4.47-6.1c-.25-.12-1.47-.73-1.7-.81-.23-.09-.4-.12-.57.12-.17.25-.65.81-.8.97-.15.17-.3.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.57-1.37-.78-1.88-.2-.48-.41-.42-.57-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.01 2.58.12.17 1.75 2.67 4.24 3.75.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z" />
        </svg>

        <span className="sr-only">{cfg.hoverText}</span>
      </a>

      {/* حركة ظهور خفيفة جداً — تُعرض مرة واحدة فقط */}
      <style>{`@keyframes waFadeIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } } @media (prefers-reduced-motion: reduce) { a[aria-label] { animation: none !important; } }`}</style>
    </div>
  )
}
