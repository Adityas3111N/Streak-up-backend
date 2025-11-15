import "dotenv/config"
import mongoose from "mongoose"
import app from "./app"
import {MONGODB_URI, PORT} from "./config/env.config"

//mongodb connection

mongoose
.connect(MONGODB_URI)
.then(
    () => {
        console.log("DB connected");
        const serverPort = Number(PORT) || 8000;
        app.listen(serverPort, () => console.log(`Server is running on Port ${serverPort}`));
    }
)
.catch(
(err) => {
    console.error("MongoDb connection Failed:", err);
    process.exit(1);
}
);