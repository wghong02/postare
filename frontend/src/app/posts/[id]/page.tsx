"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { getPost } from "@/utils/postUtils";
import { getUserPublicInfo } from "@/utils/userUtils";
import { Post, UserInfo } from "@/lib/model";
import { PostOwnerInfoCard } from "@/ui/components/users/userInfoComponents";
import {
	PostPageSection,
	CommentSection,
} from "@/ui/components/posts/postPageComponents";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { CiChat1 } from "react-icons/ci";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { VscFlame } from "react-icons/vsc";

import notFound from "@/app/not-found";
import { getCommentCountByPostId } from "@/utils/commentUtils";

const PostInfoPage = ({ params }: { params: { id: string } }) => {
	// post page for the users to upload and delete and view posts they own
	const [post, setPost] = useState<Post | null>(null); // to track the current post
	const [user, setUser] = useState<UserInfo | null>(null); // to track the user associated with the post
	const [loading, setLoading] = useState(true); // to track if the page is loading
	const [hasFetched, setHasFetched] = useState(false); // to track if the main components of the page is already fetched in full
	const [liked, setLiked] = useState(false); // the track if the user currently likes this post
	const [totalLikes, setTotalLikes] = useState<number>(0); // to adjust the total likes of the post
	const [totalComments, setTotalComments] = useState<number>(0); // to track the total comments of the post
	const [authed, setAuthed] = useState<boolean>(false); // to track if the user is currently authed to comment
	const toast = useToast();

	// fetch the post and corresponding user's info
	const fetchData = async () => {
		try {
			setLoading(true);
			const postData = await getPost(params.id);
			setPost(postData);
			if (postData && postData.postOwnerId) {
				const userInfo = await getUserPublicInfo(postData.postOwnerId);
				setUser(userInfo);
			}
			setTotalLikes(postData.likes);
		} catch (error) {
			console.error("Error fetching posts:", error);
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
				postId: params.id,
				isTotal: true,
			});
			setTotalComments(countResult);
		} catch (error) {
			console.error("Error fetching comments:", error);
		}
	};

	// fetch the number of likes of this post

	// handle when user likes. put it here since the user can only like or unlike the post.
	const handleLike = () => {
		if (!liked) {
			setTotalLikes((likes) => likes + 1);
			setLiked(true);
			toast({
				title: "Liked!",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} else {
			setTotalLikes((likes) => likes - 1);
			setLiked(false);
			toast({
				title: "Unliked!",
				status: "info",
				duration: 2000,
				isClosable: true,
			});
		}
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
			mt="30"
			ml="50"
			mr="50"
			minW="700px"
		>
			<LoadingWrapper loading={loading} hasFetched={hasFetched}>
				{post && (
					<VStack>
						<VStack
							maxW="1500px"
							maxH="100%"
							divider={<StackDivider borderColor="gray.200" />}
							spacing="5"
							align="stretch"
						>
							<HStack spacing="50px" maxH="600px">
								<Flex>
									<Image
										src={post.imageUrl}
										alt="Post Image"
										objectFit="scale-down"
										width="100%"
										height="400px"
									/>
								</Flex>
								<VStack spacing="5" align="stretch" height="100%">
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
												{post.views}
											</Text>
										</Flex>

										<Flex align="center" color={"gray.500"}>
											<Icon as={CiChat1} boxSize="30px" color="#4299E2" />
											<Text fontSize="sm" ml="6px">
												{totalComments}
											</Text>
										</Flex>
										{/* add share button here */}
									</HStack>
									{post && (
										<Flex width="100%" maxH="100%">
											<PostPageSection post={post}></PostPageSection>
										</Flex>
									)}
								</VStack>
							</HStack>

							{post && (
								<Box maxH="400px" width="70%" mx="auto">
									<CommentSection
										authed={authed}
										postId={post.postId}
										setTotalComments={setTotalComments}
									></CommentSection>
								</Box>
							)}

							{/* <Box h="200px" bg="pink.100">
							For future recommendations
						</Box> */}
						</VStack>
					</VStack>
				)}
			</LoadingWrapper>
		</Box>
	);
};
export default PostInfoPage;
