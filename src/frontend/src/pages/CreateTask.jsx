import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { Box, ThemeProvider, Typography, TextField, MenuItem, Button } from '@mui/material';
import theme from "../theme/theme";


function CreateTask() {
    const auth = localStorage.getItem('authorization');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState(dataAtual());
    const [urgency, setUrgency] = useState("Baixa");

    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")

    function dataAtual(){
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    async function handleCreateTask(){
        if (name.length > 50) {
            setError(true)
            setMessage('O nome da tarefa não pode ultrapassar 50 caracteres')
            return
        }
        if (description.length > 80) {
            setError(true)
            setMessage('A descrição da tarefa não pode ultrapassar 80 caracteres')
            return
        }
        
        if (name !== "" && description !== "" && deadline !== ""){
            const newTask = {
                name: name,
                description: description,
                deadline: deadline,
                urgency: urgency
            };

            try{
                const response = await fetch('/api/tasks/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newTask)
                });

                const data = await response.json();
                if (data.error){
                    setError(true)
                    setMessage(data.error)
                } else if (!data.task) {
                    navigate('/unauthorized')
                }else{
                    setMessage(data.mensagem);
                    console.log(data.task);
                    setDeadline(dataAtual());
                    setName("");
                    setDescription("");
                    setUrgency("baixa");
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }

        } else {
            setError(true)
            setMessage('Preencha todos os campos antes de enviar!')
        }
    }

    useEffect( () => {
        if (!auth){
            navigate('/login')
        } else {
            setToken(auth.split(" ")[1]);
            setLoading(false)
        }
    });


    if (loading) {
        return <h3>Carregando...</h3>;
    }
    return(
        <ThemeProvider theme={theme}>
            <Box sx={{ margin: { xs: '0 16px', sm: '0 32px', md: '0 64px', lg: '0 128px' } }}>
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
                    <Typography variant="h2" component="h2">Creat Task</Typography>

                    <Box> 
                        <Box sx={{ width: {xs: 250, sm: 300, md: 550}}}>

                        <TextField label='Title' type="text" maxLength={50} id="title" value={name} onChange={(e) => setName(e.target.value)}/>
                        <Typography style={{position:'relative', bottom:'20px', fontSize:'12px', color:name.length < 50 ? '#347EBF' : '#D93B3B'}}> {name.length} de 50 </Typography>
                        <TextField multiline label='Description' id="description" maxLength={80} value={description} onChange={(e) => setDescription(e.target.value)} />
                        <Typography style={{position:'relative', bottom:'20px', fontSize:'12px', color:description.length < 80 ? '#347EBF' : '#D93B3B'}}> {description.length} de 80 </Typography>
                        <TextField  type='date' label='Deadline' id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
                        <TextField select label='Urgency' id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                            <MenuItem value="Alta">Alta</MenuItem>
                            <MenuItem value="Média">Média</MenuItem>
                            <MenuItem value="Baixa">Baixa</MenuItem>
                        </TextField>

                            <Button variant="primary" onClick={handleCreateTask} style={{margin:'24px 0 42px 0'}}> Salvar </Button>
                            <Typography variant={error ? "error" : "sucess"}>{message}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default CreateTask;