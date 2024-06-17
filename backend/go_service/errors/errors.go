package customErrors

import (
	"errors"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
)

var (
    ErrUserNotFound = errors.New("user not found")
    ErrPostNotFound = errors.New("post not found")
    ErrPostNotOwnedByUser = errors.New("post not owned by user")
    ErrUsernameAlreadyExists = errors.New("username already exists")
)

func CheckUserError (err error) error {
    if err == pgx.ErrNoRows {
        return ErrUserNotFound
    }
    if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
        return ErrUsernameAlreadyExists
    }
    return err
}

func CheckPostError (err error) error {
    if err == pgx.ErrNoRows {
        return ErrPostNotFound
    }
    if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
        return ErrUsernameAlreadyExists
    }
    return err
}