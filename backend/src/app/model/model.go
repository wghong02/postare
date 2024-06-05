package model

import "time"

// the model of each row in each of the table, and some sample data

type User struct {
	UserID         int64  `json:"user_id"`
	Username       string `json:"username"`
	UserEmail      string `json:"user_email"`
	UserPhone      string `json:"user_phone"`
	Password       string `json:"password"`
	Address        string `json:"address"`
	ProfilePicture string `json:"profile_picture"`
	RegisterDate   time.Time `json:"register_date"`
	UserRating     float64  `json:"user_rating"`
	TotalItemsSold int    `json:"total_items_sold"`
	TotalReviews int64    `json:"total_reviews"`
}

type Product struct {
	ProductID       int64     `json:"product_id"`
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	Price           int64    `json:"price"`
	CategoryID      int64    `json:"category_id"`
	SellerID        int64    `json:"seller_id"`
	Condition       string    `json:"condition"`
	PutOutDate      time.Time `json:"put_out_date"`
	ProductLocation string     `json:"product_location"`
	ProductDetails  string     `json:"product_details"`
	Status          string     `json:"status"`
	ImageUrl        string     `json:"image_url"`
	Views			int64		`json:"views"`
}

type Comment struct {
	CommentID       int64     `json:"comment_id"`
	BuyerID           int64    `json:"buyer_id"`
	Comment     string    `json:"comment"`
	ProductID      int64    `json:"product_id"`
	SellerID        int64    `json:"seller_id"`
}

type Order struct {
	OrderID       int64     `json:"order_id"`
	SellerID           int64    `json:"seller_id"`
	BuyerID     int64    `json:"buyer_id"`
	Date      time.Time    `json:"date"`
	PriceTotal        int64    `json:"price_total"`
}

type OrderProduct struct {
	DetailID       int64     `json:"detail_id"`
	OrderID           int64    `json:"order_id"`
	ProductID     int64    `json:"product_id"`
}

type Category struct {
	CategoryID       int64     `json:"order_id"`
	CategoryName     string    `json:"seller_id"`
}

var Users = []User{
    {
        UserID: 101, Username: "antique_seller", UserEmail: "antique@example.com",
        UserPhone: "+1234567890", Password: "encrypted_password", Address: "123 Vintage St, Oldtown",
        ProfilePicture: "profile_pic_url.jpg", RegisterDate: time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC),
        UserRating: 4.5, TotalItemsSold: 1, TotalReviews: 5,
    },
    {
        UserID: 102, Username: "qwerty", UserEmail: "antique2@example.com",
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
        ProductID: 201, Title: "Vintage Vase", Description: "A beautiful antique vase from the 19th century.",
        Price: 15000, CategoryID: 10, SellerID: 101, Condition: "Good", PutOutDate: time.Date(2024, 4, 1, 0, 0, 0, 0, time.UTC),
        ProductLocation: "Oldtown Warehouse", ProductDetails: "Minor scratches are present.", Status: "sold",
        ImageUrl: "https://bit.ly/2Z4KKcF",
    },
	{
		ProductID: 202, Title: "Classic Clock", Description: "An elegant wall clock from the early 20th century.",
    	Price: 8000, CategoryID: 11, SellerID: 102, Condition: "Excellent", PutOutDate: time.Date(2024, 4, 1, 0, 0, 0, 0, time.UTC), ProductLocation: "City Center Depot",
    	ProductDetails: "Perfectly functioning with authentic vintage design.", Status: "available", ImageUrl: "https://i.imgur.com/LA8sP90.jpg",
	},
}

var Orders = []Order{
    {OrderID: 401, SellerID: 101, BuyerID: 102, Date: time.Date(2024, 5, 10, 0, 0, 0, 0, time.UTC), PriceTotal: 15000},
}

var OrderProducts = []OrderProduct{
    {DetailID: 1, OrderID: 401, ProductID: 201},
}

var Categories = []Category{
    {CategoryID: 10, CategoryName: "decorations"},
	{CategoryID: 18, CategoryName: "clothes"},
	{CategoryID: 3, CategoryName: "machines"},
}