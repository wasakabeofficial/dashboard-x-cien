import jsPDF from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import type { GetDashboardDataUseCase } from '@/application/use-cases/get-dashboard-data.use-case'
import type { GetClientsUseCase } from '@/application/use-cases/get-clients.use-case'
import type { GetHistorialUseCase } from '@/application/use-cases/get-historial.use-case'
import type { ClientEntity } from '@/domain/entities/client.entity'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'
import type { DashboardDataEntity } from '@/domain/entities/dashboard.entity'

/** Casos de uso que necesita el servicio de reportes */
export interface ReportUseCases {
  getDashboardData: GetDashboardDataUseCase
  getClients: GetClientsUseCase
  getHistorial: GetHistorialUseCase
}

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

/** Datos precargados para evitar llamadas repetidas a la API */
interface PrefetchedData {
  dashboard: DashboardDataEntity | null
  clients: ClientEntity[]
  historial: HistorialEntryEntity[]
}

/**
 * Genera un PDF con las secciones seleccionadas y lo descarga.
 *
 * Primero obtiene TODOS los datos de las APIs (una sola vez cada una),
 * luego construye el PDF en memoria sin más llamadas de red.
 *
 * Principio DIP — recibe los casos de uso por inyección, no los busca en infraestructura.
 */
export async function downloadReport(
  sections: ReportSection[],
  useCases: ReportUseCases,
): Promise<void> {
  if (sections.length === 0) return

  // ── 1. Precargar datos de todas las APIs necesarias ──
  const data = await prefetchData(sections, useCases)

  // ── 2. Construir PDF ──
  const doc = new jsPDF('p', 'mm', 'letter')
  const pageW = doc.internal.pageSize.getWidth()

  // Portada
  doc.setFontSize(22)
  doc.setTextColor(25, 76, 128)
  doc.text('XCien', 20, 30)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Hub Empresarial — Reporte', 20, 38)
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    20,
    45,
  )
  doc.line(20, 52, pageW - 20, 52)

  let y = 65

  // Nombre de archivo
  const allSelected = sections.length === Object.keys(SECTION_LABELS).length
  const fileName = allSelected
    ? 'xcien_reporte_completo.pdf'
    : sections.length === 1
      ? `xcien_reporte_de_${sections[0]}.pdf`
      : 'xcien_reporte_personalizado.pdf'

  // Renderizar cada seccion con datos precargados
  for (const section of sections) {
    // Gestion de Clientes e Historial siempre en pagina nueva
    if (section === 'gestion_clientes' || section === 'historial') {
      doc.addPage()
      y = 30
    }
    y = addSection(doc, section, y, pageW, data)
    if (y > 240 && section !== 'gestion_clientes' && section !== 'historial') {
      doc.addPage()
      y = 30
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 180)
    doc.text(`Página ${i} de ${totalPages} — XCien Hub Empresarial`, pageW / 2, 280, {
      align: 'center',
    })
  }

  doc.save(fileName)
}

// ────────────── Precarga ──────────────

async function prefetchData(
  sections: ReportSection[],
  useCases: ReportUseCases,
): Promise<PrefetchedData> {
  const needsDashboard =
    sections.includes('total_llamadas') ||
    sections.includes('costos_totales') ||
    sections.includes('duracion_promedio')
  const needsClients = sections.includes('gestion_clientes')
  const needsHistorial = sections.includes('historial')

  // Disparamos todas las fetch en paralelo
  const [dashboardResult, clientsResult, historialResult] = await Promise.all([
    needsDashboard ? safeFetch(() => useCases.getDashboardData.execute()) : Promise.resolve(null),
    needsClients ? safeFetch(() => useCases.getClients.execute()) : Promise.resolve([] as ClientEntity[]),
    needsHistorial ? safeFetch(() => useCases.getHistorial.execute()) : Promise.resolve([] as HistorialEntryEntity[]),
  ])

  return {
    dashboard: dashboardResult,
    clients: clientsResult as ClientEntity[],
    historial: historialResult as HistorialEntryEntity[],
  }
}

/** Ejecuta una promesa y devuelve null si falla (sin lanzar) */
async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

// ────────────── Render ──────────────

