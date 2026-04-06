import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Tasks from "./pages/Tasks.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import Register from "./pages/Register.jsx";
import EditTask from "./pages/EditTask.jsx";
import Error from "./pages/Error.jsx";

const AppRoutes = () => {
   return(
       <BrowserRouter>
            <Routes>
                <Route path='/register' element = { <Register/> } />
                <Route path="/login" element = { <Login/> }  />
                <Route path="/" element = { <Home /> } />
                <Route path="/tasks" element = { <Tasks />} />
                <Route path="/tasks/create" element = { <CreateTask />} />
                <Route path="/tasks/edit/:id" element = { <EditTask />} />
                <Route path="/forbidden" element={<Error codigo='403' subtitle='Bloqueado! Você não tem acesso à essa rota.' mensagem='Parece que você não tem permissão para visualizar esta página. Tente acessar outra seção do sistema.'/>} />
                <Route path="*" element={ <Error codigo='404' subtitle='Ops! Página não encontrada.' mensagem='A rota que você tentou acessar não existe ou foi removida.' /> } />
            </Routes>
       </BrowserRouter>
   )
}

export default AppRoutes;