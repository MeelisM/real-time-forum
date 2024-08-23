import state, { resetChatComponent } from "./state.js";
import { getUsernameById } from "./user.js";
import { scrollToBottom } from "./utils.js";

export function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();
  if (message && state.selectedUser) {
    const messageData = {
      type: "chat_message",
      content: message,
      receiverId: state.selectedUser,
      senderId: state.loggedInUserId, // Use the logged-in user's ID
    };
    state.ws.send(JSON.stringify(messageData));
    messageInput.value = "";
    // Display the sent message immediately
    displayMessage(messageData);
  }
}

export function renderChatMessages() {
  const chatMessagesDiv = document.getElementById("chat-messages");
  if (chatMessagesDiv) {
    chatMessagesDiv.innerHTML = state.messages
      .filter(
        (message) =>
          (message.receiverId === state.selectedUser &&
            message.senderId === state.loggedInUserId) ||
          (message.senderId === state.selectedUser &&
            message.receiverId === state.loggedInUserId)
      )
      .map(
        (message) => `
        <div class="message ${
          message.senderId === state.loggedInUserId ? "sent" : "received"
        }">
          <strong>${
            message.senderId === state.loggedInUserId
              ? "You"
              : getUsernameById(message.senderId)
          }:</strong>
          <p>${message.content}</p>
        </div>
      `
      )
      .join("");
    scrollToBottom(chatMessagesDiv);
  }
}

export function displayMessage(messageData) {
  state.messages.push(messageData);
  if (
    (messageData.receiverId === state.selectedUser &&
      messageData.senderId === state.loggedInUserId) ||
    (messageData.senderId === state.selectedUser &&
      messageData.receiverId === state.loggedInUserId)
  ) {
    renderChatMessages();
  }
}

export function initializeChatButton(ChatComponent) {
  const chatLink = document.getElementById("chat-link");
  if (chatLink) {
    chatLink.addEventListener("click", (e) => {
      e.preventDefault();
      const chatContainer = document.getElementById("chat-container");
      if (!state.chatInitialized) {
        chatContainer.style.display = "block";
        chatContainer.classList.add("initial");
        ChatComponent();
        state.chatInitialized = true;
      } else {
        chatContainer.style.display = "block";
        chatContainer.classList.add("initial");
      }
    });
  }
}
