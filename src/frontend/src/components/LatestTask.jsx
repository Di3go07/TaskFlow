import { Box, Typography, Link } from "@mui/material";

function LatestTask(props) {

    let dataFormatada = props.deadline
    if (props.deadline !== 'Today' && props.deadline !== 'Tomorrow'){
        const dateISO = props.deadline;
        const date = new Date(dateISO);
        dataFormatada = date.toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
    }

    function getIcon() {
        console.log(props.status)
        if (props.status === 'concluida') {
            return (<i className='fa-solid fa-check' style={{color:'#B23A3A'}}></i>);
        } else if (props.status === 'abandonada') {
            return(<i className='fa-solid fa-xmark' style={{color:'#4B5563'}}></i>)
        } else {
            return ('');
        }
    }

    return(
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',      
            padding: '12px 0',
            width: '100%',
            color: props.status === 'abandonada' ? '#4B5563' : '#000'
        }}> 
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Box sx={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    border: props.status === 'concluida' ? '1.5px solid #B23A3A' :   props.status === 'abandonada' ? '1.5px solid #4B5563' : '1.5px solid #000',
                    backgroundColor: '#fff',
                }}>
                    {getIcon()}
                </Box>
                <Typography sx={{
                    fontSize: '16px', 
                    textDecoration: props.status === 'abandonada' ? 'line-through' : 'none'
                }}> 
                    <a href={`tasks/edit/${props.id || ''}`} style={{textDecoration: 'none', color:'#000'}} > {props.name} </a>                
                </Typography>
            </Box>
            <Typography sx={{
                fontSize: '16px', 
                textDecoration: props.status === 'abandonada' ? 'line-through' : 'none',
            }}> 
                {dataFormatada} 
            </Typography>
        </Box>
    );
}

export default LatestTask;