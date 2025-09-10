import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import listRoutes from "./routes/listRoutes.js"


const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT= process.env.PORT;
const MONGOURL = process.env.MONGO_URL;

app.use("/api/user",authRoutes );
app.use("/api/user/list", listRoutes);




mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Db connected succesfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);

        });
    })
    .catch((error) => console.log(error));