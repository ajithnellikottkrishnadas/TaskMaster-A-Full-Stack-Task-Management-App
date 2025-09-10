import express from "express";
import { create, getAllTasks, getTaskById, updateTask, deleteTask } from "../controller/listController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const route = express.Router();

route.use(authMiddleware);

route.post("/create", create);
route.get("/get", getAllTasks);
route.get("/get/:id", getTaskById);
route.put("/update/:id", updateTask);
route.delete("/delete/:id", deleteTask);

export default route;
