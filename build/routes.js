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
const express_1 = require("express");
const router = express_1.Router();
// Controllers
const Personas = __importStar(require("./controllers/personas"));
const Books = __importStar(require("./controllers/books"));
const History = __importStar(require("./controllers/history"));
// ==================== ROUTES ==================== //
router.post('/persona', Personas.create);
router.get('/persona/:id', Personas.get);
router.put('/persona/:id', Personas.update);
router.delete('/persona/:id', Personas.remove);
router.get('/persona/search/:query', Personas.search);
router.post('/book', Books.create);
router.get('/book/:id', Books.get);
router.put('/book/:id', Books.update);
router.delete('/book/:id', Books.remove);
router.get('/book/search/:query', Books.search);
router.put('/book/lend/:id', Books.lend);
router.put('/book/return/:id', Books.giveback);
router.get('/history/:page?', History.getPaginated);
router.get('/history/persona/:id', History.getPersonaRecords);
router.get('/history/book/:id', History.getBookRecords);
exports.default = router;
