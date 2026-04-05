import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function CreateTask() {
    const auth = localStorage.getItem('authorization');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [urgency, setUrgency] = useState("baixa");

    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")

    async function handleCreateTask(){
        if (name !== "" && description !== "" && deadline !== ""){
            const newTask = {
                name: name,
                description: description,
                deadline: deadline,
                urgency: urgency
            };

            try{
                const response = await fetch('/api/tasks/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newTask)
                });

                const data = await response.json();
                if (data.error){
                    setError(data.error)
                }else{
                    setMessage(data.mensagem);
                    console.log(data.task);
                    setDeadline("");
                    setName("");
                    setDescription("");
                    setUrgency("baixa");
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }

        } else {
            setError(true)
            setMessage('Preencha todos os campos antes de enviar!')
        }
    }

    useEffect( () => {
        if (!auth){
            navigate('/login')
        } else {
            setToken(auth.split(" ")[1]);
            setLoading(false)
        }
    });


    if (loading) {
        return <h3>Carregando...</h3>;
    }
    return(
        <div>
            <h1> Create Task </h1>

            <div className="forms" style={{display:'flex', flexDirection:'column', maxWidth:'250px'}}>
                <label htmlFor="title">Title</label>
                <input type="text" maxLength={50} id="title" value={name} onChange={(e) => setName(e.target.value)}/>

                <label htmlFor="description">Description</label>
                <textarea id="description" maxLength={80} value={description} onChange={(e) => setDescription(e.target.value)} />

                <label htmlFor="deadline">Deadline</label>
                <input  type='date' id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>

                <label htmlFor="urgency">Urgency</label>
                <select id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                </select>

                <button style={{marginTop:'24px'}} onClick={handleCreateTask}> Salvar </button>
            </div>
            <p  style={{ color: error ? 'red' : undefined }} > {message} </p>
        </div>
    );
}

export default CreateTask;