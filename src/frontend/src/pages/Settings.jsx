import { Button, Box, Typography, ThemeProvider, TextField } from '@mui/material';
import theme from '../theme/theme';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Settings(){

    const navigate = useNavigate();
    const auth = localStorage.getItem('authorization');
    const [token, setToken] = useState("");
    const [icon, setIcon] = useState("fa-eye");
    const [showPassword, setShowPassword] = useState(false)
    const [confirmedIcon, setConfirmedIcon] = useState("fa-eye");
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)
    const [user, setUser] = useState({
        id: "",
        username: "",
        email: "",
        password: "",
    });
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    useEffect( () => {
        if (!auth){
            navigate('/login')
        } else {
            setToken(auth.split(" ")[1]);
        }

        const token = auth.split(" ")[1];
        fetch(`/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                if(data.message !== "Dados do usuário retornados com sucessos"){ 
                 navigate("/login") //caso não retorne os dados do usuário, força o usuário à refazer o seu login
                } else {
                  setUser({...data.user, password: ''})
                  return data.user;
                }
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    }, []);

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
        
        if (icon === 'fa-eye'){
          setConfirmedIcon('fa-eye-slash')
        } else {
          setConfirmedIcon('fa-eye')
        }
    }

    async function handleEditUser(){
        console.log(user)
        if (user.username.length > 50) {
            setError(true)
            setMessage('O nome da tarefa não pode ultrapassar 50 caracteres')
            return
        };
        if (user.email.length > 255) {
            setError(true)
            setMessage('O email não pode ultrapassar 255 caracteres')
            return
        };
        if (user.password.length > 255) {
            setError(true)
            setMessage('A senha não pode ultrapassar 255 caracteres')
            return
        };
        if (user.password !== confirmedPassword) {
            setError(true)
            setMessage('As senhas não coincidem')
            return
        };

        try{
            const response = await fetch(`/api/auth/edit`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            if (data.error){
                setError(true)
                setMessage(data.error)
            }else{
                if (user.password === ""){
                    setMessage(data.mensagem);
                    console.log(data.task);
                } else {
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }
    
    async function handleDeleteUser() {
        const confirmacao = confirm("Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita e tudo será perdido.");

        if (confirmacao) {
            try{
                const response = await fetch(`/api/auth/delete`, {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    },
                });

                const data = await response.json();
                if (data.error){
                    setError(true)
                    setMessage(data.error)
                }else{
                    if (user.password === ""){
                        setMessage(data.mensagem);
                        console.log(data.task);
                    } else {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }

        navigate('/login')
    }

    return(
        <ThemeProvider theme={theme}>
            <Box sx={{margin:'0 128px 42px 128px'}}>
                <Header />

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
                    <Typography variant="h2" component="h2">Configurações</Typography>

                    <Box sx={{ width: {xs: 250, sm: 300, md: 550}, padding:'24px 0'}}>
                        <TextField label='Username' type="text" maxLength={50} id="username" value={user.username} onChange={(e) => setUser(u => ({...u, username:e.target.value}))}/>
                        <Typography style={{position:'relative', bottom:'20px', fontSize:'12px', color:user.username.length < 50 ? '#347EBF' : '#D93B3B'}}> {user.username.length} de 50 </Typography>

                        <TextField label='Email' type="email" id="email" value={user.email} onChange={(e) => setUser(u => ({...u, email:e.target.value}))}/>

                        <Box sx={{ position: 'relative'}}>
                            <TextField label='New password'type={showPassword ? "text" : "password"} id="password" value={user.password} onChange={(e) => setUser(u => ({...u, password:e.target.value}))}/>
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
                            <TextField label='Confirm password' type={showConfirmedPassword ? "text" : "password"} maxLength={50} id="password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}/>
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

                        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
                            <Button variant="edit" onClick={handleEditUser} style={{margin:'24px 0 42px 0', width:'200px'}}> Editar </Button>
                            <Button variant="del" onClick={handleDeleteUser} style={{margin:'24px 0 42px 0', width:'200px'}}> Deletar usário </Button>
                        </Box>
                        <Typography variant={error ? "error" : "sucess"}>{message}</Typography>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Settings;