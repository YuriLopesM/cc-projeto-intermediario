export type Schedule = {
  id: string
  patientName: string
  healthCenter: string
  appointmentType: AppointmentType
  period: string
  date: string | Date
  hour: string
  doctorName: string
  status: ScheduleStatus
  description: string
}

type ScheduleStatus = 'Confirmado' | 'Aguardando aprovação' | 'Cancelado'
type AppointmentType = 'Consulta' | 'Exame' | 'Retorno' | 'Cirurgia'

export type Client = {
  id: string
  name: string
  number: string
  cpf: string
  address: Address
}

type Address = {
  street: string
  city: string
  neighborhood: string
  state: string
  number: number
}

export type UserAuthenticated = {
  id: string
  name: string
  healthCenter?: string
  type: string[]
}
