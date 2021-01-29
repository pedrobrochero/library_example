"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const versioning_1 = __importDefault(require("./versioning"));
let db_config;
if (process.env.NODE_ENV === 'dev') {
    db_config = {
        host: 'localhost',
        database: 'library',
        user: 'postgres',
        password: '1234',
    };
}
else {
    // TODO Set production values
    db_config = {
        host: 'localhost',
        database: 'library',
        user: 'dfgf',
        password: 'fgdg',
    };
}
console.log('Initializing db');
const pool = new pg_1.Pool(db_config);
pg_1.types.setTypeParser(1114, str => str); // Disable conversion of timestamp to Date
versioning_1.default(pool); // Create schemas/update database
// ========================================================================================================
const TABLES = Object.freeze({
    books: 'books',
    personas: 'personas',
    history: 'history',
});
exports.default = {
    query: (query, params) => {
        const start = Date.now();
        const res = pool.query(query, params);
        const duration = Date.now() - start;
        // console.log('executed query', { query, duration: `${duration} ms` });
        return res;
    },
    transaction: async (...args) => {
        if (args.length % 2 != 0)
            throw 'You should provide a pair number of args [query1, args1, query2, args2 ... queryN, argsN]';
        const client = await pool.connect();
        try {
            const start = Date.now();
            console.log('===Transaction begin===');
            await client.query('BEGIN');
            let res;
            for (let i = 0; i < args.length; i = i + 2) {
                res = await client.query(args[i], args[i + 1]);
                console.log(`executed query ${args[i]}`);
            }
            await client.query('COMMIT');
            const duration = Date.now() - start;
            console.log('===Transaction executed===', { duration: `${duration} ms` });
            return res;
        }
        catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }
        finally {
            client.release();
        }
    },
    TABLES,
};
