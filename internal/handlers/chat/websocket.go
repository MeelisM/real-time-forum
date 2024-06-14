package chat

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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
	clients[client] = true
	onlineUsers[userID] = client

	go handleMessages(client)

	notifyUserStatus(userID, "online")

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, client)
			delete(onlineUsers, userID)
			close(client.Send)
			notifyUserStatus(userID, "offline")
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
}

func handleMessages(client *Client) {
	for {
		msg, ok := <-client.Send
		if !ok {
			return
		}
		client.Conn.WriteMessage(websocket.TextMessage, msg)
	}
}

func HandleBroadcast() {
	for {
		msg := <-broadcast
		for client := range clients {
			select {
			case client.Send <- msg:
			default:
				delete(clients, client)
			}
		}
	}
}

func notifyUserStatus(userID, status string) {
	statusMessage := []byte(fmt.Sprintf(`{"userID": "%s", "status": "%s"}`, userID, status))
	broadcast <- statusMessage
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
