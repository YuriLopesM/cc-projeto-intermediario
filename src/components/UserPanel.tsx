import { getUserAuthenticated } from '@/services'
import { FaUserCircle } from 'react-icons/fa'
import { dehydrate, QueryClient, useQuery } from 'react-query'

interface UserPanelProps {
  handleClickEvent: () => void
}

export const UserPanel: React.FC<UserPanelProps> = ({ handleClickEvent }) => {
  const { data: userAuthenticated, isLoading } = useQuery({
    queryKey: ['userAuthenticated'],
    queryFn: getUserAuthenticated,
  })

  return (
    <button className="flex items-center" onClick={handleClickEvent}>
      <FaUserCircle size={50} color="white"></FaUserCircle>
      {!isLoading && userAuthenticated && (
        <h1 className="ml-2 text-xl text-white text-left">
          Olá,
          <br />
          {userAuthenticated.name}
        </h1>
      )}
      {!isLoading && !userAuthenticated && (
        <h1 className="ml-2 text-xl text-white text-left">
          Sem
          <br />
          usuário
        </h1>
      )}
    </button>
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
