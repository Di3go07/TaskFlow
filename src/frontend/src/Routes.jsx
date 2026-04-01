import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import CreateTask from "./pages/CreateTask.jsx";

import Error404 from "./pages/Erro404.jsx";

const AppRoutes = () => {
   return(
       <BrowserRouter>
            <Routes>
                <Route path="/login" element = { <Login/> }  />
                <Route path="/" element = { <Home /> } />
                <Route path="/tasks/create" element = { <CreateTask />} />
                <Route path="*" element={ <Error404/> } />
            </Routes>
       </BrowserRouter>
   )
}

export default AppRoutes;