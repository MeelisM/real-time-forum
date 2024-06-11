package middleware

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
)

type ApiResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func SendApiResponse(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		recorder := httptest.NewRecorder()
		next.ServeHTTP(recorder, r)

		response := ApiResponse{
			Code:    recorder.Code,
			Message: http.StatusText(recorder.Code),
		}

		if recorder.Code >= 400 && recorder.Code < 600 {
			bodyBytes, _ := io.ReadAll(recorder.Body)
			response.Message = string(bodyBytes)
		} else {
			err := json.NewDecoder(recorder.Body).Decode(&response.Data)
			if err != nil {
				response.Message = err.Error()
				response.Data = nil
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})
}
