import { Box, ThemeProvider, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import theme from "../theme/theme";
import { useNavigate } from 'react-router-dom';

function Header() {
  const auth = localStorage.getItem('authorization');
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); 
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect( () => {
    if (!auth){
        navigate('/login')
    } else {
        setToken(auth.split(" ")[1]);
    }

    try {
      const token = auth.split(" ")[1];
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      setUser(payload); //define as informações do usuário na header a partir das salvas no token
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      navigate('/login')
    }
  }, []);

  const handleClick = (event) => {  
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'24px' }}>
        <Typography variant="h1Header" component="h1" style={{cursor:'pointer'}} onClick={() => navigate('/')}>
          Task<span style={{ color:'#B23A3A' }}>Flow</span>
        </Typography>

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
                display: 'flex',           
                alignItems: 'center',      
                justifyContent: 'center',  
                backgroundColor: open ? 'action.hover' : 'transparent',
            }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <i className="fa-solid fa-user" style={{ fontSize:'24px'}}></i>
          </IconButton>

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Typography variant='text'>{user.username}</Typography>
          <hr></hr>
          <MenuItem onClick={() => {handleClose(); navigate('/')}}>
            <i className="fa-solid fa-house" style={{ marginRight: 8 }}></i> Home
          </MenuItem>

          <MenuItem onClick={() => {handleClose(); navigate('/tasks')}}>
            <i className="fa-solid fa-list" style={{ marginRight: 8 }}></i> Tasks
          </MenuItem>

          <MenuItem onClick={() => {handleClose(); navigate('/notes')}}>
            <i className="fa-solid fa-note-sticky" style={{ marginRight: 8 }}></i> Notes
          </MenuItem>

          <MenuItem onClick={() => {handleClose(); navigate('/settings')}}>
            <i className="fa-solid fa-gear" style={{ marginRight: 8 }}></i> Configurações
          </MenuItem>
          
          <MenuItem onClick={() => {handleClose(); localStorage.removeItem('authorization'); navigate('/login')}}>
            <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 8 }}></i> Logout
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
}

export default Header;