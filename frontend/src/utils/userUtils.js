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
      handleResponseStatus(response, "Fail to Log in");
      return response.text();
    })
    .then((data) => {
      localStorage.setItem("authToken", data);
    });
};

// export const logout = () => {
//   // logout, use auth token
//   const authToken = localStorage.getItem("authToken");
//   const url = `${domain}/auth/logout`;

//   return fetch(url, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${authToken}`,
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       handleResponseStatus(response, "Fail to Log out");
//       return response.json();
//     })
//     .then(() => {
//       localStorage.removeItem("authToken");
//     })
//     .then((data) => camelizeKeys(data));
// };

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
  console.log(url);

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

export const getUploadHistory = (query) => {
  // get the upload history of a user with its id
  const parameter = query?.userId ?? "";
  const url = `${domain}/uploadHistory/${userID}`;
  url.searchParams.append("parameter", parameter);

  return fetch(url)
    .then((response) => {
      handleResponseStatus(response, "Fail to search for upload history");
      return response.json();
    })
    .then((data) => camelizeKeys(data));
};
