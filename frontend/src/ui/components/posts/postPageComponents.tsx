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
import { getCommentsByPostId, uploadComment } from "@/utils/commentUtils";
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
	authed,
	postId,
}: {
	authed: boolean;
	postId: string;
}) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [newComment, setNewComment] = useState<string>("");
	const [initLoading, setInitLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [reachedEnd, setReachedEnd] = useState(false);
	const [onReply, setOnReply] = useState(false);
	const [replyName, setReplyName] = useState<String>("");
	const toast = useToast();
	const commentsToLoad = 6;

	const sendComment = async () => {
		if (onReply) {
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
						fetchComments();
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

	const fetchComments = async () => {
		try {
			setLoadingMore(true);
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
		} catch (error) {
			console.error("Error fetching comments:", error);
		} finally {
			setInitLoading(false);
			setHasFetched(true);
			setLoadingMore(false);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			sendComment(); // Trigger send when Enter key is pressed
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewComment(e.target.value);
	};

	useEffect(() => {
		fetchComments();
	}, [currentPage]);

	// to handle if ha reached the bottom of the page
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

	const handleCloseReply = () => {
		setOnReply(false);
	};

	return (
		<LoadingWrapper loading={initLoading} hasFetched={hasFetched}>
			<Box width="100%" height={onReply ? "290px" : "320px"}>
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
								setOnReply={setOnReply}
								authed={authed}
							/>
						</Box>
					))}
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
