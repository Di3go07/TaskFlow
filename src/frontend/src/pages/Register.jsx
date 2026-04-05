import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register(){
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

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
        <div>
            <div>
                <h1>Register</h1>
            </div>

            <div className="Forms" style={{display:'flex', flexDirection:'column', maxWidth:'250px'}}>
                <label htmlFor="username"> Username </label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="email"> Email </label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="password"> Password </label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="confirmPassword"> Confirm Password </label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                <button onClick={handleRegister} style={{marginTop:'24px'}}> Register </button>
            </div>

            <p  style={{ color: error ? 'red' : undefined }} > {message} </p>
        </div>
    );
}

export default Register;