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


    return(
        <ThemeProvider theme={theme}>
            <Box sx={{
                width: '150px',
                backgroundColor: '#E3F2FD',  
                padding: '8px',
                margin: '12px 24px',
                borderRadius: '2px',
                boxShadow: '0px 10px 5px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '10px 10px 5px rgba(0,0,0,0.15)'
                }
            }}>                
                <Typography sx={{ 
                    wordWrap: 'break-word',
                    display: 'block',
                    p: '12px',
                    height: '100px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '18px'
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