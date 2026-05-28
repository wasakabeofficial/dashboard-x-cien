import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { serviceLocator } from '@/infrastructure/di/service-locator'

export type ReportSection =
  | 'total_llamadas'
  | 'costos_totales'
  | 'duracion_promedio'
  | 'gestion_clientes'
  | 'historial'

const SECTION_LABELS: Record<ReportSection, string> = {
  total_llamadas: 'Total de Llamadas',
  costos_totales: 'Costos Totales',
  duracion_promedio: 'Duración Promedio',
  gestion_clientes: 'Gestión de Clientes',
  historial: 'Historial',
}

/**
 * Genera un PDF con las secciones seleccionadas y lo descarga.
 */
export async function downloadReport(sections: ReportSection[]): Promise<void> {
  if (sections.length === 0) return

  const doc = new jsPDF('p', 'mm', 'letter')
  const pageW = doc.internal.pageSize.getWidth()

  // ── Portada / Header ──
  doc.setFontSize(22)
  doc.setTextColor(25, 76, 128) // primary
  doc.text('XCien', 20, 30)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Hub Empresarial — Reporte', 20, 38)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 20, 45)
  doc.line(20, 52, pageW - 20, 52)

  let y = 65

  // ── Secciones ──
  const allSelected = sections.length === Object.keys(SECTION_LABELS).length
  const fileName = allSelected
    ? 'xcien_reporte_completo.pdf'
    : sections.length === 1
      ? `xcien_reporte_de_${sections[0]}.pdf`
      : 'xcien_reporte_personalizado.pdf'

  for (const section of sections) {
    y = await addSection(doc, section, y, pageW)
    // Salto de página si queda poco espacio
    if (y > 240) {
      doc.addPage()
      y = 30
    }
  }

  // ── Footer ──
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 180)
    doc.text(`Página ${i} de ${totalPages} — XCien Hub Empresarial`, pageW / 2, 280, { align: 'center' })
  }

  doc.save(fileName)
}

// ───────── helpers ─────────

async function addSection(doc: jsPDF, section: ReportSection, y: number, pageW: number): Promise<number> {
  const label = SECTION_LABELS[section]
  doc.setFontSize(14)
  doc.setTextColor(25, 76, 128)
  doc.text(label, 20, y)
  y += 8

  switch (section) {
    case 'total_llamadas':
      return addTotalLlamadas(doc, y, pageW)
    case 'costos_totales':
      return addCostosTotales(doc, y, pageW)
    case 'duracion_promedio':
      return addDuracionPromedio(doc, y, pageW)
    case 'gestion_clientes':
      return addGestionClientes(doc, y, pageW)
    case 'historial':
      return addHistorial(doc, y, pageW)
    default:
      return y
  }
}

async function addTotalLlamadas(doc: jsPDF, y: number, _pageW: number): Promise<number> {
  try {
    const dashboard = await serviceLocator.getDashboardData().execute()
    const total = dashboard.kpis.find((k) => k.title === 'Total de Llamadas')
    const value = total?.value ?? '—'
    doc.setFontSize(24)
    doc.setTextColor(50, 50, 50)
    doc.text(value, 20, y + 10)
    y += 20
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Total de llamadas registradas en el período: ${value}`, 20, y + 2)
    y += 14
  } catch {
    doc.setFontSize(10)
    doc.setTextColor(180, 80, 80)
    doc.text('Error al obtener datos.', 20, y + 6)
    y += 12
  }
  return y
}

async function addCostosTotales(doc: jsPDF, y: number, _pageW: number): Promise<number> {
  try {
    const dashboard = await serviceLocator.getDashboardData().execute()
    const kpi = dashboard.kpis.find((k) => k.title === 'Costo Total')
    const value = kpi?.value ?? '—'
    doc.setFontSize(24)
    doc.setTextColor(50, 50, 50)
    doc.text(value, 20, y + 10)
    y += 20
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Suma de costos de todas las llamadas: ${value}`, 20, y + 2)
    y += 14
  } catch {
    doc.setFontSize(10)
    doc.setTextColor(180, 80, 80)
    doc.text('Error al obtener datos.', 20, y + 6)
    y += 12
  }
  return y
}

async function addDuracionPromedio(doc: jsPDF, y: number, _pageW: number): Promise<number> {
  try {
    const dashboard = await serviceLocator.getDashboardData().execute()
    const kpi = dashboard.kpis.find((k) => k.title === 'Duración Promedio')
    const value = kpi?.value ?? '—'
    doc.setFontSize(24)
    doc.setTextColor(50, 50, 50)
    doc.text(value, 20, y + 10)
    y += 20
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Tiempo promedio por llamada: ${value}`, 20, y + 2)
    y += 14
  } catch {
    doc.setFontSize(10)
    doc.setTextColor(180, 80, 80)
    doc.text('Error al obtener datos.', 20, y + 6)
    y += 12
  }
  return y
}

async function addGestionClientes(doc: jsPDF, y: number, _pageW: number): Promise<number> {
  try {
    const clients = await serviceLocator.getClients().execute()
    ;(doc as any).autoTable({
      startY: y,
      head: [['Empresa', 'Contacto', 'Teléfono', 'Correo', 'Estado']],
      body: clients.map((c) => [c.name, c.contactoPrincipal, c.phone, c.email, c.status]),
      theme: 'striped',
      headStyles: { fillColor: [25, 76, 128], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 20, right: 20 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  } catch {
    doc.setFontSize(10)
    doc.setTextColor(180, 80, 80)
    doc.text('Error al obtener clientes.', 20, y + 6)
    y += 12
  }
  return y
}

async function addHistorial(doc: jsPDF, y: number, _pageW: number): Promise<number> {
  try {
    const historial = await serviceLocator.getHistorial().execute()
    ;(doc as any).autoTable({
      startY: y,
      head: [['Folio', 'Fecha', 'Titular', 'Categoría', 'Estado']],
      body: historial.map((h) => [h.folio, h.fecha, h.nombreTitular, h.categoriaTecnica, h.estado]),
      theme: 'striped',
      headStyles: { fillColor: [25, 76, 128], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 20, right: 20 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  } catch {
    doc.setFontSize(10)
    doc.setTextColor(180, 80, 80)
    doc.text('Error al obtener historial.', 20, y + 6)
    y += 12
  }
  return y
}
