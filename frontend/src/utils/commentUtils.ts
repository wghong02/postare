import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Comment, SubComment } from "@/lib/model";
import { QueryProps } from "@/lib/types";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

const fetchAndTransformCommentData = async (
	url: string,
	singleComment: boolean = false,
	authToken: string | null = null
): Promise<Comment | Comment[]> => {
	// helper function to be called by all comment functions
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

		if (singleComment) {
			const camelizedData = camelizeKeys(responseData);
			const comment: Comment = {
				commentId: camelizedData.commentId,
				posterId: camelizedData.posterId,
				comment: camelizedData.comment,
				postId: camelizedData.postId,
				commentTime: camelizedData.commentTime,
			};
			return comment;
		} else {
			const camelizedComments: Comment[] = responseData
				? responseData.map((camelizedComment: any) => {
						const camelizedData = camelizeKeys(camelizedComment);

						return {
							commentId: camelizedData.commentId,
							posterId: camelizedData.posterId,
							comment: camelizedData.comment,
							postId: camelizedData.postId,
							commentTime: camelizedData.commentTime,
						};
				  })
				: [];
			return camelizedComments;
		}
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

const fetchAndTransformSubCommentData = async (
	url: string,
	singleSubComment: boolean = false,
	authToken: string | null = null
): Promise<SubComment | SubComment[]> => {
	// helper function to be called by all comment functions
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

		if (singleSubComment) {
			const camelizedData = camelizeKeys(responseData);
			const subComment: SubComment = {
				subCommentId: camelizedData.subCommentId,
				posterId: camelizedData.posterId,
				comment: camelizedData.comment,
				commentId: camelizedData.postId,
				commentTime: camelizedData.commentTime,
			};
			return subComment;
		} else {
			const camelizedSubComments: SubComment[] = responseData
				? responseData.map((camelizedSubComment: any) => {
						const camelizedData = camelizeKeys(camelizedSubComment);

						return {
							subCommentId: camelizedData.subCommentId,
							posterId: camelizedData.posterId,
							comment: camelizedData.comment,
							commentId: camelizedData.commentId,
							commentTime: camelizedData.commentTime,
						};
				  })
				: [];
			return camelizedSubComments;
		}
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const getCommentsByPostId = async ({
	postId,
	query,
}: {
	postId: string;
	query: QueryProps;
}): Promise<Comment[]> => {
	// get a single post by post Id. response is json
	const url = new URL(`${domain}/public/getComments/${postId}`);

	if (query?.limit) {
		url.searchParams.append("limit", query.limit.toString());
	}
	if (query?.offset) {
		url.searchParams.append("offset", query.offset.toString());
	}

	try {
		const comments: Comment[] = (await fetchAndTransformCommentData(
			url.toString()
		)) as Comment[];

		return comments;
	} catch (error) {
		console.error("Error fetching or parsing comment:", error);
		throw error;
	}
};

export const getSubCommentsByPostId = async ({
	commentId,
	query,
}: {
	commentId: string;
	query: QueryProps;
}): Promise<SubComment[]> => {
	// get a single post by post Id. response is json
	const url = new URL(`${domain}/public/getSubComments/${commentId}`);

	if (query?.limit) {
		url.searchParams.append("limit", query.limit.toString());
	}
	if (query?.offset) {
		url.searchParams.append("offset", query.offset.toString());
	}

	try {
		const subComments: SubComment[] = (await fetchAndTransformSubCommentData(
			url.toString()
		)) as SubComment[];

		return subComments;
	} catch (error) {
		console.error("Error fetching or parsing comment:", error);
		throw error;
	}
};

export const uploadComment = (comment: string, postId: string) => {
	// user post post with auth token
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/comments/upload`;

	const body = JSON.stringify({
		comment,
		post_id: postId,
	});

	return fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authToken}`,
			"Content-Type": "application/json",
		},
		body: body,
	}).then((response) => {
		handleResponseStatus(response, "Fail to upload comment");
	});
};

export const uploadSubComment = (comment: string, commentId: number) => {
	// user post post with auth token
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/subComments/upload`;

	const body = JSON.stringify({
		comment,
		comment_id: commentId,
	});

	return fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authToken}`,
			"Content-Type": "application/json",
		},
		body: body,
	}).then((response) => {
		handleResponseStatus(response, "Fail to upload sub comment");
	});
};

export const deleteComment = (commentId: string) => {
	// delete post using its id
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/comments/delete/${commentId}`;

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

export const deleteSubComment = (subCommentId: string) => {
	// delete post using its id
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/subComments/delete/${subCommentId}`;

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
