import { Box, ThemeProvider, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import theme from "../theme/theme"

function Note(props){
    const auth = localStorage.getItem('authorization');
    const [token, setToken] = useState('');
    const [noteDate, setNoteDate] = useState('');

    useEffect( () => {
        if (!auth){
            navigate('/login')
        } else {
            setToken(auth.split(" ")[1]);
        }

        const creationDate = new Date(props.date);
        const formatedDate = creationDate.toLocaleDateString('pt-BR');
        setNoteDate(formatedDate); //formata a data de criação para ser renderizada
    });

    async function handleDeleteNote(id){
        const confirmacao = confirm("Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.");

        if (confirmacao) {
            try{
                const response = await fetch(`/api/notes/${id}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                });

                const data = await response.json();
                if (data.error){
                    console.log(data.error)
                }else{
                  console.log(data.mensagem);
                  window.location.reload();
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }
    }


    return(
        <ThemeProvider theme={theme}>
            <Box sx={{
                width: '250px',
                backgroundColor: '#E3F2FD',  
                padding: '16px',
                margin: '24px',
                borderRadius: '2px',
                boxShadow: '0px 10px 5px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '10px 10px 5px rgba(0,0,0,0.15)'
                }
            }}>
                <Box 
                    component="i"
                    className="fa-solid fa-xmark"
                    sx={{
                        display: 'flex',          
                        justifyContent: 'flex-end',
                        width: '100%',
                        fontSize: '18px',
                        color: '#666',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                        '&:hover': {
                            color: '#f44336'  
                        }
                    }}
                    onClick={() => handleDeleteNote(props.id)}
                />
                
                <Typography variant="note" sx={{ 
                    wordWrap: 'break-word',
                    display: 'block',
                    p: '12px',
                    minHeight: '180px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {props.content}
                </Typography>

                <Typography variant='small'>
                    Criada em: {noteDate}
                </Typography>
            </Box>
        </ThemeProvider>
    )
}

export default Note