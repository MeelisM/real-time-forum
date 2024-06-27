const state = {
    ws: null,
    loggedInUserId: null,
    messages: [],
    onlineUsers: [],
    offlineUsers: [],
    selectedUser: null,
    chatInitialized: false
  };

  // Used to avoid running multiple chats at once
  export function resetChatComponent() {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.innerHTML = '';
    }
  
    // Reset state
    state.chatInitialized = false;
    state.messages = [];
    state.onlineUsers = [];
    state.offlineUsers = [];
    state.selectedUser = null;
  
    if (state.ws) {
      state.ws.close();
      state.ws = null;
    }
  }
  
  export default state;
  
  