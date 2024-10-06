# real-time-forum

A forum where an user can register, create posts & comments and live chat with other users.

## Getting started

#### Clone the repository

```
git clone https://01.kood.tech/git/mmumm/real-time-forum.git
cd real-time-forum
```

Create an `.env` file or rename `.env-example` to `.env`.

```
PORT=8080
JWT_SECRET=somesecret
ORIGIN_ALLOWLIST=http://127.0.0.1:8081,http://localhost:8081
```

## Usage

#### Start the backend server

```
go run cmd/main.go
```

#### Start the frontend server

Navigate to the frontend folder

```
cd web
```

Install Node packages

```
npm install
```

Run the development environment

```
npm run dev
```

Visit

```
http://localhost:8081
```

## Docker

#### Run everything with Docker

```
docker-compose up --build
```

Backend will run at `http://localhost:8080`.
Frontend will run at `http://localhost:8081`.

### Test users

```
username: user
password: password
email: user@user.com

username: anotherUser
password: password
email: anotherUser@user.com
```

##### Authors: Tabel Dubolazov, Meelis Mumm
