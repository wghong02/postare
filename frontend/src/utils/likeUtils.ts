import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Like } from "@/lib/model";
import { QueryProps } from "@/lib/types";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

const fetchAndTransformLikeData = async (
	url: string | URL,
	authToken: string | null = null
): Promise<Like | Like[]> => {
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

		const camelizedLikes: Like[] = responseData
			? responseData.map((camelizedLike: any) => {
					const camelizedData = camelizeKeys(camelizedLike);

					return {
						postId: camelizedData.postId,
						liker: camelizedData.liker,
						dateTime: camelizedData.dateTime,
						// Add other fields as needed
					};
			  })
			: [];
		return camelizedLikes;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};



export const uploadLike = (postId: string) => {
	// user likes a post with auth token
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/likes/upload`;

	const body = JSON.stringify({
		post_id: postId,
	});

	return fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
		body: body,
	}).then((response) => {
		handleResponseStatus(response, "Fail to upload post");
	});
};

export const deleteLike = (postId: string) => {
	// delete a post using post and user ids
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/likes/delete/${postId}`;

	return fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	})
		.then((response) => {
			handleResponseStatus(response, "Fail to delete comment");
		})
		.then((data) => camelizeKeys(data));
};

export const checkLike = async (postId: string): Promise<boolean> => {
	// get likes of a user. response is json
	const authToken = localStorage.getItem("authToken");
	const url = new URL(`${domain}/user/likes/check/${postId}`);

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});

		// response here should be plain text true or false
		const boolStr = await response.text();
		return boolStr === "true";
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};
