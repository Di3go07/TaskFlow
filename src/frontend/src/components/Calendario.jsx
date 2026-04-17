import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, ThemeProvider, Button } from '@mui/material';
import theme from '../theme/theme';
import { useNavigate } from 'react-router-dom';

function Calendario() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme} >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
            sx={{
            display: 'flex',
            flexDirection: 'column',
            width: {xs: '350px', lg:'450px'},
            justifyContent: 'center', 
            borderRadius: '25px',
            }}
        >
            <Box sx={{boxShadow: 5, p: '24px', borderRadius: '25px', bgcolor: 'background.body', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} >
            <DateCalendar 
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                />
                <Button onClick={() => navigate('/tasks/create')} variant="primary" sx={{width: '150px'}} autoFocus> Nova tarefa </Button>
            </Box>

        </Box>
        </LocalizationProvider>
    </ThemeProvider>
  );
}

export default Calendario;