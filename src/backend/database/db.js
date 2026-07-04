import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

function getDbConfig() {
    const url = process.env.MYSQL_URL;

    if (url) {
        try {
            const parsed = new URL(url);
            return {
                host: parsed.hostname,
                port: Number(parsed.port || 3306),
                user: decodeURIComponent(parsed.username),
                password: decodeURIComponent(parsed.password),
                database: parsed.pathname.replace(/^\//, ''),
            };
        } catch {
            console.error('Não foi possível interpretar MYSQL_URL.');
        }
    }

    return {
        host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
        port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
        user: process.env.MYSQLUSER || process.env.DB_USERNAME,
        password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
        database:
            process.env.MYSQLDATABASE ||
            process.env.MYSQL_DATABASE ||
            process.env.DB_NAME,
    };
}

const { host, port, user, password, database: managedDb } = getDbConfig();

console.log('[DB] Config:', {
    host,
    port,
    user: user ?? '(ausente)',
    database: managedDb ?? '(será criado: taskflow)',
    hasPassword: Boolean(password),
    railway: Boolean(process.env.RAILWAY_ENVIRONMENT),
});

if (!user || !password) {
    console.error(
        'Credenciais do banco ausentes no serviço Node. ' +
        'As variáveis do MySQL precisam ser REFERENCIADAS no serviço do backend, não só existir no serviço MySQL.'
    );
}

if (host === 'localhost' && process.env.RAILWAY_ENVIRONMENT) {
    console.error(
        'MYSQLHOST ausente no container Node → caindo em localhost. ' +
        'No serviço do backend: Variables → New Variable → Add Reference → selecione o MySQL.'
    );
}

const con = mysql.createConnection({
    host,
    port,
    user,
    password,
    ...(managedDb ? { database: managedDb } : {}),
});

const db = new Promise((resolve, reject) => {
    con.connect(function (err) {
        if (err) {
            reject(err);
            return;
        }
        console.log(`Connected to MySQL at ${host}:${port}`);

        if (managedDb) {
            console.log(`Using database: ${managedDb}`);
            resolve(con);
            return;
        }

        con.query('CREATE DATABASE IF NOT EXISTS taskflow', (err) => {
            if (err) {
                reject(err);
                return;
            }
            console.log('Database created!');

            con.query('USE taskflow', (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('Database ready to be used!');
                resolve(con);
            });
        });
    });
});

export default db;
