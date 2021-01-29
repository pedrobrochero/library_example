"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookHistory = exports.getPersonaHistory = exports.getHistoryPaginated = exports.searchPersona = exports.deletePersona = exports.updatePersona = exports.getPersona = exports.createPersona = exports.returnBook = exports.lendBook = exports.searchBook = exports.deleteBook = exports.updateBook = exports.getBook = exports.createBook = void 0;
const index_1 = __importDefault(require("./index"));
const T = index_1.default.TABLES;
// ==================== BOOKS ====================
exports.createBook = (name, author, year) => index_1.default.query(`INSERT INTO ${T.books} 
        (name, author, year) ` +
    `VALUES ($1,$2,$3) RETURNING id`, [name, author, year]);
exports.getBook = (id) => index_1.default.query(`SELECT * FROM ${T.books} WHERE id = $1 `, [id]);
exports.updateBook = (id, name, author, year) => index_1.default.query(`UPDATE ${T.books} SET ` +
    'name = COALESCE($1, name), ' +
    'author = COALESCE($2, author), ' +
    'year = COALESCE($3, year) ' +
    'WHERE id = $4', [name, author, year, id]);
exports.deleteBook = (id) => index_1.default.query(`DELETE FROM ${T.books} WHERE id = $1`, [id]);
exports.searchBook = (query) => index_1.default.query(`SELECT * FROM ${T.books} ` +
    `WHERE name ILIKE $1 OR author ILIKE $1 OR year = $2 ` +
    'ORDER name ', [`%${query}%`, +query]);
exports.lendBook = (bookId, personaId) => index_1.default.transaction(`UPDATE ${T.books} SET is_lend = true WHERE id = $1`, [bookId], `INSERT INTO ${T.history} (book_id, persona_id, action_lend, created_at) 
    VALUES($1,$2,true,CURRENT_TIMESTAMP AT TIME ZONE 'UTC')`, [bookId, personaId]);
exports.returnBook = (bookId, personaId) => index_1.default.transaction(`UPDATE ${T.books} SET is_lend = false WHERE id = $1`, [bookId], `INSERT INTO ${T.history} (book_id, persona_id, action_lend, created_at) 
    VALUES($1,$2,false,CURRENT_TIMESTAMP AT TIME ZONE 'UTC')`, [bookId, personaId]);
// ==================== PERSONAS ====================
exports.createPersona = (name) => index_1.default.query(`INSERT INTO ${T.personas} (name) VALUES ($1)`, [name]);
exports.getPersona = (id) => index_1.default.query(`SELECT * FROM ${T.personas} WHERE id = $1`, [id]);
exports.updatePersona = (id, name) => index_1.default.query(`UPDATE ${T.personas} SET
name = COALESCE($1, name) 
WHERE id = $2`, [name, id]);
exports.deletePersona = (id) => index_1.default.query(`DELETE FROM ${T.personas} WHERE id = $1`, [id]);
exports.searchPersona = (query) => index_1.default.query(`SELECT * FROM ${T.personas} WHERE name ILIKE $1 ORDER BY name`, [`%${query}%`]);
// ==================== HISTORY ====================
exports.getHistoryPaginated = (limit, offset) => index_1.default.query(`SELECT H.id, B.name, P.name, H.action_lend, H.created_at FROM 
    (${T.history} as H LEFT JOIN ${T.books} as B ON H.book_id = B.id) 
    LEFT JOIN ${T.personas} as P ON H.persona_id = P.id 
    ORDER BY id DESC LIMIT $1 OFFSET $2 `, [limit, offset]);
exports.getPersonaHistory = (personaId) => index_1.default.query(`SELECT H.id, B.name, H.action_lend, H.created_at FROM 
    (${T.history} as H LEFT JOIN ${T.books} as B ON H.book_id = B.id) 
    LEFT JOIN ${T.personas} as P ON H.persona_id = P.id 
    WHERE P.id = $1 `, [personaId]);
exports.getBookHistory = (bookId) => index_1.default.query(`SELECT H.id, P.name, H.action_lend, H.created_at FROM 
    (${T.history} as H LEFT JOIN ${T.books} as B ON H.book_id = B.id) 
    LEFT JOIN ${T.personas} as P ON H.persona_id = P.id 
    WHERE B.id = $1 `, [bookId]);
