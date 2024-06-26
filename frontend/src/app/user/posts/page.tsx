"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { UserPostCard } from "@/ui/components/posts/cards";
import { getUserPosts } from "@/utils/postUtils";
import { UploadPostForm } from "@/ui/components/posts/forms";
import { Post } from "@/lib/model";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { BackToTopFooter } from "@/ui/components/basicComponents/productBasicComponents";

const UserPostPage = () => {
  // post page for the users to upload and delete and view posts they own
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [initLoading, setInitLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const containerRef = useRef<HTMLDivElement>(null);

  // fetch post from the user
  const fetchData = async () => {
    try {
      setLoadingMore(true); // Start loading
      const newPosts = await getUserPosts({
        query: { limit: 4, offset: posts.length }, // load 10 posts at a time
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
      throw error; // Re-throw the error to handle it
    } finally {
      setHasFetched(true);
      setInitLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // fetch more data when scroll to the bottom
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container && !reachedEnd) {
        if (
          container.scrollHeight - container.scrollTop ===
          container.clientHeight
        ) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }
    };
    const container = containerRef.current;
    BackToTopFooter;
    setHasFetched(false);
    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loadingMore]);

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      ml="4"
      mt="4"
      ref={containerRef}
      style={{ overflowY: "auto" }}
    >
      {/* can view posts the user uploaded and upload new and delete existing posts */}

      <Flex>
        <Button onClick={onOpen} mb="4">
          Upload New Post
        </Button>
      </Flex>

      <UploadPostForm isOpen={isOpen} onClose={onClose} />

      <LoadingWrapper
        loading={initLoading}
        hasFetched={hasFetched}
        hasData={posts.length > 0}
      >
        {posts.length > 0 && (
          <Flex justify="space-between" wrap="wrap" mb="2">
            {posts.map((post, index) => (
              <UserPostCard key={index} post={post} />
            ))}
          </Flex>
        )}
        {loadingMore && <Box mb="20px">Loading More...</Box>}
        {posts.length == 0 && <Box>You have no posts, upload to see more.</Box>}
      </LoadingWrapper>
      {!loadingMore && currentPage > 1 && reachedEnd && (
        <Box mb="20px">You have reached the bottom of all posts.</Box>
      )}
      <BackToTopFooter containerRef={containerRef}></BackToTopFooter>
    </Box>
  );
};
export default UserPostPage;
