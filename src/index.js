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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Express App running on port ${PORT}`);
});
