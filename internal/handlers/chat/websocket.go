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
	Conn    *websocket.Conn
	Send    chan []byte
	UserID  string
	Handler *Handler
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

	userID, err := validateToken(token)
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	client := &Client{Conn: ws, Send: make(chan []byte), UserID: userID, Handler: h}

	mu.Lock()
	clients[client] = true
	onlineUsers[userID] = client
	mu.Unlock()

	log.Printf("User connected: %s", userID)
	notifyUserStatus(userID, "online")

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

		message := models.Message{
			Id:         uuid.New().String(),
			Content:    incomingMessage.Content,
			SenderId:   userID,
			ReceiverId: incomingMessage.ReceiverId,
		}

		err = h.ChatService.CreateMessage(&message)
		if err != nil {
			log.Printf("error saving message: %v", err)
		}

		if receiver, ok := onlineUsers[message.ReceiverId]; ok {
			receiver.Send <- msg
		}
	}

	mu.Lock()
	delete(clients, client)
	delete(onlineUsers, userID)
	mu.Unlock()
	close(client.Send)

	log.Printf("User disconnected: %s", userID)
	notifyUserStatus(userID, "offline")
}

func handleMessages(client *Client) {
	for {
		msg, ok := <-client.Send
		if !ok {
			log.Printf("Send channel closed for user: %s", client.UserID)
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
			log.Printf("Broadcasting to client: %s", client.UserID)
			select {
			case client.Send <- msg:
			default:
				delete(clients, client)
			}
		}
		mu.Unlock()
	}
}

func notifyUserStatus(userID, status string) {
	statusMessage := fmt.Sprintf(`{"type": "user_status", "userID": "%s", "status": "%s"}`, userID, status)
	log.Printf("Notify user status: %s", statusMessage)
	message := []byte(statusMessage)
	broadcast <- message
}

func validateToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(config.LoadConfig().JWTSecret), nil
	})

	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return "", fmt.Errorf("invalid user ID in token")
	}

	return userID, nil
}

func sendInitialOnlineUsers(client *Client) {
	mu.Lock()
	defer mu.Unlock()

	var onlineUserIDs []string
	for _, c := range onlineUsers {
		onlineUserIDs = append(onlineUserIDs, c.UserID)
	}

	initialUsersMessage, err := json.Marshal(map[string]interface{}{
		"type":    "initial_online_users",
		"userIDs": onlineUserIDs,
	})
	if err != nil {
		log.Printf("error marshalling initial online users: %v", err)
		return
	}

	client.Send <- initialUsersMessage
}
