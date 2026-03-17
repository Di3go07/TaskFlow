import express from "express";
import tasksRoutes from "./routes/tasks.js";

const app = express();

// -- Routes --
app.use('/tasks/', tasksRoutes);

// --  Server --
var server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})
