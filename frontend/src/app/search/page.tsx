"use client";
import React, { useEffect, useState } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { searchPostsByDescription } from "@/utils/postUtils";
import { Post } from "@/lib/model";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import {
	BackToTopFooter,
	Masonry,
} from "@/ui/components/basicComponents/productBasicComponents";
import { PostPreviewCard } from "@/ui/components/posts/cards";

const SearchPostsPage = () => {
	// show search results of post cards

	const [posts, setPosts] = useState<Post[]>([]); // posts to show
	const [currentPage, setCurrentPage] = useState(1);
	const [initLoading, setInitLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [postsToLoad, setPostsToLoad] = useState(20);
	const [numColumns, setNumColumns] = useState(4);
	const [hasFetched, setHasFetched] = useState(false);
	const [reachedEnd, setReachedEnd] = useState(false);

	const fetchData = async () => {
		try {
			const searchParams = new URLSearchParams(window.location.search);
			const description: string | null = searchParams.get("description");
			setLoadingMore(true); // Start loading
			const newPosts = await searchPostsByDescription({
				description: description,
				limit: postsToLoad,
				offset: posts.length,
			});

			if (newPosts != null && newPosts.length != 0) {
				if (currentPage == 1) {
					setPosts(newPosts);
				} else {
					setPosts([...posts, ...newPosts]); // append new posts
				}
			} else {
				setReachedEnd(true);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
			throw error;
		} finally {
			setHasFetched(true);
			setInitLoading(false);
			setLoadingMore(false);
		}
	};

	useEffect(() => {
		// fetch more data when going to the next page
		fetchData();
	}, [currentPage]);

	// to handle if ha reached the bottom of the page
	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY >= document.body.offsetHeight &&
				!loadingMore &&
				!reachedEnd
			) {
				setCurrentPage(currentPage + 1);
			}
		};
		setHasFetched(false);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loadingMore]);

	// number of posts to load per scroll

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			const rowsToLoad = 1;

			let columns = 1;
			if (width > 1500) {
				columns = 4;
			} else if (width > 1100) {
				columns = 3;
			} else if (width > 700) {
				columns = 2;
			}
			setNumColumns(columns);
			setPostsToLoad(numColumns * rowsToLoad);
		};
		// intializer
		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const renderPhantomCards = (count: number) => {
		const phantomCards = [];
		for (let i = 0; i < count; i++) {
			phantomCards.push(
				<Box
					key={`phantom-${i}`}
					maxW="300px"
					borderWidth="1px"
					borderRadius="lg"
					overflow="hidden"
				>
					<Box p="3" bg="gray.300" height="200px" />
					<Box p="3" bg="gray.200" height="100px" />
				</Box>
			);
		}
		return phantomCards;
	};

	return (
		<Flex direction="column" align="center">
			<Box
				display="flex"
				width="100%"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				mt="4"
			>
				<LoadingWrapper loading={initLoading} hasFetched={hasFetched}>
					<Heading as="h1" mb="4" fontWeight={500}>
						Search Results
					</Heading>
					<Masonry columns={numColumns} gap={10}>
						{posts?.length > 0 ? (
							posts.map((post, index) => (
								<PostPreviewCard key={index} post={post} />
							))
						) : (
							<p>No posts available</p>
						)}
						{loadingMore && renderPhantomCards(numColumns)}
					</Masonry>
				</LoadingWrapper>
			</Box>
			{!loadingMore && reachedEnd && posts.length > 0 && (
				<p>
					<Box justifyContent={"center"} paddingBottom={8}>
						You have reached the bottom of all posts.
					</Box>
				</p>
			)}
			<BackToTopFooter containerRef={null}></BackToTopFooter>
		</Flex>
	);
};

export default SearchPostsPage;
