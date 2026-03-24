import express from 'express';
import { readTasks, readTask, createTask, updateTask, deleteTask } from '../database/querys/manipulateTasks.js'
import { getUserData } from '../database/querys/manipulateUsers.js'
import { authJwt } from '../middleware/authJwt.js'

const router = express.Router();

// GET "/tasks" - Lista todas as tarefas de um usuário
router.get('/', authJwt, async function (req, res) {
   
   //busca o id do usuário
   const userToken = req.headers['authorization'].split(' ')[1];
   const data = await getUserData(userToken);
   const id = data.id //armazena qual o id do usuário

   readTasks(id)
      .then(result => {
         if (result.length === 0) {
            res.status(200).json({ 
               mensagem: `O usuário ${data.username} não tem nenhuma tarefa`,
            });
         } else {
            res.status(200).json({ 
               mensagem: "Lista de tasks do usuário retornadas com sucesso!",
               task: result 
            });
         }
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
router.get('/:id', authJwt, async function (req, res) {
   const taskId = req.params.id;
   
   //busca o id do usuário
   const userToken = req.headers['authorization'].split(' ')[1];
   const data = await getUserData(userToken);
   const userId = data.id //armazena qual o id do usuário

   readTask(taskId, userId)
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
         if (error.status === 403) {
            res.status(403).json({ error: error.error });
         } else {
            res.status(500).json({ 
               error: "Erro ao resgatar a tarefa",
               detalhe: error.message 
            })
         }
      });
})

// POST "tasks/create" - Adiciona uma nova tarefa
router.post('/create', authJwt, async function(req, res) {

   //busca o id do usuário que esta criando a tarefa
   const userToken = req.headers['authorization'].split(' ')[1];
   const data = await getUserData(userToken);
   const userId = data.id //armazena qual o id do usuário

   //Objeto da nova tarefa com os dados passados
   const newTask = {
      user_id: userId,
      name: req.body.name,
      description: req.body.description,
      deadline: req.body.deadline,
      urgency: req.body.urgency,
      status: req.body.status || 'pendente',
      created_at: new Date()
   };
   
   // Validação básica dos campos
   if (!newTask.user_id) {
      return res.status(400).json({ 
         error: "Id do usuário é obrigatório",
      });
   }
   if (!newTask.name) {
      return res.status(400).json({ 
         error: "Nome é um campo obrigatório",
      });
   }
   if (newTask.description.length > 80) {
      return res.status(400).json({ 
         error: "Descrição ultrapassa o limite de 80 caracteres",
      });
   }
   const deadlineDate = new Date(newTask.deadline);
   const dataAtual = new Date();
   if (deadlineDate < dataAtual) {
      return res.status(400).json({ 
         error: "A data do deadline já passou. Escolha uma data futura.",
      });
   }

   //chama a função para adicionar a tarefa no banco
   createTask(newTask)
      .then(result => {
         res.status(201).json({ 
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
router.delete('/:id', authJwt, async function(req, res) {
   const taskId = req.params.id;

   //busca o id do usuário
   const userToken = req.headers['authorization'].split(' ')[1];
   const data = await getUserData(userToken);
   const userId = data.id //armazena qual o id do usuário

   deleteTask(taskId, userId) 
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
         console.error("Erro ao deletar task:", error);
         if (error.status === 403) {
            res.status(403).json({ error: error.error });
         } else {
            res.status(500).json({ 
               error: "Erro ao deletar a tarefa",
               detalhe: error.message 
            })
         }
      });
});


// PUT "tasks/editar/:id" - Edita as informações de uma tarefa 
router.put('/editar/:id', authJwt, async function(req, res) {
   const id = req.params.id
   const newTask = {
      user_id: req.body.user_id || null,
      name: req.body.name || null,
      description: req.body.description || null,
      deadline: req.body.deadline || null,
      urgency: req.body.urgency || null,
      status: req.body.status || null,
   };

   //busca o id do usuário
   const userToken = req.headers['authorization'].split(' ')[1];
   const data = await getUserData(userToken);
   const userId = data.id //armazena qual o id do usuário

   updateTask(id, newTask, userId)
   .then(result => {
      if (result.affectedRows === 0) {
         res.status(404).json({
            error: `O id ${taskId} não remete a alguma tarefa`
         })
      } else {
         res.status(200).json({ 
            mensagem: "Task atualizada com sucesso!",
            task: result 
         });
      }
   })
   .catch(error => {
      console.error("Erro ao editar task:", error);
      if (error.status === 403) {
         res.status(403).json({ error: error.error });
      } else {
         res.status(500).json({ 
            error: "Erro ao editar a tarefa",
            detalhe: error.message 
         })
      }
   });
})

export default router;