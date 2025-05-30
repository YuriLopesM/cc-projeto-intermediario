import HealthCenter from '@/pages/health-center'
import { Schedule, UserAuthenticated } from '@/types'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { useQuery } from 'react-query'

// Mock de dados
const mockUser: UserAuthenticated = {
  id: '1',
  name: 'Dr. House',
  healthCenter: 'Centro de Saúde',
  type: ['health-center'],
}

const mockSchedules: Schedule[] = [
  {
    id: '123',
    patientName: 'João Silva',
    healthCenter: 'Centro de Saúde',
    appointmentType: 'Consulta',
    date: '2025-06-01',
    description: 'Dor de cabeça constante',
    status: 'Confirmado',
    doctorName: 'Dr. House',
    hour: '09:00',
    period: 'Manhã',
  },
]

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

describe('HealthCenter Page', () => {
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
  })

  it('renderiza corretamente os componentes principais', async () => {
    render(<HealthCenter />)

    expect(await screen.findByText('Próximos agendamentos')).toBeInTheDocument()
    expect(screen.getByTestId('back-button')).toBeInTheDocument()
    expect(screen.getByTestId('schedule-cards')).toHaveTextContent(
      '1 agendamento(s)'
    )
    expect(screen.getByText('Buscar pacientes')).toBeInTheDocument()
    expect(screen.getByText('Solicitações de Agendamento')).toBeInTheDocument()
    expect(screen.getByText('Agendar consulta')).toBeInTheDocument()
  })
})
