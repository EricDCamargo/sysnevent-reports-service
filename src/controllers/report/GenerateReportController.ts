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
      let response

      try {
        response = await axios.get(
          `${process.env.PARTICIPANT_SERVICE_URL}/filtered`,
          {
            params: {
              event_id,
              onlyStudents: includeStudents,
              onlyFatec: includeFatec,
              onlyExternal: includeExternal
            },
            headers: {
              Authorization: req.headers.authorization || ''
            }
          }
        )
      } catch (error: any) {
        throw new AppError(
          error?.response?.data?.error || 'Evento não encontrado.',
          error?.response?.status || StatusCodes.BAD_REQUEST
        )
      }

      const participants = response.data.data

      if (!Array.isArray(participants) || participants.length === 0) {
        throw new AppError(
          response?.data?.error || 'Nenhum participante encontrado.',
          StatusCodes.NOT_FOUND
        )
      }

      const generatePDF = new GenerateReportService()

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
