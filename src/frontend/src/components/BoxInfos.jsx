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
                margin: {xs: '24px 42px', lg: '0'}
            }}>
                <Typography variant='title'> {props.text} </Typography>
                <Typography variant='number'> {props.value} </Typography>
            </Box>
        </ThemeProvider>
    );
}

export default BoxInfos