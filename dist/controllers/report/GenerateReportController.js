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
exports.GenerateReportController = void 0;
const http_status_codes_1 = require("http-status-codes");
const axios_1 = __importDefault(require("axios"));
const AppError_1 = require("../../errors/AppError");
const GenerateReportService_1 = require("../../services/report/GenerateReportService");
class GenerateReportController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const { event_id, includeStudents, includeFatec, includeExternal, isAttendanceReport } = req.body;
            if (!event_id) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    error: '"event_id" is required.'
                });
            }
            try {
                let response;
                try {
                    response = yield axios_1.default.get(`${process.env.PARTICIPANT_SERVICE_URL}/filtered`, {
                        params: {
                            event_id,
                            onlyStudents: includeStudents,
                            onlyFatec: includeFatec,
                            onlyExternal: includeExternal
                        },
                        headers: {
                            Authorization: req.headers.authorization || ''
                        }
                    });
                }
                catch (error) {
                    throw new AppError_1.AppError(((_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Evento não encontrado.', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || http_status_codes_1.StatusCodes.BAD_REQUEST);
                }
                const participants = response.data.data;
                if (!Array.isArray(participants) || participants.length === 0) {
                    throw new AppError_1.AppError(((_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.error) || 'Nenhum participante encontrado.', http_status_codes_1.StatusCodes.NOT_FOUND);
                }
                const generatePDF = new GenerateReportService_1.GenerateReportService();
                const pdfBuffer = yield generatePDF.execute({
                    participants,
                    isAttendanceReport: isAttendanceReport === true
                });
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${isAttendanceReport ? 'attendance' : 'registration'}-report.pdf`);
                return res.status(http_status_codes_1.StatusCodes.OK).send(pdfBuffer);
            }
            catch (error) {
                console.error(error);
                if (axios_1.default.isAxiosError(error)) {
                    return res.status(((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) || 500).json({
                        error: ((_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.error) || 'Erro ao buscar participantes.'
                    });
                }
                if (error instanceof AppError_1.AppError) {
                    return res.status(error.statusCode).json({ error: error.message });
                }
                return res
                    .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: 'Erro ao gerar relatório.' });
            }
        });
    }
}
exports.GenerateReportController = GenerateReportController;
