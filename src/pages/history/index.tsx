import { BackButton, HistoryRow } from '@/components'
import { getSchedules, getUserAuthenticated } from '@/services'
import { Schedule } from '@/types'
import { QueryClient, dehydrate, useQuery } from 'react-query'

export default function History() {
  const schedulesQuery = useQuery<Schedule[]>({
    queryKey: ['schedule'],
    queryFn: getSchedules,
  })
  const schedules = schedulesQuery.data || []

  return (
    <div className="h-screen flex w-screen justify-center items-center">
      <BackButton customClass="mr-8 -ml-[439px] mt-4 h-10" />
      <div className="w-full px-4 md:w-2/3 xl:w-1/3 grid gap-4">
        <h1 className="text-2xl mx-auto font-bold text-primary">
          HISTÓRICO DE CONSULTAS
        </h1>
        {schedules.map((schedule) => (
          <HistoryRow
            doctorName={schedule.doctorName}
            scheduleDate={schedule.date}
            status={schedule.status}
            key={schedule.id}
          />
        ))}
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

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
