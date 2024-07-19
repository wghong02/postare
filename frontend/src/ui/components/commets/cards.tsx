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
	const [showReplyClicked, setShowReplyClicked] = useState(false);
	const [subComments, setSubComments] = useState<SubComment[]>([]);
	const [subCommentCount, setSubCommentCount] = useState<number>(0);
	const subCommentsToLoad = 5;

	function isComment(comment: Comment | SubComment): comment is Comment {
		return (
			"commentId" in comment &&
			"posterId" in comment &&
			"comment" in comment &&
			"postId" in comment &&
			"commentTime" in comment
		);
	}

	const fetchData = async () => {
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
		setShowReplyClicked(true);
		fetchSubComments();
	};

	const fetchSubComments = async (fetchRecent = false) => {
		try {
			if (fetchRecent) {
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
		setSubComments([]);
	};

	useEffect(() => {
		fetchData();
		fetchSubCommentCount();
	}, []);

	useEffect(() => {
		if (fetchRecentReply == true) {
			fetchSubComments(true);
			setFetchRecentReply(false);
		}
	}, [fetchRecentReply]);

	if (poster) {
		return (
			<Box>
				<HStack spacing="4">
					<Image
						borderRadius="full"
						boxSize="35px"
						width="35px"
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

						<Text>{comment.comment}</Text>
					</VStack>
				</HStack>
				<Box ml="40px">
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
				{isComment(comment) && (
					<Flex ml="50px">
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

						{subCommentCount - subComments.length != 0 && (
							<Box
								fontSize="small"
								fontWeight="300"
								onClick={handleShowReplies}
								_hover={{ color: "blue.500", cursor: "pointer" }}
								alignContent="initial"
								mr="4"
							>
								{"View " +
									(subCommentCount - subComments.length) +
									" more " +
									(subCommentCount == 1 ? " reply" : " replies")}
							</Box>
						)}
						{subComments.length > 0 && (
							<Box
								fontSize="small"
								fontWeight="300"
								onClick={hideReply}
								_hover={{ color: "blue.500", cursor: "pointer" }}
								alignContent="initial"
								mr="4"
							>
								{"Hide all replies"}
							</Box>
						)}
					</Flex>
				)}
			</Box>
		);
	}
}
