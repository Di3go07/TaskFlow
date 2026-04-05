import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Login</h1>

      <div>
        <label htmlFor='email'> Email </label>
        <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <div>
          <label htmlFor='paswword'> Password </label>
          <input type={showPassword ? "text" : "password"} id='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <i className={`fa-regular ${icon}`} onClick={() => handleShowPassword()}></i> 
        </div>

        <button onClick={() => handleLogin()}> Login </button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Login;