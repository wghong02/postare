import { Text, Box, HStack, Image, Link, VStack, Flex } from "@chakra-ui/react";
import { timeAgo } from "@/utils/generalUtils";
import { Comment, SubComment, UserInfo } from "@/lib/model";
import { getUserPublicInfo } from "@/utils/userUtils";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
	getSubCommentCountByCommentId,
	getSubCommentsByCommentId,
} from "@/utils/commentUtils";

export function CommentCard({
	comment,
	setReplyName,
	setOnReply,
	setReplyCommentId,
	authed,
	fetchRecentReply,
	setFetchRecentReply,
}: {
	comment: Comment | SubComment;
	setReplyName: React.Dispatch<React.SetStateAction<String>>;
	setOnReply: React.Dispatch<React.SetStateAction<boolean>>;
	setReplyCommentId: React.Dispatch<React.SetStateAction<number>>;
	authed: boolean;
	fetchRecentReply: boolean;
	setFetchRecentReply: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const commentTime = timeAgo(comment.commentTime);
	const [poster, setPoster] = useState<UserInfo | null>(null);
	const [subComments, setSubComments] = useState<SubComment[]>([]);
	const [subCommentCount, setSubCommentCount] = useState<number>(0);
	const subCommentsToLoad = 5;

	function isSubComment(comment: Comment | SubComment): comment is SubComment {
		// to determine if the given is a sub comment or a comment
		return "subCommentId" in comment;
	}

	const fetchData = async () => {
		// fetching the user public info of each comment
		try {
			const userInfo = await getUserPublicInfo(comment.posterId);
			setPoster(userInfo);
		} catch (error) {
			console.error("Error fetching comment user:", error);
		}
	};

	const handleSetReply = () => {
		if (authed && poster) {
			setReplyName(poster.nickname);
			setReplyCommentId(comment.commentId);
			setOnReply(true);
		}
	};

	const handleShowReplies = () => {
		// whenever show more replies, fetch more comments
		fetchSubComments();
	};

	const fetchSubComments = async (fetchRecent = false) => {
		// function that calls backend to fetch
		try {
			if (fetchRecent) {
				// fetch the user's reply immediately after
				const commentsData = await getSubCommentsByCommentId({
					commentId: comment.commentId,
					query: {
						limit: 1,
						offset: 0,
						description: null,
					},
				});

				setSubComments([...commentsData, ...subComments]);
			} else {
				const commentsData = await getSubCommentsByCommentId({
					commentId: comment.commentId,
					query: {
						limit: subCommentsToLoad,
						offset: subComments.length,
						description: null,
					},
				});

				setSubComments([...subComments, ...commentsData]);
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	const fetchSubCommentCount = async () => {
		// fetch the number of sub comments from backend
		try {
			const countResult = await getSubCommentCountByCommentId({
				commentId: comment.commentId,
			});
			setSubCommentCount(countResult);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	const hideReply = () => {
		// hide all replies to a comment, is the same as setting the sub comment list to empty
		setSubComments([]);
	};

	useEffect(() => {
		// fetch userInfo and sub comment count when it loads
		fetchData();
		fetchSubCommentCount();
	}, []);

	useEffect(() => {
		// fetch the user's reply after the reply is submitted
		if (fetchRecentReply == true) {
			fetchSubComments(true);
			setFetchRecentReply(false);
		}
	}, [fetchRecentReply]);

	return (
		<Box>
			{poster && (
				<HStack spacing="3">
					<Image
						borderRadius="full"
						boxSize="30px"
						width="30px"
						src={poster.profilePicture}
						alt="User Profile Picture"
					/>
					<VStack spacing="0" align="initial">
						<HStack>
							<Link
								as={NextLink}
								href={`/users/public/${poster.userId}`}
								passHref
							>
								<Text fontWeight="500" fontSize="sm">
									{poster.nickname}
								</Text>
							</Link>
							<Box fontSize="xs" fontWeight="350">
								{commentTime}
							</Box>
						</HStack>

						<Text as="span">{comment.comment}</Text>
					</VStack>
				</HStack>
			)}
			<Box ml="30px">
				{subComments.map((subComment, index) => (
					<CommentCard
						key={index}
						comment={subComment}
						setReplyName={setReplyName}
						setReplyCommentId={setReplyCommentId}
						setOnReply={setOnReply}
						authed={authed}
						fetchRecentReply={false}
						setFetchRecentReply={setFetchRecentReply}
					/>
				))}
			</Box>
			{!isSubComment(comment) && (
				<Flex ml="42px">
					{authed && (
						<Box
							fontSize="small"
							fontWeight="300"
							onClick={handleSetReply}
							_hover={{ color: "blue.500", cursor: "pointer" }}
							alignContent="initial"
							mr="4"
							mb="2"
						>
							Reply
						</Box>
					)}

					<Box
						fontSize="small"
						fontWeight="300"
						alignContent="initial"
						mr="4"
						maxW="270px"
					>
						{subCommentCount - subComments.length > 0 && (
							<Box
								onClick={handleShowReplies}
								_hover={{ color: "blue.500", cursor: "pointer" }}
							>
								{"View " +
									(subCommentCount - subComments.length) +
									" more " +
									(subCommentCount == 1 ? " reply" : " replies")}
							</Box>
						)}
					</Box>

					{subComments.length > 0 && (
						<Box
							fontSize="small"
							fontWeight="300"
							onClick={hideReply}
							_hover={{ color: "blue.500", cursor: "pointer" }}
							alignContent="initial"
						>
							{"Hide all replies"}
						</Box>
					)}
				</Flex>
			)}
		</Box>
	);
}
