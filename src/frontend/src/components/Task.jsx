function Task(props){
    const dateISO = props.deadline;
    const date = new Date(dateISO);
    const dataFormatada = date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      const urgencyStyle = {
        alta: { color: 'red', fontWeight: 'bold'},
        media: { color: 'green' },
        baixa: { color: 'blue' }
      };

    return(
        <div className="Task" style={{display: 'flex',   justifyContent: 'space-between', alignItems: 'center', marginBottom:'20px', padding:'10px 50px', borderBottom:'2px solid'}}>
            <h3 style={{margin:'0'}}>{props.name}</h3>
            <p style={{margin:'0'}}>{props.description}</p>
            <p style={urgencyStyle[props.urgency]}>{props.urgency}</p>
            <p>{dataFormatada}</p>
            <a href={`/tasks/edit/${props.id}`}><i className="fa-solid fa-pencil"></i></a>
        </div>
    )
}

export default Task;