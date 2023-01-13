const socket = io();

// const socket = new WebSocket(`ws://${window.location.host}`);

const welcome = document.getElementById("welcome");
const messageList = welcome.querySelector("ul");
const roomForm = welcome.querySelector("form");
const room = document.getElementById("room");
const roomName = room.querySelector("h2");

room.hidden = true;

let oldRoomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.append(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("user_message", input.value, oldRoomName, () => {
        addMessage(`You: ${input.value}`);
        input.value = "";
    });
}

function handleNameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function showRoom(msg) {
    welcome.hidden = true;
    room.hidden = false;
    oldRoomName = msg;
    roomName.innerText = msg;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("room", input.value, showRoom);
    input.value = "";
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
    const nameForm = room.querySelector("#name");
    nameForm.addEventListener("submit", handleNameSubmit);
}

roomForm.addEventListener("submit", handleRoomSubmit);
socket.on("welcome", () => {
    addMessage("someone joind");
});

socket.on("bye", () => {
    addMessage("someone Left");
});

socket.on("user_message", addMessage);

// function makeMessage(type, payload) {
//     const mesg = { type, payload };
//     return JSON.stringify(mesg);
// }

// socket.addEventListener("open", () => {
//     console.log("Connected to Server ✅");
// });

// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li");
//     li.innerText = message;
//     messageList.append(li);
// });

// socket.addEventListener("close", () => {
//     console.log("Disconnected from Server ❌");
// });

// function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickName", input.value));
//     input.value = "";
// }

// function handleMessageSubmit(event) {
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));
//     input.value = "";
// }

// nickForm.addEventListener("submit", handleNickSubmit);
// messageForm.addEventListener("submit", handleMessageSubmit);
