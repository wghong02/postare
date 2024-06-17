import handleResponseStatus from "@/utils/errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";

const domain = "http://localhost:8080"; // local test
// const domain = "http://18.216.40.20:8080"; // aws container

export const getPost = (postID) => {
  // get a single post by post ID. response is json
  const url = `${domain}/posts/${postID}`;

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to get post");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

export const searchPostsByDescription = (query) => {
  // use query parameters to search for posts. result is a batch of posts
  const description = query?.description ?? "";
  const batch = query?.batch ?? "";
  const totalSize = query?.totalSize ?? "";

  const url = new URL(`${domain}/search`);
  url.searchParams.append("description", description);
  url.searchParams.append("batch", batch);
  url.searchParams.append("totalSize", totalSize);

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to search for posts");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

export const uploadPost = (data) => {
  // user post post with auth token
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/posts/upload`;

  const {
    title,
    description,
    price,
    condition,
    postLocation,
    postDetails,
    imageUrl,
  } = data;

  const body = JSON.stringify({
    title,
    description,
    price: Number(price),
    condition,
    post_location: postLocation,
    post_details: postDetails,
    image_url: imageUrl,
  });

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: body,
  }).then((response) => {
    handleResponseStatus(response, "Fail to upload post");
  });
};

export const deletePost = (postID) => {
  // delete post using its id
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/posts/delete/${postID}`;

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

export const ratePost = (data, postID) => {
  // user can rate post they have purchased, requires auth token
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/purchaseHistory/${postID}/rate`;

  const { rating, comment } = data;
  const formData = new FormData();
  formData.append("rating", rating);
  formData.append("comment", comment);

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to post ratings");
    })
    .then((data) => camelizeKeys(data));
};

export const getMostViewedPosts = (query) => {
  // get a single post by post ID. response is json

  const url = `${domain}/post/get/mostViewed`;
  if (query?.batch) {
    url.searchParams.append("batch", query.batch);
  }

  if (query?.totalSize) {
    url.searchParams.append("totalSize", query.totalSize);
  }

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to get post");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

export const getUserPosts = ({ userID, query }) => {
  // get the upload history of a user with its id
  const url = `${domain}/postHistory/${userID}`;
  if (query?.batch) {
    url.searchParams.append("batch", query.batch);
  }

  if (query?.totalSize) {
    url.searchParams.append("totalSize", query.totalSize);
  }

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to search for upload history");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};
