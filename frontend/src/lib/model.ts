type DateString = string;

// User Model
export interface User {
  userID: number;
  username: string;
  userEmail: string;
  userPhone: string;
  password: string;
  address: string;
  profilePicture: string;
  registerDate: DateString;
  userRating: number;
  totalItemsSold: number;
  totalReviews: number;
}

// Product Model
export interface Product {
  productID: string;
  title: string;
  description: string;
  price: number;
  categoryID: number;
  sellerID: number;
  condition: string;
  putOutTime: DateString;
  productLocation: string;
  productDetails: string;
  status: string;
  imageUrl: string;
  views: number;
}

// Comment Model
export interface Comment {
  commentID: number;
  buyerID: number;
  comment: string;
  productID: number;
  sellerID: number;
}

// Order Model
export interface Order {
  orderID: number;
  sellerID: number;
  buyerID: number;
  date: DateString;
  priceTotal: number;
}

// OrderDetail Model
export interface OrderDetail {
  detailID: number;
  orderID: number;
  productID: number;
}

// Category Model
export interface Category {
  categoryID: number;
  categoryName: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface ProductPost {
  title: string;
  description: string;
  price: number;
}

export interface RatingData {
  rating: number;
  comment: string;
}

export interface UploadFormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  productLocation: string;
  productDetails: string;
  imageUrl: string;
}
