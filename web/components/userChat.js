import { setupWebSocket } from '../services/websocket.js';
import { sendMessage, initializeChatButton } from '../services/chat.js';
import { fetchAllUsers, goBackToUserList, renderUserList, selectUser } from '../services/user.js';
import { setupSendButton, setupBackButton, setupMessageInput, setupCloseButton } from '../services/utils.js';
import { resetChatComponent } from '../services/state.js';

export async function ChatComponent() {
  const chatContainer = document.getElementById("chat-container");
  if (!chatContainer) {
    console.error("Chat container not found!");
    return;
  }

  chatContainer.innerHTML = `
    <div id="chat-header">
      <span class="chat-title">Chat</span>
      <div class="header-buttons">
        <button id="back-button" class="button back-button" style="display: none;"></button>
        <button id="close-chat-button" class="button close-button"></button>
      </div>
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

  setupSendButton("send-button", sendMessage);
  setupBackButton("back-button", goBackToUserList);
  setupMessageInput("message-input", sendMessage);

  setupCloseButton("close-chat-button");

  initializeChatButton(ChatComponent);
  renderUserList(); 
}
