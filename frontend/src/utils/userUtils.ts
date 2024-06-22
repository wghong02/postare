import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";
import { UserInfo, Post } from "@/lib/model";

const domain = "http://localhost:8080";
// const domain = "http://18.216.40.20:8080"; // aws container

const fetchAndTransformUserData = async (
  url: string,
  singleUser: boolean = false,
  authToken: string | null
): Promise<UserInfo | UserInfo[]> => {
  // helper function to be called by all post functions
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    handleResponseStatus(response, "Failed to fetch data");
    const responseData: any = await response.json();

    if (singleUser) {
      const camelizedData = camelizeKeys(responseData);
      const user: UserInfo = {
        userId: camelizedData.userId,
        username: camelizedData.username,
        userEmail: camelizedData.userEmail,
        userPhone: camelizedData.userPhone,
        nickname: camelizedData.nickname,
        profilePicture: camelizedData.profilePicture,
        registerTime: camelizedData.registerTime,
        totalViews: camelizedData.totalViews,
        totalComments: camelizedData.totalComments,
        totalLikes: camelizedData.totalLikes,
        userExperience: camelizedData.userExperience,
        totalPosts: camelizedData.totalPosts,
      };
      return user;
    } else {
      const camelizedUsers: UserInfo[] = responseData.map(
        (camelizedUser: any) => {
          const camelizedData = camelizeKeys(camelizedUser);

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
        }
      );
      return camelizedUsers;
    }
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
};

export const login = (credential: any) => {
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
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("authToken", data.token);
    });
};

export const register = (credential: any) => {
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

export const getUserInfo = async () => {
  // get a single user's info by user Id. response is json

  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/user/get/userinfo`;
  try {
    const user: UserInfo = (await fetchAndTransformUserData(
      url.toString(),
      true,
      authToken
    )) as UserInfo;

    return user;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
};
