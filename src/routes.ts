import { Router } from 'express'
import { isAuthenticated } from './middlewares/isAuthenticated'
import { GenerateReportController } from './controllers/report/GenerateReportController'

const router = Router()

router.post('/reports/participants', isAuthenticated, new GenerateReportController().handle)

export { router }
