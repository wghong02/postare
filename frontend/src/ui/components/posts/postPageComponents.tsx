import React, { ChangeEvent, useEffect, useState } from "react";
import {
	Box,
	Badge,
	Text,
	Input,
	Flex,
	Icon,
	useToast,
} from "@chakra-ui/react";
import { timeAgo, isPostedWithin } from "@/utils/generalUtils";
import { Post, Comment } from "@/lib/model";
import { IoIosSend, IoMdCloseCircleOutline } from "react-icons/io";
import { CommentCard } from "../commets/cards";
import {
	getCommentsByPostId,
	uploadComment,
	uploadSubComment,
} from "@/utils/commentUtils";
import LoadingWrapper from "../web/LoadingWrapper";

export function PostPageSection({ post }: { post: Post }) {
	// card of post info
	// registerTime to record time, posted recently to check if post is new
	const registerTime = timeAgo(post.putOutTime);
	const postedRecent = isPostedWithin(post.putOutTime, "month");
	const isAvailable = post.isAvailable;
	const isHot = post.views >= 500;

	// put all information of the post out
	return (
		<Box borderRadius="lg" overflow="auto">
			<Box display="flex" alignItems="baseline">
				{postedRecent && isAvailable && (
					<Badge borderRadius="full" px="2" colorScheme="blue" mr="4">
						New
					</Badge>
				)}
				{!isAvailable && (
					<Badge borderRadius="full" px="2" colorScheme="gray">
						Archived
					</Badge>
				)}
				<Box fontWeight={500} letterSpacing="wide" fontSize="lg" ml="2">
					{post.title}
				</Box>
				<Box as="span" ml="8" color="gray.600" fontSize="sm">
					{registerTime}
				</Box>
			</Box>

			{isHot && (
				<Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
					<Badge borderRadius="full" px="2" colorScheme="red" mr="8">
						Hot
					</Badge>
					{post.views} {"views"}
				</Box>
			)}

			<Box mt="1" as="h4" lineHeight="tight" fontSize="md" fontWeight={450}>
				<Text as="span">{post.description}</Text>
			</Box>

			<Box mt="1" as="h4" lineHeight="tight" fontSize="md" fontWeight={350}>
				<Text as="span">{post.postDetails}</Text>{" "}
			</Box>
		</Box>
	);
}

