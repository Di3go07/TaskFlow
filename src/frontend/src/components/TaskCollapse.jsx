import { Collapse, Button, Box, Typography, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Task from './Task';
import theme from '../theme/theme';
import Error from '../pages/Error';

function TaskCollapse(props){
    const auth = localStorage.getItem('authorization');
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [tasks, setTasks] = useState([]);
    const [mensagem, setMensagem] = useState('')
    const [open, setOpen] = useState(false);
    const [loading,setLoading] = useState(false);
    const [error, setError] = useState(false)
    const backgroundColor = `tasks.${props.status}`;
    const icon = `fa-solid ${props.icon}`;

    async function getUserTasks(token) {
        /*
        getUserTasks(token) recebe o token como parâmetro para validar a requisição da API. 
        Seu request busca todas as tarefas do banco que armazanem o id do usuário cadastrado no campo "user_id". 
        O retorno é uma lista de objetos das tarefas e é armazenado na variável "tasks".
        */
        try {
            const response = await fetch(`/api/tasks/?status=${props.status}`, {
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

    useEffect(() => {
        const fetchUserTasks = async () => {
            const userToken = auth.split(" ")[1];

            const base64Url = userToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            setUser(payload); //retorna as informações principais do usuário a partir do token dele

            const data = await getUserTasks(userToken);
            if (data){
                if (data.mensagem === `O usuário ${payload.username} não tem nenhuma tarefa com o ${props.status}`){ 
                    setMensagem(`Você ainda não tem nenhuma task marcada como ${props.status}`);
                } else if (data.mensagem && data.mensagem !== "Lista de tasks do usuário retornadas com sucesso!") {
                    setError({status: 404, message: data.mensagem});
                } else if (data.mensagem === "Lista de tasks do usuário retornadas com sucesso!"){
                    setTasks(data.task)
                } else {
                    navigate('/unauthorized')
                }
            }
        };

        fetchUserTasks();
        setLoading(false)
    }, [])

    const handleClick = () => {
      setOpen(!open);
    };

    if (loading) {
        return <h3>Carregando...</h3>;
    }
    if(error){
        return (<div>
            <h3> Error {error.status} </h3>
            <p> {error.message} </p>
        </div>);
    }

    return(
        <ThemeProvider theme={theme}>
            <Box sx={{marginBottom:'24px'}}> 
                <Box onClick={handleClick} sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    bgcolor:backgroundColor,
                    borderRadius: '10px',
                    padding: 2,
                    cursor: 'pointer',
                }}> 
                    <Box sx={{display:'flex', gap:2, alignItems:'center'}}>
                        <i class={icon} style={{color:'white'}}></i>
                        <Typography variant="title">{props.title}</Typography>
                    </Box>
                    <Typography variant="title" style={{fontSize:20}}> {open ? '\u25C4' : '\u25BC'}</Typography>

                </Box>
                <Collapse in={open}>
                    <Box sx={{margin:'0 42px'}}>
                        <Typography variant="text" style={{padding:'24px'}}> {mensagem} </Typography>
                        {tasks.map(task => <Task name={task.name} description={task.description} urgency={task.urgency} deadline={task.deadline} id={task.id} status={props.status}/>)}
                    </Box>
                </Collapse>
            </Box>
        </ThemeProvider>
    );
}

export default TaskCollapse