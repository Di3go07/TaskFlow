import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Button, Box, Typography, ThemeProvider } from '@mui/material';
import theme from '../theme/theme';
import Header from '../components/Header';

function Home(){
    const navigate = useNavigate();
    const auth = localStorage.getItem('authorization');
    const [token, setToken] = useState("");
    const [user, setUser] = useState("");
    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function getUserData(token){
        /* 
        getUserData(token) recebe como parâmetro o token do usuário resgatado no localStorage. 
        A partir dele, a função faz um request ao servidor pedindo seus dados.
        A resposta é fornecida em JSON e os dados são usados para criar um objeto do usuário.
        */
        try {
            const response = await fetch('api/auth/me', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
            });

            const data = await response.json();
            return data
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    async function getUserTasks(token) {
        /*
        getUserTasks(token) recebe o token como parâmetro para validar a requisição da API. 
        Seu request busca todas as tarefas do banco que armazanem o id do usuário cadastrado no campo "user_id". 
        O retorno é uma lista de objetos das tarefas e é armazenado na variável "tasks".
        */
        try {
            const response = await fetch('api/tasks/all', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
            });

            const data = await response.json();
            return data
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    } 

    useEffect( () => {
        if (!auth){
            navigate('/login')
        } else {
            setToken(auth.split(" ")[1]);
        }

        const fetchUserData = async () => {
            const userToken = auth.split(" ")[1];
            const data = await getUserData(userToken);
            if (data) {
              if(data.message !== "Dados do usuário retornados com sucessos"){ 
               navigate("/login") //caso não retorne os dados do usuário, força o usuário à refazer o seu login
              } else {
                setUser(data.user)
                return data.user;
              }
            }
        };

        const fetchUserTasks = async () => {
            const userToken = auth.split(" ")[1];
            const user = await fetchUserData();
            const data = await getUserTasks(userToken);
            if (data){
                if (data.mensagem === `O usuário ${user.username} não tem nenhuma tarefa`){ 
                    setMensagem(<p> Você ainda não tem nenhuma task cadastrada, crie uma <a href="/tasks/create">aqui!</a> </p>);
                } else if (data.mensagem !== "Lista de tasks do usuário retornadas com sucesso!") {
                    console.log(data.mensagem);
                    setError({status: 404, message: data.mensagem});
                } 
                else {
                    setTasks(data.task)
                    console.log(data.task)
                }
            }
        };

        fetchUserData()
        fetchUserTasks()

        setLoading(false); //retira a tela de loading quando carrega tudo do banco de dados
    }, []);


    if (loading) {
        return <h3>Carregando...</h3>;
    }
    if(error){
        return <div>
            <h3> Error {error.status} </h3>
            <p> {error.message} </p>
        </div>
    }

    return(
        <ThemeProvider theme={theme}>
            <Box sx={{margin:'0 128px 42px 128px'}}>
                <Header />

                <Box
                    sx={{
                    display:"flex",
                    flexDirection:'column',
                    bgcolor: 'background.body',
                    boxShadow: 1,
                    borderRadius: 5,
                    padding: 5,
                    minWidth: 300,
                    }}
                >
                    <Typography variant="h2" component="h2">Bem vindo, {user.username}</Typography>
                </Box>
            </Box>
        </ThemeProvider>
     )
}

export default Home;

/* 
            <div className='Tasks'>
                {tasks.map(task => <Task name={task.name} description={task.description} urgency={task.urgency} deadline={task.deadline} id={task.id}/>)}
            </div>
*/