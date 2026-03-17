import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const taskPath =  __dirname + "/../tasks.json";
console.log(taskPath)

const router = express.Router();

// GET "/tasks" - Lista todas as tarefas 
router.get('/', function (req, res) {
    fs.readFile( taskPath, 'utf8', function (err, data) {
      if (err) {
         res.status(500).end(JSON.stringify({ error: "Erro ao ler o arquivo" }));
         return;
      }
      res.end( data );
   });
 })
 
// GET "/tasks/:id" - Filtra uma tarefa específica
router.get('/:id', function (req, res) {
   fs.readFile(taskPath, 'utf8', function (err, data) {
      if (err) {
         res.status(500).end(JSON.stringify({ error: "Erro ao ler o arquivo" }));
         return;
      }
      
      const taskList = JSON.parse(data); 
      var task = taskList.tasks.find(t => t.id === parseInt(req.params.id));
 
      if(task){
         res.end(JSON.stringify(task));
      } else {
         res.status(404).end(JSON.stringify({ error: "Task não encontrada" }));
      }
   });
})

export default router;