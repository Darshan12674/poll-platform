import { Server} from "socket.io";

let io

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    })

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id)

        socket.on("disconnect", () => {
            console.log("User disconnected")
        })
    })
}

export const getIo = () => {
    if(!io) {
        throw new Error("Socket.io no initialized")
    }

    return io
}
