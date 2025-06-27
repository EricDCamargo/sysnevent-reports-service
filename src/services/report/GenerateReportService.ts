import PDFDocument from 'pdfkit'
import { Participant } from '../../@types/participant.types.js'

interface GenerateReportParams {
  participants: Participant[]
  isAttendanceReport: boolean
}

function getStreamBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = []
    stream.on('data', data => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
    stream.on('error', reject)
  })
}

class GenerateReportService {
  async execute({
    participants,
    isAttendanceReport
  }: GenerateReportParams): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 })

    // Stream para capturar o buffer final
    const buffers: Buffer[] = []
    doc.on('data', buffers.push.bind(buffers))

    doc.on('end', () => {})

    const title = isAttendanceReport
      ? 'Lista de Presença'
      : 'Lista de Inscritos'

    doc.fontSize(20).text(title, { align: 'center' })
    doc.moveDown()

    const headers = isAttendanceReport
      ? ['Nome', 'RA', 'Curso', 'Semestre', 'Presente']
      : ['Nome', 'E-mail']

    // Cabeçalho da tabela
    doc.fontSize(12).font('Helvetica-Bold')
    headers.forEach(header => {
      doc.text(header, { continued: true, width: 100, align: 'left' })
    })
    doc.moveDown()

    // Conteúdo da tabela
    doc.font('Helvetica')
    participants.forEach(participant => {
      if (isAttendanceReport) {
        const presence = participant.isPresent ? '✔️' : '❌'

        doc.text(participant.name || '-', { continued: true, width: 100 })
        doc.text(participant.ra || '-', { continued: true, width: 100 })
        doc.text(participant.course || '-', { continued: true, width: 100 })
        doc.text(participant.semester || '-', { continued: true, width: 100 })
        doc.text(presence, { align: 'left' })
      } else {
        doc.text(participant.name || '-', { continued: true, width: 200 })
        doc.text(participant.email || '-', { align: 'left' })
      }
      doc.moveDown()
    })

    doc.end()

    const buffer = await getStreamBuffer(doc)

    return buffer
  }
}

export { GenerateReportService }
