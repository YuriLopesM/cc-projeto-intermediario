import { deleteUserAuthenticated, postUserAuthenticated } from '@/services'
import { UserAuthenticated } from '@/types'
import Link from 'next/link'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'

export default function Home() {
  const login = () => {
    const user = {
      id: '1',
      name: 'Yuri',
      healthCenter: 'Centro de Saúde',
      type: ['patient', 'health-center'],
    } as UserAuthenticated
    mutationPost.mutate(user)
  }

  const queryClient = useQueryClient()

  const mutationPost = useMutation(
    (newUserLogged: UserAuthenticated) => postUserAuthenticated(newUserLogged),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userAuthenticated')
      },
    }
  )

  const mutationDelete = useMutation(() => deleteUserAuthenticated(), {
    onSuccess: () => {
      queryClient.invalidateQueries('userAuthenticated')
    },
  })

  useEffect(() => {
    mutationDelete.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-full w-full items-center justify-center flex-col">
      <h1 className="text-xl text-blue-950 pb-3">Você é um(a):</h1>
      <div className="flex gap-x-2">
        <Link href="/patient">
          <button
            className="h-10 w-52 bg-blue-950 hover:bg-blue-800 rounded-md text-white"
            onClick={login}
          >
            <h1>Paciente</h1>
          </button>
        </Link>
        <Link href="/health-center">
          <button
            className="h-10 w-52 bg-blue-950 hover:bg-blue-800 rounded-md text-white"
            onClick={login}
          >
            <h1>Enfermeiro(a)</h1>
          </button>
        </Link>
        <Link href="/register">
          <button className="h-10 w-52 bg-blue-950 hover:bg-blue-800 rounded-md text-white">
            <h1>Cadastro</h1>
          </button>
        </Link>
      </div>
    </div>
  )
}
