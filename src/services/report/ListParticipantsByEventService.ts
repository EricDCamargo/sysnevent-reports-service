import axios from 'axios'
import { AppError } from '../../errors/AppError'
import { StatusCodes } from 'http-status-codes'
import { AppResponse } from '../../@types/app.types'

class ListParticipantsByEventService {
  async execute(eventId: string): Promise<AppResponse> {
    const ticketApi = process.env.TICKET_SERVICE_URL
    const participantApi = process.env.PARTICIPANT_SERVICE_URL

    try {
      // 1. Consulta todos os ingressos
      const ticketRes = await axios.get(`${ticketApi}/tickets`)
      const tickets = ticketRes.data.data

      // 2. Filtra os que são do evento desejado
      const participantIds = tickets
        .filter((ticket: any) => ticket.eventId === eventId)
        .map((ticket: any) => ticket.participantId)

      if (participantIds.length === 0) {
        return {
          data: [],
          message: 'Nenhum participante encontrado para este evento.'
        }
      }

      // 3. Consulta participantes por ID (poderia ser otimizado com batch endpoint)
      const participants: any[] = []

      for (const id of participantIds) {
        try {
          const res = await axios.get(`${participantApi}/participants/${id}`)
          participants.push({
            id,
            name: res.data.name,
            email: res.data.email
          })
        } catch {
          participants.push({
            id,
            name: 'Desconhecido',
            email: 'Não encontrado'
          })
        }
      }

      return {
        data: participants,
        message: 'Participantes recuperados com sucesso!'
      }
    } catch (err) {
      throw new AppError(
        'Erro ao buscar participantes por evento',
        StatusCodes.BAD_GATEWAY
      )
    }
  }
}

export { ListParticipantsByEventService }
