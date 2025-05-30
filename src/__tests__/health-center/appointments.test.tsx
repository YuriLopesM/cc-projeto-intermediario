import Appointments from '@/pages/health-center/appointments'
import { postSchedule } from '@/services'
import { Schedule, UserAuthenticated } from '@/types'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

// Mocks
jest.mock('../../../services', () => ({
  getSchedules: jest.fn(),
  getUserAuthenticated: jest.fn(),
  postSchedule: jest.fn(),
}))

jest.mock('react-query', () => {
  const original = jest.requireActual('react-query')
  return {
    ...original,
    useQuery: jest.fn(),
  }
})

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children
})

jest.mock('../../../components', () => ({
  BackButton: () => <div data-testid="back-button">Back</div>,
  ScheduleCards: ({ schedules }: { schedules: Schedule[] }) => (
    <div data-testid="schedule-cards">{schedules.length} agendamento(s)</div>
  ),
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}))

const mockSchedules: Schedule[] = [
  {
    id: '1',
    patientName: 'João da Silva',
    healthCenter: 'Centro de Saúde',
    appointmentType: 'Consulta',
    period: 'Manhã',
    date: '2025-06-01',
    hour: '',
    doctorName: '',
    status: 'Aguardando aprovação',
    description: 'Consulta geral',
  },
]

const mockUser: UserAuthenticated = {
  id: 'abc123',
  name: 'Médico Exemplo',
  type: ['health-center'],
  healthCenter: 'Centro de Saúde',
}

function renderWithClient() {
  const client = new QueryClient()
  return render(
    <QueryClientProvider client={client}>
      <Appointments />
    </QueryClientProvider>
  )
}

describe('Appointments Page', () => {
  beforeEach(() => {
    ;(useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'userAuthenticated') {
        return { data: mockUser }
      }
      if (queryKey[0] === 'schedule') {
        return { data: mockSchedules }
      }
      return { data: undefined }
    })
    jest.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deve renderizar título e botão de ações', async () => {
    renderWithClient()

    expect(
      await screen.findByText(/NOVAS SOLICITAÇÕES DE AGENDAMENTO/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/confirmar agendamento/i)).toBeInTheDocument()
    expect(screen.getByText(/cancelar atendimento/i)).toBeInTheDocument()
  })

  it('deve expandir e mostra informações do agendamento ao clicar', async () => {
    renderWithClient()

    const card = await screen.findByText(/joão da silva/i)
    fireEvent.click(card)

    expect(await screen.findByText(/consulta geral/i)).toBeInTheDocument()
    expect(screen.getByText(/atendimento:/i)).toBeInTheDocument()
  })

  it('deve abrir opções ao clicar em Confirmar Agendamento', async () => {
    renderWithClient()

    const button = await screen.findByText(/confirmar agendamento/i)
    fireEvent.click(button)

    expect(
      await screen.findByText(/profissional responsável/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/horário/i)).toBeInTheDocument()
  })

  it('deve confirmar agendamento com profissional e horário preenchidos', async () => {
    ;(postSchedule as jest.Mock).mockResolvedValue({
      ...mockSchedules[0],
      status: 'Confirmado',
    })

    renderWithClient()

    fireEvent.click(await screen.findByText(/confirmar agendamento/i))

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Dra. Ana' },
    })

    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: '10:00' },
    })

    fireEvent.click(screen.getByText(/enviar/i))

    await waitFor(() => {
      expect(postSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          doctorName: 'Dra. Ana',
          hour: '10:00',
          status: 'Confirmado',
        })
      )
    })
  })

  it('deve cancelar agendamento com motivo preenchido', async () => {
    ;(postSchedule as jest.Mock).mockResolvedValue({
      ...mockSchedules[0],
      status: 'Cancelado',
    })

    renderWithClient()

    fireEvent.click(await screen.findByText(/cancelar atendimento/i))
    const textarea = await screen.findByPlaceholderText(
      /justifique o cancelamento/i
    )

    fireEvent.change(textarea, {
      target: { value: 'Paciente desmarcou' },
    })

    fireEvent.click(screen.getByText(/^enviar$/i))

    await waitFor(() => {
      expect(postSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Cancelado',
          description: 'Paciente desmarcou',
        })
      )
    })
  })

  // it('deve exibir mensagem quando não há solicitações', async () => {
  //   ;(getSchedules as jest.Mock).mockResolvedValue([])

  //   renderWithClient()

  //   expect(
  //     await screen.findByText(/nenhuma nova solicitação/i)
  //   ).toBeInTheDocument()
  // })
})
