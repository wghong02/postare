import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Post } from "@/lib/model";
import { QueryProps } from "@/lib/types";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

const fetchAndTransformPostData = async (
	url: string | URL,
	singlePost: boolean = false,
	authToken: string | null = null
): Promise<Post | Post[]> => {
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
	const url = `${domain}/posts/postId/${postId}`;

	try {
		const post: Post = (await fetchAndTransformPostData(url, true)) as Post;

		return post;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const searchPostsByDescription = async (
	query: QueryProps
): Promise<Post[]> => {
	// use query parameters to search for posts. result are posts
	const description = query?.description ?? "";
	const limit = query?.limit ?? "";
	const offset = query?.offset ?? "";

	const url = new URL(`${domain}/posts/search`);
	url.searchParams.append("description", description);
	url.searchParams.append("limit", limit.toString());
	url.searchParams.append("offset", offset.toString());

	try {
		const posts: Post[] = (await fetchAndTransformPostData(url)) as Post[];

		return posts;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const uploadPost = (data: FormData) => {
	// user upload a post with auth token
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
	query: QueryProps;
}) => {
	// get a most viewed posts for recommendation. response is json

	const url = new URL(`${domain}/posts/most/${attribute}`);
	if (query?.limit) {
		url.searchParams.append("limit", query.limit.toString());
	}

	if (query?.offset) {
		url.searchParams.append("offset", query.offset.toString());
	}

	try {
		const posts: Post[] = (await fetchAndTransformPostData(url)) as Post[];

		return posts;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const getUserPosts = async ({ query }: { query: QueryProps }) => {
	// get the upload history of a user with its id

	const authToken = localStorage.getItem("authToken");
	const url = new URL(`${domain}/user/posts/history`);

	if (query?.limit) {
		url.searchParams.append("limit", query.limit.toString());
	}

	if (query?.offset) {
		url.searchParams.append("offset", query.offset.toString());
	}

	try {
		const posts: Post[] = (await fetchAndTransformPostData(
			url,
			false,
			authToken
		)) as Post[];

		return posts;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const getUserPublicPosts = async ({
	query,
	userId,
}: {
	query: QueryProps;
	userId: number;
}) => {
	// get the upload history of a user with its id

	const url = new URL(`${domain}/public/posts/history/${userId}`);

	if (query?.limit) {
		url.searchParams.append("limit", query.limit.toString());
	}

	if (query?.offset) {
		url.searchParams.append("offset", query.offset.toString());
	}

	try {
		const posts: Post[] = (await fetchAndTransformPostData(url)) as Post[];

		return posts;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const increasePostViews = (postId: string) => {
	// increase the number of views of a post by 1
	// only needs post id
	const url = `${domain}/posts/view/${postId}`;

	return fetch(url, {
		method: "POST",
	}).then((response) => {
		handleResponseStatus(response, "Fail to add views");
	});
};

export const getLikedPostsByUser = async (
	query: QueryProps
): Promise<Post[]> => {
	// get likes of a user. response is json
	const authToken = localStorage.getItem("authToken");
	const url = new URL(`${domain}/user/posts/userLiked`);
	const limit = query?.limit ?? "";
	const offset = query?.offset ?? "";
	url.searchParams.append("limit", limit.toString());
	url.searchParams.append("offset", offset.toString());
	try {
		const likes: Post[] = (await fetchAndTransformPostData(
			url,
			false,
			authToken
		)) as Post[];

		return likes;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};
