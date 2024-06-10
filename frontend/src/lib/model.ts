type DateString = string;

// User Model
export interface User {
  userId: number;
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
  productId: string;
  title: string;
  description: string;
  price: number;
  categoryId: number;
  sellerId: number;
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
  commentId: number;
  buyerId: number;
  comment: string;
  productId: number;
  sellerId: number;
}

// Order Model
export interface Order {
  orderId: number;
  sellerId: number;
  buyerId: number;
  date: DateString;
  priceTotal: number;
}

// OrderDetail Model
export interface OrderDetail {
  detailId: number;
  orderId: number;
  productId: number;
}

// Category Model
export interface Category {
  categoryId: number;
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
