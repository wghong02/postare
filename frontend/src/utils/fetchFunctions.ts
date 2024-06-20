import { UserInfo, Post } from "@/lib/model";

// these generalized functions all take one parameter for simplication on future reuse
// to fetch a single user's info
export const fetchUser = async ({
  parameter, // parameter of the til function
  setUser,
  userUtilFunction,
}: {
  parameter: any;
  setUser: (user: UserInfo | null) => void;
  userUtilFunction: (parameter: any) => Promise<UserInfo>;
}): Promise<void> => {
  // function to handle any request to fetch the user
  try {
    const response = await userUtilFunction(parameter);
    setUser(response || []);
  } catch (error) {
    console.error("Failed to fetch the user:", error);
  }
};

// to fetch a single post's info
export const fetchSinglePost = async ({
  parameter, // parameter of the til function
  setPost,
  postUtilFunction,
}: {
  parameter: any;
  setPost: (post: Post | null) => void;
  postUtilFunction: (parameter: any) => Promise<Post>;
}): Promise<Post | null> => {
  // function to handle any request to fetch the post
  try {
    const response = await postUtilFunction(parameter);
    setPost(response || []);
    return response; // return here for the special occasion that fetch both post and user
  } catch (error) {
    console.error("Failed to fetch the post:", error);
    return null;
  }
};

// to fetch multiple posts
export const fetchPosts = async ({
  parameter, // parameter of the til function
  setPosts,
  postUtilFunction,
}: {
  parameter: any;
  setPosts: (posts: Post[]) => void;
  postUtilFunction: (parameter: any) => Promise<Post[]>;
}): Promise<void> => {
  // function to handle any request to fetch the post
  try {
    const response = await postUtilFunction(parameter);
    setPosts(response || []);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
};
