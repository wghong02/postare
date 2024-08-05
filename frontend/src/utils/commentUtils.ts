import handleResponseStatus from "./errorUtils";
import { camelizeKeys, decamelizeKeys } from "humps";
import { Comment, SubComment, CountData } from "@/lib/model";
import { QueryProps } from "@/lib/types";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

const fetchAndTransformCommentData = async (
	url: string | URL,
	singleComment: boolean = false,
	authToken: string | null = null
): Promise<Comment | Comment[]> => {
	// helper function to be called by all comment functions
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
	url: string | URL,
	singleSubComment: boolean = false,
	authToken: string | null = null
): Promise<SubComment | SubComment[]> => {
	// helper function to be called by all sub comment functions
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
				postId: camelizedData.postId,
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
							postId: camelizedData.postId,
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
	// get a single comment by post Id. response is json
	const url = new URL(`${domain}/public/comments/postID/${postId}`);

	if (query?.limit) {
		url.searchParams.append("limit", query.limit.toString());
	}
	if (query?.offset) {
		url.searchParams.append("offset", query.offset.toString());
	}

	try {
		const comments: Comment[] = (await fetchAndTransformCommentData(
			url
		)) as Comment[];

		return comments;
	} catch (error) {
		console.error("Error fetching or parsing comment:", error);
		throw error;
	}
};

export const getCommentCountByPostId = async ({
	postId,
	isTotal = false, // isTotal represents if to get the number of counts that includes the total number of subcomments
}: {
	postId: string;
	isTotal: boolean;
}): Promise<number> => {
	// get the count of comments (or with replies) of a post by post Id. response is json
	const url = new URL(`${domain}/public/count/comment/postID/${postId}`);
	if (isTotal) {
		url.searchParams.append("isTotal", isTotal.toString());
	}
	try {
		let response;
		response = await fetch(url);

		handleResponseStatus(response, "Failed to fetch data");

		const responseData: CountData = await response.json();

		return responseData.count;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const getSubCommentsByCommentId = async ({
	commentId,
	query,
}: {
	commentId: number;
	query: QueryProps;
}): Promise<SubComment[]> => {
	// get sub comments of a comment by comment Id. response is json
	const url = new URL(`${domain}/public/subComments/commentID/${commentId}`);

	if (query?.limit) {
		url.searchParams.append("limit", query.limit.toString());
	}
	if (query?.offset) {
		url.searchParams.append("offset", query.offset.toString());
	}

	try {
		const subComments: SubComment[] = (await fetchAndTransformSubCommentData(
			url
		)) as SubComment[];

		return subComments;
	} catch (error) {
		console.error("Error fetching or parsing comment:", error);
		throw error;
	}
};

export const getSubCommentCountByCommentId = async ({
	commentId,
}: {
	commentId: number;
}): Promise<number> => {
	// get the count of sub comments of a comment. response is json
	const url = new URL(
		`${domain}/public/count/subComment/commentID/${commentId}`
	);

	try {
		let response;
		response = await fetch(url);

		handleResponseStatus(response, "Failed to fetch data");

		const responseData: CountData = await response.json();

		return responseData.count;
	} catch (error) {
		console.error("Error fetching or parsing data:", error);
		throw error;
	}
};

export const uploadComment = (comment: string, postId: string) => {
	// user comment a post, with auth token
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

export const uploadSubComment = (
	comment: string,
	commentId: number,
	postId: string
) => {
	// user reply to a comment, with auth token
	const authToken = localStorage.getItem("authToken");
	const url = `${domain}/user/subComments/upload`;

	const body = JSON.stringify({
		comment,
		comment_id: commentId,
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
		handleResponseStatus(response, "Fail to upload sub comment");
	});
};

export const deleteComment = (commentId: string) => {
	// delete a comment using its id
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
	// delete a sub comment using its id
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
