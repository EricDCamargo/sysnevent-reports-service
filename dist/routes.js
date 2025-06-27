"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
const GenerateReportController_1 = require("./controllers/report/GenerateReportController");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/participants', isAuthenticated_1.isAuthenticated, new GenerateReportController_1.GenerateReportController().handle);
