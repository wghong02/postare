package errors

import "errors"

var (
    ErrUserNotFound = errors.New("user not found")
    ErrPostNotFound = errors.New("post not found")
    ErrPostNotOwnedByUser = errors.New("post not owned by user")
)
