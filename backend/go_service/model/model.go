package model

import (
	"time"

	"github.com/google/uuid"
)

// the model of each row in each of the table, and some sample data

type UserInfo struct {
	UserID          int64     `json:"user_id"`
	Username        string    `json:"username"`
	UserEmail       string    `json:"user_email"`
	UserPhone       *string    `json:"user_phone"`
	Nickname		string	  `json:"nickname"`
	ProfilePicture  *string    `json:"profile_picture"`
	RegisterTime    time.Time `json:"register_time"`
	TotalViews 	    int64     `json:"total_views"`
	TotalComments   int64     `json:"total_comments"`
	TotalLikes      int64     `json:"total_likes"`
	UserExperience  int64     `json:"user_experience"`
	TotalPosts      int64	  `json:"total_posts"`
}

type UserAuth struct {
    Username        string `json:"username"`
    EncodedPassword string `json:"encoded_password"`
}

type Post struct {
	PostID       	uuid.UUID `json:"post_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Likes           int64     `json:"likes"`
	CategoryID      int64     `json:"category_id"`
	PostOwnerID     int64     `json:"post_owner_id"`
	PutOutTime      time.Time `json:"put_out_time"`
	PostDetails     string    `json:"post_details"`
	IsAvailable     bool      `json:"is_available"`
	ImageUrl        string    `json:"image_url"`
	Views           int64     `json:"views"`
}

type Comment struct {
	CommentID int64  `json:"comment_id"`
	PosterID   int64  `json:"poster_id"`
	Comment   string `json:"comment"`
	PostID uuid.UUID  `json:"post_id"`
	CommentTime	time.Time `json:"comment_time"`
}

type SubComment struct {
	SubCommentID int64  `json:"sub_comment_id"`
	PosterID   int64  `json:"poster_id"`
	Comment   string `json:"comment"`
	CommentID int64  `json:"comment_id"`
	CommentTime	time.Time `json:"comment_time"`
}

type Like struct {
	LikeID    int64     `json:"like_id"`
	PostID   uuid.UUID `json:"post_owner_id"`
	LikerID    int64 `json:"Liker_id"`
	DateTime   time.Time `json:"date_time"`
}

type Category struct {
	CategoryID   int64  `json:"order_id"`
	CategoryName string `json:"seller_id"`
}

type CountModel struct {
	Count int64 `json:"count"`
}

var Auths = []UserAuth{
	{
		Username: "antique_seller", EncodedPassword: "encrypted_password",
	},
	{
		Username: "antique_seller2", EncodedPassword: "encrypted_password2",
	},
}

var Users = []UserInfo{
	{
		UserID: 101, Username: "antique_seller", UserEmail: "antique@example.com",
		UserPhone: nil,  Nickname: "Ann",
		ProfilePicture: nil, RegisterTime: time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC),
		TotalComments: 3, TotalLikes: 1, TotalViews: 5, UserExperience: 17, TotalPosts: 0,
	},
	{
		UserID: 102, Username: "antique_seller2", UserEmail: "antique2@example.com",
		UserPhone: nil,  Nickname: "Johnny",
		ProfilePicture: nil, RegisterTime: time.Date(2023, 1, 2, 0, 0, 0, 0, time.UTC),
		TotalComments: 4, TotalLikes: 157, TotalViews: 23, UserExperience: 45, TotalPosts: 0,
	},
}

var uuid1 = uuid.New()
var uuid2 = uuid.New()
var time1 = time.Now()

var Comments = []Comment{
	{CommentID: 1, PosterID: 101, Comment: "not bad", PostID: uuid1, CommentTime: time1},
	{CommentID: 2, PosterID: 101, Comment: "pretty good", PostID: uuid1, CommentTime: time1},
}

var SubComments = []SubComment{
	{SubCommentID: 1, PosterID: 101, Comment: "not bad", CommentID: 2, CommentTime: time1},
}

var Posts = []Post{
	{
		PostID: uuid1, Title: "Vintage Vase", Description: "A beautiful antique vase from the 19th century.",
		Likes: 1500, CategoryID: 10, PostOwnerID: 101, PutOutTime: time.Date(2024, 4, 1, 3, 5, 7, 0, time.UTC),
		PostDetails: "Minor scratches are present.", IsAvailable: true,
		ImageUrl: "https://bit.ly/2Z4KKcF", Views: 2357,
	},
	{
		PostID: uuid2, Title: "Classic Clock", Description: "An elegant wall clock from the early 20th century.",
		Likes: 80, CategoryID: 10, PostOwnerID: 102, PutOutTime: time.Date(2024, 4, 1, 0, 12, 0, 0, time.UTC),
		PostDetails: "Perfectly functioning with authentic vintage design.", IsAvailable: true,
		ImageUrl: "https://i.pinimg.com/originals/47/a9/a5/47a9a581ba4e599ceb453dbd2fb3694b.jpg", Views: 165,
	},
}

var Likes = []Like{}

var Categories = []Category{
	{CategoryID: 10, CategoryName: "decorations"},
	{CategoryID: 18, CategoryName: "clothes"},
	{CategoryID: 3, CategoryName: "machines"},
}
