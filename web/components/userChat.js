let onlineUsers = [];
let offlineUsers = [];
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
    <div id="offline-users"></div>
    <div id="chat-messages"></div>
    <input type="text" id="message-input" placeholder="Type a message...">
    <button id="send-button">Send</button>
  `;

  await fetchAllUsers();

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
      onlineUsers = data.onlineUsers;
      removeDuplicateUsers();
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

async function fetchAllUsers() {
  try {
    const response = await fetch("http://localhost:8080/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const data = await response.json();
    console.log("Fetched users:", data); // Debugging log

    if (data.code === 200 && data.data && Array.isArray(data.data.data)) {
      offlineUsers = data.data.data.map(user => ({ userId: user.id, username: user.username }));
    } else {
      console.error("Failed to fetch users or data format is incorrect:", data.message);
      offlineUsers = [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    offlineUsers = [];
  }
}

function updateOnlineUsers(data) {
  const { userId, username, status } = data;
  if (
    status === "online" &&
    !onlineUsers.some((user) => user.userId === userId)
  ) {
    onlineUsers.push({ userId, username });
    offlineUsers = offlineUsers.filter((user) => user.username !== username);
  } else if (status === "offline") {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    if (!offlineUsers.some((user) => user.username === username)) {
      offlineUsers.push({ userId, username });
    }
  }
  renderOnlineUsers();
}

function removeDuplicateUsers() {
  offlineUsers = offlineUsers.filter(offlineUser => 
    !onlineUsers.some(onlineUser => onlineUser.username === offlineUser.username)
  );
}

function renderOnlineUsers() {
  const onlineUsersDiv = document.getElementById("online-users");
  const offlineUsersDiv = document.getElementById("offline-users");
  onlineUsersDiv.innerHTML = "";
  offlineUsersDiv.innerHTML = "";

  // Sort online users alphabetically and numerically
  onlineUsers.sort((a, b) => a.username.localeCompare(b.username, undefined, {numeric: true}));

  // Sort offline users alphabetically and numerically
  offlineUsers.sort((a, b) => a.username.localeCompare(b.username, undefined, {numeric: true}));

  onlineUsers.forEach((user) => {
    const userStatus = document.createElement("div");
    userStatus.setAttribute("data-user-id", user.userId);
    userStatus.textContent = `${user.username} is online`;
    userStatus.classList.add("online-user");
    userStatus.addEventListener("click", () => selectUser(user.userId));
    onlineUsersDiv.appendChild(userStatus);
  });

  offlineUsers.forEach((user) => {
    const userStatus = document.createElement("div");
    userStatus.setAttribute("data-user-id", user.userId);
    userStatus.textContent = `${user.username} is offline`;
    userStatus.classList.add("offline-user");
    userStatus.addEventListener("click", () => selectUser(user.userId));
    offlineUsersDiv.appendChild(userStatus);
  });
}

function selectUser(userID) {
  const user = [...onlineUsers, ...offlineUsers].find((user) => user.userId === userID);
  selectedUser = userID;
  document.getElementById("message-input").placeholder = `Message to ${user.username}`;
  const userElements = document.querySelectorAll(".online-user, .offline-user");
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
