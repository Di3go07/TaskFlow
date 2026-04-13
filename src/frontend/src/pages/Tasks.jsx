import Header from "../components/Header";
import TaskCollapse from "../components/TaskCollapse";
import { useNavigate } from "react-router-dom";
import { Box, ThemeProvider, Typography, TextField, MenuItem, Button, Collapse} from '@mui/material';
import theme from "../theme/theme";

function Tasks(){
    const navigate = useNavigate();

    return(
        <ThemeProvider theme={theme}>
            <Box sx={{ margin: { xs: '0', sm: '0 32px', md: '0 64px', lg: '0 128px' } }}>
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
                    <Typography variant="h2" component="h2">Tasks List</Typography>

                    <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <Button variant="primary" onClick={() => navigate('/tasks/create')} style={{margin:'24px 0 42px 0', maxWidth:'200px'}}> Nova tarefa </Button>
                    </Box>

                    <TaskCollapse status='pendente' title='Pending Tasks' icon='fa-hourglass-half'/>
                    <TaskCollapse status='andamento' title='Ongoing Tasks'icon="fa-rotate" />
                    <TaskCollapse status='concluida' title='Done Tasks' icon="fa-circle-check" />
                    <TaskCollapse status='abandonada' title='Dropped Tasks' icon="fa-box-archive" />

                </Box>
            </Box>
        </ThemeProvider>
    );   
}

export default Tasks;