let onlineUsers = [];

export async function renderChat() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Chat</h1>
        <div id="online-users"></div>
        <div id="chat-messages"></div>
        <input type="text" id="message-input" placeholder="Type a message...">
        <button id="send-button">Send</button>
    `;

    const ws = new WebSocket(`ws://localhost:8080/ws?token=${localStorage.getItem('token')}`);

    ws.onopen = function () {
        console.log('Connected to chat');
    };

    ws.onerror = function (event) {
        console.error('WebSocket error:', event);
    };

    ws.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log('Received message:', data); // Debugging log
        if (data.type === 'user_status') {
            updateOnlineUsers(data);
        } else if (data.type === 'chat_message') {
            displayMessage(data);
        } else if (data.type === 'initial_online_users') {
            onlineUsers = data.userIDs;
            renderOnlineUsers();
        }
    };

    document.getElementById('send-button').addEventListener('click', () => {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value;
        messageInput.value = '';


        ws.send(JSON.stringify({ type: 'chat_message', content: message, receiverId: 'receiver_user_id' }));
    });


}

function updateOnlineUsers(data) {
    const { userID, status } = data;

    console.log('Updating online user:', userID, 'status:', status); // Debugging log
    if (status === 'online' && !onlineUsers.includes(userID)) {
        onlineUsers.push(userID);
    } else if (status === 'offline') {
        onlineUsers = onlineUsers.filter(user => user !== userID);
    }


    renderOnlineUsers();
}

function renderOnlineUsers() {
    const onlineUsersDiv = document.getElementById('online-users');


    onlineUsersDiv.innerHTML = '';
    onlineUsers.forEach(userID => {
        const userStatus = document.createElement('div');
        userStatus.setAttribute('data-user-id', userID);
        userStatus.textContent = `${userID} is online`;
        onlineUsersDiv.appendChild(userStatus);
    });
}

function displayMessage(messageData) {
    const chatMessagesDiv = document.getElementById('chat-messages');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    messageDiv.innerHTML = `
        <p><strong>${messageData.senderId}:</strong> ${messageData.content}</p>
    `;

    chatMessagesDiv.appendChild(messageDiv);
}
