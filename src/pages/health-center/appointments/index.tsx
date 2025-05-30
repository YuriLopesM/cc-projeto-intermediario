import { BackButton } from '@/components'
import { getSchedules, getUserAuthenticated, postSchedule } from '@/services'
import { Schedule, UserAuthenticated } from '@/types'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

export default function Appointments() {
  const queryClient = useQueryClient()

  const { data: schedules = [] } = useQuery<Schedule[]>({
    queryKey: ['schedule'],
    queryFn: getSchedules,
  })

  const { data: userAuthenticated } = useQuery<UserAuthenticated | null>({
    queryKey: ['userAuthenticated'],
    queryFn: getUserAuthenticated,
  })

  const [expandedId, setExpandedId] = useState('')
  const [selectedProfessional, setSelectedProfessional] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [showCancelReason, setShowCancelReason] = useState(false)
  const [choiceTime, setChoiceTime] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  // Mutation para postar / atualizar agendamento
  const mutationPost = useMutation(postSchedule, {
    onSuccess: (schedule: Schedule) => {
      queryClient.invalidateQueries('schedule')
      alert(`Agendamento ${schedule.status}`)
    },
  })

  const filteredRequests = schedules.filter(
    (schedule) =>
      schedule.healthCenter === userAuthenticated?.healthCenter &&
      schedule.status === 'Aguardando aprovação'
  )

  const toggleExpandedId = useCallback((id: string) => {
    setExpandedId((prevId) => (prevId === id ? '' : id))
    setShowOptions(false)
    setShowCancelReason(false)
    setCancelReason('')
    setChoiceTime('')
    setSelectedProfessional('')
  }, [])

  const onConfirmClick = useCallback(
    (id: string) => {
      const isSameCard = expandedId === id
      setExpandedId(isSameCard && showOptions ? '' : id)
      setShowCancelReason(false)
      setChoiceTime('')
      setShowOptions((prev) => !prev)
      setSelectedProfessional('')
    },
    [expandedId, showOptions]
  )

  const onCancelClick = useCallback(
    (id: string) => {
      const isSameCard = expandedId === id
      setExpandedId(isSameCard && showCancelReason ? '' : id)
      setShowCancelReason((prev) => !prev)
      setShowOptions(false)
    },
    [expandedId, showCancelReason]
  )

  const onSubmitCancelReason = useCallback(
    (id: string) => {
      if (!cancelReason.trim()) {
        alert('Por favor, informe o motivo do cancelamento.')
        return
      }

      setShowCancelReason(false)

      const scheduleToUpdate = filteredRequests.find((sch) => sch.id === id)
      if (!scheduleToUpdate) return

      const updatedSchedule = {
        ...scheduleToUpdate,
        status: 'Cancelado' as const,
        description: cancelReason,
      }

      mutationPost.mutate(updatedSchedule)
      setCancelReason('')
      setExpandedId('')
    },
    [cancelReason, filteredRequests, mutationPost]
  )

  const onCancelCancelReason = useCallback(() => {
    setShowCancelReason(false)
    setCancelReason('')
  }, [])

  const onSubmitConfirmReason = useCallback(
    (id: string) => {
      if (!selectedProfessional || !choiceTime) {
        alert('Por favor, selecione profissional e horário.')
        return
      }

      setShowOptions(false)

      const scheduleToUpdate = filteredRequests.find((sch) => sch.id === id)
      if (!scheduleToUpdate) return

      const updatedSchedule = {
        ...scheduleToUpdate,
        status: 'Confirmado' as const,
        hour: choiceTime,
        doctorName: selectedProfessional,
      }

      mutationPost.mutate(updatedSchedule)
      setExpandedId('')
      setSelectedProfessional('')
      setChoiceTime('')
    },
    [choiceTime, selectedProfessional, filteredRequests, mutationPost]
  )

  return (
    <div className="flex min-h-full w-full items-center text-left justify-center flex-col">
      <div className="ml-80 flex flex-row">
        <BackButton customClass="mr-8 -ml-[439px] mt-4 h-10" />
        <h1 className="font-bold text-blue-950 text-3xl my-4 whitespace-nowrap">
          NOVAS SOLICITAÇÕES DE AGENDAMENTO:
        </h1>
      </div>
      <ul className="mx-5 my-4 space-y-4">
        {filteredRequests.length === 0 && (
          <p className="font-semibold text-blue-950 my-4 -mt-8">
            Nenhuma nova solicitação
          </p>
        )}
        {filteredRequests.map((schedule) => {
          const isExpanded = expandedId === schedule.id
          return (
            <li key={schedule.id}>
              <div
                className={`border-blue-950 rounded-lg text-white text-start text-xl px-10 ${
                  isExpanded ? 'bg-blue-950' : 'bg-blue-950 opacity-50'
                } p-2 cursor-pointer`}
                onClick={() => toggleExpandedId(schedule.id)}
              >
                <div className="p-1">
                  <p>Data: {dayjs(schedule.date).format('DD/MM/YYYY HH:mm')}</p>
                  <p>Período: {schedule.period}</p>
                  <p>Paciente: {schedule.patientName}</p>
                </div>
                {isExpanded && (
                  <div className="text-start">
                    <p>Atendimento: {schedule.appointmentType}</p>
                    <p>Descrição: {schedule.description}</p>
                    <hr />
                  </div>
                )}
              </div>

              <div className="flex mt-4 justify-between">
                <div className="mt-4">
                  <button
                    className="bg-blue-950 rounded-full text-white h-10 w-[320px] px-4 py-2 mr-2"
                    onClick={() => onConfirmClick(schedule.id)}
                  >
                    Confirmar Agendamento
                  </button>

                  {isExpanded && showOptions && (
                    <div>
                      <div className="mt-4 flex bg-blue-950 bg-opacity-50 rounded-xl w-80 h-32">
                        <div>
                          <h3 className="text-center font-bold text-black underline mt-10 whitespace-nowrap">
                            Profissional Responsável
                          </h3>
                          <select
                            className="input w-[190px] bg-white text-black rounded-xl h-8 pl-2 mt-2 m-2"
                            value={selectedProfessional}
                            onChange={(e) =>
                              setSelectedProfessional(e.target.value)
                            }
                          >
                            <option value="" disabled>
                              Selecione o profissional
                            </option>
                            <option value="Dra. Júlia">Dra. Júlia</option>
                            <option value="Dra. Ana">Dra. Ana</option>
                            <option value="Dr. Artur">Dr. Artur</option>
                          </select>
                        </div>
                        <div className="ml-2 mt-2">
                          <h3 className="text-center font-bold text-black underline mt-8 whitespace-nowrap">
                            Horário
                          </h3>
                          <input
                            className="input w-[100px] h-[32px] bg-white text-black rounded-xl pl-6 mt-2 text-center"
                            type="time"
                            value={choiceTime}
                            onChange={(e) => setChoiceTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <button
                          className="bg-blue-950 w-36 h-10 rounded-xl text-white font-bold px-4 py-2"
                          onClick={() => {
                            setShowOptions(false)
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          className="bg-blue-950 ml-2 w-36 h-10 rounded-xl text-white font-bold px-4 py-2"
                          onClick={() => onSubmitConfirmReason(schedule.id)}
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    className="bg-blue-950 rounded-full text-white h-10 w-80 px-4 py-2 ml-2"
                    onClick={() => onCancelClick(schedule.id)}
                  >
                    Cancelar Atendimento
                  </button>
                </div>
              </div>

              {isExpanded && showCancelReason && (
                <div className="mt-2 ml-2 flex justify-end">
                  <div className="mr-6 mt-2 mb-12 flex-col bg-blue-950 bg-opacity-50 rounded-xl w-[260px] h-32">
                    <textarea
                      placeholder="Justifique o cancelamento"
                      className="input w-[245px] h-28 ml-2 bg-white rounded-md mt-2 mb-4"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <div className="flex justify-between">
                      <button
                        className="bg-blue-950 w-[200px] h-[40px] rounded-xl text-white font-bold px-4 py-2"
                        onClick={onCancelCancelReason}
                      >
                        Cancelar
                      </button>
                      <button
                        className="bg-blue-950 ml-2 w-[200px] h-[40px] rounded-xl text-white font-bold px-4 py-2"
                        onClick={() => onSubmitCancelReason(schedule.id)}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['schedule'],
    queryFn: getSchedules,
  })

  await queryClient.prefetchQuery({
    queryKey: ['userAuthenticated'],
    queryFn: getUserAuthenticated,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
