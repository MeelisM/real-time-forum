Build the project: `make build`

Run the project: `make run`

Test the project: `make test`

Clean build artifacts: `make clean`

Run all tasks (build, run, test): `make all`

```
real-time-forum
|-LICENSE
|-Makefile
|-README.md
|-cmd
| |-main.go
|-go.mod
|-go.sum
|-internal
| |-config
| | |-config.go
| |-database
| | |-database.go
| | |-forum.db
| |-errors
| | |-errors.go
| |-handlers
| | |-chat
| | | |-handler.go
| | | |-websocket.go
| | |-comment
| | | |-create.go
| | | |-handler.go
| | | |-list_by_post_id.go
| | |-post
| | | |-create.go
| | | |-handler.go
| | | |-list.go
| | |-user
| | | |-create.go
| | | |-handler.go
| | | |-login.go
| |-middleware
| | |-api_response.go
| | |-auth.go
| | |-cors.go
| |-models
| | |-comment.go
| | |-message.go
| | |-post.go
| | |-user.go
| |-router
| | |-router.go
| |-server
| | |-server.go
| |-services
| | |-chat.go
| | |-comment.go
| | |-post.go
| | |-user.go
|-web
| |-app.js
| |-components
| | |-forumPost.js
| | |-loginForm.js
| |-index.html
| |-package-lock.json
| |-package.json
| |-router.js
| |-views
| | |-forum.js
| | |-login.js
| |-webpack.config.js

```