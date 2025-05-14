import { Router } from 'express'
import { isAuthenticated } from './middlewares/isAuthenticated'
import { ListSalesByEventController } from './controllers/report/ListSalesByEventController'
import { ListParticipantsByEventController } from './controllers/report/ListParticipantsByEventController'

const router = Router()

router.get(
  '/reports/sales',
  isAuthenticated,
  new ListSalesByEventController().handle
)
router.get(
  '/reports/participants',
  isAuthenticated,
  new ListParticipantsByEventController().handle
)

export { router }
