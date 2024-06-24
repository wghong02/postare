"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import UserPostCard from "@/ui/components/posts/UserPostCard";
import { getUserPosts, uploadPost } from "@/utils/postUtils";
import UploadPostForm from "@/ui/components/posts/UploadPostForm";
import { UploadFormData } from "@/lib/types";
import { Post } from "@/lib/model";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { BackToTopFooter } from "@/ui/components/basicComponents/productBasicComponents";

const UserPostPage = () => {
  // post page for the users to upload and delete and view posts they own
  const [posts, setPosts] = useState<Post[]>([]);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [initLoading, setInitLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);

  // for the pop up chakra modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  // to upload the post
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    postDetails: "",
    imageUrl: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  // default is not show delete
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await uploadPost(formData);
      onClose(); // Close the modal after form submission
      // Optionally refresh the post list
      setNeedsRefresh(true);
    } catch (error) {
      console.error("Failed to upload post:", error);
    }
  };

  useEffect(() => {}), [needsRefresh];

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

      <UploadPostForm
        formData={formData}
        isOpen={isOpen}
        onClose={onClose}
        handleChange={handleChange}
        handleFormSubmit={handleFormSubmit}
      />

      <LoadingWrapper
        loading={initLoading}
        hasFetched={hasFetched}
        hasData={posts.length > 0}
      >
        <Flex justify="space-between" wrap="wrap" mb="2">
          {posts.map((post, index) => (
            <UserPostCard key={index} post={post} />
          ))}
        </Flex>
      </LoadingWrapper>
      {!loadingMore && currentPage > 1 && reachedEnd && (
        <Box mb="20px">You have reached the bottom of all posts.</Box>
      )}
      <BackToTopFooter containerRef={containerRef}></BackToTopFooter>
    </Box>
  );
};
export default UserPostPage;
