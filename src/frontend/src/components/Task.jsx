import { Box, Typography, ThemeProvider } from '@mui/material';
import theme from '../theme/theme';

function Task(props){
  const urgencyStyle = props.urgency === 'alta' ? 800 : 400;
  const isAbandonada = props.status === 'abandonada' ? 'done' : 'text';
  const dateISO = props.deadline;
    const date = new Date(dateISO);
    const dataFormatada = date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

    return(
      <ThemeProvider theme={theme}>
        <Box sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr', // Ajuste os valores conforme necessário
          alignItems: 'center',
          gap: 2,
          padding: 2,
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0, // Permite truncar se necessário
          }}>
            <Typography variant={isAbandonada} noWrap><b>{props.name}</b></Typography>
            <Typography variant={isAbandonada}>{props.description}</Typography>
          </Box>
          
          <Typography variant={isAbandonada} style={urgencyStyle[props.urgency]} sx={{ width:'100%', textAlign:'center', fontWeight: urgencyStyle}}> 
            {props.urgency} 
          </Typography>
          
          <Typography variant={isAbandonada} sx={{ width:'100%', textAlign:'center'}}> {dataFormatada} </Typography>
          
          <a href={`/tasks/edit/${props.id}`} style={{marginBottom:'16px', width: '100%', textAlign:'center' }} > <i className="fa-solid fa-pencil"></i> </a>
        </Box>
        </ThemeProvider>
    )
}

export default Task;