import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, ThemeProvider, Typography, TextField, Button } from '@mui/material';
import theme from "../theme/theme";



function Register(){
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [icon, setIcon] = useState("fa-eye");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmedIcon, setConfirmedIcon] = useState("fa-eye");
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    function handleShowPassword(){
        setShowPassword(!showPassword);
        
        if (icon === 'fa-eye'){
          setIcon('fa-eye-slash')
        } else {
          setIcon('fa-eye')
        }
    }

    function handleShowConfirmedPassword(){
        setShowConfirmedPassword(!showConfirmedPassword);
        
        if (confirmedIcon === 'fa-eye'){
          setConfirmedIcon('fa-eye-slash')
        } else {
          setConfirmedIcon('fa-eye')
        }
    }

    async function handleRegister(){
        if (username !== "" && email !== "" && password !== "" && confirmPassword !== ""){
            const newUser = {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }

            try{
                const response = await fetch('api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });

                const data = await response.json();
                if (data.error){
                    setError(true);
                    setMessage(data.error);
                }else{
                    console.log(data);
                    navigate('/login');
                }
            } catch (error){
                console.error('Erro na requisição:', error);
            }
        } else {
            setError(true)
            setMessage('Preencha todos os campos antes de enviar!')
        }
    }     
          
    
    return(
        <ThemeProvider theme={theme}>
            <Box sx={{
            display:"flex",
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            }}>
                <Typography variant="h1" component="h1"> Task<span style={{ color:'#B23A3A'}}>Flow</span> </Typography>

                <Box sx={{
                    display:"flex",
                    flexDirection:'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.body',
                    boxShadow: 1,
                    borderRadius: 5,
                    padding: 5,
                    maxWidth: 400,
                }}
                >
                    <Typography variant="h2" component="h2">Register</Typography>
                    <Typography variant="error">{message}</Typography>

                    <Box sx={{marginTop:'24px'}}> 
                        <TextField label='Username' type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                        <TextField label='Email' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>

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

                        <Box sx={{ position: 'relative'}}>
                            <TextField label='Confirm password' type={showConfirmedPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>

                            <Box
                                onClick={handleShowConfirmedPassword}
                                sx={{
                                position: 'absolute',
                                right: -25,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                }}
                            >
                                <i className={`fa-regular ${confirmedIcon}`} style={{marginBottom:'24px'}}></i>
                            </Box>
                        </Box>
                    </Box>

                    <Button variant='primary' onClick={handleRegister} style={{marginTop:'24px'}}> Register </Button>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Register;