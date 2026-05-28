export interface Client {
  folio: string
  id: string
  date: string
  name: string
  initials: string
  situation: 'Residencial' | 'Empresarial'
  status: 'Activo' | 'Inactivo'
  phone: string
  email: string
}

export interface KpiData {
  title: string
  value: string
  subtitle: string
  icon: string
  trend: {
    value: string
    direction: 'up' | 'down'
  }
  colorClass: string
}

export interface DistributionItem {
  label: string
  value: number
  colorClass: string
}
