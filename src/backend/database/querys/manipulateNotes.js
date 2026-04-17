import db from '../db.js';

// -- Funções de validação --

async function createTable() {
    /*
    createTable() função que cria a tabela no banco para armazenar as tasks. Caso já exista no banco essa tabela, nada é criado. 
    */
    const con = await db;

    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS notes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id VARCHAR(10) NOT NULL,
            content VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
        con.query(qry, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log("✅ Table 'notes' created/verified!");
                resolve(result);
            }
        });
    })
}

// -- Manipulações no banco --

export async function readNotes(id){
    const con = await db;
    await createTable() 

    const query = "SELECT * FROM notes WHERE user_id = ?"

    return new Promise((resolve, reject) => {
        con.query(query, [id], (err, result) => {
            err ? reject(err) : resolve(result)
        })
    })
}

export async function readLatestNotes(id){
    const con = await db;
    await createTable() 

    const query = "SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC LIMIT 3"
    
    return new Promise((resolve, reject) => {
        con.query(query, [id], (err, result) => {
            err ? reject(err) : resolve(result)
        })
    })
}

export async function createNote(newNote) {
    const con = await db;
    await createTable() 

    const query = 'INSERT INTO notes (user_id, content, created_at) VALUES (?, ?, ?)'
    const values = [
        newNote.user_id,
        newNote.content,
        newNote.created_att || new Date()
    ];

    return new Promise((resolve, reject) => {
        con.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: result.insertId,
                    ...newNote,
                })
            }
        })
    })
}

export async function deleteNote(noteId, userId) {
    const con = await db; 
    await createTable()

    const queryRead = 'SELECT * FROM notes WHERE id = ?';
    const taskData = await new Promise((resolve, reject) => {
        con.query(queryRead, [noteId], (err, result) => {
            err ? reject(err) : resolve(result);
        })
    })
    const taskUser = (taskData[0].user_id); //recupera qual o id do usuário dono da nota

    if (taskUser === userId){
        const query = 'DELETE FROM notes WHERE id = ?';

        return new Promise((resolve, reject) => {
            con.query(query, [noteId], (err, result) => {
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