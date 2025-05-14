import axios from 'axios'
import { AppResponse } from '../../@types/app.types'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'

class ListSalesByEventService {
  async execute(eventId: string): Promise<AppResponse> {
    try {
      const ticketApi = process.env.TICKET_SERVICE_URL
      const response = await axios.get(`${ticketApi}/tickets`)
      const tickets = response.data.data

      const filtered = tickets.filter(
        (ticket: any) => ticket.eventId === eventId
      )

      return {
        data: {
          eventId,
          totalSales: filtered.length
        },
        message: 'Total de vendas recuperado com sucesso'
      }
    } catch (err) {
      throw new AppError(
        'Erro ao buscar dados de ingressos',
        StatusCodes.BAD_GATEWAY
      )
    }
  }
}

export { ListSalesByEventService }
