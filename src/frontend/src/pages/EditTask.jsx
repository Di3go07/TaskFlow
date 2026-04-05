import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function EditTask() {
    const taskId = useParams().id;
    const auth = localStorage.getItem('authorization');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState("");
    
    const [task, setTask] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);


    useEffect(() => {
        if (!auth){
            navigate('/login')
        } else {
            setToken(auth.split(" ")[1]);
            setLoading(false)
        }

        const token = auth.split(" ")[1];
        fetch(`/api/tasks/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error){
                if (data.error === "Você não tem autorização para ler essa tarefa"){ //protege um usuário acessar a tarefa de outro
                    console.log(data.error)
                    navigate('/forbidden');
                }
                setError(true)
                setMessage(data.error);
            }else{
                setTask(data.task[0]);
                console.log(data.task[0].deadline)
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
    }, [taskId]);

    async function handleEditTask(){
        try{
            const response = await fetch(`/api/tasks/editar/${taskId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task)
            });

            const data = await response.json();
            if (data.error){
                setError(data.error)
            }else{
                setMessage(data.mensagem);
                console.log(data.task);
            }
        } catch{
            console.error('Erro na requisição:', error);
        }
    }


    if (loading){ return (<div><p>Carregando...</p></div>)}

    return (
        <div>
            <h1>Edit Task</h1>

            <div className="forms" style={{display:'flex', flexDirection:'column', maxWidth:'250px'}}>
                <label htmlFor="title">Title</label>
                <input type="text" maxLength={50} id="title" value={task.name} onChange={(e) => setTask(t => ({...t, name:e.target.value}))}/>

                <label htmlFor="description">Description</label>
                <textarea id="description" maxLength={80} value={task.description} onChange={(e) => setTask(t => ({...t, description:e.target.value}))} />

                <label htmlFor="deadline">Deadline</label>
                <input  type='date' id="deadline" value={task.deadline} onChange={(e) =>  setTask(t => ({...t, deadline:e.target.value}))}/>

                <label htmlFor="urgency">Urgency</label>
                <select id="urgency" value={task.urgency} onChange={(e) =>  setTask(t => ({...t, urgency:e.target.value}))}>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                </select>

                <label htmlFor="status">Status</label>
                <select id="status" value={task.status} onChange={(e) =>  setTask(t => ({...t, status:e.target.value}))}>
                    <option value="pendente">Pendente</option>
                    <option value="andamento">Em andamento</option>
                    <option value="concluida">Concluida</option>
                    <option value="abandonada">Abandonada</option>
                </select>

                <button style={{marginTop:'24px'}} onClick={handleEditTask}> Editar </button>
            </div>

            <p style={{ color: error ? 'red' : undefined }}>{message}</p>
        </div>
    )
}

export default EditTask;