// Create a new WebSocket connection
// JOHN sends to MARY
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTg2NDg3MTksInVzZXJfaWQiOiIyZDUwYTgxNy00NzIzLTRkMzEtOGFlZS1iYzdmODNjNjIwOTkifQ.-y9KPXuhNrqDKkt8T-3VOzQnltZ6Udwdc5uRPh80_b0'; // Replace with the actual JWT token
var socket = new WebSocket('ws://localhost:8080/ws?token=' + token);

// Connection opened
socket.addEventListener('open', function (event) {
    // Send a message after 5 seconds
    setTimeout(function () {
        var message1 = {
            ReceiverId: '2df2f85c-cc6e-483d-acb5-ec38ab26b2e9',
            Content: 'Hello, MARY! This is message 1.'
        };
        socket.send(JSON.stringify(message1));
    }, 5000);

    // Send a second message after 10 seconds
    setTimeout(function () {
        var message2 = {
            ReceiverId: '2df2f85c-cc6e-483d-acb5-ec38ab26b2e9',
            Content: 'Hello, MARY! This is message 2.'
        };
        socket.send(JSON.stringify(message2));
    }, 10000);

    // Send a third message after 15 seconds
    setTimeout(function () {
        var message3 = {
            ReceiverId: '2df2f85c-cc6e-483d-acb5-ec38ab26b2e9',
            Content: 'Hello, MARY! This is message 3.'
        };
        socket.send(JSON.stringify(message3));
    }, 15000);
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server: ', event.data);
});
