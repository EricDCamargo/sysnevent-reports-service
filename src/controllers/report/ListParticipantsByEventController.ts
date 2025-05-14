import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ListParticipantsByEventService } from '../../services/report/ListParticipantsByEventService'
import { AppError } from '../../errors/AppError'

class ListParticipantsByEventController {
  async handle(req: Request, res: Response) {
    const event_id = req.query.event_id as string

    if (!event_id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Id do evento é obrigatório' })
    }

    const service = new ListParticipantsByEventService()

    try {
      const result = await service.execute(String(event_id))
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno ao buscar participantes' })
    }
  }
}

export { ListParticipantsByEventController }
