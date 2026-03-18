import db from '../db.js';

// -- Funções de validação --

async function createTable() {
    /*
    createTable() função que cria a tabela no banco para armazenar as tasks. Caso já exista no banco essa tabela, nada é criado. 
    */
    const con = await db;

    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS tasks (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(80),
            deadline DATE,
            urgency ENUM('baixa', 'media', 'alta') DEFAULT 'media',
            status ENUM('pendente', 'andamento', 'concluida', 'abandonada') DEFAULT 'pendente',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        con.query(qry, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log("✅ Table 'tasks' created/verified!");
                resolve(result);
            }
        });
    })
}

// -- Manipulações no banco --

export async function createTask(newTask) {
    /*
    createTask(newTask) essa função recebe um objeto da classe Task e resgata suas informações para armazenar essa instância na tabela do banco de dados.
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tasks (user_id, name, description, deadline, urgency, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'; 
        const values = [
            newTask.user_id,
            newTask.name,
            newTask.description || null,
            newTask.deadline || null,
            newTask.urgency || 'media',
            newTask.status || 'pendente',
            newTask.created_at || new Date()
        ];

        con.query(query, values, (err, result) => { //aciona a query de push na tabela 'tasks'
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: result.insertId,
                    ...newTask,
                    created_at: newTask.created_at || new Date()
                });
            }
        });
    });
}

