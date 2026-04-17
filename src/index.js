import express from "express";
import tasksRoutes from "./backend/routes/tasks.js";
import usersRoutes from "./backend/routes/users.js";
import notesRoutes from "./backend/routes/notes.js"
import dotenv from "dotenv";

dotenv.config(); //le as variáveis locais
const app = express();
app.use(express.json());

// -- Rotas --
app.use("/tasks", tasksRoutes);
app.use("/auth", usersRoutes);
app.use("/notes", notesRoutes);

// --  Server --
var server = app.listen(5000, function () {
  console.log("Express App running at http://127.0.0.1:5000/");
});
