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
import { CiHeart } from "react-icons/ci";
import { VscFlame } from "react-icons/vsc";
import { TiMessages } from "react-icons/ti";

import notFound from "@/app/not-found";
import { Comment } from "@/lib/model";

const PostInfoPage = ({ params }: { params: { id: string } }) => {
	// post page for the users to upload and delete and view posts they own
	const [post, setPost] = useState<Post | null>(null);
	const [user, setUser] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);
	const [liked, setLiked] = useState(false);
	const [totalLikes, setTotalLikes] = useState<number>(0);
	const [authed, setAuthed] = useState<boolean>(false);
	const toast = useToast();

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

	useEffect(() => {
		fetchData();
		const authToken = localStorage.getItem("authToken");
		setAuthed(authToken !== null);
	}, []);

	return (
		<>
			<Box display="flex" justifyContent="center" mt="30" ml="50" mr="50">
				<LoadingWrapper loading={loading} hasFetched={hasFetched}>
					<VStack
						maxW="1500px"
						minW="60%"
						maxH="100%"
						divider={<StackDivider borderColor="gray.200" />}
						spacing="5"
						align="stretch"
					>
						{/* Hstacks to organize the details of the post */}
						<HStack spacing={4} maxH="400px">
							<Flex maxH="400px" align="center" justify="center">
								<Image
									src={post?.imageUrl}
									alt="Post Image"
									objectFit="cover"
									maxW="100%"
									height="400px"
								/>
							</Flex>

							{/* column of icons */}
							<VStack
								height="100%"
								minW="50px"
								maxH="400px"
								align="center"
								justify="space-between"
								direction="column"
							>
								<Flex
									flexDirection="column"
									align="center"
									cursor="pointer"
									onClick={handleLike}
									color={liked ? "red.500" : "gray.500"}
									_hover={{ color: "pink.300" }}
								>
									<Icon as={CiHeart} boxSize="30px" />
									<Text fontSize="sm">{totalLikes}</Text>
								</Flex>

								<Flex flexDirection="column" align="center">
									<Icon as={VscFlame} boxSize="30px" />
									<Text fontSize="sm">{post?.views}</Text>
								</Flex>

								<Flex flexDirection="column" align="center">
									<Icon as={TiMessages} boxSize="30px" color="blue" />
									<Text fontSize="sm">#1</Text>
								</Flex>
							</VStack>

							{/* column of comments */}
							<VStack minW="35%" maxH="400px" spacing="5" align={"left"}>
								{user && (
									<Flex height="50px">
										<PostOwnerInfoCard user={user}></PostOwnerInfoCard>
									</Flex>
								)}
								{post && (
									<Box maxH="calc(100% - 50px)">
										<CommentSection
											authed={authed}
											postId={post.postId}
										></CommentSection>
									</Box>
								)}
							</VStack>
						</HStack>

						{post && (
							<Flex width="100%" minH="100px">
								<PostPageSection post={post}></PostPageSection>
							</Flex>
						)}

						{/* <Box h="200px" bg="pink.100">
							For future recommendations
						</Box> */}
					</VStack>
				</LoadingWrapper>
			</Box>
		</>
	);
};
export default PostInfoPage;
