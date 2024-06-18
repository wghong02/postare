type DateString = string;

// UserInfo Model
export interface UserInfo {
  userID: number;
  username: string;
  userEmail: string;
  userPhone: string;
  nickname: string;
  profilePicture: string;
  registerTime: DateString;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  userExperience: number;
  totalPosts: number;
}

// UserAuth Model
export interface UserAuth {
  username: string;
  encodedPassword: string;
}

// Post Model
export interface Post {
  postID: string;
  title: string;
  description: string;
  likes: number;
  categoryID: number;
  postOwnerID: number;
  putOutTime: DateString;
  postDetails: string;
  isAvailable: boolean;
  imageUrl: string;
  views: number;
}

// Comment Model
export interface Comment {
  commentID: number;
  posterID: number;
  comment: string;
  postID: string;
}

// SubComment Model
export interface SubComment {
  subCommentID: number;
  posterID: number;
  comment: string;
  commentID: number;
}

// Like Model
export interface Like {
  likeID: number;
  postID: string;
  likerID: number;
  dateTime: DateString;
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
