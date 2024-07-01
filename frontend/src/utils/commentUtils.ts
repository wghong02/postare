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
