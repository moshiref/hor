/**
 * Export helpers — Excel / PDF / Print
 * تعتمد على البيانات الظاهرة بعد الفلترة (passed as filtered array)
 */
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { siteConfig } from '@/config/site'

function fileName(prefix: string, ext: string): string {
  const d = new Date().toISOString().slice(0, 10)
  return `${prefix}_${d}.${ext}`
}

export function exportToExcel(rows: Record<string, string | number>[], columns: string[], prefix: string): void {
  const ws = XLSX.utils.json_to_sheet(rows)
  // Set column widths
  ws['!cols'] = columns.map(() => ({ wch: 18 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'البيانات')
  XLSX.writeFile(wb, fileName(prefix, 'xlsx'))
}

export function exportToPDF(
  rows: (string | number)[][],
  columns: string[],
  title: string,
  filtersSummary: string[],
): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

  // Header — use built-in font (Arabic will render but may need font embedding for perfect shaping; jsPDF supports UTF-8)
  doc.setFontSize(14)
  doc.text(siteConfig.name, 40, 40)
  doc.setFontSize(11)
  doc.text(title, 40, 62)
  doc.setFontSize(8)
  doc.text(`تاريخ التقرير: ${new Date().toLocaleString('ar-SA')}`, 40, 78)
  if (filtersSummary.length) {
    doc.text(`الفلاتر: ${filtersSummary.join(' | ')}`, 40, 92)
  }

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: filtersSummary.length ? 105 : 95,
    styles: { fontSize: 7, halign: 'center', cellPadding: 4 },
    headStyles: { fillColor: [196, 28, 99], textColor: 255 },
    alternateRowStyles: { fillColor: [253, 241, 245] },
    margin: { left: 20, right: 20 },
  })

  doc.save(fileName(title.replace(/\s+/g, '_'), 'pdf'))
}

export function printTable(containerId: string): void {
  const el = document.getElementById(containerId)
  if (!el) {
    window.print()
    return
  }
  const win = window.open('', '_blank', 'width=1000,height=800')
  if (!win) {
    window.print()
    return
  }
  const styles = Array.from(document.styleSheets)
    .map((s) => {
      try {
        return Array.from(s.cssRules)
          .map((r) => r.cssText)
          .join('\n')
      } catch {
        return ''
      }
    })
    .join('\n')

  win.document.write(`
    <html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>طباعة</title><style>${styles}
    @media print { .no-print { display:none !important } body { background:white } }
    body { font-family: Almarai, sans-serif; padding:24px; }
    table { width:100%; border-collapse:collapse }
    th,td { border:1px solid #E3E9F1; padding:8px; font-size:11px; text-align:center }
    th { background:#C41C63; color:white }
    </style></head><body>${el.innerHTML}</body></html>
  `)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 300)
}
