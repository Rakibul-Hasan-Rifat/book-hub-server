import cors from 'cors';
import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import client from "./mongodb.js";
import router from "./router/routes.js";

const app = express();
const port = process.env.PORT || 5050

configDotenv();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://book-hub-client-b46b2.web.app'],
}));
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(port, async () => {
    console.log(`app is running at http://localhost:${port}`);

    try {
        client.connect()
    } catch (error) {
        console.log(error)
    }
})