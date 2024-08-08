import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";
import { UserInfo, Post } from "@/lib/model";
import { QueryProps } from "@/lib/types";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

const fetchAndTransformUserData = async (
	url: string | URL,
	singleUser: boolean = false,
	authToken: string | null = null
): Promise<UserInfo | UserInfo[]> => {
	// helper function to be called by all post functions
	try {
		let response;
		if (authToken) {
			// if given auth token, then auth is needed
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

		// save the response locally based on the size (single or multiple as an array)
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
				bio: camelizedData.bio,
			};
			return user;
		} else {
			const camelizedUsers: UserInfo[] = responseData.map(
				(camelizedUser: any) => {
					const camelizedData = camelizeKeys(camelizedUser);

					return {
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
						bio: camelizedData.bio,
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
	const url = `${domain}/user/userinfo`;
	try {
		const user: UserInfo = (await fetchAndTransformUserData(
			url,
			true,
			authToken
		)) as UserInfo;

		return user;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const getUserPublicInfo = async (userID: number) => {
	// get a single user's public info by user Id. response is json

	const url = `${domain}/public/userInfo/userID/${userID}`;
	try {
		const user: UserInfo = (await fetchAndTransformUserData(
			url,
			true
		)) as UserInfo;

		return user;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const getLikedUsersByPostId = async (
	postId: string,
	query: QueryProps
): Promise<UserInfo[]> => {
	// get likes of a post. response is json
	const url = new URL(`${domain}/public/userInfo/userLikes/${postId}`);
	const limit = query?.limit ?? "";
	const offset = query?.offset ?? "";
	url.searchParams.append("limit", limit.toString());
	url.searchParams.append("offset", offset.toString());
	try {
		const likes: UserInfo[] = (await fetchAndTransformUserData(
			url.toString(),
			false
		)) as UserInfo[];

		return likes;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const updateUserInfo = (data: FormData) => {
	// user upload a post with auth token
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/userinfo/update`;

	return fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
		body: data,
	}).then((response) => {
		handleResponseStatus(response, "Fail to update userinfo");
	});
};
