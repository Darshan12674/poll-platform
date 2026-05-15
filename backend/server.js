import "dotenv/config"

import http from "http"

import app from "./src/app.js"
import {connectDB} from "./src/common/config/db.js"
import { initSocket } from "./src/sockets/analytics.socket.js"



const PORT = process.env.PORT || 3000

//Connect database
connectDB()

// Create HTTP  server
const server = http.createServer(app)

// initialize socket.io
initSocket(server)

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
