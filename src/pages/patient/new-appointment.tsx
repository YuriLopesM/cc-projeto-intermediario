import { ScheduleBuilder } from '@/builders/ScheduleBuilder'
import { BackButton } from '@/components'
import { getUserAuthenticated, postSchedule } from '@/services'
import { Schedule, UserAuthenticated } from '@/types'
import { FormEvent, useMemo, useState } from 'react'
import {
  QueryClient,
  dehydrate,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'

export default function NewPatientAppointment() {
  const userAuthenticated = useQuery<UserAuthenticated | null>({
    queryKey: ['userAuthenticated'],
    queryFn: getUserAuthenticated,
  })
  const name = userAuthenticated.data?.name
  const patientName = typeof name === 'string' ? name : ''

  const [errorMessage, setErrorMessage] = useState('')

  const requiredFields = useMemo(
    () => [
      'newScheduleHealthCenter',
      'newScheduleAppointmentType',
      'newSchedulePeriod',
      'newScheduleDate',
      'newScheduleDescription',
    ],
    []
  )

  const queryClient = useQueryClient()

  const mutationPost = useMutation(
    (newSchedule: Schedule) => postSchedule(newSchedule),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('schedules')
        alert('Agendamento Confirmado')
      },
    }
  )

  function isFormDataValid(formData: FormData, requiredFields: string[]) {
    return requiredFields.every(
      (field) =>
        formData.get(field) !== null &&
        formData.get(field)?.toString().trim() !== ''
    )
  }

  function addSchedule(event: FormEvent) {
    event.preventDefault()

    const form = event.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    if (!isFormDataValid(formData, requiredFields)) {
      setErrorMessage('Preencha todos os campos!')
      return
    }

    const builder = new ScheduleBuilder()
    const newSchedule = builder.fromPatientForm(formData, patientName).build()

    mutationPost.mutate(newSchedule)

    form.reset()
    setErrorMessage('')
  }

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center">
      <div className="flex flex-row">
        <BackButton customClass="mr-80 -ml-[439px] mt-[10px]"></BackButton>
        <h1 className="font-bold text-blue-950 text-2xl whitespace-nowrap">
          NOVO AGENDAMENTO
        </h1>
      </div>
      <form
        onSubmit={addSchedule}
        method="post"
        className="space-y-4 text-left mt-10 ml-1"
      >
        <fieldset disabled={mutationPost.isLoading}>
          <div className="flex space-x-15">
            <div>
              <label
                htmlFor="state"
                className="block font-bold text-blue-950 text-2xl "
              >
                Estado:
              </label>
              <select
                id="state"
                name="state"
                className="input w-[440px] bg-gray-300 rounded-md h-10 pl-2"
              >
                <option value="">Selecione o estado</option>
                <option value="SC">Santa Catarina</option>
              </select>
            </div>

            <div className="ml-64">
              <label
                htmlFor="city"
                className="block font-bold text-blue-950 text-2xl"
              >
                Cidade:
              </label>
              <select
                id="city"
                name="city"
                className="input w-96 h-10 bg-gray-300 rounded-md pl-2"
              >
                <option value="">Selecione a cidade</option>
                <option value="Criciúma">Criciúma</option>
                <option value="Sombrio">Sombrio</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="newScheduleHealthCenter"
              className="block font-bold text-blue-950 text-2xl"
            >
              Posto de Saúde:
            </label>
            <select
              id="newScheduleHealthCenter"
              name="newScheduleHealthCenter"
              className="input w-[1085px] h-10 bg-gray-300 rounded-md pl-2"
            >
              <option value="">Selecione o posto</option>
              <option value="Tal">Posto Centro</option>
              <option value="Mina do Mato">Posto Mina do Mato</option>
              <option value="Pinheirinho">Posto Pinheirinho</option>
              <option value="Sombrio">Posto Sombrio</option>
            </select>
          </div>

          <div className="flex">
            <div>
              <label
                htmlFor="newScheduleAppointmentType"
                className="block font-bold text-blue-950 text-2xl"
              >
                Tipo de Atendimento:
              </label>
              <select
                id="newScheduleAppointmentType"
                name="newScheduleAppointmentType"
                className="input w-[440px] bg-gray-300 rounded-md h-10 pl-2"
              >
                <option value="">Selecione o tipo de consulta</option>
                <option value="Pediatra">Pediatra</option>
                <option value="Dentista">Dentista</option>
                <option value="Rotina">Rotina</option>
                <option value="Dermatologista">Dermatologista</option>
              </select>

              <div className="flex space-x-15 mt-4">
                <div>
                  <label
                    htmlFor="newScheduleDate"
                    className="block font-bold text-blue-950 text-2xl "
                  >
                    Data:
                  </label>
                  <input
                    type="date"
                    id="newScheduleDate"
                    name="newScheduleDate"
                    className="input bg-gray-300 rounded-md h-10 w-44 pl-2"
                  />
                </div>

                <div className="ml-[90px]">
                  <label
                    htmlFor="newSchedulePeriod"
                    className="block font-bold text-blue-950 text-2xl "
                  >
                    Período:
                  </label>
                  <select
                    id="newSchedulePeriod"
                    name="newSchedulePeriod"
                    className="input bg-gray-300 rounded-md h-10 w-44 pl-2"
                  >
                    <option value="">Selecione o Período</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="ml-64">
              <label
                htmlFor="newScheduleDescription"
                className="block font-bold text-blue-950 text-2xl"
              >
                O que você está sentindo:
              </label>
              <textarea
                id="newScheduleDescription"
                name="newScheduleDescription"
                className="input w-96 h-32  bg-gray-300 rounded-md pl-2"
              ></textarea>
            </div>
          </div>
          {errorMessage && (
            <div className="text-center h-0 text-red-600 ml-10">
              <h1>{errorMessage}</h1>
            </div>
          )}
          <div className="self-center text-center">
            <button
              disabled={mutationPost.isLoading}
              type="submit"
              className="btn w-80 h-12 rounded-3xl bg-blue-950 self-center mt-8 text-2xl text-white ml-10 mb-2"
            >
              ENVIAR
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

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
