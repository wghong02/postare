import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";
import { UserInfo, Post } from "@/lib/model";
import { UploadFormData } from "@/lib/types";

const domain = "http://localhost:8080"; // local test
// const domain = "http://18.216.40.20:8080"; // aws container

const fetchAndTransformPostData = async (
  url: string,
  singlePost: boolean = false,
  authToken: string | null = null
): Promise<Post | Post[]> => {
  // helper function to be called by all post functions
  try {
    let response;
    if (authToken) {
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } else {
      response = await fetch(url);
    }

    handleResponseStatus(response, "Failed to fetch data");

    const responseData: any = await response.json();

    if (singlePost) {
      const camelizedData = camelizeKeys(responseData);
      const post: Post = {
        postId: camelizedData.postId,
        title: camelizedData.title,
        description: camelizedData.description,
        likes: camelizedData.likes,
        categoryId: camelizedData.categoryId,
        postOwnerId: camelizedData.postOwnerId,
        putOutTime: camelizedData.putOutTime,
        postDetails: camelizedData.postDetails,
        isAvailable: camelizedData.isAvailable,
        imageUrl: camelizedData.imageUrl,
        views: camelizedData.views,
      };
      return post;
    } else {
      const camelizedPosts: Post[] = responseData
        ? responseData.map((camelizedPost: any) => {
            const camelizedData = camelizeKeys(camelizedPost);

            return {
              postId: camelizedData.postId,
              title: camelizedData.title,
              description: camelizedData.description,
              likes: camelizedData.likes,
              categoryId: camelizedData.categoryId,
              postOwnerId: camelizedData.postOwnerId,
              putOutTime: camelizedData.putOutTime,
              postDetails: camelizedData.postDetails,
              isAvailable: camelizedData.isAvailable,
              imageUrl: camelizedData.imageUrl,
              views: camelizedData.views,
              // Add other fields as needed
            };
          })
        : [];
      return camelizedPosts;
    }
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
};

export const getPost = async (postId: string): Promise<Post> => {
  // get a single post by post Id. response is json
  const url = `${domain}/posts/${postId}`;

  try {
    const post: Post = (await fetchAndTransformPostData(url, true)) as Post;

    return post;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
};

export const searchPostsByDescription = async (query: any): Promise<Post[]> => {
  // use query parameters to search for posts. result are posts
  const description = query?.description ?? "";
  const limit = query?.limit ?? "";
  const offset = query?.offset ?? "";

  const url = new URL(`${domain}/search`);
  url.searchParams.append("description", description);
  url.searchParams.append("limit", limit);
  url.searchParams.append("offset", offset);

  try {
    const posts: Post[] = (await fetchAndTransformPostData(
      url.toString()
    )) as Post[];

    return posts;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
};

export const uploadPost = (data: FormData) => {
  // user post post with auth token
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/posts/upload`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: data,
  }).then((response) => {
    handleResponseStatus(response, "Fail to upload post");
  });
};

export const deletePost = (postId: string) => {
  // delete post using its id
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/posts/delete/${postId}`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to delete post");
    })
    .then((data) => camelizeKeys(data));
};

export const getMostInOneAttributePosts = async ({
  attribute,
  query,
}: {
  attribute: string;
  query: any;
}) => {
  // get a most viewed posts for recommendation. response is json

  const url = new URL(`${domain}/posts/get/most/${attribute}`);
  if (query?.limit) {
    url.searchParams.append("limit", query.limit);
  }

  if (query?.offset) {
    url.searchParams.append("offset", query.offset);
  }

  try {
    const posts: Post[] = (await fetchAndTransformPostData(
      url.toString()
    )) as Post[];

    return posts;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
};

export const getUserPosts = async ({ query }: { query: any }) => {
  // get the upload history of a user with its id

  const authToken = localStorage.getItem("authToken");
  const url = new URL(`${domain}/user/get/postHistory`);

  if (query?.limit) {
    url.searchParams.append("limit", query.limit);
  }

  if (query?.offset) {
    url.searchParams.append("offset", query.offset);
  }

  try {
    const posts: Post[] = (await fetchAndTransformPostData(
      url.toString(),
      false,
      authToken
    )) as Post[];

    return posts;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
};
