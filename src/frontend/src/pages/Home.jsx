import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, ThemeProvider } from '@mui/material';
import theme from '../theme/theme';
import Header from '../components/Header';
import BoxInfos from '../components/BoxInfos';
import LatestTask from '../components/LatestTask';

function Home(){
    const navigate = useNavigate();
    const auth = localStorage.getItem('authorization');
    const [token, setToken] = useState("");
    const [user, setUser] = useState("");
    const [tasks, setTasks] = useState([]);
    const [infos, setInfos] = useState({
        total: 0,
        pendentes: 0,
        today: 0
    })
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

    async function getTasksData(token) {
        try{
            const response = await fetch('api/tasks/infos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            return data;
        } catch(error){
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
            const response = await fetch('api/tasks/latests', {
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

    useEffect( () =>  {
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

        const fetchTaskInfos = async () => {
            const userToken = auth.split(" ")[1];
            const data = await getTasksData(userToken);
            if (data){
                setInfos(data.result)
            }
        }

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

        fetchTaskInfos()
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
            <Box sx={{ margin: { xs: '0 16px', sm: '0 32px', md: '0 64px', lg: '0 128px' } }}>
                <Header />

                <Box
                    sx={{
                    display:"flex",
                    flexDirection:'column',
                    margin: { sm: '0', lg:'0 42px'}
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',  
                        maxWidth: { sm: '100vw', lg: '35vw' },
                        margin: { sm: '0', lg:'0 0 0 42px'} 
                    }}>
                        <Typography variant="h2" component="h2" sx={{position: 'relative', bottom: 15}}>
                            {infos.today === 0 ? `Tire um dia de folga, ${user.username}` : infos.total == 0 ? `Escreva sua primeira tarefa, ${user.username}` : `Bem vindo, ${user.username}. Quais as tarefas de hoje?` }
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', lg: 'row' },
                            justifyContent: 'space-between',
                            margin: '24px 0',
                        }}>
                            <BoxInfos color='#347EBF' text='Total' value={infos.total} />
                            <BoxInfos color='#B23A3A' text='Pendentes' value={infos.pendentes} />
                            <BoxInfos color='#347EBF' text='Hoje' value={infos.today} />
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            bgcolor: 'background.body', 
                            margin: '42px 0',
                            boxShadow: 5,
                            p: '24px 42px 42px 42px',
                            borderRadius: '25px'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignContent: 'center'
                            }}>
                                <Typography variant="h2" component="h2"> Next tasks </Typography>
                                <Typography sx={{margin:'24px 0'}}> <a href='/tasks'>View all</a> </Typography>
                            </Box>
                            {tasks.map( task => <LatestTask id={task.id} name={task.name} deadline={task.deadline} status={task.status} /> )}
                        </Box>
                    </Box>

                </Box>
            </Box>
        </ThemeProvider>
     )
}

export default Home;

