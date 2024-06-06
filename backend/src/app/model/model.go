package model

import (
	"time"

	"github.com/google/uuid"
)

// the model of each row in each of the table, and some sample data

type User struct {
	UserID         int64     `json:"user_id"`
	Username       string    `json:"username"`
	UserEmail      string    `json:"user_email"`
	UserPhone      string    `json:"user_phone"`
	Password       string    `json:"password"`
	Address        string    `json:"address"`
	ProfilePicture string    `json:"profile_picture"`
	RegisterDate   time.Time `json:"register_date"`
	UserRating     float64   `json:"user_rating"`
	TotalItemsSold int       `json:"total_items_sold"`
	TotalReviews   int64     `json:"total_reviews"`
}

type Product struct {
	ProductID       uuid.UUID `json:"product_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Price           int64     `json:"price"`
	CategoryID      int64     `json:"category_id"`
	SellerID        int64     `json:"seller_id"`
	Condition       string    `json:"condition"`
	PutOutTime      time.Time `json:"put_out_time"`
	ProductLocation string    `json:"product_location"`
	ProductDetails  string    `json:"product_details"`
	Status          string    `json:"status"`
	ImageUrl        string    `json:"image_url"`
	Views           int64     `json:"views"`
}

type Comment struct {
	CommentID int64  `json:"comment_id"`
	BuyerID   int64  `json:"buyer_id"`
	Comment   string `json:"comment"`
	ProductID int64  `json:"product_id"`
	SellerID  int64  `json:"seller_id"`
}

type Order struct {
	OrderID    int64     `json:"order_id"`
	SellerID   uuid.UUID `json:"seller_id"`
	BuyerID    uuid.UUID `json:"buyer_id"`
	DateTime   time.Time `json:"date_time"`
	PriceTotal int64     `json:"price_total"`
}

type OrderProduct struct {
	DetailID  int64     `json:"detail_id"`
	OrderID   int64     `json:"order_id"`
	ProductID uuid.UUID `json:"product_id"`
}

type Category struct {
	CategoryID   int64  `json:"order_id"`
	CategoryName string `json:"seller_id"`
}

var Users = []User{
	{
		UserID: 101, Username: "antique_seller", UserEmail: "antique@example.com",
		UserPhone: "+1234567890", Password: "encrypted_password", Address: "123 Vintage St, Oldtown",
		ProfilePicture: "profile_pic_url.jpg", RegisterDate: time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC),
		UserRating: 4.5, TotalItemsSold: 1, TotalReviews: 5,
	},
	{
		UserID: 102, Username: "Johnny", UserEmail: "antique2@example.com",
		UserPhone: "+134562897", Password: "encrypted_password2", Address: "1234 Vintage St, Oldtown",
		ProfilePicture: "profile_pic_url2.jpg", RegisterDate: time.Date(2023, 1, 2, 0, 0, 0, 0, time.UTC),
		UserRating: 4.2, TotalItemsSold: 157, TotalReviews: 23,
	},
}

var Comments = []Comment{
	{CommentID: 1, BuyerID: 101, Comment: "not bad", ProductID: 201, SellerID: 102},
	{CommentID: 2, BuyerID: 101, Comment: "pretty good", ProductID: 201, SellerID: 102},
}

var Products = []Product{
	{
		ProductID: uuid.New(), Title: "Vintage Vase", Description: "A beautiful antique vase from the 19th century.",
		Price: 15000, CategoryID: 10, SellerID: 101, Condition: "Good", PutOutTime: time.Date(2024, 4, 1, 3, 5, 7, 0, time.UTC),
		ProductLocation: "Oldtown Warehouse", ProductDetails: "Minor scratches are present.", Status: "sold",
		ImageUrl: "https://bit.ly/2Z4KKcF", Views: 2357,
	},
	{
		ProductID: uuid.New(), Title: "Classic Clock", Description: "An elegant wall clock from the early 20th century.",
		Price: 8000, CategoryID: 11, SellerID: 102, Condition: "Excellent", PutOutTime: time.Date(2024, 4, 1, 0, 12, 0, 0, time.UTC), ProductLocation: "City Center Depot",
		ProductDetails: "Perfectly functioning with authentic vintage design.", Status: "available",
		ImageUrl: "https://i.pinimg.com/originals/47/a9/a5/47a9a581ba4e599ceb453dbd2fb3694b.jpg", Views: 165,
	},
}

var Orders = []Order{}

var OrderProducts = []OrderProduct{}

var Categories = []Category{
	{CategoryID: 10, CategoryName: "decorations"},
	{CategoryID: 18, CategoryName: "clothes"},
	{CategoryID: 3, CategoryName: "machines"},
}
