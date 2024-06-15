let onlineUsers = [];
let selectedUser = null;
let ws = null;

export async function renderChat() {
  const chatContainer = document.getElementById("chat-container");
  if (!chatContainer) {
    console.error("Chat container not found!");
    return;
  }

  chatContainer.innerHTML = `
    <h1>Chat</h1>
    <div id="online-users"></div>
    <div id="chat-messages"></div>
    <input type="text" id="message-input" placeholder="Type a message...">
    <button id="send-button">Send</button>
  `;

  ws = new WebSocket(
    `ws://localhost:8080/ws?token=${localStorage.getItem("authToken")}`
  );

  ws.onopen = function () {
    console.log("Connected to chat");
  };

  ws.onerror = function (event) {
    console.error("WebSocket error:", event);
  };

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received message:", data); // Debugging log
    if (data.type === "user_status") {
      updateOnlineUsers(data);
    } else if (data.type === "chat_message") {
      displayMessage(data);
    } else if (data.type === "initial_online_users") {
      onlineUsers = data.userIDs;
      renderOnlineUsers();
    }
  };

  document.getElementById("send-button").addEventListener("click", () => {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
    messageInput.value = "";

    if (selectedUser) {
      ws.send(
        JSON.stringify({
          type: "chat_message",
          content: message,
          receiverId: selectedUser,
        })
      );
    } else {
      alert("Please select a user to send a message.");
    }
  });
}

function updateOnlineUsers(data) {
  const { userID, status } = data;
  console.log("Updating online user:", userID, "status:", status); // Debugging log
  if (status === "online" && !onlineUsers.includes(userID)) {
    onlineUsers.push(userID);
  } else if (status === "offline") {
    onlineUsers = onlineUsers.filter((user) => user !== userID);
  }
  renderOnlineUsers();
}

function renderOnlineUsers() {
  const onlineUsersDiv = document.getElementById("online-users");
  onlineUsersDiv.innerHTML = "";
  onlineUsers.forEach((userID) => {
    const userStatus = document.createElement("div");
    userStatus.setAttribute("data-user-id", userID);
    userStatus.textContent = `${userID} is online`;
    userStatus.classList.add("online-user");
    userStatus.addEventListener("click", () => selectUser(userID));
    onlineUsersDiv.appendChild(userStatus);
  });
}

function selectUser(userID) {
  selectedUser = userID;
  document.getElementById("message-input").placeholder = `Message to ${userID}`;
  const userElements = document.querySelectorAll(".online-user");
  userElements.forEach((element) => {
    if (element.getAttribute("data-user-id") === userID) {
      element.classList.add("selected");
    } else {
      element.classList.remove("selected");
    }
  });
}

function displayMessage(messageData) {
  const chatMessagesDiv = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `
    <p><strong>${messageData.senderId}:</strong> ${messageData.content}</p>
  `;
  chatMessagesDiv.appendChild(messageDiv);
}
