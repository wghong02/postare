import handleResponseStatus from "@/utils/errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";

const domain = "http://localhost:8080";

export const getProduct = (productID) => {
  // get a single product by product ID. response is json
  const url = `${domain}/products/${productID}`;
  console.log(url);

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to get product");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

export const searchProduct = (query) => {
  // use query parameters to search for products. result is a batch of products
  const description = query?.description ?? "";
  const batch = query?.batch ?? "";
  const totalSize = query?.totalSize ?? "";

  const url = new URL(`${domain}/search`);
  url.searchParams.append("description", description);
  url.searchParams.append("batch", batch);
  url.searchParams.append("totalSize", totalSize);

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to search for products");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

export const uploadProduct = (data, file) => {
  // user post product with auth token
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/products/upload`;

  const { title, description, price } = data;
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("media_file", file);

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to upload product");
    })
    .then((data) => camelizeKeys(data));
};

export const deleteProduct = (productID) => {
  // delete product using its id
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/products/delete/${productID}`;

  return fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to delete product");
    })
    .then((data) => camelizeKeys(data));
};

export const rateProduct = (data, productID) => {
  // user can rate product they have purchased, requires auth token
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/purchaseHistory/${productID}/rate`;

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

export const getMostViewedProducts = (query) => {
  // get a single product by product ID. response is

  const url = `${domain}/products/get/mostViewed`;
  if (query?.batch) {
    url.searchParams.append("batch", query.batch);
  }

  if (query?.totalSize) {
    url.searchParams.append("totalSize", query.totalSize);
  }

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to get product");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};
