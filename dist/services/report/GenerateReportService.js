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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
            // Caminho para sua imagem
            const devPath = path_1.default.join(__dirname, '..', '..', 'assets', 'footer.png');
            const prodPath = path_1.default.join(__dirname, '..', 'assets', 'footer.png');
            const footerImagePath = fs_1.default.existsSync(prodPath) ? prodPath : devPath;
            const footerImageWidth = 620;
            const footerImageHeight = 100;
            // Função pra desenhar rodapé na página atual
            const drawFooter = () => {
                const { width, height, margins } = doc.page;
                const x = (width - footerImageWidth) / 2; // centralizado
                const y = height - margins.bottom - 50; // 10px acima da margem inferior
                doc.image(footerImagePath, x, y, {
                    width: footerImageWidth,
                    height: footerImageHeight
                });
            };
            // Garante o rodapé em páginas adicionais
            doc.on('pageAdded', drawFooter);
            // Título na primeira página
            const title = isAttendanceReport
                ? 'Lista de Presença'
                : 'Lista de Inscritos';
            doc.fontSize(20).text(title, { align: 'center' });
            doc.moveDown();
            // Desenha o rodapé na primeira página
            drawFooter();
            // Configurações de tabela
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
            // Cabeçalho da tabela
            doc.fontSize(12).font('Helvetica-Bold');
            let x = doc.page.margins.left;
            cols.forEach(col => {
                doc.text(col.label, x, tableTop);
                x += col.width + colSpacing;
            });
            // Linhas da tabela
            doc.font('Helvetica');
            let y = tableTop + rowHeight;
            for (const participant of participants) {
                x = doc.page.margins.left;
                if (y >
                    doc.page.height -
                        doc.page.margins.bottom -
                        rowHeight -
                        footerImageHeight) {
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
            }
            // Finaliza e retorna buffer
            doc.end();
            return getStreamBuffer(doc);
        });
    }
}
exports.GenerateReportService = GenerateReportService;
