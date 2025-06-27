"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateReportService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
function getStreamBuffer(stream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        stream.on('data', data => buffers.push(data));
        stream.on('end', () => resolve(Buffer.concat(buffers)));
        stream.on('error', reject);
    });
}
class GenerateReportService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ participants, isAttendanceReport }) {
            const doc = new pdfkit_1.default({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            const title = isAttendanceReport
                ? 'Lista de Presença'
                : 'Lista de Inscritos';
            doc.fontSize(20).text(title, { align: 'center' });
            doc.moveDown();
            // Cabeçalho
            const tableTop = doc.y + 10;
            const rowHeight = 25;
            const colSpacing = 10;
            const cols = isAttendanceReport
                ? [
                    { label: 'Nome', width: 150 },
                    { label: 'RA', width: 80 },
                    { label: 'Curso', width: 120 },
                    { label: 'Semestre', width: 60 },
                    { label: 'Presente', width: 70 }
                ]
                : [
                    { label: 'Nome', width: 200 },
                    { label: 'E-mail', width: 250 }
                ];
            // Render headers
            doc.fontSize(12).font('Helvetica-Bold');
            let x = doc.page.margins.left;
            cols.forEach(col => {
                doc.text(col.label, x, tableTop);
                x += col.width + colSpacing;
            });
            // Render participants
            doc.font('Helvetica');
            let y = tableTop + rowHeight;
            participants.forEach(participant => {
                x = doc.page.margins.left;
                if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
                    doc.addPage();
                    y = doc.page.margins.top;
                }
                if (isAttendanceReport) {
                    const values = [
                        participant.name || '-',
                        participant.ra || '-',
                        participant.course || '-',
                        participant.semester || '-',
                        participant.isPresent ? 'Presente' : 'Ausente'
                    ];
                    values.forEach((text, i) => {
                        doc.text(text, x, y, { width: cols[i].width });
                        x += cols[i].width + colSpacing;
                    });
                }
                else {
                    doc.text(participant.name || '-', x, y, { width: cols[0].width });
                    doc.text(participant.email || '-', x + cols[0].width + colSpacing, y, {
                        width: cols[1].width
                    });
                }
                y += rowHeight;
            });
            doc.end();
            return getStreamBuffer(doc);
        });
    }
}
exports.GenerateReportService = GenerateReportService;
