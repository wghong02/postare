import React, { useEffect, useState, useRef } from "react";
import { getMostViewedPosts } from "@/utils/postUtils";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "../web/LoadingWrapper";
import { fetchPosts } from "@/utils/fetchFunctions";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Post } from "@/lib/model";
import PostCard from "./PostCard";
import Masonry from "react-masonry-css";
import {
  handleInfScroll,
  Footer,
} from "../basicComponents/productBasicComponents";

const MostViewedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postsToLoad, setPostsToLoad] = useState(20);

  const fetchData = async () => {
    try {
      await fetchPosts(
        { batch: currentPage, totalSize: postsToLoad },
        (newPosts) => setPosts((prevPosts) => [...prevPosts, ...newPosts]),
        getMostViewedPosts
      );
      setLoadingMore(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; // Re-throw the error to handle it in useLoading
    }
  };

  const { loading, hasFetched } = useLoading(fetchData);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // number of columns of posts
  const breakpointColumnsObj = {
    default: 4,
    1500: 3,
    1100: 2,
    700: 1,
  };

  // to handle if ha reached the bottom of the page
  useEffect(() => {
    const handleScroll = handleInfScroll(
      () => setLoadingMore(true),
      () => setCurrentPage((prevPage) => prevPage + 1),
      loadingMore
    );

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore]);

  // number of posts to load per scroll
  const rowsToLoad = 5;
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1500) {
        setPostsToLoad(4 * rowsToLoad);
      } else if (width > 1100) {
        setPostsToLoad(3 * rowsToLoad);
      } else if (width > 700) {
        setPostsToLoad(2 * rowsToLoad);
      } else {
        setPostsToLoad(1 * rowsToLoad);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially to set the correct posts per page

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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
    <Box display="flex" flexDirection="column" justifyContent="center" mt="4">
      <LoadingWrapper loading={loading} hasFetched={hasFetched}>
        <Heading as="h1" mb="4">
          Posts For You
        </Heading>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts?.length > 0 ? (
            posts.map((post, index) => <PostCard key={index} post={post} />)
          ) : (
            <p>No posts available</p>
          )}
          {loadingMore && renderPhantomCards(postsToLoad)}
        </Masonry>
        <div ref={loadMoreRef} />
      </LoadingWrapper>
      <Footer></Footer>
    </Box>
  );
};

export default MostViewedPage;
