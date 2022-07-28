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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const mongoose_1 = require("../../mongoose");
const router = express_1.default.Router();
router.post('/:userId/:reportId', passport_1.default.authenticate('jwt', { session: false, failureRedirect: '/auth/loginjwt' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, reportId } = req.params;
        const { reason, reported } = req.body; // REPORTED VA A ACEPTAR 3 VALORES: COMMENT, POST Y USER
        if (reported === 'comment') {
            var report = new mongoose_1.Report({
                userId,
                commentReportedId: reportId,
                reason
            });
        }
        else if (reported === 'post') {
            var report = new mongoose_1.Report({
                userId,
                postReportedId: reportId,
                reason
            });
        }
        else {
            var report = new mongoose_1.Report({
                userId,
                userReportedId: reportId,
                reason
            });
        }
        if (!report)
            return res.status(401).json({ msg: 'Reported fails' });
        yield report.save();
        return res.status(201).json({ msg: 'Reported successfully' });
    }
    catch (error) {
        return res.status(400).json(error);
    }
}));
exports.default = router;
