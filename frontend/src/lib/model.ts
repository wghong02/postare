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

// Post Model
export interface Post {
  postID: string;
  title: string;
  description: string;
  price: number;
  categoryID: number;
  sellerID: number;
  condition: string;
  putOutTime: DateString;
  postDetails: string;
  status: string;
  imageUrl: string;
  views: number;
}

// Comment Model
export interface Comment {
  commentID: number;
  buyerID: number;
  comment: string;
  postID: number;
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
  postID: number;
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

export interface PostPost {
  title: string;
  description: string;
  price: number;
}

export interface RatingData {
  rating: number;
  comment: string;
}
