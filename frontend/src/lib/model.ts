type DateString = string;

// UserInfo Model
export interface UserInfo {
  userId: number;
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
  postId: string;
  title: string;
  description: string;
  likes: number;
  categoryId: number;
  postOwnerId: number;
  putOutTime: DateString;
  postDetails: string;
  isAvailable: boolean;
  imageUrl: string;
  views: number;
}

// Comment Model
export interface Comment {
  commentId: number;
  posterId: number;
  comment: string;
  postId: string;
}

// SubComment Model
export interface SubComment {
  subCommentId: number;
  posterId: number;
  comment: string;
  commentId: number;
}

// Like Model
export interface Like {
  likeId: number;
  postId: string;
  likerId: number;
  dateTime: DateString;
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

export interface PostPost {
  title: string;
  description: string;
  price: number;
}

export interface RatingData {
  rating: number;
  comment: string;
}
