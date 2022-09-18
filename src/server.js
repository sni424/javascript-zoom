import express from "express";
import http from "http";
import path from "path";
import WebSocket, { WebSocketServer } from "ws";

const __dirname = path.resolve();

const app = express();
/**pug페이지들을  렌더하기위해 */
/** pug로 view enggine */
app.set("view engine", "pug");
/**템플릿이 어디에있는지 지정 */
app.set("views", __dirname + "/src/views");
/**public url생성 */
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);

/**http와 ws를 같이 실행 */
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    console.log("connected to Browser");
    socket.on("close", () => console.log("disconnected from browser"));

    socket.on("message", (message) => {
        sockets.forEach((aSockets) => aSockets.send(message.toString()));
    });
    socket.send("hello!!!");
});

server.listen(3000, handleListen);
