import jsPDF from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import type { GetDashboardDataUseCase } from '@/application/use-cases/get-dashboard-data.use-case'
import type { GetClientsUseCase } from '@/application/use-cases/get-clients.use-case'
import type { GetHistorialUseCase } from '@/application/use-cases/get-historial.use-case'
import type { ClientEntity } from '@/domain/entities/client.entity'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'
import type { DashboardDataEntity } from '@/domain/entities/dashboard.entity'

interface JsPdfWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number }
}

export interface ReportUseCases {
  getDashboardData: GetDashboardDataUseCase
  getClients: GetClientsUseCase
  getHistorial: GetHistorialUseCase
}

export type ReportSection =
  | 'total_llamadas'
  | 'duracion_promedio'
  | 'gestion_clientes'
  | 'historial'

const SECTION_LABELS: Record<ReportSection, string> = {
  total_llamadas: 'Total de Llamadas',
  duracion_promedio: 'Duración Promedio',
  gestion_clientes: 'Gestión de Clientes',
  historial: 'Historial',
}

interface PrefetchedData {
  dashboard: DashboardDataEntity | null
  clients: ClientEntity[]
  historial: HistorialEntryEntity[]
}

function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

function drawCard(doc: jsPDF, x: number, y: number, width: number, height: number): void {
  doc.setDrawColor(229, 231, 235)
  doc.setLineWidth(0.3)
  doc.roundedRect(x, y, width, height, 2, 2)
  doc.setFillColor(255, 255, 255)
  doc.rect(x + 0.3, y + 0.3, width - 0.6, height - 0.6, 'F')
}

function drawStatusBadge(doc: jsPDF, x: number, y: number, status: string): void {
  const formattedStatus = formatStatus(status)
  const width = doc.getTextWidth(formattedStatus) + 6
  
  if (status === 'soporte_insuficiente') {
    doc.setFillColor(254, 226, 226)
    doc.setTextColor(153, 27, 27)
  } else if (status === 'resuelto') {
    doc.setFillColor(220, 252, 231)
    doc.setTextColor(21, 128, 61)
  } else {
    doc.setFillColor(254, 243, 199)
    doc.setTextColor(146, 64, 14)
  }
  
  doc.roundedRect(x, y - 3, width, 5, 1, 1, 'F')
  doc.setFontSize(7)
  doc.text(formattedStatus, x + 3, y)
}

