# Start from the official Go image to create a build artifact.
FROM golang:1.22 as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod tidy
RUN go mod download

# Copy the source code into the container
COPY . .

# Copy .env file
COPY ./.env /app/.env
RUN ls -al  # This will list all files in the /app directory

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Start a new stage from scratch
FROM alpine:latest  

# Copy the Pre-built binary file from the previous stage
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

# Expose port 8081 to the outside world
EXPOSE 8081

# Command to run the executable
CMD ["./main"]
