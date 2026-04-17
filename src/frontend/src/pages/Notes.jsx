import { Box, ThemeProvider, Typography, Button, Dialog, TextField, DialogActions } from "@mui/material";
import theme from "../theme/theme";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Note from "../components/Note";
import { useEffect, useState } from "react";

function Notes(){
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState([]);
    const [message, setMessage] = useState('')

    const [token, setToken] = useState('');
    const [open, setOpen] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [error, setError] = useState(false)
    const [loading,setLoading] = useState(false);

    const auth = localStorage.getItem('authorization');
    const navigate = useNavigate();


    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    async function handleCreateNote() {
        if (content.length > 50) {
            setError(true)
            setMessage('O nome da tarefa não pode ultrapassar 50 caracteres')
            return
        }

        if (content !== ""){
            const newNote = {
                content: content
            };

            try{
                const response = await fetch('/api/notes/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newNote)
                });

                const data = await response.json();
                if (data.error){
                    setError(true)
                    setMessage(data.error)
                } else if (!data.note) {
                    navigate('/unauthorized')
                } else {
                    setContent("");
                    setOpen(false);
                    window.location.reload();
                }
                    
            } catch (error){
                console.error('Erro na requisição:', error);
            }
        } else {
            setError(true)
            setMessage('Preencha todos os campos antes de enviar!')
        }
    }

    async function getUserNotes(token) {
        try {
            const response = await fetch('/api/notes/all', {
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
        const fetchUserNotes = async () => {
            setLoading(true)

            if (!auth) {
                navigate('/login');
                return;
            } else {
                setToken(auth.split(" ")[1]);
            }

            const userToken = auth.split(" ")[1]; //resgata o token do usuário

            //armazena os dados do usuário a partir do seu token
            const base64Url = userToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64)); 

            //busca as notas do usuário
            const data = await getUserNotes(userToken);
            if (data){
                if (data.mensagem === `O usuário ${payload.username} não tem nenhuma nota`) {
                    setMensagem('Escreva a sua primeira nota e preencha o quadro');
                } else if (!data.notes && data.mensagem !== 'Lista de notas do usuário retornadas com sucesso!') {
                    navigate('/unauthorized')
                } else {
                    console.log(data.notes)
                    setNotes(data.notes)
                    setLoading(false);
                }
            } else {
                navigate('/unauthorized')
            }
        }

        fetchUserNotes();
    }, [])

    if (loading) {
        return <h3>Carregando...</h3>;
    }
    return(
        <ThemeProvider theme={theme}>
            <Box sx={{ margin: { xs: '0', sm: '0 32px', md: '0 64px', lg: '0 128px' } }}>
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
                    <Typography variant="h2" component="h2">Notes board</Typography>  

                    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Button variant="primary" onClick={handleClickOpen} style={{margin:'24px 0 42px 0', maxWidth:'200px'}}> Nova nota </Button>
                    </Box>  

                    <Box sx={{
                        display:'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                        marginTop: '42px'
                    }}>
                        {notes.map(note => <Note id={note.id} content={note.content} date={note.created_at}/>)}
                    </Box>

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                        sx={{
                            '& .MuiDialog-paper': {
                                minWidth: '350px',
                                minHeight: '400px',
                                p: 5,
                                display: 'flex',
                                flexDirection:'column',
                                justifyContent: 'space-around',
                                alignItems: 'center'
                            }                        
                        }}
                    >
                        <Typography variant="h2" component="h2">Create Note</Typography>  

                        <Typography variant={error ? "error" : "sucess"}>{message}</Typography>

                        <TextField multiline label='Content' id="content" maxLength={50} value={content} onChange={(e) => setContent(e.target.value)} />

                        <DialogActions>
                            <Button onClick={handleCreateNote} variant="primary" sx={{minWidth: '200px'}} autoFocus>
                                Salvar nota
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Notes