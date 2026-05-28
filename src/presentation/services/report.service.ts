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

const LOGO_URL = 'https://assets.zyrosite.com/m6Lwq9PRb8cokJ8l/xcien-favicon-YD06e6MbjvcBwPvx.svg'

async function loadLogoAsPng(): Promise<string | null> {
  try {
    const response = await fetch(LOGO_URL)
    if (!response.ok) return null
    const svgText = await response.text()
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    return new Promise<string | null>((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          resolve(null)
          return
        }
        ctx.drawImage(img, 0, 0, 128, 128)
        URL.revokeObjectURL(url)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      img.src = url
    })
  } catch {
    return null
  }
}

export async function downloadReport(
  sections: ReportSection[],
  useCases: ReportUseCases,
): Promise<void> {
  if (sections.length === 0) return

  const [data, logoDataUrl] = await Promise.all([
    prefetchData(sections, useCases),
    loadLogoAsPng(),
  ])
  const doc = new jsPDF('p', 'mm', 'letter')
  const pageW = doc.internal.pageSize.getWidth()

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 20, 18, 12, 12)
  }

  const textX = logoDataUrl ? 36 : 20
  doc.setFontSize(22)
  doc.setTextColor(25, 76, 128)
  doc.text('XCien', textX, 27)
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Hub Empresarial — Reporte Ejecutivo', textX, 35)

  const generatedDate = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  doc.setFontSize(8)
  doc.setTextColor(156, 163, 175)
  doc.text(`Generado: ${generatedDate}`, pageW - 20, 27, { align: 'right' })

  doc.setDrawColor(229, 231, 235)
  doc.line(20, 42, pageW - 20, 42)

  let y = 52

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
    doc.text(`Página ${i} de ${totalPages} — XCien Hub Empresarial`, pageW / 2, 275, {
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

  const fullWidth = pageW - 40

  if (hasHistorial) {
    y = addHistorialTable(doc, y, 20, fullWidth, data.historial!)
    y += 10
  }

  if (hasClients) {
    if (y > 220) {
      doc.addPage()
      y = 30
    }
    y = addClientsCard(doc, y, 20, fullWidth, data.clients!)
  }

  return y
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
      h.estado
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
    columnStyles: {
      4: { cellWidth: 25 }
    },
    didParseCell: function(data) {
      if (data.column.index === 4 && data.section === 'body') {
        const status = data.cell.raw as string
        
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

  autoTable(doc, {
    startY: y,
    margin: { left: x, right: 20 },
    head: [['Empresa', 'Contacto', 'Teléfono', 'Email', 'Estado']],
    body: clients.map((c) => [
      c.name,
      c.contactoPrincipal,
      c.phone,
      c.email,
      c.status === 'Activo' ? 'resuelto' : 'soporte_insuficiente'
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
        const status = data.cell.raw as string
        
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
