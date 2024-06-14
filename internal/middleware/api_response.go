package middleware

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"time"

	"01.kood.tech/git/mmumm/real-time-forum.git/internal/errors"
)

type ApiResponse struct {
	Code         int                  `json:"code"`
	Message      string               `json:"message"`
	Timestamp    string               `json:"timestamp"`
	ErrorDetails *errors.ErrorDetails `json:"errorDetails,omitempty"`
	Data         interface{}          `json:"data,omitempty"`
}

func SendApiResponse(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		recorder := httptest.NewRecorder()
		next.ServeHTTP(recorder, r)

		response := ApiResponse{
			Code:      recorder.Code,
			Message:   http.StatusText(recorder.Code),
			Timestamp: time.Now().Format(time.RFC3339),
		}

		if recorder.Code >= 400 && recorder.Code < 600 {
			var err errors.Error
			json.NewDecoder(recorder.Body).Decode(&err)
			response.Message = err.Message
			response.ErrorDetails = err.ErrorDetails
		} else {
			err := json.NewDecoder(recorder.Body).Decode(&response.Data)
			if err != nil {
				response.Message = err.Error()
				response.Data = nil
			}
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(recorder.Code)
		json.NewEncoder(w).Encode(response)
	})
}
