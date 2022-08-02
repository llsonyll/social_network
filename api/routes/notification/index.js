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
router.post('/:fromId/:toId', passport_1.default.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth/loginjwt",
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromId, toId } = req.params;
    const { content, type, refId } = req.body;
    try {
        const from = yield mongoose_1.User.findById(`${fromId}`);
        const to = yield mongoose_1.User.findById(`${toId}`);
        if (!from || !to)
            return res.status(404).json({ errorMsg: "Missing data !!!!" });
        const notification = new mongoose_1.Notification({
            from: from._id,
            to: to._id,
            refId: refId,
            type: type,
            content: content,
            seen: false,
        });
        return res.json({ msg: "Notification posted successfully", notification });
    }
    catch (err) {
        return res.status(400).json({ errorMsg: err });
    }
}));
exports.default = router;
