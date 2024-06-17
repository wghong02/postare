import { User, Post } from "@/lib/model";

export const fetchUser = async (
  parameter: any,
  setUser: (user: User | null) => void,
  userUtilFunction: (parameter: any) => Promise<User>
): Promise<void> => {
  // function to handle any request to fetch the user
  try {
    const response = await userUtilFunction(parameter);
    setUser(response || []);
  } catch (error) {
    console.error("Failed to fetch the user:", error);
  }
};

export const fetchSinglePost = async (
  parameter: any,
  setPost: (post: Post | null) => void,
  postUtilFunction: (parameter: any) => Promise<Post>
): Promise<Post | null> => {
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

export const fetchPosts = async (
  parameter: any,
  setPosts: (posts: Post[]) => void,
  postUtilFunction: (parameter: any) => Promise<Post[]>
): Promise<void> => {
  // function to handle any request to fetch the post
  try {
    const response = await postUtilFunction(parameter);
    setPosts(response || []);
  } catch (error) {
    console.error("Failed to fetch the post:", error);
  }
};
