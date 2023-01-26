const socket = io();

// const socket = new WebSocket(`ws://${window.location.host}`);

const welcome = document.getElementById("welcome");
const roomList = welcome.querySelector("ul");
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
socket.on("welcome", (user) => {
    addMessage(`${user} joind`);
});

socket.on("bye", (user) => {
    addMessage(`${user} Left`);
});

socket.on("user_message", addMessage);

socket.on("room_change", (rooms) => {
    roomList.innerHTML = "";
    if (rooms.length < 1) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});
