import { AppointmentType, Schedule } from '@/types'
import { generateId, generatePeriod } from '@/utils'

export class ScheduleBuilder {
  private schedule: Partial<Schedule> = {
    id: generateId(),
    status: 'Aguardando aprovação',
    doctorName: '',
    hour: '',
  }

  fromPatientForm(formData: FormData, patientName: string): this {
    this.schedule.patientName = patientName
    this.schedule.healthCenter = formData.get(
      'newScheduleHealthCenter'
    ) as string
    this.schedule.appointmentType = formData.get(
      'newScheduleAppointmentType'
    ) as AppointmentType
    this.schedule.period = formData.get('newSchedulePeriod') as string
    this.schedule.date = formData.get('newScheduleDate') as string
    this.schedule.description = formData.get('newScheduleDescription') as string
    return this
  }

  fromHospitalForm(formData: FormData, healthCenter: string): this {
    const hour = formData.get('newScheduleHour') as string
    this.schedule.patientName = formData.get('newSchedulePatient') as string
    this.schedule.healthCenter = healthCenter
    this.schedule.appointmentType = formData.get(
      'newScheduleAppointmentType'
    ) as AppointmentType
    this.schedule.hour = hour
    this.schedule.date = formData.get('newScheduleDate') as string
    this.schedule.description = formData.get('newScheduleDescription') as string
    this.schedule.doctorName = formData.get('newScheduleDoctor') as string
    this.schedule.period = generatePeriod(hour)
    this.schedule.status = 'Confirmado'
    return this
  }

  build(): Schedule {
    return this.schedule as Schedule
  }
}
