import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
	Box,
	Badge,
	Text,
	Input,
	Flex,
	Icon,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import { timeAgo, isPostedWithin, isCleanComment } from "@/utils/generalUtils";
import { Post, Comment } from "@/lib/model";
import { IoIosSend, IoMdCloseCircleOutline } from "react-icons/io";
import { CommentCard } from "../comments/cards";
import {
	getCommentsByPostId,
	uploadComment,
	uploadSubComment,
} from "@/utils/commentUtils";

export function PostPageSection({ post }: { post: Post }) {
	// card of post info
	// registerTime to record time, posted recently to check if post is new
	const registerTime = timeAgo(post.putOutTime);
	const postedRecent = isPostedWithin(post.putOutTime, "month");
	const isAvailable = post.isAvailable;
	const isHot = post.views >= 500;
	const [isPostDetailsLong, setIsPostDetailsLong] = useState(false);
	const [detailsLengthToKeep, setDetailsLengthToKeep] = useState(0);

	const contentRef = useRef<HTMLDivElement | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const updateDetailsLength = () => {
		// to update how long of the post details to show in the page
		if (contentRef.current) {
			const containerWidth = contentRef.current.clientWidth;
			setDetailsLengthToKeep(1.5 * containerWidth - post.description.length);
			setIsPostDetailsLong(post.postDetails.length > detailsLengthToKeep);
		}
	};

	useEffect(() => {
		// Update details length on mount
		updateDetailsLength();

		// Update details length on window resize
		window.addEventListener("resize", updateDetailsLength);

		// Clean up the event listener on unmount
		return () => {
			window.removeEventListener("resize", updateDetailsLength);
		};
	}, [post.postDetails.length, detailsLengthToKeep]);

	// put all information of the post out
	return (
		<Box borderRadius="lg" overflow="auto" ref={contentRef}>
			<Box display="flex" alignItems="baseline">
				{postedRecent && isAvailable && (
					<Badge borderRadius="full" px="2" colorScheme="blue" mr="3">
						New
					</Badge>
				)}
				{!isAvailable && (
					<Badge borderRadius="full" px="2" colorScheme="gray" mr="3">
						Archived
					</Badge>
				)}
				{isHot && (
					<Badge borderRadius="full" px="2" colorScheme="red" mr="3">
						Hot
					</Badge>
				)}
				<Box fontWeight={500} letterSpacing="wide" fontSize="lg">
					{post.title}
				</Box>
				<Box as="span" ml="8" color="gray.600" fontSize="sm">
					{registerTime}
				</Box>
			</Box>

			<Box mt="1" as="h4" lineHeight="tight" fontSize="md" fontWeight={450}>
				<Text as="span">{post.description}</Text>
			</Box>

			<Flex
				mt="1"
				lineHeight="tight"
				fontSize="md"
				fontWeight={325}
				wrap="wrap"
				align="center"
			>
				<Box as="span">
					{post.postDetails.length > 600
						? post.postDetails.substring(0, detailsLengthToKeep) + "..."
						: post.postDetails.substring(0, detailsLengthToKeep)}
					{isPostDetailsLong && (
						<Text
							align="right"
							fontSize="sm"
							colorScheme="blue"
							onClick={onOpen}
							_hover={{ color: "blue.300" }}
						>
							Show More
						</Text>
					)}
				</Box>
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Post Details</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box maxH="60vh" overflowY="auto">
							{post.postDetails.split("\n\n").map((paragraph, index) => (
								<Text key={index} mb="4">
									{paragraph}
								</Text>
							))}
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
}

export function CommentSection({
	// the entire comment section of each post
	authed,
	postId,
	setTotalComments,
}: {
	authed: boolean;
	postId: string;
	setTotalComments: React.Dispatch<React.SetStateAction<number>>;
}) {
	const [comments, setComments] = useState<Comment[]>([]); // the array of all comments that are to be loaded
	const [newComment, setNewComment] = useState<string>(""); // the input comment of the user
	const [loadingMore, setLoadingMore] = useState(true); // if it is loading comments
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
		if (onReply && postId) {
			if (newComment == "") {
				toast({
					title: "Reply cannot be empty.",
					status: "error",
					duration: 2000,
					isClosable: true,
				});
			} else {
				try {
					await uploadSubComment(newComment, replyCommentId, postId);
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
				} finally {
					setTotalComments((comments) => comments + 1);
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
				} else if (!isCleanComment(newComment)) {
					toast({
						title: "Please ensure language used in the comments and try again.",
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
					} finally {
						setTotalComments((comments) => comments + 1);
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
		<Box width="100%" height="500px">
			{/* add to display comments related to this post */}
			<Text fontSize="large" fontWeight="bold" height="30px">
				{" "}
				Comments{" "}
			</Text>
			<Box
				height={onReply ? "calc(100% - 131px)" : "calc(100% - 100px)"}
				overflowY="auto"
				id="commentBox"
				mb="2"
			>
				{comments.map((comment) => (
					<Box key={comment.commentId}>
						<CommentCard
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
				{!loadingMore && comments.length == 0 && (
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
	);
}
