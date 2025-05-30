import { BackButton, ScheduleCards } from '@/components'
import { getSchedules, getUserAuthenticated } from '@/services'
import { Schedule, UserAuthenticated } from '@/types'
import Link from 'next/link'
import { QueryClient, dehydrate, useQuery } from 'react-query'

export default function HealthCenter() {
  const { data: userAuthenticated } = useQuery<UserAuthenticated | null>({
    queryKey: ['userAuthenticated'],
    queryFn: getUserAuthenticated,
  })

  const { data: schedules = [] } = useQuery<Schedule[]>({
    queryKey: ['schedule'],
    queryFn: getSchedules,
  })

  return (
    <div className="flex min-h-full w-full items-center justify-center flex-col">
      <div className="flex flex-row">
        <BackButton customClass="h-10 mr-8 -ml-8"></BackButton>
        <h2 className="mb-5 text-3xl font-semibold text-gray-800">
          Próximos agendamentos
        </h2>
      </div>
      <ScheduleCards
        schedules={schedules}
        type="health-center"
        user={userAuthenticated as UserAuthenticated}
      />
      <div>
        <Link href="/health-center/patient-search">
          <button className="h-10 w-52 bg-blue-950 hover:bg-blue-800 rounded-md text-white">
            <h1>Buscar pacientes</h1>
          </button>
        </Link>
        <Link href="/health-center/appointments">
          <button className="h-10 w-56 mt-8 ml-8 bg-blue-950 hover:bg-blue-800 rounded-md text-white whitespace-nowrap">
            <h1>Solicitações de Agendamento</h1>
          </button>
        </Link>
        <Link href="/health-center/new-appointment">
          <button className="h-10 w-56 mt-8 ml-8 bg-blue-950 hover:bg-blue-800 rounded-md text-white whitespace-nowrap">
            <h1>Agendar consulta</h1>
          </button>
        </Link>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['userAuthenticated'],
    queryFn: getUserAuthenticated,
  })
  await queryClient.prefetchQuery({
    queryKey: ['schedule'],
    queryFn: getSchedules,
  })
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
