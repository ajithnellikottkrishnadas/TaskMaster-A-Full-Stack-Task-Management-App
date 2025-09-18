import express from "express";
import { create, getAllTasks,  updateTask, deleteTask,getAllUsers } from "../controller/listController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const route = express.Router();

route.use(authMiddleware);

route.post("/create", create);
route.get("/get", getAllTasks);
route.put("/update/:id", updateTask);
route.delete("/delete/:id", deleteTask);
route.get("/all",getAllUsers)

export default route;
