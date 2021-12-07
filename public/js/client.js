document.addEventListener("DOMContentLoaded", () => {
  const urlValue = new URLSearchParams(window.location.search);
  const category = urlValue.get("category");
  console.log(category);

  const socket = io();

  const message = document.getElementById("message");
  const population = document.getElementById("population");
  const sendButton = document.getElementById("sendButton");
  const chatWindow = document.getElementById("chat");

  const sendMessage = () => {
    if (message.value == "") return;

    let container = document.createElement("article");
    container.classList.add("msg-container");
    container.classList.add("msg-self");

    let innerContainer1 = document.createElement("div");
    innerContainer1.classList.add("msg-box");

    let innerContainer2 = document.createElement("div");
    innerContainer2.classList.add("flr");

    let innerContainer3 = document.createElement("div");
    innerContainer3.classList.add("messages");

    let para = document.createElement("p");
    para.classList.add("msg");

    para.innerHTML = message.value;
    innerContainer3.appendChild(para);
    innerContainer2.appendChild(innerContainer3);
    innerContainer1.appendChild(innerContainer2);
    container.appendChild(innerContainer1);

    chatWindow.appendChild(container);

    socket.emit("sendMessage", message.value, category);

    message.value = "";
  };

  const receiveMessage = (mess) => {
    let container = document.createElement("article");
    container.classList.add("msg-container");
    container.classList.add("msg-remote");

    let innerContainer1 = document.createElement("div");
    innerContainer1.classList.add("msg-box");

    let innerContainer2 = document.createElement("div");
    innerContainer2.classList.add("flr");

    let innerContainer3 = document.createElement("div");
    innerContainer3.classList.add("messages");

    let para = document.createElement("p");
    para.classList.add("msg");

    para.innerHTML = mess;
    innerContainer3.appendChild(para);
    innerContainer2.appendChild(innerContainer3);
    innerContainer1.appendChild(innerContainer2);
    container.appendChild(innerContainer1);

    chatWindow.appendChild(container);
  };

  socket.on("connect", () => {
    socket.emit("joinRoom", category);
    socket.on("population", (members) => {
      population.innerHTML = members;
    });
  });

  socket.on("receiveMessage", receiveMessage);

  sendButton.addEventListener("click", sendMessage);

  socket.on("noRoom", () => {
    document.write("No Room Available");
  });
});
