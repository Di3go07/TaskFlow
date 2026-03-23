import db from '../db.js';

// -- Funções de validação --

async function createTable() {
    /*
    createTable() função que cria a tabela no banco para armazenar os usuários. Caso já exista no banco essa tabela, nada é criado. 
    */
    const con = await db;

    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(10) PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        con.query(qry, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log("✅ Table 'users' created/verified!");
                resolve(result);
            }
        });
    })
}

async function creatID() {
    /*
    creatID() conta quantas instâncias de usuários tem no banco e cria o id customizado para a próxima. Exemplo: TF0001, TF020, TF150
    */
    const con = await db;
    const query = 'SELECT COUNT(*) as total FROM users';
    return new Promise((resolve,reject) => {
        con.query(query, (err, result) => { 
            if(err) { 
            reject(err)  
            }else {
                const total = result[0].total;
                const novoID = `TF${String(total + 1).padStart(3, '0')}`;
                resolve(novoID);
            }
        });
    }) 
}

// -- Manipulações no banco --

export async function readUsers() {
    /*
    readTasks() essa função retorna todas as instâncias de usuários armazenados no banco 
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const query = 'SELECT * FROM users' //query de busca

    return new Promise((resolve, reject) => { //promise  com a resposta
       con.query(query, (err, result) => { //função que realiza a busca em segundo plano da aplicação
        err ? reject(err) : resolve(result);
       }) 
    });
}

export async function createUser(newUser) {
    /*
    createUser(newUser) essa função recebe um objeto da classe User e resgata suas informações para armazenar essa instância na tabela do banco de dados.
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const userID = await creatID();
    const query = 'INSERT INTO users (id, username, email, password, created_at) VALUES (?, ?, ?, ?, ?)';
    const values = [
        userID,
        newUser.username,
        newUser.email,
        newUser.password,
        newUser.created_at
    ];

    return new Promise((resolve,reject) => {
        con.query(query, values, (err, result) => { 
            err ? reject(err) : resolve(result);
        });
    })
}