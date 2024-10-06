import state from "./state.js";
import { renderChatMessages, displayMessage } from "./chat.js";
import {
  updateOnlineUsers,
  removeDuplicateUsers,
  renderOnlineUsers,
} from "./user.js";

function setupWebSocket() {
  let wsUrl = `ws://localhost:8080/ws?token=${localStorage.getItem(
    "authToken"
  )}`;
  state.ws = new WebSocket(wsUrl);

  state.ws.onopen = function () {
    const token = localStorage.getItem("authToken");
    const payload = JSON.parse(atob(token.split(".")[1]));
    state.loggedInUserId = payload.user_id;
  };

  state.ws.onerror = function (event) {
    console.error("WebSocket error:", event);
  };

  state.ws.onclose = function (event) {
    setTimeout(() => setupWebSocket(), 5000);
  };

  state.ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    handleWebSocketData(data);
  };
}

function handleWebSocketData(data) {
  switch (data.type) {
    case "chat_history":
      state.messages = data.messages || [];
      renderChatMessages();
      break;
    case "user_status":
      updateOnlineUsers(data);
      break;
    case "chat_message":
      displayMessage(data);
      break;
    case "initial_online_users":
      state.onlineUsers = data.onlineUsers;
      removeDuplicateUsers();
      if (
        document.getElementById("online-users") &&
        document.getElementById("offline-users")
      ) {
        renderOnlineUsers();
      } else {
        console.error("User list containers not found!");
      }
      break;
    default:
  }
}

export { setupWebSocket, handleWebSocketData };
