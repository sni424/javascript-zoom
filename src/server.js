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

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

const sockets = [];

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("room", (roomName, done) => {
        socket.join(roomName);
        done(roomName);
        socket
            .to(roomName)
            .emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("user_message", (msg, room, done) => {
        socket.to(room).emit("user_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
        );
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
