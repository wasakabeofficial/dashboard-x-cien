/** Entidad de negocio: Cliente */
export interface ClientEntity {
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
