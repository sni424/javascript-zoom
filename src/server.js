import path from "path";
import express from "express";
import http from "http";
// import { WebSocketServer } from "ws";
import { Server } from "socket.io";

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

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
/**http와 ws를 같이 실행 */
// const wss = new WebSocketServer({ server });
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname)
        );
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
