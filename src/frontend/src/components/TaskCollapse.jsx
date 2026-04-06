import { Collapse, Button, Box, Typography, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import theme from '../theme/theme';

function TaskCollapse(props){
    const [open, setOpen] = useState(false);;
    const backgroundColor = `tasks.${props.status}`;
    const colorWithOpacity = `tasks.${props.status}Opacity`;

    const handleClick = () => {
      setOpen(!open);
    };

    return(
        <ThemeProvider theme={theme}>
            <Box sx={{marginBottom:'24px'}}> 
                <Box onClick={handleClick} sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    bgcolor:backgroundColor,
                    padding: 2,
                    cursor: 'pointer'
                }}>
                    <Typography variant="title">{props.title}</Typography>
                    <Typography variant="title" style={{fontSize:20}}> {open ? '\u25C4' : '\u25BC'}</Typography>

                </Box>
                <Collapse in={open}>
                    <Box sx={{padding: 2, backgroundColor:colorWithOpacity, borderRadius:'0 0 10px 10px'}}>
                        <p>Este é o conteúdo que será expandido ou recolhido!</p>
                        <p>Você pode colocar qualquer componente React aqui dentro.</p>
                    </Box>
                </Collapse>
            </Box>
        </ThemeProvider>
    );
}

export default TaskCollapse