export async function downloadReport(
  sections: ReportSection[],
  useCases: ReportUseCases,
): Promise<void> {
  if (sections.length === 0) return

  const data = await prefetchData(sections, useCases)
  const doc = new jsPDF('p', 'mm', 'letter')
  const pageW = doc.internal.pageSize.getWidth()

  doc.setFontSize(22)
  doc.setTextColor(25, 76, 128)
  doc.text('XCien', 20, 30)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Hub Empresarial — Reporte Ejecutivo', 20, 38)
  
  const generatedDate = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  doc.setFontSize(8)
  doc.setTextColor(156, 163, 175)
  doc.text(`Generado: ${generatedDate}`, pageW - 20, 30, { align: 'right' })
  
  doc.setDrawColor(229, 231, 235)
  doc.line(20, 45, pageW - 20, 45)

  let y = 55

  const allSelected = sections.length === Object.keys(SECTION_LABELS).length
  const fileName = allSelected
    ? 'xcien_reporte_completo.pdf'
    : sections.length === 1
      ? `xcien_reporte_de_${sections[0]}.pdf`
      : 'xcien_reporte_personalizado.pdf'

  const hasKPIs = sections.includes('total_llamadas') || sections.includes('duracion_promedio')
  const hasTables = sections.includes('gestion_clientes') || sections.includes('historial')

  if (hasKPIs && data.dashboard) {
    y = addKPIsGrid(doc, y, pageW, data.dashboard, sections)
    y += 10
  }

  if (hasTables) {
    if (y > 180) {
      doc.addPage()
      y = 30
    }
    y = addUnifiedLayout(doc, y, pageW, data, sections)
  }

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

async function prefetchData(
  sections: ReportSection[],
  useCases: ReportUseCases,
): Promise<PrefetchedData> {
  const needsDashboard =
    sections.includes('total_llamadas') ||
    sections.includes('duracion_promedio')
  const needsClients = sections.includes('gestion_clientes')
  const needsHistorial = sections.includes('historial')

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

async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

function addKPIsGrid(
  doc: jsPDF,
  y: number,
  pageW: number,
  dashboard: DashboardDataEntity,
  sections: ReportSection[],
): number {
  const kpisToShow = dashboard.kpis.filter(kpi => {
    if (kpi.title === 'Total de Llamadas') return sections.includes('total_llamadas')
    if (kpi.title === 'Duración Promedio') return sections.includes('duracion_promedio')
    if (kpi.title === 'Tasa de Éxito') return true
    return false
  })

  if (kpisToShow.length === 0) return y

  const cardWidth = (pageW - 50) / Math.min(kpisToShow.length, 3)
  const cardHeight = 35
  let x = 20

  kpisToShow.forEach((kpi, index) => {
    drawCard(doc, x, y, cardWidth, cardHeight)
    
    doc.setFontSize(20)
    doc.setTextColor(25, 76, 128)
    doc.text(kpi.value, x + 5, y + 12)
    
    doc.setFontSize(9)
    doc.setTextColor(75, 85, 99)
    doc.text(kpi.title, x + 5, y + 20)
    
    doc.setFontSize(7)
    doc.setTextColor(156, 163, 175)
    
    let subtitle = kpi.subtitle
    if (kpi.title === 'Total de Llamadas') {
      const count = parseInt(kpi.value.replace(/,/g, ''))
      subtitle = `${count} ${pluralize(count, 'llamada registrada', 'llamadas registradas')}`
    } else if (kpi.title === 'Duración Promedio') {
      const count = dashboard.kpis.find(k => k.title === 'Total de Llamadas')
      const numCalls = count ? parseInt(count.value.replace(/,/g, '')) : 0
      subtitle = `${numCalls} ${pluralize(numCalls, 'medición', 'mediciones')}`
    }
    
    doc.text(subtitle, x + 5, y + 28)
    
    x += cardWidth + 5
  })

  return y + cardHeight
}

function addUnifiedLayout(
  doc: jsPDF,
  y: number,
  pageW: number,
  data: PrefetchedData,
  sections: ReportSection[],
): number {
  const hasHistorial = sections.includes('historial') && data.historial && data.historial.length > 0
  const hasClients = sections.includes('gestion_clientes') && data.clients && data.clients.length > 0

  if (!hasHistorial && !hasClients) return y

  if (hasHistorial && hasClients) {
    const historialWidth = (pageW - 45) * 0.65
    const clientsWidth = (pageW - 45) * 0.35
    
    const historialY = addHistorialTable(doc, y, 20, historialWidth, data.historial!)
    const clientsY = addClientsCard(doc, y, 20 + historialWidth + 5, clientsWidth, data.clients!)
    
    return Math.max(historialY, clientsY)
  } else if (hasHistorial) {
    return addHistorialTable(doc, y, 20, pageW - 40, data.historial!)
  } else {
    return addClientsCard(doc, y, 20, pageW - 40, data.clients!)
  }
}

function addHistorialTable(
  doc: jsPDF,
  y: number,
  x: number,
  width: number,
  historial: HistorialEntryEntity[],
): number {
  doc.setFontSize(12)
  doc.setTextColor(25, 76, 128)
  doc.text('Historial de Tickets', x, y)
  y += 8

  autoTable(doc, {
    startY: y,
    margin: { left: x, right: 20 },
    head: [['Folio', 'Fecha', 'Titular', 'Categoría', 'Estado']],
    body: historial.map((h) => [
      h.folio,
      h.fecha,
      h.nombreTitular,
      h.categoriaTecnica,
      { content: h.estado, styles: { cellWidth: 25 } }
    ]),
    theme: 'plain',
    headStyles: {
      fillColor: [249, 250, 251],
      textColor: [75, 85, 99],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 7,
      cellPadding: 3,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    tableWidth: width,
    didParseCell: function(data) {
      if (data.column.index === 4 && data.section === 'body') {
        const rawValue = data.cell.raw
        const status = typeof rawValue === 'string' 
          ? rawValue 
          : Array.isArray(rawValue) 
            ? rawValue[0] 
            : String(rawValue)
        
        if (!status) return
        
        if (status === 'soporte_insuficiente') {
          data.cell.styles.textColor = [153, 27, 27]
          data.cell.styles.fillColor = [254, 226, 226]
        } else if (status === 'resuelto') {
          data.cell.styles.textColor = [21, 128, 61]
          data.cell.styles.fillColor = [220, 252, 231]
        } else {
          data.cell.styles.textColor = [146, 64, 14]
          data.cell.styles.fillColor = [254, 243, 199]
        }
        data.cell.text[0] = formatStatus(status)
      }
    },
  })

  return (doc as JsPdfWithAutoTable).lastAutoTable?.finalY ?? y + 10
}

function addClientsCard(
  doc: jsPDF,
  y: number,
  x: number,
  width: number,
  clients: ClientEntity[],
): number {
  doc.setFontSize(12)
  doc.setTextColor(25, 76, 128)
  doc.text('Gestión de Clientes', x, y)
  y += 8

  const cardHeight = Math.min(clients.length * 25 + 10, 200)
  drawCard(doc, x, y, width, cardHeight)

  let currentY = y + 8
  clients.slice(0, 8).forEach((client) => {
    if (currentY > y + cardHeight - 10) return

    doc.setFontSize(9)
    doc.setTextColor(25, 76, 128)
    doc.text(client.name, x + 5, currentY)
    currentY += 5

    doc.setFontSize(7)
    doc.setTextColor(107, 114, 128)
    doc.text(`Contacto: ${client.contactoPrincipal}`, x + 5, currentY)
    currentY += 4
    doc.text(`Tel: ${client.phone}`, x + 5, currentY)
    currentY += 4
    doc.text(`Email: ${client.email}`, x + 5, currentY)
    currentY += 4

    drawStatusBadge(doc, x + 5, currentY, client.status === 'Activo' ? 'resuelto' : 'soporte_insuficiente')
    currentY += 8
  })

  return y + cardHeight
}
