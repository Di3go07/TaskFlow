import express from 'express';
import bcrypt from 'bcrypt';
import { createUser, readUsers } from '../database/querys/manipulateUsers.js'

const router = express.Router();

//GET "auth/users" - Retorna todos os usuários
router.get('/users', function(req,res) {
    readUsers()
    .then(result => {
       res.status(200).json({ 
          mensagem: "Lista de usuários retornada com sucesso!",
          task: result 
       });
    })
    .catch(error => {
       console.error("Erro ao resgatar task:", error);
       res.status(500).json({ 
          error: "Erro ao resgatar a lista de usuários",
          detalhe: error.message 
       });
    });
})

// GET "auth/me" - Retorna os dados do usuário conetado atualmente, a partir do token passados

//POST "auth/register" - Registra um novo usuário no banco
router.post('/register', async function(req,res) {
    //validação básica dos campos
    if (req.body.username.length > 50 || !req.body.username) {
        return res.status(400).json({ 
           error: "Nome de usuário deve ser informado e não ultrapassar o limite de 50 caracteres"
        });
    }
    if (req.body.email.length > 255) {
        return res.status(400).json({ 
           error: "O email ultrapassa o limite de 255 caracteres"
        });
    }
    if (req.body.password.length > 50 || !req.body.password) {
        return res.status(400).json({ 
           error: "A senha deve ser informada e não pode ultrapassar o limite de 50 caracteres"
        });
    }

    //criptografia da senha
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    //Objeto do novo usuário 
    const newUser = {
        username: req.body.username,
        email: req.body.email || null,
        password: hashedPassword,  
        created_at: new Date()
    };

    createUser(newUser)
        .then(result => {
            res.status(201).json({ 
            mensagem: "User registrado com sucesso!",
            task: newUser 
            });
        })
        .catch(error => {
            console.error("Erro ao registrar usuário:", error);

            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ 
                    error: "Email ou username já está em uso"
                });
            }

            res.status(500).json({ 
                error: "Erro ao registrar o novo usuário",
                detalhe: error.message 
            });
        });
})

// PUT "auth/edit" - Edita os dados do usuário conetado atualmente, a partir do token passados

// DELETE "auth/delete" - Deleta o usuário contectado atualmente, a partir do token passado

export default router;