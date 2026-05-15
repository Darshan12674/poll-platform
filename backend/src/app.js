import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "./routes/index.js"

const app = express()

//Middleware
app.use(express.json())

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        credentials: true
    })
)

app.use(cookieParser())

//test route
app.get("/", (req, res) => {
    res.send("App is runing...")
})

app.use("/api", routes)
export default app