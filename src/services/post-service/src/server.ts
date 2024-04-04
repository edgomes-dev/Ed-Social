import Express from "express"
import mongoose from "mongoose";
import "reflect-metadata"
import cors from "cors"

import { router } from "./router";

const app = Express();
app.use(Express.json());
app.use(cors());

const MONGODB_URI = 'mongodb://dev:senha123@localhost:27017/post';
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    }).catch((err) => {
        console.error(err)
    })

app.use('/', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})