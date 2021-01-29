import db from './index';
const T = db.TABLES;

// ==================== BOOKS ====================
export const createBook = (name: string, author: string, year: number) =>
    db.query(`INSERT INTO ${T.books} 
        (name, author, year) ` +
        `VALUES ($1,$2,$3) RETURNING id`, 
        [name, author, year]
    );
export const getBook = (id:number) => db.query(`SELECT * FROM ${T.books} WHERE id = $1 `, [id]);
export const updateBook = (id: number, name: number, author:string, year:number) => db.query(
    `UPDATE ${T.books} SET ` +
    'name = COALESCE($1, name), ' +
    'author = COALESCE($2, author), ' +
    'year = COALESCE($3, year) ' +
    'WHERE id = $4', 
    [name, author, year, id]
);
export const deleteBook = (id:number) => db.query(`DELETE FROM ${T.books} WHERE id = $1`, [id]);
export const searchBook = (query: string) => db.query(
    `SELECT * FROM ${T.books} ` +
    `WHERE name ILIKE $1 OR author ILIKE $1 OR year = $2 ` +
    'ORDER name ', [`%${query}%`, + query]
);
export const lendBook = (bookId:number, personaId:number) => db.transaction(
    `UPDATE ${T.books} SET is_lend = true WHERE id = $1`, [bookId],
    `INSERT INTO ${T.history} (book_id, persona_id, action_lend, created_at) 
    VALUES($1,$2,true,CURRENT_TIMESTAMP AT TIME ZONE 'UTC')`, [bookId, personaId]
);
export const returnBook = (bookId:number, personaId:number) => db.transaction(
    `UPDATE ${T.books} SET is_lend = false WHERE id = $1`, [bookId],
    `INSERT INTO ${T.history} (book_id, persona_id, action_lend, created_at) 
    VALUES($1,$2,false,CURRENT_TIMESTAMP AT TIME ZONE 'UTC')`, [bookId, personaId]
);
// ==================== PERSONAS ====================
export const createPersona = (name:string) => db.query(`INSERT INTO ${T.personas} (name) VALUES ($1)`, [name]);
export const getPersona = (id:number) => db.query(`SELECT * FROM ${T.personas} WHERE id = $1`, [id]);
export const updatePersona = (id:number, name:string) => db.query(`UPDATE ${T.personas} SET
name = COALESCE($1, name) 
WHERE id = $2`, [name, id]
);
export const deletePersona = (id:number) => db.query(`DELETE FROM ${T.personas} WHERE id = $1`, [id]);
export const searchPersona = (query:string) => db.query(`SELECT * FROM ${T.personas} WHERE name ILIKE $1 ORDER BY name`, [`%${query}%`]);
// ==================== HISTORY ====================
export const getHistoryPaginated = (limit:number, offset:number) => db.query(
    `SELECT H.id, B.name, P.name, H.action_lend, H.created_at FROM 
    (${T.history} as H LEFT JOIN ${T.books} as B ON H.book_id = B.id) 
    LEFT JOIN ${T.personas} as P ON H.persona_id = P.id 
    ORDER BY id DESC LIMIT $1 OFFSET $2 `, 
    [limit, offset]);
export const getPersonaHistory = (personaId:number) => db.query(
    `SELECT H.id, B.name, H.action_lend, H.created_at FROM 
    (${T.history} as H LEFT JOIN ${T.books} as B ON H.book_id = B.id) 
    LEFT JOIN ${T.personas} as P ON H.persona_id = P.id 
    WHERE P.id = $1 `, 
    [personaId]);
export const getBookHistory = (bookId:number) => db.query(
    `SELECT H.id, P.name, H.action_lend, H.created_at FROM 
    (${T.history} as H LEFT JOIN ${T.books} as B ON H.book_id = B.id) 
    LEFT JOIN ${T.personas} as P ON H.persona_id = P.id 
    WHERE B.id = $1 `, 
    [bookId]);