import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, updateUser, getUserData, verifyLogin } from '../database/querys/manipulateUsers.js'
import { authJwt } from '../middleware/authJwt.js'

const router = express.Router();

// GET "auth/me" - Retorna os dados do usuário conetado atualmente, a partir do token passados
router.get('/me', authJwt, async function (req, res) {
    try {
        const userToken = req.headers['authorization'].split(' ')[1];
        const myUser = await getUserData(userToken);
        
        res.status(200).json({
            message:"Dados do usuário retornados com sucessos",
            user: myUser
        });
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).json({
            mensagem: "Falha ao buscar os dados do usuário",
            error: error
        });
    }
});

//POST "auth/register" - Registra um novo usuário no banco
router.post('/register', async function(req,res) {
    //validação básica dos campos
    if (req.body.username.length > 50 || !req.body.username) {
        return res.status(400).json({ 
           error: "Nome de usuário deve ser informado e não ultrapassar o limite de 50 caracteres"
        });
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex para validar o email
    if (!regex.test(req.body.email)) {
        return res.status(400).json({ 
           error: "O email não é válido. Utilize o formato: nome@email.com"
        });
    }
    if (req.body.email.length > 255 ) {
        return res.status(400).json({ 
           error: "O email ultrapassa o limite de 255 caracteres"
        });
    }
    if (req.body.password.length > 50 || !req.body.password) {
        return res.status(400).json({ 
           error: "A senha deve ser informada e não pode ultrapassar o limite de 50 caracteres"
        });
    }
    if (req.body.confirmPassword !== req.body.password) {
        return res.status(400).json({ 
           error: "As senhas não conferem"
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

//POST "auth/login" - Realiza o login de um usuário
router.post('/login', async function (req, res) {

    //validação básica dos campos
    if (!req.body.email) {
        return res.status(400).json({ 
           error: "O email deve ser fornecdio"
        });
    }
    if (!req.body.password) {
        return res.status(400).json({ 
           error: "A senha deve ser informada"
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = {
        email: email,
        password: password
    }

    const userData = await verifyLogin(user); //valida os dados passados

    // Verifica se houve erro no login
    if (userData.error) {
        return res.status(401).json({ 
            error: userData.error 
        });
    }

    const accessToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15m' }); //gera o token 

    return res.json({ accessToken }); //retorna o token
})

// PUT "auth/edit" - Edita os dados do usuário conetado atualmente, a partir do token passados
router.put('/edit', authJwt, async function (req, res) {
    const userToken = req.headers['authorization'].split(' ')[1];
    const data = await getUserData(userToken);
    const userId = data.id;
    
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = {
        id: userId, //recebe o id do user logado
        username: req.body.username || null,
        email: req.body.email || null,
        password: hashedPassword || null
    };

    updateUser(newUser)
        .then( result => {
            res.status(200).json({ 
                mensagem: "Usuário atualizado com sucesso!",
                task: result 
            });
        })
        .catch(error => {
            res.status(500).json({ 
                error: "Erro ao editar o usuário",
                detalhe: error.message 
             })
        })
})

// DELETE "auth/delete" - Deleta o usuário contectado atualmente, a partir do token passado
router.delete('/delete', authJwt, async function(req, res) {
    //buscando o id do usuário
    const userToken = req.headers['authorization'].split(' ')[1];
    const data = await getUserData(userToken);
    const userId = data.id;

    deleteUser(userId)
    .then(result => {
        res.status(200).json({ 
            mensagem: "Usuário deletado com sucesso!",
            task: result 
        });
     })
     .catch(error => {
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ 
            error: "Erro ao deletar o usuário",
            detalhe: error.message 
        })
     });
})

export default router;