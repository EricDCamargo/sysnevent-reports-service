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
const get_stream_1 = __importDefault(require("get-stream"));
class GenerateReportService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ participants, isAttendanceReport }) {
            const doc = new pdfkit_1.default({ margin: 50 });
            // Stream para capturar o buffer final
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => { });
            const title = isAttendanceReport
                ? 'Lista de Presença'
                : 'Lista de Inscritos';
            doc.fontSize(20).text(title, { align: 'center' });
            doc.moveDown();
            const headers = isAttendanceReport
                ? ['Nome', 'RA', 'Curso', 'Semestre', 'Presente']
                : ['Nome', 'E-mail'];
            // Cabeçalho da tabela
            doc.fontSize(12).font('Helvetica-Bold');
            headers.forEach(header => {
                doc.text(header, { continued: true, width: 100, align: 'left' });
            });
            doc.moveDown();
            // Conteúdo da tabela
            doc.font('Helvetica');
            participants.forEach(participant => {
                if (isAttendanceReport) {
                    const presence = participant.isPresent ? '✔️' : '❌';
                    doc.text(participant.name || '-', { continued: true, width: 100 });
                    doc.text(participant.ra || '-', { continued: true, width: 100 });
                    doc.text(participant.course || '-', { continued: true, width: 100 });
                    doc.text(participant.semester || '-', { continued: true, width: 100 });
                    doc.text(presence, { align: 'left' });
                }
                else {
                    doc.text(participant.name || '-', { continued: true, width: 200 });
                    doc.text(participant.email || '-', { align: 'left' });
                }
                doc.moveDown();
            });
            doc.end();
            const buffer = yield get_stream_1.default.buffer(doc);
            return buffer;
        });
    }
}
exports.GenerateReportService = GenerateReportService;
