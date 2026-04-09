import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    creatID() busca o id customizado do último usuário cadastrado e adiciona um ao valor para o próximo registro. Exemplo: TF0001, TF020, TF150
    */

    const con = await db;
    const query = 'SELECT MAX(id) as ultimo_id FROM users';
    
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                let ultimoId = result[0].ultimo_id;
                
                // Se não houver usuários, começa do TF001
                if (!ultimoId) {
                    resolve('TF001');
                } else {
                    // Extrai o número do ID (ex: TF005 -> 5)
                    const numero = parseInt(ultimoId.replace('TF', ''));
                    const novoId = numero + 1;
                    const novoID = `TF${String(novoId).padStart(3, '0')}`;
                    resolve(novoID);
                }
            }
        });
    });
}

export async function verifyLogin(user) {
    /*
    verifiyLogin(user) recebe um email e uma senha para verificar se elas existem no banco. 
    Caso existam, retorna as informações do usuário para gerar o token, caso não, retorna uma mensagem de erro.
    */
    const con = await db;
    await createTable() 

    const email = user.email;
    const password = user.password;

    //verificar se o email existe
    const queryEmail = 'SELECT * FROM users WHERE email = ?';
    const dataUser = await new Promise((resolve, reject) => {
        con.query(queryEmail, email, (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })

    if (dataUser.length === 0) {
        return {'error': 'Email não encontrado'}
    }

    //compara as senhas
    const senhasComparadas = await new Promise((resolve, reject) => {
        bcrypt.compare(password, dataUser[0].password, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result); //retorna true ou false
            }
        });
    });

    if (senhasComparadas) {
        const user_logged = {
            id: dataUser[0].id,
            username: dataUser[0].username,
            email: dataUser[0].email
        };
        return user_logged;
    } else {
        return { error: 'Senha inválida' };
    }
}

export async function getUserData(token) {
    /* getUserData(token) recebe o token do usuário passado na header e retorna  um objeto com todos os seus dados passados no jwt */
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id

    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const queryRead = 'SELECT * FROM users WHERE id = ?';
    const userData = await new Promise((resolve, reject) => {
        con.query(queryRead, [userId], (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })

    const myUser = {
        'id': userData[0].id,
        'username': userData[0].username,
        'email': userData[0].email
    }

    return  myUser
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

export async function updateUser(updatedUser) {
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    //resgata o estado atual do usuário
    const queryRead = 'SELECT * FROM users WHERE id = ?';
    const userNow = await new Promise((resolve, reject) => {
        con.query(queryRead, [updatedUser.id], (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })

    const queryUpdate = 'UPDATE users SET ? WHERE id = ?';
    const values = [
        { //objeto do usuário
            id: userNow[0].id,
            username: updatedUser.username ?? userNow[0].username,
            email: updatedUser.email ?? userNow[0].email,
            password: updatedUser.password ?? userNow[0].password
        }, 
        updatedUser.id //id do usuário
    ]

    return new Promise((resolve, reject) => {
        con.query(queryUpdate, values, (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })
}

export async function deleteUser(id) {
    const con = await db;
    await createTable() 

    const query = 'DELETE FROM users WHERE id = ?';
    const queryTasks = 'DELETE FROM tasks WHERE user_id = ?';

    await new Promise((resolve, reject) => {
        con.query(queryTasks, [id], (err, result) => {
            err ? reject(err) : resolve(result);
        });
        console.log('Tarefas do usuário deletadas')
    });
    return new Promise((resolve, reject) => {
        con.query(query, [id], (err, result) => {
            err ? reject(err) : resolve(result);
        });
    })
}