export interface ClientEntity {
  id: string
  name: string
  contactoPrincipal: string
  phone: string
  email: string

  folio: string
  date: string
  initials: string
  situation: 'Residencial' | 'Empresarial'
  status: 'Activo' | 'Inactivo'
  tipoServicio: string
  velocidad: string
  medio: string
  plan: string
  cpe: string
  direccion: string
  ciudad: string
  rfc: string
  observaciones: string
}
