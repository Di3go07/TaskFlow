import express from 'express'
import { authJwt } from '../middleware/authJwt.js'
import { getUserData } from '../database/querys/manipulateUsers.js';
import { createNote, readNotes, deleteNote, readLatestNotes } from '../database/querys/manipulateNotes.js';

const router = express.Router();

//GET "/notes/all" - Retorna todas as notas de um usuário
router.get('/all', authJwt, async function (req, res) {
    
    const userToken = req.headers['authorization'].split(' ')[1];
    const data = await getUserData(userToken);
    const userId = data.id

    readNotes(userId)
        .then(result => {
            if (result.length === 0) {
                res.status(200).json({ 
                   mensagem: `O usuário ${data.username} não tem nenhuma nota`,
                });
            } else {
                res.status(200).json({ 
                    mensagem: "Lista de notas do usuário retornadas com sucesso!",
                    notes: result 
                 });  
            }
        })
        .catch(error => {
            console.error("Erro ao resgatar notas:", error);
            res.status(500).json({ 
               error: "Erro ao resgatar a lista de notas",
               detalhe: error.message 
            });
         });
})

//GET "/notes/latests" - Retorna as três últimas notas do usuário
router.get('/latests', authJwt, async function (req, res) {
    
    const userToken = req.headers['authorization'].split(' ')[1];
    const data = await getUserData(userToken);
    const userId = data.id

    readLatestNotes(userId)
        .then(result => {
            if (result.length === 0) {
                res.status(200).json({ 
                   mensagem: `O usuário ${data.username} não tem nenhuma nota`,
                });
            } else {
                res.status(200).json({ 
                    mensagem: "Lista de últimas notas do usuário retornadas com sucesso!",
                    notes: result 
                 });  
            }
        })
        .catch(error => {
            console.error("Erro ao resgatar notas:", error);
            res.status(500).json({ 
               error: "Erro ao resgatar a lista de notas",
               detalhe: error.message 
            });
         });
})

//POST "/notes/create" - Adciona uma nova nota
router.post('/create', authJwt, async function(req, res) {

    //busca o id do usuário que esta criando a nota a partir do token passado na Header
    const userToken = req.headers['authorization'].split(' ')[1];
    const data = await getUserData(userToken);
    const userId = data.id //armazena qual o id do usuário

    //cria a instância da classe para adicionar ao banco
    const newNote = {
        user_id: userId,
        content: req.body.content,
        created_at: new Date()
    };

    //Validação dos campos
    if (!newNote.user_id) {
        return res.status(400).json({ 
        error: "Id do usuário é obrigatório",
        });
    };
    if (!newNote.content || newNote.content.length >= 50) {
        return res.status(400).json({ 
           error: "Conteúdo é um campo obrigatório e deve conter até 50 caracteres",
        });
    };

    //chama a função para adicionar ao banco
    createNote(newNote)
        .then(result => {
            res.status(201).json({
                mensagem: "Nota adicionada com sucesso",
                note: result
            })
        })
        .catch(error => {
            console.error("Erro ao criar nota:", error);
            res.status(500).json({ 
               error: "Erro ao adicionar a nota",
               detalhe: error.message 
            });
        })
})

// DELETE "notes/:id" - Deleta uma nota a partir de seu id
router.delete('/:id', authJwt, async function (req, res) {
    const noteId = req.params.id;

    const userToken = req.headers['authorization'].split(' ')[1];
    const data = await getUserData(userToken);
    const userId = data.id

    deleteNote(noteId, userId)
        .then(result => {
            if (result.affectedRows === 0) {
            res.status(404).json({
                error: `O id ${taskId} não remete a alguma nota`
            })
            } else {
            res.status(200).json({ 
                mensagem: "Nota deletada com sucesso!",
                task: result 
            });
            }
        })
        .catch(error => {
            console.error("Erro ao deletar nota:", error);
            if (error.status === 403) {
            res.status(403).json({ error: error.error });
            } else {
            res.status(500).json({ 
                error: "Erro ao deletar a nota",
                detalhe: error.message 
            })
            }
        });
})

export default router