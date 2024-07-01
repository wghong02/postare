package customErrors

import (
	"errors"

	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
)

var (
    ErrUserNotFound = errors.New("user not found")
    ErrPostNotFound = errors.New("post not found")
    ErrUserOrPostNotFound = errors.New("user or post not found")
    ErrUserOrCommentNotFound = errors.New("user or comment not found")
    ErrCommentNotFound = errors.New("comment not found")
    ErrSubCommentNotFound = errors.New("subComment not found")
    ErrPostNotOwnedByUser = errors.New("post not owned by user")
    ErrCommentNotOwnedByUser = errors.New("comment not owned by user")
    ErrSubCommentNotOwnedByUser = errors.New("subComment not owned by user")
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
    return err
}

func CheckCommentError (err error) error {
    if err == pgx.ErrNoRows {
        return ErrCommentNotFound
    }
    return err
}