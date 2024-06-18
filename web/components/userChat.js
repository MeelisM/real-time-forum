let onlineUsers = [];
let offlineUsers = [];
let selectedUser = null;
let messages = [];
let ws = null;
let loggedInUserId = null; // Store the logged-in user's ID

function getUsernameById(userId) {
  const user = [...onlineUsers, ...offlineUsers].find(user => user.userId === userId);
  return user ? user.username : 'Unknown';
}

export async function renderChat() {
  const chatContainer = document.getElementById("chat-container");
  if (!chatContainer) {
    console.error("Chat container not found!");
    return;
  }

  chatContainer.innerHTML = `
    <div id="chat-header">
      <button id="back-button" style="display: none;">Back</button>
      <span>Chat</span>
    </div>
    <div id="chat-body">
      <div id="user-list-container">
        <div id="online-users"></div>
        <div id="offline-users"></div>
      </div>
      <div id="chat-messages-container" style="display: none;">
        <div id="chat-messages"></div>
        <div id="message-input-container">
          <input type="text" id="message-input" placeholder="Message" />
          <button type="button" id="send-button">Send</button>
        </div>
      </div>
    </div>
  `;

  await fetchAllUsers();
  setupWebSocket();

  document.getElementById("send-button").addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
  });

  document.getElementById("back-button").addEventListener("click", (e) => {
    e.preventDefault();
    goBackToUserList();
  });
}

function setupWebSocket() {
  let wsUrl = `ws://localhost:8080/ws?token=${localStorage.getItem("authToken")}`;
  ws = new WebSocket(wsUrl);

  ws.onopen = function () {
    console.log("Connected to chat");
    const token = localStorage.getItem("authToken");
    const payload = JSON.parse(atob(token.split('.')[1]));
    loggedInUserId = payload.user_id;
  };

  ws.onerror = function (event) {
    console.error("WebSocket error:", event);
  };

  ws.onclose = function(event) {
    console.log("WebSocket is closed now. Attempting to reconnect...");
    setTimeout(() => setupWebSocket(), 5000); // Try to reconnect every 5 seconds
  };

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("Received message:", data);
    handleWebSocketData(data);
  };
}

function handleWebSocketData(data) {
  switch (data.type) {
    case "chat_history":
      messages = data.messages || []; // Handle null messages
      renderChatMessages();
      break;
    case "user_status":
      updateOnlineUsers(data);
      break;
    case "chat_message":
      displayMessage(data);
      break;
    case "initial_online_users":
      onlineUsers = data.onlineUsers;
      removeDuplicateUsers();
      renderOnlineUsers();
      break;
    default:
      console.log("Unknown message type:", data.type);
  }
}

function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();
  if (message && selectedUser) {
    const messageData = {
      type: "chat_message",
      content: message,
      receiverId: selectedUser,
      senderId: loggedInUserId // Use the logged-in user's ID
    };
    ws.send(JSON.stringify(messageData));
    messageInput.value = "";
    // Display the sent message immediately
    displayMessage(messageData);
  }
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
    console.log("Fetched users:", data);

    if (data.code === 200 && data.data && Array.isArray(data.data.data)) {
      offlineUsers = data.data.data.map(user => ({
        userId: user.id,
        username: user.username
      }));
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
  if (status === "online" && !onlineUsers.some((user) => user.userId === userId)) {
    onlineUsers.push({ userId, username });
    offlineUsers = offlineUsers.filter((user) => user.userId !== userId);
  } else if (status === "offline") {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    if (!offlineUsers.some((user) => user.userId === userId)) {
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

  onlineUsers.forEach((user) => {
    const userStatus = document.createElement("div");
    userStatus.setAttribute("data-user-id", user.userId);
    userStatus.textContent = `${user.username} is online`;
    userStatus.classList.add("user-status", "online-user");
    userStatus.addEventListener("click", () => selectUser(user.userId));
    onlineUsersDiv.appendChild(userStatus);
  });

  offlineUsers.forEach((user) => {
    const userStatus = document.createElement("div");
    userStatus.setAttribute("data-user-id", user.userId);
    userStatus.textContent = `${user.username} is offline`;
    userStatus.classList.add("user-status", "offline-user");
    userStatus.addEventListener("click", () => selectUser(user.userId));
    offlineUsersDiv.appendChild(userStatus);
  });
}

function selectUser(userID) {
  const user = [...onlineUsers, ...offlineUsers].find((user) => user.userId === userID);
  selectedUser = userID;
  document.getElementById("chat-header").innerHTML = `
    <button id="back-button">Back</button>
    <span>${user.username}</span>
  `;
  document.getElementById("back-button").addEventListener("click", (e) => {
    e.preventDefault();
    goBackToUserList();
  });
  document.getElementById("chat-messages-container").style.display = "flex";
  document.getElementById("user-list-container").style.display = "none";
  document.getElementById("message-input").placeholder = `Message to ${user.username}`;
  const userElements = document.querySelectorAll(".online-user, .offline-user");
  userElements.forEach((element) => {
    if (element.getAttribute("data-user-id") === userID) {
      element.classList.add("selected");
    } else {
      element.classList.remove("selected");
    }
  });

  // Request chat history for the selected user
  ws.send(JSON.stringify({ type: "get_chat_history", receiverId: selectedUser }));
}

function goBackToUserList() {
  selectedUser = null;
  document.getElementById("chat-header").innerHTML = `<span>Chat</span>`;
  renderUserList();
}

function renderUserList() {
  document.getElementById("chat-messages-container").style.display = "none";
  document.getElementById("user-list-container").style.display = "block";
  renderOnlineUsers();
}

function renderChatMessages() {
  const chatMessagesDiv = document.getElementById("chat-messages");
  if (chatMessagesDiv) {
      chatMessagesDiv.innerHTML = messages
          .filter(message => (message.receiverId === selectedUser && message.senderId === loggedInUserId) ||
                             (message.senderId === selectedUser && message.receiverId === loggedInUserId))
          .map(message => `
              <div class="message">
                  <strong>${message.senderId === loggedInUserId ? "You" : getUsernameById(message.senderId)}:</strong>
                  ${message.content}
              </div>
          `).join('');
  }
}

function displayMessage(messageData) {
  messages.push(messageData);
  if ((messageData.receiverId === selectedUser && messageData.senderId === loggedInUserId) ||
      (messageData.senderId === selectedUser && messageData.receiverId === loggedInUserId)) {
      renderChatMessages();
  }
}
