import { Box, Typography, ThemeProvider } from '@mui/material';
import theme from '../theme/theme';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Task(props){
  const auth = localStorage.getItem('authorization');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState('')
  const navigate = useNavigate();

  const urgencyText = props.status === 'concluida' ? 'Concluida' : props.status === 'abandonada' ? 'Abandonada' :props.urgency;
  const isAbandonada = props.status === 'abandonada' ? 'done' : 'text';
  const colorWithOpacity = `tasks.${props.status}Opacity`;
  const iconColor = `tasks.${props.status}Icon`;
  const taskIcon = {
    'pendente': 'fa-regular fa-clock',
    'andamento': 'fa-solid fa-play',
    'concluida': 'fa-solid fa-check',
    'abandonada': 'fa-solid fa-xmark'
  }
  
  const dateISO = props.deadline;
  const date = new Date(dateISO);
  const dataFormatada = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect( () => {
    if (!auth){
        navigate('/login')
    } else {
        setToken(auth.split(" ")[1]);
    }
  });

  async function handleDeleteTask(id){
    const confirmacao = confirm("Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.");

    if (confirmacao) {
      setLoading(true);

      try{
        const response = await fetch(`/api/tasks/${id}`, {
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
          console.log('Task deletada com sucesso!');
          setLoading(false);
          window.location.reload();
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }
  } 

  if (loading) {
    return <h3>Carregando...</h3>;
  }

  return(
      <ThemeProvider theme={theme}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr 1fr', 
          alignItems: 'center',
          justifyItems: 'center',
          padding: 5,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
          marginBottom:'24px',
          bgcolor: colorWithOpacity,
          borderRadius:5
        }}>
          <Box sx={{
            bgcolor: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius:'25px',
            minHeight: '150px',
            minWidth: '150px'
          }}>
            <Typography sx={{
              color: `tasks.${props.status}`,
              fontSize: '45px'
            }}>
                <i class={taskIcon[props.status]}></i> 
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            justifySelf: 'start'
          }}>
            <Typography variant={isAbandonada} noWrap><b>{props.name}</b></Typography>
            <Typography variant={isAbandonada}>{props.description}</Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems:'center',
              gap: 5
            }}>
              <Typography variant={isAbandonada} sx={{ 
                bgcolor: theme.palette.urgencyBackground[urgencyText],
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                padding:'3px 15px',
                borderRadius:5 
                }}> 
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: theme.palette.urgency[urgencyText]
                }}/>
                {urgencyText} 
              </Typography>
              <Typography variant={isAbandonada} sx={{ 
                bgcolor: '#6B728044',
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                padding:'3px 15px',
                borderRadius:5 
              }}>   
                <i class="fa-regular fa-calendar"></i> 
                {dataFormatada} 
              </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
            }}>
              <a 
                href={`/tasks/edit/${props.id}`} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '15px',
                  marginRight: 8,
                  borderRadius: 6,
                  backgroundColor: '#F3E8FF',
                  border: '1px solid #7C3AED66',
                  color: '#7C3AED',
                  textDecoration: 'none'
                }}
              >
                <i className="fa-solid fa-pen"></i>
              </a>

              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '15px',
                  borderRadius: 6,
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #DC262666',
                  color: '#DC2626',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => handleDeleteTask(props.id)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </Box>
        </Box>
        </ThemeProvider>
    )
}

export default Task;