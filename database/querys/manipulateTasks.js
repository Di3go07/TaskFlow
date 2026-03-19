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

export async function readTasks() {
    /*
    readTasks() essa função retorna todas as instâncias de tarefas armazenadas no banco 
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const query = 'SELECT * FROM tasks' //query de busca

    return new Promise((resolve, reject) => { //promise  com a resposta
       con.query(query, (err, result) => { //função que realiza a busca em segundo plano da aplicação
        err ? reject(err) : resolve(result);
       }) 
    });
}

export async function readTask(id) {
    /*
    readTask(id) recebe o id de uma tarefa e retorna a sua instância no banco
    */
    const con = await db;
    await createTable();

    const query = 'SELECT * FROM tasks WHERE id = ?';

    return new Promise((resolve, reject) => {
        con.query(query, [id], (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })
}

export async function createTask(newTask) {
    /*
    createTask(newTask) essa função recebe um objeto da classe Task e resgata suas informações para armazenar essa instância na tabela do banco de dados.
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

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

    return new Promise((resolve, reject) => {
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

export async function updateTask(id, updatedTask) {
    /*
    updateTask(id, updatedTask) essa função atualiza os campos de uma tarefa. Ela recebe o id da tarefa alvo e um objeto com os novos valores. Caso a requsiição HTTP não tenha passado todos os campos, eles são definidos como null e o valor antigo permanece
    */

    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    //resgata o estado atual da tarefa
    const queryRead = 'SELECT * FROM tasks WHERE id = ?';
    const taskNow = await new Promise((resolve, reject) => {
        con.query(queryRead, [id], (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })

    const queryUpdate = 'UPDATE tasks SET ? WHERE id = ?';
    const values = [
        { //objeto da tarefa
            id: taskNow[0].id, //o id nunca pode ser editado
            user_id: taskNow[0].user_id, //usuário nunca pode ser editado
            name: updatedTask.name ?? taskNow[0].name,
            description: updatedTask.description ?? taskNow[0].description,
            deadline: updatedTask.deadline ?? taskNow[0].deadline,
            urgency: updatedTask.urgency ?? taskNow[0].urgency,
            status: updatedTask.status ?? taskNow[0].status,
            created_at: taskNow[0].created_at //a data de criação não muda
        }, 
        id //id da tarefa
    ]

    return new Promise((resolve, reject) => {
        con.query(queryUpdate, values, (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })

}

export async function deleteTask(id) {
    /*
    deleteTask(id) recebe o id da tarefa e exclui a instância do banco
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const query = 'DELETE FROM tasks WHERE id = ?';

    return new Promise((resolve, reject) => {
        con.query(query, [id], (err, result) => {
            err ? reject(err) : resolve(result);
        });
    })
}