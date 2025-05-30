import { Schedule, UserAuthenticated } from '@/types'
import dayjs from 'dayjs'

type ScheduleCardsProps = {
  schedules: Schedule[]
  type: 'patient' | 'health-center'
  user: UserAuthenticated
}

export function ScheduleCards({ schedules, type, user }: ScheduleCardsProps) {
  const filteredSchedules = schedules?.filter((schedule: Schedule) => {
    if (type === 'patient') {
      return (
        schedule.patientName === user.name && schedule.status === 'Confirmado'
      )
    }

    if (type === 'health-center') {
      return (
        schedule.healthCenter === user.healthCenter &&
        schedule.status === 'Confirmado'
      )
    }
    return false
  })

  return (
    <div>
      <ul className="mx-5 my-4 flex space-x-4">
        {filteredSchedules?.map((schedule: Schedule) => (
          <li key={schedule.id} className="py-px">
            <div className="border-blue-950 border rounded text-white text-center text-2xl max-w-xs">
              <div className="bg-blue-950 p-1">
                <h1>
                  {dayjs(schedule.date).format('DD/MM/YYYY HH:mm')} -{' '}
                  {type === 'patient'
                    ? schedule.appointmentType
                    : schedule.hour}
                </h1>
              </div>
              {type === 'patient' && (
                <div className="bg-blue-950 opacity-50 text-start p-2">
                  <h1>Horário: {schedule.hour}</h1>
                  <h1>Unidade: {schedule.healthCenter}</h1>
                  <h1>Especialista: {schedule.doctorName}</h1>
                </div>
              )}
              {type === 'health-center' && (
                <div className="bg-blue-950 opacity-50 text-start p-2">
                  <h1>Nome: {schedule.patientName}</h1>
                  <h1>Profissional: {schedule.doctorName}</h1>
                  <h1 className="break-words">
                    Motivo: {schedule.description}
                  </h1>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {filteredSchedules?.length === 0 && (
        <p className="font-semibold text-blue-950 my-4 -mt-8">
          Nenhum agendamento marcado
        </p>
      )}
    </div>
  )
}
