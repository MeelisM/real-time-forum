import { resetChatComponent } from './state.js';

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

// button to navigate back to user list in chat window
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

// button to close chat window
export function setupCloseButton(closeButtonId) {
  const closeButton = document.getElementById(closeButtonId);
  if (closeButton) {
    closeButton.addEventListener("click", (e) => {
      e.preventDefault();
      const chatContainer = document.getElementById("chat-container");
      chatContainer.style.display = "none";
      resetChatComponent();
    });
  } else {
    console.error("Close button not found!");
  }
}

// send messages with enter
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

// universal picture uploading function
export async function uploadPicture(formData, type) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8080/api/${type}/picture`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    return await response.json();
  } catch (error) {
    console.error(`Error uploading ${type} picture:`, error);
    throw error;
  }
}

export async function handlePictureSubmit(event, type) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const uploadError = document.getElementById(`${type}-upload-error`);
  const uploadSuccess = document.getElementById(`${type}-upload-success`);

  try {
    const response = await uploadPicture(formData, type);
    if (response.code === 200) {
      uploadSuccess.style.display = 'block';
      uploadError.style.display = 'none';
    } else {
      uploadError.innerText = response.message || `Failed to upload ${type} picture`;
      uploadError.style.display = 'block';
      uploadSuccess.style.display = 'none';
    }
  } catch (error) {
    console.error(`Error uploading ${type} picture:`, error);
    uploadError.innerText = `Failed to upload ${type} picture. Please try again.`;
    uploadError.style.display = 'block';
    uploadSuccess.style.display = 'none';
  }
}
