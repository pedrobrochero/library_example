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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.canGetPersonas = exports.canGetTransactions = exports.canModifyItems = exports.canCreateItemTransactions = exports.verifyToken = void 0;
const firebase_admin_1 = __importDefault(require("../services/firebase_admin"));
const queries = __importStar(require("../db/queries"));
const constants_1 = require("../misc/constants");
const response_1 = require("../misc/response");
const utils_1 = require("../misc/utils");
// Verify firebase token in headers, and sets user id to req.params.requester_fb_id
exports.verifyToken = async (req, res, next) => {
    const token = req.get('token');
    // console.log('===================TOKEN VERIFICATION===============================');
    // console.log(token);
    try {
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
        let uid = decodedToken.uid;
        req.params.requester_fb_id = uid;
        next();
    }
    catch (error) {
        if (error.code === 'auth/invalid-user-token') {
            res.status(400).json({
                message: 'Invalid token. Sign in again.',
                error
            });
        }
        else if (error.code === 'auth/argument-error') {
            res.status(400).json({
                message: 'You do not have provided any token.',
                error
            });
        }
        else if (error.code === 'auth/id-token-expired') {
            res.status(403).json({
                message: 'Your token has expired. Get a fresh one.',
                error
            });
        }
        else {
            res.status(500).json({
                message: 'An error ocurred while verifing your token.',
                error
            });
            console.log(error);
        }
    }
};
exports.canCreateItemTransactions = async (req, res, next) => canDo(req, res, next, [constants_1.UserRoles.ADMIN, constants_1.UserRoles.EMPLOYEE, constants_1.UserRoles.DEV]);
exports.canModifyItems = async (req, res, next) => canDo(req, res, next, [constants_1.UserRoles.ADMIN, constants_1.UserRoles.EMPLOYEE, constants_1.UserRoles.DEV]);
exports.canGetTransactions = async (req, res, next) => canDo(req, res, next, [constants_1.UserRoles.ADMIN, constants_1.UserRoles.EMPLOYEE, constants_1.UserRoles.DEV]);
exports.canGetPersonas = async (req, res, next) => canDo(req, res, next, [constants_1.UserRoles.ADMIN, constants_1.UserRoles.EMPLOYEE, constants_1.UserRoles.DEV]);
const canDo = async (req, res, next, authorizedRoles) => {
    exports.verifyToken(req, res, async () => {
        try {
            const id = req.params.requester_fb_id;
            const response = await queries.getFirebasePersona(id);
            if (authorizedRoles.includes(response.rows[0].role)) {
                req.params.requester_id = response.rows[0].id;
                next();
            }
            else {
                res.status(403).json(new response_1.MyResponse('You have no permissions for this.'));
            }
        }
        catch (error) {
            utils_1.sendErrorServer(res, 'An error has ocurred while checking for permissions', error);
        }
    });
};
