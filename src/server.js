import path from "path";
import express from "express";
import http from "http";
// import { WebSocketServer } from "ws";
import { Server, Socket } from "socket.io";

const __dirname = path.resolve();
const app = express();
/**pug페이지들을  렌더하기위해 */
/** pug로 view enggine */
app.set("view engine", "pug");
/**템플릿이 어디에있는지 지정 */
app.set("views", __dirname + "/src/views");
/**public url생성 */
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
/**http와 ws를 같이 실행 */
// const wss = new WebSocketServer({ server });
const wsServer = new Server(httpServer);
const handleListen = () => console.log(`Listening on http://localhost:3000`);

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

const sockets = [];

wsServer.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("room", (roomName, done) => {
        socket.join(roomName);
        done(roomName);
        socket.to(roomName).emit("welcome");
    });
    socket.on("user_message", (msg, room, done) => {
        socket.to(room).emit("user_message", msg);
        done();
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye"));
    });
});

// wsServer.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     socket.on("close", () => console.log("Disconnected from the Browser ❌"));
//     socket.on("message", (message) => {
//         const newMessage = JSON.parse(message);
//         if (newMessage.type === "new_message") {
//             sockets.forEach((aSocket) =>
//                 aSocket.send(`${socket.nickname}: ${newMessage.payload}`)
//             );
//         } else {
//             socket["nickname"] = newMessage.payload;
//         }
//     });
// });

httpServer.listen(3000, handleListen);
