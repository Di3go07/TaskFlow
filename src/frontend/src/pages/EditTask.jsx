import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { Box, ThemeProvider, Typography, TextField, MenuItem, Button } from '@mui/material';
import theme from "../theme/theme";

function EditTask() {
    const taskId = useParams().id;
    const auth = localStorage.getItem('authorization');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState("");
    
    const [task, setTask] = useState({
        name: '',
        description: '',
        deadline: '',
        status: 'pendente',
        urgency: 'alta',
      });

    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);


    useEffect(() => {
        if (!auth){
            navigate('/login')
        } else {
            setToken(auth.split(" ")[1]);
            setLoading(false)
        }

        const token = auth.split(" ")[1];
        fetch(`/api/tasks/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error){
                if (data.error === "Você não tem autorização para ler essa tarefa"){ //protege um usuário acessar a tarefa de outro
                    console.log(data.error)
                    navigate('/forbidden');
                }
                setError(true)
                setMessage(data.error);
            }else{
                setTask(data.task[0]);
                console.log(data.task[0].deadline)
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    }, [taskId]);

    async function handleEditTask(){
        try{
            const response = await fetch(`/api/tasks/editar/${taskId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task)
            });

            const data = await response.json();
            if (data.error){
                setError(true)
                setMessage(data.error)
            }else{
                setMessage(data.mensagem);
                console.log(data.task);
            }
        } catch{
            console.error('Erro na requisição:', error);
        }
    }


    if (loading){ return (<div><p>Carregando...</p></div>)}

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{margin:'0 128px 42px 128px'}}>
                <Header/>

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

                    <Typography variant="h2" component="h2">Edit Task</Typography>

                    <Box> 
                        <Box sx={{ width: {xs: 250, sm: 300, md: 550}, padding:'24px 0'}}>
                            <TextField label='Title' type="text" maxLength={50} id="title" value={task.name} onChange={(e) => setTask(t => ({...t, name:e.target.value}))}/>
                            <TextField multiline label='Description' id="description" maxLength={80} value={task.description} onChange={(e) => setTask(t => ({...t, description:e.target.value}))} />
                            <TextField type='date' id="deadline" value={task.deadline} onChange={(e) =>  setTask(t => ({...t, deadline:e.target.value}))} />
                            <TextField
                                label="Urgency"
                                select
                                value={task.urgency}  
                                onChange={(e) => setTask(t => ({ ...t, urgency: e.target.value }))}
                                >
                                <MenuItem value="alta">Alta</MenuItem>
                                <MenuItem value="media">Média</MenuItem>
                                <MenuItem value="baixa">Baixa</MenuItem>
                            </TextField>
                            <TextField
                                label="Status"
                                select                  
                                value={task.status}
                                onChange={(e) =>
                                    setTask(t => ({ ...t, status: e.target.value }))
                                }
                            >
                                <MenuItem value="pendente">Pendente</MenuItem>
                                <MenuItem value="andamento">Em andamento</MenuItem>
                                <MenuItem value="concluida">Concluída</MenuItem>
                                <MenuItem value="abandonada">Abandonada</MenuItem>
                            </TextField>

                            <Button variant="primary" onClick={handleEditTask} style={{margin:'24px 0 42px 0'}}> Editar </Button>
                            <Typography variant={error ? "error" : "sucess"}>{message}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default EditTask;