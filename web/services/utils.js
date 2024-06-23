// helper function to scroll chat messages to bottom
export function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

// chat send button
export function setupSendButton(sendButtonId, sendMessageCallback) {
    const sendButton = document.getElementById(sendButtonId);
    if (sendButton) {
      sendButton.addEventListener("click", (e) => {
        e.preventDefault();
        sendMessageCallback();
      });
    } else {
      console.error("Send button not found!");
    }
  }
  
  // button to navigate back to user list in chat
  export function setupBackButton(backButtonId, goBackCallback) {
    const backButton = document.getElementById(backButtonId);
    if (backButton) {
      backButton.addEventListener("click", (e) => {
        e.preventDefault();
        goBackCallback();
      });
    } else {
      console.error("Back button not found!");
    }
  }
  
  // message input
  export function setupMessageInput(messageInputId, sendMessageCallback) {
    const messageInput = document.getElementById(messageInputId);
    if (messageInput) {
      messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          sendMessageCallback();
        }
      });
    } else {
      console.error("Message input not found!");
    }
  }