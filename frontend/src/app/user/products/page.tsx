"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import UserPostCard from "@/ui/components/posts/UserPostCard";
import { getUserPosts, uploadPost } from "@/utils/postUtils";
import { jwtDecode } from "jwt-decode";
import UploadPostForm from "@/ui/components/posts/UploadPostForm";
import { UploadFormData } from "@/lib/types";
import { Post } from "@/lib/model";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { fetchPosts } from "@/utils/fetchFunctions";

const UserPostPage = () => {
  // post page for the users to upload and delete and view posts they own
  const [posts, setPosts] = useState<Post[]>([]);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // for the pop up chakra modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  // to upload the post
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    price: "",
    condition: "",
    postDetails: "",
    imageUrl: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // fetch post from the user
  const fetchData = async () => {
    const token: string | null = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userID = decodedToken.userID;
        await fetchPosts({ userID: userID, query: "" }, setPosts, getUserPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Re-throw the error to handle it in useLoading
      }
    }
  };

  const { loading, hasFetched } = useLoading(fetchData);

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

  useEffect(() => {}), [needsRefresh]; // !!! edit to refresh on submit

  return (
    <>
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
        loading={loading}
        hasFetched={hasFetched}
        hasData={posts.length > 0}
      >
        <Flex justify="space-between" wrap="wrap">
          {posts.map((post, index) => (
            <UserPostCard key={index} post={post} />
          ))}
        </Flex>
      </LoadingWrapper>
    </>
  );
};
export default UserPostPage;
