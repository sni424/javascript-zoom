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
    socket.on("enter_room", (msg, done) => {
        console.log(msg);
        setTimeout(() => {
            done();
        }, 10000);
    });
});
// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser ✅");
//     socket.on("close", onSocketClose);
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach((aSocket) =>
//                     aSocket.send(`${socket.nickname}: ${message.payload}`)
//                 );
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     });
// });

httpServer.listen(3000, handleListen);
