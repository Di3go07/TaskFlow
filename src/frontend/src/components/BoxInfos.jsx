import {Box, Typography, ThemeProvider } from '@mui/material';
import theme from '../theme/theme';

function BoxInfos(props){
    return(
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: props.color,
                color: '#fff',
                minWidth: '125px',
                p: 3,
                borderRadius: '25px', 
                boxShadow: 5,
            }}>
                <Typography sx={{fontSize:'18px'}}> {props.text} </Typography>
                <Typography sx={{fontSize:'42px', fontWeight:600}}> {props.value} </Typography>
            </Box>
        </ThemeProvider>
    );
}

export default BoxInfos