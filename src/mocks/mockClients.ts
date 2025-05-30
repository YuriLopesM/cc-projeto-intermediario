import { Client } from '@/types'
import { generateId } from '@/utils'

export const mockClients: Client[] = [
  {
    id: generateId(),
    name: 'Maria Oliveira',
    number: '(11) 99999-0001',
    cpf: '123.456.789-00',
    address: {
      street: 'Rua das Flores',
      city: 'São Paulo',
      neighborhood: 'Jardins',
      state: 'SP',
      number: 123,
    },
  },
  {
    id: generateId(),
    name: 'João da Silva',
    number: '(21) 98888-0002',
    cpf: '987.654.321-00',
    address: {
      street: 'Avenida Brasil',
      city: 'Rio de Janeiro',
      neighborhood: 'Copacabana',
      state: 'RJ',
      number: 456,
    },
  },
  {
    id: generateId(),
    name: 'Ana Costa',
    number: '(31) 97777-0003',
    cpf: '456.123.789-00',
    address: {
      street: 'Rua da Liberdade',
      city: 'Belo Horizonte',
      neighborhood: 'Savassi',
      state: 'MG',
      number: 789,
    },
  },
  {
    id: generateId(),
    name: 'Carlos Pereira',
    number: '(41) 96666-0004',
    cpf: '321.789.654-00',
    address: {
      street: 'Rua das Palmeiras',
      city: 'Curitiba',
      neighborhood: 'Centro',
      state: 'PR',
      number: 101,
    },
  },
]
