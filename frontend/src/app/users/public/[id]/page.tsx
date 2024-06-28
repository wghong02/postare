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
	IconButton,
	useToast,
} from "@chakra-ui/react";
import { getUserPublicPosts } from "@/utils/postUtils";
import { getUserPublicInfo } from "@/utils/userUtils";
import { Post, UserInfo } from "@/lib/model";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { UserPublicInfoComponent } from "@/ui/components/users/userPublicInfoComponents";
import { notFound } from "next/navigation";
import { UserPublicPostRow } from "@/ui/components/posts/rows";
import { VscTasklist } from "react-icons/vsc";

const UserPublicInfoPage = ({ params }: { params: { id: string } }) => {
	// to view the posts and info of a user
	const [posts, setPosts] = useState<Post[]>([]);
	const [user, setUser] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(4);
	const [reachedEnd, setReachedEnd] = useState(false);
	const [totalPages, setTotalPages] = useState<number | null>(null);

	const userId = parseInt(params.id);
	const toast = useToast();

	const fetchUserData = async () => {
		try {
			setLoading(true);
			const userInfo = await getUserPublicInfo(userId);
			setUser(userInfo);
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoading(false);
			setHasFetched(true);
		}
	};

	const fetchPostsData = async () => {
		try {
			setLoadingMore(true);
			const newPosts = await getUserPublicPosts({
				query: {
					limit: postsPerPage + 1,
					offset: posts.length,
					description: null,
				},
				userId: userId,
			});
			if (newPosts.length > 0) {
				setPosts([...posts, ...newPosts]); // Append new posts to existing posts
			} else {
				setReachedEnd(true); // No more posts to load
				setTotalPages(currentPage);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		} finally {
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			let columns = 1;
			if (width > 1600) {
				columns = 4;
			} else if (width > 1100) {
				columns = 3;
			} else if (width > 600) {
				columns = 2;
			}
			setPostsPerPage(columns);
		};

		// Initial setup
		handleResize();
		window.addEventListener("resize", handleResize);

		// Cleanup event listener
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		fetchUserData();
	}, []);

	useEffect(() => {
		fetchPostsData();
	}, [user]);

	const handleNextPage = () => {
		setCurrentPage((prevPage) => {
			if (!reachedEnd) {
				fetchPostsData();
				return prevPage + 1;
			} else if (totalPages && currentPage <= totalPages) {
				return prevPage + 1;
			} else {
				toast({
					description: "No more posts.",
					status: "info",
					duration: 1500,
					isClosable: true,
				});
				return prevPage;
			}
		});
	};

	const handlePrevPage = () => {
		if (currentPage != 1) {
			setCurrentPage((prevPage) => prevPage - 1);
		} else {
			toast({
				description: "This is the first page.",
				status: "error",
				duration: 1500,
				isClosable: true,
			});
		}
	};

	if (!loading && !user) {
		notFound();
	}

	return (
		<>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				mt="30"
				ml="50"
				mr="50"
				flexDir="column"
			>
				<LoadingWrapper loading={loading} hasFetched={hasFetched}>
					<VStack divider={<StackDivider borderColor="gray.400" />}>
						{user && (
							<UserPublicInfoComponent user={user}></UserPublicInfoComponent>
						)}
						<LoadingWrapper loading={loadingMore} hasFetched={hasFetched}>
							<Flex align="center" direction="column">
								<Box fontSize="md" margin="4">
									{" "}
									Most Recent Posts By the User
								</Box>
								<UserPublicPostRow
									posts={posts}
									postsPerPage={postsPerPage}
									currentPage={currentPage}
									handleNextPage={handleNextPage}
									handlePrevPage={handlePrevPage}
									reachedEnd={reachedEnd}
								/>
							</Flex>
						</LoadingWrapper>
					</VStack>
				</LoadingWrapper>
			</Box>
		</>
	);
};
export default UserPublicInfoPage;
