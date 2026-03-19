import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import { readTasks, readTask, createTask, deleteTask } from '../database/querys/manipulateTasks.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const taskPath =  __dirname + "/../tasks.json";
console.log(taskPath)

const router = express.Router();

// GET "/tasks" - Lista todas as tarefas 
router.get('/', function (req, res) {
   readTasks()
      .then(result => {
         res.status(200).json({ 
            mensagem: "Lista de tasks retornadas com sucesso!",
            task: result 
         });
      })
      .catch(error => {
         console.error("Erro ao resgatar task:", error);
         res.status(500).json({ 
            error: "Erro ao resgatar a lista de tarefa",
            detalhe: error.message 
         });
      });
})
 
// GET "/tasks/:id" - Filtra uma tarefa específica
router.get('/:id', function (req, res) {
   const taskId = req.params.id;

   readTask(taskId)
      .then(result => {
         if (result.length === 0) {
            res.status(404).json({ 
               error: `O id ${taskId} não remete a alguma tarefa`,
            });
         } else {
            res.status(200).json({ 
               mensagem: "Task retornada com sucesso!",
               task: result 
            });
         }
      })
      .catch(error => {
         console.error("Erro ao resgatar task:", error);
         res.status(500).json({ 
            error: "Erro ao resgatar a tarefa",
            detalhe: error.message 
         });
      });
})

// POST "tasks/create" - Adiciona uma nova tarefa
router.post('/create', function(req, res) {

   //Objeto da nova tarefa com os dados passados
   const newTask = {
      user_id: req.body.user_id,
      name: req.body.name,
      description: req.body.description,
      deadline: req.body.deadline,
      urgency: req.body.urgency,
      status: req.body.status || 'pendente',
      created_at: new Date()
   };
   
   // Validação básica dos campos
   if (!newTask.user_id) {
      return res.status(500).json({ 
         error: "Id do usuário é obrigatório",
      });
   }
   if (!newTask.name) {
      return res.status(500).json({ 
         error: "Nome é um campo obrigatório",
      });
   }
   if (newTask.description.length > 80) {
      return res.status(500).json({ 
         error: "Descrição ultrapassa o limite de 80 caracteres",
      });
   }
   const deadlineDate = new Date(newTask.deadline);
   const dataAtual = new Date();
   if (deadlineDate < dataAtual) {
      return res.status(500).json({ 
         error: "A data do deadline já passou. Escolha uma data futura.",
      });
   }

   //chama a função para adicionar a tarefa no banco
   createTask(newTask)
      .then(result => {
         res.status(200).json({ 
            mensagem: "Task adicionada com sucesso!",
            task: result 
         });
      })
      .catch(error => {
         console.error("Erro ao criar task:", error);
         res.status(500).json({ 
            error: "Erro ao adicionar a tarefa",
            detalhe: error.message 
         });
      });
})

// DELETE "tasks/:id" - Deleta uma tarefa 
router.delete('/:id', function(req, res) {
   const taskId = req.params.id;

   deleteTask(taskId) 
      .then(result => {
         if (result.affectedRows === 0) {
            res.status(404).json({
               error: `O id ${taskId} não remete a alguma tarefa`
            })
         } else {
            res.status(200).json({ 
               mensagem: "Task deletada com sucesso!",
               task: result 
            });
         }
      })
      .catch(error => {
         console.error("Erro ao criar task:", error);
         res.status(500).json({ 
            error: "Erro ao deletar a tarefa",
            detalhe: error.message 
         });
      });
})

// PUT "tasks/editar/:id" - Edita as informações de uma tarefa 
router.put('/editar/:id', function(req, res) {
   //adicionar função
})

export default router;