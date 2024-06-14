package errors

import (
	"encoding/json"
	"net/http"
)

type ErrorDetails struct {
	UserError string `json:"userError,omitempty"`
	DevError  string `json:"devError,omitempty"`
}

type Error struct {
	Code         int           `json:"code"`
	Message      string        `json:"message"`
	ErrorDetails *ErrorDetails `json:"errorDetails,omitempty"`
}

func Handle(w http.ResponseWriter, code int, userError string, devError error) {
	w.WriteHeader(code)
	err := Error{
		Code:    code,
		Message: http.StatusText(code),
		ErrorDetails: &ErrorDetails{
			UserError: userError,
			DevError:  "",
		},
	}
	if devError != nil {
		err.ErrorDetails.DevError = devError.Error()
	}
	json.NewEncoder(w).Encode(err)
}
