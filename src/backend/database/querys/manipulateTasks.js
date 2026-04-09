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
            user_id VARCHAR(10) NOT NULL,
            name VARCHAR(50) NOT NULL,
            description VARCHAR(80),
            deadline DATE,
            urgency ENUM('Baixa', 'Média', 'Alta') DEFAULT 'media',
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

function formatedResult(result){
    return result.map(task => ({
        ...task,
        deadline: result[0].deadline.toISOString().split("T")[0]
    }));
}

// -- Manipulações no banco --

export async function readTasks(id, status) {
    /*
    readTasks(id, status) essa função retorna todas as instâncias de tarefas do usuário armazenadas no banco com o status passado 
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    if (status){
        const query = 'SELECT * FROM tasks WHERE user_id = ? AND status = ? ORDER BY deadline ASC' 

        return new Promise((resolve, reject) => { //promise  com a resposta
            con.query(query, [id, status], (err, result) => { //função que realiza a busca em segundo plano da aplicação
             err ? reject(err) : resolve(result);
            }) 
        });
    } else {
        const query = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline ASC'

        return new Promise((resolve, reject) => { //promise  com a resposta
            con.query(query, [id], (err, result) => { //função que realiza a busca em segundo plano da aplicação
             err ? reject(err) : resolve(result);
            }) 
        });
    }
}

export async function getTasksInfos(id) {
    /*
    getTasksInfos(id) executa algumas querys no banco de dados para resgatar alguns dados estatísticos sobre as tarefas do usuário
    */

    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const queryTotal = 'SELECT COUNT(*) as total FROM tasks WHERE user_id = ?';
    const queryPendentes = 'SELECT COUNT(*) as pendentes FROM tasks WHERE user_id = ? AND status != "concluida" AND status != "abandonada" AND deadline >= CURDATE()';
    const queryToday = 'SELECT COUNT(*) as today FROM tasks WHERE user_id = ? AND deadline = CURDATE()';

    try {
        // Usando a função wrapper
        const totalResult = await new Promise((resolve, reject) => {
            con.query(queryTotal, [id], (err, result) => {
                err ? reject(err) : resolve(result)
            })
        });
        const pendentesResult = await new Promise((resolve, reject) => {
            con.query(queryPendentes, [id], (err, result) => {
                err ? reject(err) : resolve(result)
            })
        });     
        const todayResult = await new Promise((resolve, reject) => {
            con.query(queryToday, [id], (err, result) => {
                err ? reject(err) : resolve(result)
            })
        });   
                
        return {
            total: totalResult[0].total,
            pendentes: pendentesResult[0].pendentes,
            today: todayResult[0].today
        };
        
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

export async function readLatestsTasks(id){
    /* 
    readLatestsTasks(id) essa função retorna as 5 tarefas no banco de dados com a deadline mais próxima de ser atingida, ignorando as de dias anteriores
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const query = 'SELECT name, deadline, status FROM tasks WHERE user_id = ? AND deadline >= CURDATE() ORDER BY deadline ASC LIMIT 5'

    return new Promise((resolve, reject) => { //promise  com a resposta
        con.query(query, [id], (err, result) => { //função que realiza a busca em segundo plano da aplicação
         err ? reject(err) : resolve(result);
        }) 
    });
}

export async function readTask(id, userId) {
    /*
    readTask(id) recebe o id de uma tarefa e retorna a sua instância no banco
    */
    const con = await db;
    await createTable();

    //resgata o id do proprietario da tarefa
    const queryRead = 'SELECT * FROM tasks WHERE id = ?';
    const taskData = await new Promise((resolve, reject) => {
        con.query(queryRead, [id], (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })
    const taskUser = (taskData[0].user_id);

    //verifica se o user da requisição é dono da tarefa
    if (taskUser === userId){ 
        const query = 'SELECT * FROM tasks WHERE id = ?';

        return new Promise((resolve, reject) => {
            con.query(query, [id], (err, result) => {
                err ? reject(err) : resolve(formatedResult(result));
            })
        })
    } else {
        return Promise.reject({ 
            status: 403, 
            error: "Você não tem autorização para ler essa tarefa" 
        });
    }
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
        newTask.urgency,
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

export async function updateTask(id, updatedTask, userId) {
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

    //verifica se o usuário do request é dono da tarefa
    const taskUser = (taskNow[0].user_id);

    if (taskUser === userId) {
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
    } else {
        return Promise.reject({ 
            status: 403, 
            error: "Você não tem autorização para manipular essa tarefa" 
        });
    }
}

export async function deleteTask(id, userId) {
    /*
    deleteTask(id) recebe o id da tarefa e exclui a instância do banco
    */
    const con = await db; //inicializa o banco
    await createTable() //verifica se a tabela esta criada

    const queryRead = 'SELECT * FROM tasks WHERE id = ?';
    const taskData = await new Promise((resolve, reject) => {
        con.query(queryRead, [id], (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })
    const taskUser = (taskData[0].user_id);

    if (taskUser === userId){
        const query = 'DELETE FROM tasks WHERE id = ?';

        return new Promise((resolve, reject) => {
            con.query(query, [id], (err, result) => {
                err ? reject(err) : resolve(result);
            });
        })
    } else {
        return Promise.reject({ 
            status: 403, 
            error: "Você não tem autorização para manipular essa tarefa" 
        });
    }
}