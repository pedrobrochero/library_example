"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookRecords = exports.getPersonaRecords = exports.getPaginated = void 0;
const queries = __importStar(require("../db/queries"));
const response_1 = require("../misc/response");
const utils_1 = require("../misc/utils");
const OBJECT = 'Record';
const HISTORY_PAGE_SIZE = 10;
exports.getPaginated = async (req, res) => {
    try {
        const page = +(req.query.page ? req.query.page : 1);
        const offset = HISTORY_PAGE_SIZE * (page - 1);
        let response = await queries.getHistoryPaginated(HISTORY_PAGE_SIZE, offset);
        res.json(new response_1.MyResponse(`Returning ${OBJECT}s.`, {
            isLastPage: response.rowCount < HISTORY_PAGE_SIZE,
            count: response.rowCount,
            rows: response.rows,
        }));
    }
    catch (error) {
        console.log(error);
        utils_1.sendErrorServer(res, `An error ocurred while getting ${OBJECT}s.`, error);
    }
};
exports.getPersonaRecords = async (req, res) => {
    try {
        const id = +req.params.id;
        let response = await queries.getPersonaHistory(id);
        res.json(new response_1.MyResponse(`Returning ${OBJECT}s.`, response.rows));
    }
    catch (error) {
        console.log(error);
        utils_1.sendErrorServer(res, `An error ocurred while getting ${OBJECT}s.`, error);
    }
};
exports.getBookRecords = async (req, res) => {
    try {
        const id = +req.params.id;
        let response = await queries.getBookHistory(id);
        res.json(new response_1.MyResponse(`Returning ${OBJECT}s.`, response.rows));
    }
    catch (error) {
        console.log(error);
        utils_1.sendErrorServer(res, `An error ocurred while getting ${OBJECT}s.`, error);
    }
};