function addSection(
  doc: jsPDF,
  section: ReportSection,
  y: number,
  pageW: number,
  data: PrefetchedData,
): number {
  const label = SECTION_LABELS[section]
  doc.setFontSize(14)
  doc.setTextColor(25, 76, 128)
  doc.text(label, 20, y)
  y += 8

  // Si los datos necesarios fallaron, mostrar error y salir
  if (section === 'gestion_clientes' && !data.clients) {
    return writeError(doc, y, 'No se pudieron cargar los clientes.')
  }
  if (section === 'historial' && !data.historial) {
    return writeError(doc, y, 'No se pudo cargar el historial.')
  }

  // Si el dashboard falló pero la sección lo necesita
  if (
    (section === 'total_llamadas' || section === 'costos_totales' || section === 'duracion_promedio') &&
    !data.dashboard
  ) {
    return writeError(doc, y, 'No se pudieron cargar los datos del dashboard.')
  }

  switch (section) {
    case 'total_llamadas':
      return addTotalLlamadas(doc, y, data.dashboard!)
    case 'costos_totales':
      return addCostosTotales(doc, y, data.dashboard!)
    case 'duracion_promedio':
      return addDuracionPromedio(doc, y, data.dashboard!)
    case 'gestion_clientes':
      return addGestionClientes(doc, y, data.clients!)
    case 'historial':
      return addHistorial(doc, y, data.historial!)
    default:
      return y
  }
}

function writeError(doc: jsPDF, y: number, message: string): number {
  doc.setFontSize(10)
  doc.setTextColor(180, 80, 80)
  doc.text(message, 20, y + 6)
  return y + 12
}

function addTotalLlamadas(doc: jsPDF, y: number, dashboard: DashboardDataEntity): number {
  const kpi = dashboard.kpis.find((k) => k.title === 'Total de Llamadas')
  const value = kpi?.value ?? '—'
  doc.setFontSize(24)
  doc.setTextColor(50, 50, 50)
  doc.text(value, 20, y + 10)
  y += 20
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Total de llamadas registradas en el período: ${value}`, 20, y + 2)
  return y + 14
}

function addCostosTotales(doc: jsPDF, y: number, dashboard: DashboardDataEntity): number {
  const kpi = dashboard.kpis.find((k) => k.title === 'Costo Total')
  const value = kpi?.value ?? '—'
  doc.setFontSize(24)
  doc.setTextColor(50, 50, 50)
  doc.text(value, 20, y + 10)
  y += 20
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Suma de costos de todas las llamadas: ${value}`, 20, y + 2)
  return y + 14
}

function addDuracionPromedio(doc: jsPDF, y: number, dashboard: DashboardDataEntity): number {
  const kpi = dashboard.kpis.find((k) => k.title === 'Duración Promedio')
  const value = kpi?.value ?? '—'
  doc.setFontSize(24)
  doc.setTextColor(50, 50, 50)
  doc.text(value, 20, y + 10)
  y += 20
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Tiempo promedio por llamada: ${value}`, 20, y + 2)
  return y + 14
}

function addGestionClientes(doc: jsPDF, y: number, clients: ClientEntity[]): number {
  autoTable(doc, {
    startY: y,
    head: [['Empresa', 'Contacto', 'Teléfono', 'Correo', 'Estado']],
    body: clients.map((c) => [c.name, c.contactoPrincipal, c.phone, c.email, c.status]),
    theme: 'striped',
    headStyles: { fillColor: [25, 76, 128], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    margin: { left: 20, right: 20 },
  })
  return (doc as any).lastAutoTable?.finalY ?? y + 10
}

function addHistorial(doc: jsPDF, y: number, historial: HistorialEntryEntity[]): number {
  autoTable(doc, {
    startY: y,
    head: [['Folio', 'Fecha', 'Titular', 'Categoría', 'Estado']],
    body: historial.map((h) => [h.folio, h.fecha, h.nombreTitular, h.categoriaTecnica, h.estado]),
    theme: 'striped',
    headStyles: { fillColor: [25, 76, 128], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    margin: { left: 20, right: 20 },
  })
  return (doc as any).lastAutoTable?.finalY ?? y + 10
}
