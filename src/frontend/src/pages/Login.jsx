import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, ThemeProvider, Typography, TextField, Button } from '@mui/material';
import theme from "../theme/theme";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("fa-eye");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function handleShowPassword(){
    setShowPassword(!showPassword);
    
    if (icon === 'fa-eye'){
      setIcon('fa-eye-slash')
    } else {
      setIcon('fa-eye')
    }
  }

  async function handleLogin(){
    /*
    handleLogin() resgata os valores passados nos campos e envia uma requisição ao servidor, passando esses parâmetros no body como um objeto JSON. 
    Por sua vez, o backend verifica se todos os campos foram enviados e se existe esse usuário no banco de dados.
    Após a validação, a função salva o token do usuário no local storage. 
    */

    const user = {
      email: email, 
      password: password
    }

    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      }); 

      const data = await response.json(); 
      if (data.error){
        setMessage(data.error)
      }else{
        const token = data.accessToken
        console.log(token)
        localStorage.setItem('authorization', `Bearer ${token}`);
        navigate('/') //direciona o usuário para home após o login
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
    }


  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display:"flex",
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}>
        <Typography variant="h1Login" component="h1"> Task<span style={{ color:'#B23A3A'}}>Flow</span> </Typography>
          
          <Box
            sx={{
              display:"flex",
              flexDirection:'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'background.body',
              boxShadow: 1,
              borderRadius: 5,
              padding: 5,
              minWidth: 300,
            }}
          >
                <Typography variant="h2" component="h2">Login</Typography>
                <Typography variant="error">{message}</Typography>


                <div style={{marginTop:24}}> 
                  <Box sx={{ width: {xs: 250, sm: 300, md: 350} }}>
                    <TextField
                      label="email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Box sx={{ position: 'relative'}}>
                      <TextField
                        label="password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <Box
                        onClick={handleShowPassword}
                        sx={{
                          position: 'absolute',
                          right: -25,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                        }}
                      >
                        <i className={`fa-regular ${icon}`} style={{marginBottom:'24px'}}></i>
                      </Box>
                    </Box>
                  </Box>

                  <Button variant="primary" onClick={() => handleLogin()} style={{margin:'24px 0 42px 0'}}> Login </Button>
                </div>

                <Typography variant="text" style={{marginBottom:42}}>Caso não tenha uma conta, <a href='/register'>registre-se</a></Typography>
          </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Login;