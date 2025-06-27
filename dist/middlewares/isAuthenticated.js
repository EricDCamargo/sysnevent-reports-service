"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
function isAuthenticated(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: 'Token não encontrado!' })
            .end();
    }
    const [, token] = authToken.split(' ');
    try {
        const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        req.user_id = sub;
        return next();
    }
    catch (err) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: 'Token invalido ou expirado!' })
            .end();
    }
}
