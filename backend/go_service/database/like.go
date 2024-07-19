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

func SaveLikeToSQL(like *model.Like) error {

	// save comment
	query := `INSERT INTO Likes (PostID, 
        Liker, DateTime) VALUES ($1, $2, $3)`

	_, err := dbPool.Exec(context.Background(),
		query, like.PostID, like.Liker,
		like.DateTime)
	if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23503" {
		// 23505 is the foreign key violation error code in PostgreSQL
		return customErrors.ErrUserOrPostNotFound
	}

	return err
}

func CheckIfLikedByUser(likeID int64, userID int64) (bool, error) {
	var likerID int64
    err := dbPool.QueryRow(context.Background(), "SELECT Liker FROM Likes WHERE LikeID=$1", likeID).Scan(&likerID)
    if err != nil {
        if errors.Is (err, pgx.ErrNoRows) {
            return false, customErrors.ErrLikeNotFound
        }
        return false, err
    }
    if likerID != userID {
        return false, customErrors.ErrNotLikedByUser
    }
    return true, nil
}

func DeleteLikeFromSQL(likeID int64)  error {

	// delete from db
	_, err := dbPool.Exec(context.Background(), "DELETE FROM Likes WHERE LikeID=$1", likeID)
	if err != nil {
		return err
	}

	return nil
}

func GetLikesByPostID(postID uuid.UUID, limit int, offset int) ([]model.Like, error) {

	// Check if user exists
    exists, err := checkIfPostExistsByID(postID)
    if err != nil {
        return nil, err
    }
    if !exists {
        return nil, customErrors.ErrPostNotFound
    }

	var likes []model.Like
	var query string
	var args []interface{}

	// use args to avoid sql injection
	query = `SELECT * FROM Likes WHERE PostID = $1 ORDER BY DateTime DESC LIMIT $2 OFFSET $3`
	args = append(args, postID, limit, offset)

	// search with sql statement
	rows, err := dbPool.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// add to result
	for rows.Next() {
		var like model.Like
		err := rows.Scan(&like.LikeID, &like.PostID, &like.Liker,
			&like.DateTime,
		)
		if err != nil {
			return nil, err
		}
		likes = append(likes, like)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return likes, nil
}

func GetTotalLikeCountByPostID(postID uuid.UUID) (int64, error) { // this includes comments and subComments
	exists, err := checkIfPostExistsByID(postID)
    if err != nil {
        return 0, err
    }
    if !exists {
        return 0, customErrors.ErrPostNotFound
    }

    query := `
        SELECT COUNT(*) FROM Likes WHERE postID = $1 ;
    `
    var totalCount int64
    err = dbPool.QueryRow(context.Background(), query, postID).Scan(&totalCount)
    if err != nil {
        return 0, err
    }

    return totalCount, nil
}