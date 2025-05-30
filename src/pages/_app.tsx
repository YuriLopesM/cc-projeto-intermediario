import Profile from '@/components/Profile'
import { UserPanel } from '@/components/UserPanel'
import { mockClients } from '@/mocks/mockClients'
import { mockSchedules } from '@/mocks/mockSchedules'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaBars, FaBell } from 'react-icons/fa'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import logo from '../../public/logo.png'
import Modal from '../components/Notification'
import SideBar from '../components/SideBar'

export default function App({ Component, pageProps }: AppProps) {
  const [sideBarOpen, setSidebar] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const openSideBar = () => {
    setSidebar(!sideBarOpen)
  }

  const openModal = () => {
    setShowModal(!showModal)
  }

  const openProfile = () => {
    setShowProfile(!showProfile)
  }

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !localStorage.getItem('@agende-aqui/clients')
    ) {
      localStorage.setItem('@agende-aqui/clients', JSON.stringify(mockClients))
    }
  }, [])

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !localStorage.getItem('@agende-aqui/schedules')
    ) {
      localStorage.setItem(
        '@agende-aqui/schedules',
        JSON.stringify(mockSchedules)
      )
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <main className="flex min-h-screen flex-col overflow-hidden">
          <div className="h-20 lg:flex flex-row bg-blue-950">
            <button className="mx-5" onClick={openSideBar}>
              <FaBars color="white" />
            </button>
            <div className="flex pl-5 pb-3 pt-3">
              <Image src={logo} alt="logo" height={0} width={180}></Image>
            </div>
            <div className="flex pb-3 pt-3 place-items-center gap-4 ml-auto mr-5">
              <button className="mx-5" onClick={openModal}>
                <FaBell size={30} color="white"></FaBell>
              </button>
              <UserPanel handleClickEvent={openProfile} />
            </div>
          </div>
          <div className="flex flex-1 bg-white">
            {sideBarOpen && <SideBar />}
            <Component {...pageProps} />
            {showModal && <Modal />}
            {showProfile && <Profile />}
          </div>
        </main>
      </Hydrate>
    </QueryClientProvider>
  )
}
