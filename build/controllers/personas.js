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
exports.search = exports.remove = exports.update = exports.get = exports.create = void 0;
const queries = __importStar(require("../db/queries"));
const response_1 = require("../misc/response");
const utils_1 = require("../misc/utils");
const OBJECT = 'Persona';
exports.create = async (req, res) => {
    const body = req.body;
    if (!utils_1.checkForMandatoryFields(res, body, ['name']))
        return;
    try {
        const response = await queries.createPersona(body.name);
        res.status(201).json(new response_1.MyResponse(`${OBJECT} created successfully.`, response.rows[0].id));
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while creating the ${OBJECT}.`, error);
    }
};
exports.get = async (req, res) => {
    try {
        const id = +req.params.id;
        const response = await queries.getPersona(id);
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
        await queries.updatePersona(id, body.name);
        res.status(204).end();
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while updating ${OBJECT}.`, error);
    }
};
exports.remove = async (req, res) => {
    try {
        const id = +req.params.id;
        await queries.deletePersona(id);
        res.status(204).end();
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while deleting ${OBJECT}.`, error);
    }
};
exports.search = async (req, res) => {
    const query = req.params.query;
    try {
        const response = await queries.searchPersona(query);
        if (response.rowCount == 0)
            return res.status(404).json(new response_1.MyResponse(`No ${OBJECT} found with that query`));
        res.json(new response_1.MyResponse('Returning data', response.rows));
    }
    catch (error) {
        utils_1.sendErrorServer(res, `An error has ocurred while searching ${OBJECT}s.`, error);
    }
};
