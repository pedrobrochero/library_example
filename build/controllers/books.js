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
exports.giveback = exports.lend = exports.search = exports.remove = exports.update = exports.get = exports.create = void 0;
const queries = __importStar(require("../db/queries"));
const response_1 = require("../misc/response");
const utils_1 = require("../misc/utils");
const OBJECT = 'Book';
exports.create = async (req, res) => {
    const body = req.body;
    if (!utils_1.checkForMandatoryFields(res, body, ['name']))
        return;
    try {
        const response = await queries.createBook(body.name, body.author, body.year);
        res.status(201).json(new response_1.MyResponse(`${OBJECT} created successfully.`, response.rows[0].id));
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while creating the ${OBJECT}.`, error);
    }
};
exports.get = async (req, res) => {
    try {
        const id = +req.params.id;
        const response = await queries.getBook(id);
        if (response.rowCount == 0)
            return res.status(404).json(new response_1.MyResponse(`${OBJECT} not found`));
        res.json(new response_1.MyResponse('Returning data', response.rows[0]));
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while getting the ${OBJECT}.`, error);
    }
};
exports.update = async (req, res) => {
    const body = req.body;
    try {
        const id = +req.params.id;
        await queries.updateBook(id, body.name, body.author, body.year);
        res.status(204).end();
    }
    catch (error) {
        utils_1.sendErrorServer(res, 'An error has ocurred while updating item.', error);
    }
};
exports.remove = async (req, res) => {
    try {
        const id = +req.params.id;
        await queries.deleteBook(id);
        res.status(204).end();
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while deleting ${OBJECT}.`, error);
    }
};
exports.search = async (req, res) => {
    const query = req.params.query;
    try {
        const response = await queries.searchBook(query);
        if (response.rowCount == 0)
            return res.status(404).json(new response_1.MyResponse(`No ${OBJECT} found with that query`));
        res.json(new response_1.MyResponse('Returning data', response.rows));
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while searching ${OBJECT}s.`, error);
    }
};
exports.lend = async (req, res) => {
    const body = req.body;
    if (!utils_1.checkForMandatoryFields(res, body, ['persona_id']))
        return;
    try {
        const bookId = +req.params.id;
        // Check for valid ids
        if (isNaN(bookId) || isNaN(+body.persona_id)) {
            return res.status(400).json(new response_1.MyResponse('You have provided invalid(s) id(s).', {
                persona_id: body.persona_id,
                book_id: req.params.id,
            }));
        }
        // Check if book is NOT lent
        const response = await queries.getBook(bookId);
        if (response.rows[0].is_lend == true) {
            return res.status(400).json(new response_1.MyResponse('This book is already lent.'));
        }
        await queries.lendBook(bookId, body.persona_id);
        res.status(204).end();
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while lending ${OBJECT}.`, error);
    }
};
exports.giveback = async (req, res) => {
    const body = req.body;
    if (!utils_1.checkForMandatoryFields(res, body, ['persona_id']))
        return;
    try {
        const bookId = +req.params.id;
        // Check for valid ids
        if (isNaN(bookId) || isNaN(+body.persona_id)) {
            return res.status(400).json(new response_1.MyResponse('You have provided invalid(s) id(s).', {
                persona_id: body.persona_id,
                book_id: req.params.id,
            }));
        }
        // Check if book is lent
        const response = await queries.getBook(bookId);
        if (response.rows[0].is_lend == false) {
            return res.status(400).json(new response_1.MyResponse('This book is not lent, you cannot return it.'));
        }
        await queries.returnBook(bookId, body.persona_id);
        res.status(204).end();
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while returning ${OBJECT}.`, error);
    }
};
