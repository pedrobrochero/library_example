import { Pool } from 'pg';
const SERVER_DB_USER = 'api';
export default async function  versioning(pool:Pool) {
    try {
        let res = await pool.query(`SELECT EXISTS (SELECT * FROM pg_tables WHERE tablename = 'my_vars')`);
        if (res.rows[0].exists == false) {
            await pool.query('CREATE TABLE my_vars (name text NOT NULL,value text NULL, modified_at timestamp NOT NULL, CONSTRAINT my_vars_un UNIQUE (name))');
            console.log(`my_vars table created`);

            await pool.query(`INSERT INTO my_vars(name, value, modified_at) VALUES('db_version', '1', CURRENT_TIMESTAMP AT TIME ZONE 'UTC')`);
            console.log(`Added 'db_version' var. Default value: 1.`);

            await pool.query(`CREATE TABLE public.books (
                id serial NOT NULL,
                "name" text NOT NULL,
                author text NULL,
                "year" int2 NULL,
                is_lend bool NOT NULL DEFAULT false,
                CONSTRAINT books_pk PRIMARY KEY (id)
            )`);
            console.log(`Table 'books' created`);
            
            await pool.query(`CREATE TABLE public.personas (
                id serial NOT NULL,
                "name" text NOT NULL,
                CONSTRAINT personas_pk PRIMARY KEY (id)
            )`);
            console.log(`Table 'personas' created.`);

            await pool.query(`CREATE TABLE public.history (
                id serial NOT NULL,
                book_id int4 NOT NULL,
                persona_id int4 NOT NULL,
                action_lend bool NOT NULL,
                created_at timestamp(0) NOT NULL,
                CONSTRAINT history_pk PRIMARY KEY (id),
                CONSTRAINT history_fk FOREIGN KEY (book_id) REFERENCES books(id) ON UPDATE CASCADE,
                CONSTRAINT history_fk_1 FOREIGN KEY (persona_id) REFERENCES personas(id) ON UPDATE CASCADE
            )`);
            console.log(`Table 'history' created.`);
        }
        // Upgradings
        // await upgrade(pool, 2, []);

        if (process.env.NODE_ENV == 'prod') {
            await pool.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${SERVER_DB_USER}`);
            console.log(`Permissions granted to ${SERVER_DB_USER}.`);
        }
        
    } catch (error) {
        console.log(error);
    }
}

async function upgrade(pool:Pool, newVersion:number, queries:string[]) {
    try {
        const res = await pool.query(`SELECT value FROM my_vars WHERE name = 'db_version'`);
        const db_version = +res.rows[0].value;

        if (db_version < newVersion) {
            for (const query of queries) {
                await pool.query(query);
                console.log(`Query executed: ${query}`);
            }
        
            await pool.query(`UPDATE my_vars SET value = $1, modified_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC' WHERE name = 'db_version'`, [newVersion]);
            console.log(`Database updated to version ${newVersion}.`);
        }
    } catch (error) {
        console.log(`Error updating db to version ${newVersion}`);
        console.log(error);        
    }
    
}