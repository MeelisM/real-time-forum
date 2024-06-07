# Declare PHONY targets.
.PHONY: all build run test clean

# Default target: Build, run and test the project.
all: build run test 

# Build the project.
build:
	@mkdir -p bin
	@go build -o bin/real-time-forum ./cmd

# Run the project.
run: build
	@./bin/real-time-forum

# Test the project.
test:
	@go test -v ./...

# Clean build artifacts.
clean:
	@rm -rf bin
