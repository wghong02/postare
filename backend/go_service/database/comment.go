package sqlMethods

import (
	customErrors "appBE/errors"
	"appBE/model"
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgconn"
	"github.com/jackc/pgx/v4"
)

func SaveCommentToSQL(comment *model.Comment) error {

	// save comment
	query := `INSERT INTO Comments (PosterID, 
        Comment, PostID, CommentTime) VALUES ($1, $2, $3, $4)`

	_, err := dbPool.Exec(context.Background(),
		query, comment.PosterID, comment.Comment,
		comment.PostID, comment.CommentTime)
	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23503" {
		// 23505 is the foreign key violation error code in PostgreSQL
		return customErrors.ErrUserOrPostNotFound
	}

	return err
}

func SaveSubCommentToSQL(subComment *model.SubComment) error {

	// save subComment
	query := `INSERT INTO SubComments (PosterID, 
        Comment, CommentID, CommentTime) VALUES ($1, $2, $3, $4)`

	_, err := dbPool.Exec(context.Background(),
		query, subComment.PosterID, subComment.Comment,
		subComment.CommentID, subComment.CommentTime)
	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23503" {
		// 23505 is the foreign key violation error code in PostgreSQL
		return customErrors.ErrUserOrCommentNotFound
	}	

	return err
}

func DeleteCommentFromSQL(commentID int64)  error {

	// delete from db
	result, err := dbPool.Exec(context.Background(), "DELETE FROM Comments WHERE CommentID=$1", commentID)
	if err != nil {
		return err
	}
	// if comment does not exist, the 0 row is affected
	if result.RowsAffected() == 0 {
        return customErrors.ErrCommentNotFound
    }

	return nil
}

func DeleteSubCommentFromSQL(subCommentID int64)  error {

	// delete from db
	result, err := dbPool.Exec(context.Background(), "DELETE FROM SubComments WHERE SubCommentID=$1", subCommentID)
	if err != nil {
		return err
	}
	// if post does not exist, the 0 row is affected
	if result.RowsAffected() == 0 {
        return customErrors.ErrSubCommentNotFound
    }

	return nil
}

func CheckIfCommentOwnedByUser(commentID int64, userID int64) (bool, error) {
	var commentOwnerID int64
    err := dbPool.QueryRow(context.Background(), "SELECT posterID FROM Comments WHERE CommentID=$1", commentID).Scan(&commentOwnerID)
    if err != nil {
        if errors.Is (err, pgx.ErrNoRows) {
            return false, customErrors.ErrCommentNotFound
        }
        return false, err
    }
    if commentOwnerID != userID {
        return false, customErrors.ErrCommentNotOwnedByUser
    }
    return true, nil
}

func CheckIfSubCommentOwnedByUser(subCommentID int64, userID int64) (bool, error) {
	var commentOwnerID int64
    err := dbPool.QueryRow(context.Background(), "SELECT posterID FROM SubComments WHERE SubCommentID=$1", subCommentID).Scan(&commentOwnerID)
    if err != nil {
        if errors.Is (err, pgx.ErrNoRows) {
            return false, customErrors.ErrSubCommentNotFound
        }
        return false, err
    }
    if commentOwnerID != userID {
        return false, customErrors.ErrSubCommentNotOwnedByUser
    }
    return true, nil
}

func GetCommentsByPostID(postID uuid.UUID, limit int, offset int) ([]model.Comment, error) {

	// Check if user exists
    exists, err := checkIfPostExistsByID(postID)
    if err != nil {
        return nil, err
    }
    if !exists {
        return nil, customErrors.ErrPostNotFound
    }

	var comments []model.Comment
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Comments WHERE PostID = $1 ORDER BY CommentTime DESC LIMIT $2 OFFSET $3`
	args = append(args, postID, limit, offset)

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var comment model.Comment
		err := rows.Scan(&comment.CommentID, &comment.PosterID, &comment.Comment,
			&comment.PostID, &comment.CommentTime,
		)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return comments, nil
}

func checkIfCommentExistsByID(commentID int64) (bool, error) {
    var exists bool
    err := dbPool.QueryRow(context.Background(), "SELECT EXISTS(SELECT 1 FROM Comments WHERE CommentID=$1)", commentID).Scan(&exists)
    if err != nil {
        return false, err
    }
    return exists, nil
}

func GetSubCommentsByCommentID(commentID int64, limit int, offset int) ([]model.SubComment, error) {

	// Check if user exists
    exists, err := checkIfCommentExistsByID(commentID)
    if err != nil {
        return nil, err
    }
    if !exists {
        return nil, customErrors.ErrCommentNotFound
    }

	var subComments []model.SubComment
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM SubComments WHERE CommentID = $1 ORDER BY CommentTime DESC LIMIT $2 OFFSET $3`
	args = append(args, commentID, limit, offset)

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var subComment model.SubComment
		err := rows.Scan(&subComment.SubCommentID, &subComment.PosterID, &subComment.Comment,
			&subComment.CommentID, &subComment.CommentTime, 
		)
		if err != nil {
			return nil, err
		}
		subComments = append(subComments, subComment)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return subComments, nil
}