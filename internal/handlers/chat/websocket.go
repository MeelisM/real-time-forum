package chat

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/config"
	"01.kood.tech/git/mmumm/real-time-forum.git/internal/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Client struct {
	Conn     *websocket.Conn
	Send     chan []byte
	UserId   string
	Username string
	Handler  *Handler
}

var clients = make(map[*Client]bool)
var onlineUsers = make(map[string]*Client)
var broadcast = make(chan []byte)
var mu sync.Mutex

func (h *Handler) HandleConnections(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token == "" {
		http.Error(w, "Authentication token is required", http.StatusBadRequest)
		return
	}
	userId, username, err := validateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	client := &Client{Conn: ws, Send: make(chan []byte), UserId: userId, Username: username, Handler: h}
	mu.Lock()
	clients[client] = true
	onlineUsers[userId] = client
	mu.Unlock()
	log.Printf("User connected: %s", userId)
	notifyUserStatus(userId, username, "online")
	go handleMessages(client)
	sendInitialOnlineUsers(client)
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			break
		}
		var incomingMessage models.Message
		err = json.Unmarshal(msg, &incomingMessage)
		if err != nil {
			log.Printf("error parsing message: %v", err)
			continue
		}
		switch incomingMessage.Type {
		case "chat_message":
			handleChatMessage(client, incomingMessage)
		case "get_chat_history":
			sendChatHistory(client, incomingMessage.ReceiverId)
		default:
			log.Printf("Unknown message type: %s", incomingMessage.Type)
		}
	}
	mu.Lock()
	delete(clients, client)
	delete(onlineUsers, userId)
	mu.Unlock()
	close(client.Send)
	log.Printf("User disconnected: %s", userId)
	notifyUserStatus(userId, username, "offline")
}
func handleChatMessage(client *Client, incomingMessage models.Message) {
	message := models.Message{
		Id:         uuid.New().String(),
		Content:    incomingMessage.Content,
		SenderId:   client.UserId,
		ReceiverId: incomingMessage.ReceiverId,
	}
	err := client.Handler.ChatService.Create(&message)
	if err != nil {
		log.Printf("error saving message: %v", err)
	}
	messageData, err := json.Marshal(map[string]interface{}{
		"type":       "chat_message",
		"id":         message.Id,
		"content":    message.Content,
		"senderId":   message.SenderId,
		"receiverId": message.ReceiverId,
		"createdAt":  message.CreatedAt,
	})
	if err != nil {
		log.Printf("error marshalling message data: %v", err)
		return
	}
	if receiver, ok := onlineUsers[message.ReceiverId]; ok {
		receiver.Send <- messageData
	}
}
func handleMessages(client *Client) {
	for {
		msg, ok := <-client.Send
		if !ok {
			log.Printf("Send channel closed for user: %s", client.UserId)
			return
		}
		err := client.Conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			log.Printf("error writing to websocket: %v", err)
			return
		}
	}
}
func HandleBroadcast() {
	for {
		msg := <-broadcast
		mu.Lock()
		for client := range clients {
			log.Printf("Broadcasting to client: %s", client.UserId)
			select {
			case client.Send <- msg:
			default:
				delete(clients, client)
			}
		}
		mu.Unlock()
	}
}
func notifyUserStatus(userId, username, status string) {
	statusMessage := fmt.Sprintf(`{"type": "user_status", "userId": "%s", "username": "%s", "status": "%s"}`, userId, username, status)
	log.Printf("Notify user status: %s", statusMessage)
	message := []byte(statusMessage)
	broadcast <- message
}
func validateToken(tokenString string) (string, string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.LoadConfig().JWTSecret), nil
	})
	if err != nil || !token.Valid {
		return "", "", fmt.Errorf("invalid token")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", "", fmt.Errorf("invalid token claims")
	}
	userId, ok := claims["user_id"].(string)
	if !ok {
		return "", "", fmt.Errorf("invalid user ID in token")
	}
	username, ok := claims["username"].(string)
	if !ok {
		return "", "", fmt.Errorf("invalid username in token")
	}
	return userId, username, nil
}
func sendInitialOnlineUsers(client *Client) {
	mu.Lock()
	defer mu.Unlock()
	var onlineUsersList []map[string]string
	for _, c := range onlineUsers {
		onlineUsersList = append(onlineUsersList, map[string]string{
			"userId":   c.UserId,
			"username": c.Username,
		})
	}
	initialUsersMessage, err := json.Marshal(map[string]interface{}{
		"type":        "initial_online_users",
		"onlineUsers": onlineUsersList,
	})
	if err != nil {
		log.Printf("error marshalling initial online users: %v", err)
		return
	}
	client.Send <- initialUsersMessage
}
func sendChatHistory(client *Client, userId string) {
	messages, err := client.Handler.ChatService.GetMessagesByUserID(userId)
	if err != nil {
		log.Printf("error fetching chat history: %v", err)
		return
	}
	historyMessage, err := json.Marshal(map[string]interface{}{
		"type":     "chat_history",
		"messages": messages,
	})
	if err != nil {
		log.Printf("error marshalling chat history: %v", err)
		return
	}
	client.Send <- historyMessage
}
