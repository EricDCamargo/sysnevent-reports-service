import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import axios from 'axios'
import { AppError } from '../../errors/AppError'
import { GenerateReportService } from '../../services/report/GenerateReportService'


class GenerateReportController {
  async handle(req: Request, res: Response) {
    const {
      event_id,
      includeStudents,
      includeFatec,
      includeExternal,
      isAttendanceReport
    } = req.body

    if (!event_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: '"event_id" is required.'
      })
    }

    try {
      // Chama o microserviço de participantes
      const response = await axios.get(
        `${process.env.PARTICIPANT_SERVICE_URL}/participants/filtered`,
        {
          params: {
            event_id,
            apenasAlunos: includeStudents,
            apenasFatec: includeFatec,
            apenasExternos: includeExternal
          },
          headers: {
            Authorization: req.headers.authorization || ''
          }
        }
      )

      const participants = response.data.data
      const generatePDF = new GenerateReportService()

      // Geração do PDF
      const pdfBuffer = await generatePDF.execute({
        participants,
        isAttendanceReport: isAttendanceReport === true
      })

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${
          isAttendanceReport ? 'attendance' : 'registration'
        }-report.pdf`
      )

      return res.status(StatusCodes.OK).send(pdfBuffer)
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        return res.status(error.response?.status || 500).json({
          error: error.response?.data?.error || 'Erro ao buscar participantes.'
        })
      }

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message })
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro ao gerar relatório.' })
    }
  }
}

export { GenerateReportController }
