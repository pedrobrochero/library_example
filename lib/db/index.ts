import { Pool, types } from 'pg';
import versioning from './versioning';

let db_config;
if (process.env.NODE_ENV === 'dev') {
    db_config = {
        host: 'localhost',
        database: 'library',
        user: 'postgres',
        password: '1234',
    };
} else {
    // TODO Set production values
    db_config = {
        host: 'localhost',
        database: 'library',
        user: 'dfgf',
        password: 'fgdg',
    };
}
console.log('Initializing db');
const pool = new Pool(db_config);
types.setTypeParser(1114, str => str); // Disable conversion of timestamp to Date
versioning(pool); // Create schemas/update database

// ========================================================================================================

const TABLES = Object.freeze({
    books: 'books',
    personas: 'personas',
    history: 'history',
});

export default {
    query: (query: string, params?: Array<any> , ) => {
        const start = Date.now();
        const res = pool.query(query, params);
        const duration = Date.now() - start;
        // console.log('executed query', { query, duration: `${duration} ms` });
        return res;
    },
    transaction: async(...args:any[]) => {
        if (args.length % 2 != 0) throw 'You should provide a pair number of args [query1, args1, query2, args2 ... queryN, argsN]';

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
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },
    TABLES,
};