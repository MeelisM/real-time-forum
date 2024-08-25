FROM golang:1.22-alpine

WORKDIR /app

RUN apk add --no-cache build-base sqlite-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 go build -o /go-backend ./cmd/main.go

EXPOSE 8080

CMD ["/go-backend"]
