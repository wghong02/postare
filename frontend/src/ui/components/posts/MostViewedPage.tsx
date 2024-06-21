import React, { useEffect, useState, useRef } from "react";
import { getMostInOneAttributePosts } from "@/utils/postUtils";
import LoadingWrapper from "../web/LoadingWrapper";
import { fetchPosts } from "@/utils/fetchFunctions";
import { Box, Heading } from "@chakra-ui/react";
import { Post } from "@/lib/model";
import PostPreviewCard from "./PostPreviewCard";
import {
  BackToTopFooter,
  Masonry,
} from "../basicComponents/productBasicComponents";

const MostViewedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [initLoading, setInitLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postsToLoad, setPostsToLoad] = useState(20);
  const [numColumns, setNumColumns] = useState(4);
  const [hasFetched, setHasFetched] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  // Fetch data based on currentPage
  const fetchData = async () => {
    try {
      setLoadingMore(true); // Start loading
      const newPosts = await getMostInOneAttributePosts({
        attribute: "viewed",
        query: { limit: postsToLoad, offset: posts.length },
      });

      if (newPosts != null) {
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
    <>
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
            Posts For You
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
      {!loadingMore && currentPage > 3 && reachedEnd && (
        <p>
          <Box justifyContent={"center"} paddingBottom={8}>
            You have reached the bottom of all posts.
          </Box>
        </p>
      )}
      <BackToTopFooter></BackToTopFooter>
    </>
  );
};

export default MostViewedPage;
