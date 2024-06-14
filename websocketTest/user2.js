// Create a new WebSocket connection
// MARY sends to JOHN
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTg2NDg2NjUsInVzZXJfaWQiOiIyZGYyZjg1Yy1jYzZlLTQ4M2QtYWNiNS1lYzM4YWIyNmIyZTkifQ.wtyLWiMWNPsXYmOTZjnd3PHz1z6CAawzpQD-qjxS2XM'; // Replace with the actual JWT token
var socket = new WebSocket('ws://localhost:8080/ws?token=' + token);

// Connection opened
socket.addEventListener('open', function (event) {
    // Send a message after 5 seconds
    setTimeout(function () {
        var message1 = {
            ReceiverId: '2d50a817-4723-4d31-8aee-bc7f83c62099',
            Content: 'Hi JOHN message 1.'
        };
        socket.send(JSON.stringify(message1));
    }, 5000);

    // Send a second message after 10 seconds
    setTimeout(function () {
        var message2 = {
            ReceiverId: '2d50a817-4723-4d31-8aee-bc7f83c62099',
            Content: 'HI JOHN message 2.'
        };
        socket.send(JSON.stringify(message2));
    }, 10000);

    // Send a third message after 15 seconds
    setTimeout(function () {
        var message3 = {
            ReceiverId: '2d50a817-4723-4d31-8aee-bc7f83c62099',
            Content: 'HI JOHN message 3.'
        };
        socket.send(JSON.stringify(message3));
    }, 15000);
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server: ', event.data);
});
