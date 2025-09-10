import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT= process.env.PORT;
const MONGOURL = process.env.MONGO_URL;






mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Db connected succesfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);

        });
    })
    .catch((error) => console.log(error));