import { setupWebSocket } from '../services/websocket.js';
import { sendMessage, initializeChatButton } from '../services/chat.js';
import { fetchAllUsers, goBackToUserList } from '../services/user.js';
import { setupSendButton, setupBackButton, setupMessageInput } from '../services/utils.js';
import { resetChatComponent } from '../services/state.js';

export async function ChatComponent() {
  const chatContainer = document.getElementById("chat-container");
  if (!chatContainer) {
    console.error("Chat container not found!");
    return;
  }

  chatContainer.innerHTML = `
    <div id="chat-header">
      <span>Chat</span>
      <button id="close-chat-button">Close</button>
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

  // Fetch all users and set up WebSocket
  await fetchAllUsers();
  setupWebSocket();

  // Set up the send button, back button, and message input
  setupSendButton("send-button", sendMessage);
  setupBackButton("back-button", goBackToUserList);
  setupMessageInput("message-input", sendMessage);

  // Add event listener to the close button to hide the chat and reset the component
  document.getElementById("close-chat-button").addEventListener("click", () => {
    chatContainer.style.display = "none";
    resetChatComponent();
  });

  // Initialize the chat button to open the chat
  initializeChatButton(ChatComponent);
}
