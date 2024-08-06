"use client";
import React, { useEffect, useState } from "react";
import {
	Box,
	Flex,
	VStack,
	Image,
	StackDivider,
	HStack,
	Icon,
	Text,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	useClipboard,
	IconButton,
} from "@chakra-ui/react";
import { getPost, increasePostViews } from "@/utils/postUtils";
import { getUserPublicInfo } from "@/utils/userUtils";
import { uploadLike, deleteLike, checkLike } from "@/utils/likeUtils";
import { Post, UserInfo } from "@/lib/model";
import { PostOwnerInfoCard } from "@/ui/components/users/userInfoComponents";
import {
	PostPageSection,
	CommentSection,
} from "@/ui/components/posts/postPageComponents";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import notFound from "@/app/not-found";
import { getCommentCountByPostId } from "@/utils/commentUtils";

import { CiChat1 } from "react-icons/ci";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { VscFlame } from "react-icons/vsc";
import { CopyIcon } from "@chakra-ui/icons";

const PostInfoPage = ({ params }: { params: { id: string } }) => {
	// post page for the users to upload and delete and view posts they own
	const [post, setPost] = useState<Post | null>(null); // to track the current post
	const [user, setUser] = useState<UserInfo | null>(null); // to track the user associated with the post
	const [loading, setLoading] = useState(true); // to track if the page is loading
	const [hasFetched, setHasFetched] = useState(false); // to track if the main components of the page is already fetched in full
	const [liked, setLiked] = useState(false); // the track if the user currently likes this post
	const [totalLikes, setTotalLikes] = useState<number>(0); // to adjust the total likes of the post
	const [totalComments, setTotalComments] = useState<number>(0); // to track the total comments of the post
	const [authed, setAuthed] = useState<boolean>(false); // to track if the user is currently authed to comment and like
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { hasCopied, onCopy } = useClipboard(window.location.href);
	const toast = useToast();

	const postId = params.id;

	// fetch the post and corresponding user's info
	const fetchData = async () => {
		try {
			setLoading(true);
			const postData = await getPost(postId);
			await increasePostViews(postId);
			setPost(postData);
			if (postData) {
				const userInfo = await getUserPublicInfo(postData.postOwnerId);
				if (!authed) {
					setLiked(false);
				} else {
					const alreadyLiked = await checkLike(postId);
					setLiked(alreadyLiked);
				}
				setUser(userInfo);
			}
			setTotalLikes(postData.likes);
		} catch (error) {
			console.error("Error fetching post:", error);
			notFound();
		} finally {
			setLoading(false);
			setHasFetched(true);
		}
	};

	// fetch the number of comments of this post
	const fetchCommentCount = async () => {
		try {
			const countResult = await getCommentCountByPostId({
				postId: postId,
				isTotal: true,
			});
			setTotalComments(countResult);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	// fetch the number of likes of this post

	// handle when user likes. put it here since the user can only like or unlike the post.
	const handleLike = async () => {
		if (!authed) {
			toast({
				title: "Log into your account to like",
				status: "info",
				duration: 2000,
				isClosable: true,
			});
		} else if (!liked) {
			try {
				await uploadLike(postId);
			} catch (error) {
				console.error("Error adding like:", error);
			} finally {
				setTotalLikes((likes) => likes + 1);
				setLiked(true);
				toast({
					title: "Liked!",
					status: "success",
					duration: 2000,
					isClosable: true,
				});
			}
		} else {
			try {
				await deleteLike(postId);
			} catch (error) {
				console.error("Error deleting like:", error);
			} finally {
				setTotalLikes((likes) => likes - 1);
				setLiked(false);
				toast({
					title: "Unliked!",
					status: "info",
					duration: 2000,
					isClosable: true,
				});
			}
		}
	};

	// for copying the url of the post to share
	const handleCopy = () => {
		onCopy();
		toast({
			title: "URL Copied.",
			description: "The current URL has been copied to your clipboard.",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
	};

	// fetch the data, number of comments and number of likes each load of the website
	useEffect(() => {
		fetchData();
		fetchCommentCount();
		const authToken = localStorage.getItem("authToken");
		setAuthed(authToken !== null);
	}, []);

	return (
		<Box
			display="flex"
			justifyContent="center"
			style={{ overflow: "auto" }}
			minW="700px"
		>
			<LoadingWrapper loading={loading} hasFetched={hasFetched}>
				<Box
					minW="61.8%"
					maxW="1200px"
					display="flex"
					flexDir="column"
					justifyContent="center"
				>
					{post && (
						<VStack
							m="25"
							borderWidth="1px"
							borderRadius="30"
							boxShadow="lg"
							minW="600px"
							overflowX="auto"
						>
							<VStack
								maxH="100%"
								divider={<StackDivider borderColor="gray.200" />}
								spacing="5"
								align="center"
								m="25"
							>
								<HStack spacing="50px" maxH="600px">
									<Flex width="61.8%" minW="300px">
										<Image
											src={post.imageUrl}
											alt="Post Image"
											objectFit="scale-down"
											width="100%"
											minW="300px"
											height="400px"
										/>
									</Flex>
									<VStack
										spacing="5"
										align="start"
										minH="400px"
										minW="200px"
										maxW="40%"
									>
										{user && (
											<Flex height="50px" width="100%">
												<PostOwnerInfoCard user={user}></PostOwnerInfoCard>
											</Flex>
										)}
										<HStack align="center" justify="left" spacing="30px">
											<Flex
												align="center"
												cursor="pointer"
												onClick={handleLike}
												color={liked ? "red.500" : "gray.500"}
												_hover={{ color: "pink.300" }}
											>
												{liked ? (
													<Icon as={IoMdHeart} boxSize="30px" />
												) : (
													<Icon as={IoIosHeartEmpty} boxSize="30px" />
												)}
												<Text fontSize="sm" ml="4px">
													{totalLikes}
												</Text>
											</Flex>

											<Flex align="center" color={"gray.500"}>
												<Icon as={VscFlame} boxSize="30px" color="#F56565" />
												<Text fontSize="sm" ml="4px">
													{post.views + 1}
												</Text>
											</Flex>

											<Flex align="center" color={"gray.500"}>
												<Icon as={CiChat1} boxSize="30px" color="#4299E2" />
												<Text fontSize="sm" ml="6px">
													{totalComments}
												</Text>
											</Flex>

											<Flex
												align="center"
												color={"gray.500"}
												cursor="pointer"
												onClick={onOpen}
												_hover={{ color: "blue.300" }}
											>
												<Icon as={BsThreeDots} boxSize="30px" color="grey" />
											</Flex>
										</HStack>
										{post && (
											<Flex width="100%" maxH="100%">
												<PostPageSection post={post}></PostPageSection>
											</Flex>
										)}
									</VStack>
								</HStack>

								<Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
									<ModalOverlay />
									<ModalContent>
										<ModalHeader>Share this Post</ModalHeader>
										<ModalCloseButton />
										<ModalBody>
											<HStack
												spacing={4}
												p={4}
												borderWidth={1}
												borderRadius="md"
												borderColor="gray.200"
												bg="gray.50"
												alignItems="center"
											>
												<Text flex="1">{window.location.href}</Text>
												<IconButton
													icon={<CopyIcon />}
													aria-label="Copy URL"
													onClick={() => {
														handleCopy();
														onOpen();
													}}
												/>
											</HStack>
										</ModalBody>
									</ModalContent>
								</Modal>

								{post && (
									<Box height="500px" width="70%">
										<CommentSection
											authed={authed}
											postId={post.postId}
											setTotalComments={setTotalComments}
										></CommentSection>
									</Box>
								)}
							</VStack>
						</VStack>
					)}
					<Box
						h="200px"
						fontSize="x-large"
						justifyContent="center"
						display="flex"
					>
						More Like This
					</Box>
				</Box>
			</LoadingWrapper>
		</Box>
	);
};
export default PostInfoPage;
