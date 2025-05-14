import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ListSalesByEventService } from '../../services/report/ListSalesByEventService'

class ListSalesByEventController {
  async handle(req: Request, res: Response) {
    const event_id = req.query.event_id as string

    const service = new ListSalesByEventService()

    try {
      const result = await service.execute(String(event_id))
      return res.status(StatusCodes.OK).json(result)
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro ao buscar vendas do evento' })
    }
  }
}

export { ListSalesByEventController }