export function CommentSection({
	// the entire comment section of each post
	authed,
	postId,
}: {
	authed: boolean;
	postId: string;
}) {
	const [comments, setComments] = useState<Comment[]>([]); // the array of all comments that are to be loaded
	const [newComment, setNewComment] = useState<string>(""); // the input comment of the user
	const [initLoading, setInitLoading] = useState(true); // if the page has loaded initially
	const [loadingMore, setLoadingMore] = useState(false); // if it is loading more comments
	const [hasFetched, setHasFetched] = useState(false); // if the page has completed fetched all inital data
	const [currentPage, setCurrentPage] = useState(1); // the current page of comments that are in
	const [reachedEnd, setReachedEnd] = useState(false); // if it is the end of all comments
	const [onReply, setOnReply] = useState(false); // if the input comment is a reply
	const [replyName, setReplyName] = useState<String>(""); // the name of the person replying to, if on reply. else the name is empty string
	const [replyCommentId, setReplyCommentId] = useState<number>(0); // the comment Id replying to
	const [fetchRecentReply, setFetchRecentReply] = useState(false); // to fetch the most recent reply by the user after sending a reply
	const toast = useToast();
	const commentsToLoad = 10; // the set number of comments to load when scrolling to the bottom

	// If it is onReply then to send a subcomment(reply), else send a normal comment.
	const sendComment = async () => {
		if (onReply) {
			if (newComment == "") {
				toast({
					title: "Reply cannot be empty.",
					status: "error",
					duration: 2000,
					isClosable: true,
				});
			} else {
				try {
					await uploadSubComment(newComment, replyCommentId);
					toast({
						title: "Reply sent!",
						status: "success",
						duration: 2000,
						isClosable: true,
					});
					setFetchRecentReply(true);
					setNewComment("");
				} catch (error) {
					console.error("Error sending reply:", error);
					toast({
						title: "Failed to send reply.",
						status: "error",
						duration: 2000,
						isClosable: true,
					});
				}
			}
		} else {
			if (postId) {
				if (newComment == "") {
					toast({
						title: "Comment cannot be empty.",
						status: "error",
						duration: 2000,
						isClosable: true,
					});
				} else {
					try {
						await uploadComment(newComment, postId);
						toast({
							title: "Comment sent!",
							status: "success",
							duration: 2000,
							isClosable: true,
						});
						fetchComments(true);
						setNewComment("");
					} catch (error) {
						console.error("Error sending comment:", error);
						toast({
							title: "Failed to send comment.",
							status: "error",
							duration: 2000,
							isClosable: true,
						});
					}
				}
			}
		}
	};

	// util function to fetch more comments
	const fetchComments = async (toLoadRecentReply = false) => {
		try {
			setLoadingMore(true);
			if (toLoadRecentReply) {
				// only fetch one (the most recent one) when submitting a new comment
				const commentsData = await getCommentsByPostId({
					postId: postId,
					query: {
						limit: 1,
						offset: 0,
						description: null,
					},
				});

				setComments([...commentsData, ...comments]);
			} else {
				const commentsData = await getCommentsByPostId({
					postId: postId,
					query: {
						limit: commentsToLoad,
						offset: comments.length,
						description: null,
					},
				});
				if (commentsData.length == 0) {
					setReachedEnd(true);
				} else {
					setComments([...comments, ...commentsData]);
				}
			}
		} catch (error) {
			console.error("Error fetching comments:", error);
		} finally {
			setInitLoading(false);
			setHasFetched(true);
			setLoadingMore(false);
		}
	};

	// also to send the comment/reply when press the enter key
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			sendComment();
		}
	};

	// to track the comment entered by the user.
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewComment(e.target.value);
	};

	// fetch more comments when the current page number changes
	useEffect(() => {
		fetchComments();
	}, [currentPage]);

	// to handle if ha reached the bottom of the page. the current page number would change when reach the bottom
	useEffect(() => {
		const handleScroll = () => {
			const box = document.getElementById("commentBox");

			if (
				box &&
				box.scrollHeight - box.scrollTop <= box.clientHeight &&
				!loadingMore &&
				!reachedEnd
			) {
				setCurrentPage(currentPage + 1);
			}
		};
		setHasFetched(false);
		const box = document.getElementById("commentBox");
		if (box) {
			box.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (box) {
				box.removeEventListener("scroll", handleScroll);
			}
		};
	}, [loadingMore]);

	// util function to close the reply bar.
	const handleCloseReply = () => {
		setOnReply(false);
	};

	return (
		<LoadingWrapper loading={initLoading} hasFetched={hasFetched}>
			<Box width="100%" height={onReply ? "400px" : "430px"}>
				{/* add to display comments related to this post */}
				<Text fontSize="large" fontWeight="bold" height="30px">
					{" "}
					Comments{" "}
				</Text>
				<Box
					height={onReply ? "calc(100% - 82px)" : "calc(100% - 62px)"}
					overflowY="scroll"
					id="commentBox"
					mb="2"
				>
					{comments.map((comment, index) => (
						<Box>
							<CommentCard
								key={index}
								comment={comment}
								setReplyName={setReplyName}
								setReplyCommentId={setReplyCommentId}
								setOnReply={setOnReply}
								authed={authed}
								fetchRecentReply={
									fetchRecentReply && replyCommentId == comment.commentId
								}
								setFetchRecentReply={setFetchRecentReply}
							/>
						</Box>
					))}
					{comments.length == 0 && (
						<Box fontWeight={300}>
							No comment yet. Leave the first comment below.
						</Box>
					)}
				</Box>
				{onReply && (
					<Flex direction="row" align="center" justify="space-between">
						<Flex
							borderWidth="1px"
							borderRadius="md"
							fontSize="sm"
							mt={2}
							width="100%"
						>
							Replying to{" "}
							<Text fontWeight={500} ml="1">
								{" " + replyName}
							</Text>
						</Flex>
						<Icon
							as={IoMdCloseCircleOutline}
							boxSize="20px"
							ml="2"
							onClick={handleCloseReply}
							_hover={{ color: "blue.300", cursor: "pointer" }}
						/>
					</Flex>
				)}
				{authed ? (
					<Flex direction="row" align="center" height="32px">
						<Input
							size="sm"
							placeholder="Add a comment"
							value={newComment}
							onKeyDown={handleKeyDown}
							onChange={handleChange}
						></Input>
						<Icon
							as={IoIosSend}
							boxSize="20px"
							ml="2"
							onClick={sendComment}
							_hover={{ color: "blue.300", cursor: "pointer" }}
						/>
					</Flex>
				) : (
					<Input isDisabled size="sm" placeholder="Log in to comment"></Input>
				)}
			</Box>
		</LoadingWrapper>
	);
}
