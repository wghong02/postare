import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";

const domain = "http://localhost:8080";

export const login = (credential) => {
  // login, input json with credentials, output auth token
  const url = `${domain}/auth/login`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(decamelizeKeys(credential)),
  })
    .then((response) => {
      console.log(response)
      handleResponseStatus(response, "Fail to Log in");
      return response.text();
    })
    .then((data) => {
      localStorage.setItem("authToken", data);
    });
};

export const register = (credential) => {
  // register, input json, output status
  const url = `${domain}/auth/register`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(decamelizeKeys(credential)),
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to register");
    })
    .then((data) => camelizeKeys(data));
};

export const getUserInfo = (userID) => {
  // get a single user's info by user ID. response is json
  const url = `${domain}/users/${userID}`;

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to get user");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

export const getPurchaseHistory = () => {
  // get user's purchase history with auth token
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/purchaseHistory`;

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to get purchase history");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

export const getShoppingCart = () => {
  // get user's shopping cart with auth token
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/cart`;

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      handleResponseStatus(response, "Fail to get shopping cart");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};

