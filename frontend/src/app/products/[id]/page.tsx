"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Image,
  StackDivider,
  HStack,
} from "@chakra-ui/react";
import { getPost } from "@/utils/postUtils";
import { getUserInfo } from "@/utils/userUtils";
import { Post, User } from "@/lib/model";
import RatingDisplay from "@/ui/components/users/ratingComponent";
import { SellerCard } from "@/ui/components/users/userInfoComponent";
import PostPageCard from "@/ui/components/posts/postInfoComponent";
import { fetchSinglePost, fetchUser } from "@/utils/fetchFunctions";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";

const PostInfoPage = ({ params }: { params: { id: string } }) => {
  // post page for the users to upload and delete and view posts they own
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const fetchData = async () => {
    try {
      const postData = await fetchSinglePost(params.id, setPost, getPost);
      if (postData && postData.sellerID) {
        try {
          await fetchUser(postData.sellerID, setUser, getUserInfo);
        } catch (error) {
          console.error("Error fetching posts:", error);
          throw error; // Re-throw the error to handle it in useLoading
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; // Re-throw the error to handle it in useLoading
    }
  };

  const { loading, hasFetched } = useLoading(fetchData);

  return (
    <>
      <Box display="flex" justifyContent="center" mt="4">
        <LoadingWrapper loading={loading} hasFetched={hasFetched}>
          <VStack
            width="60%"
            divider={<StackDivider borderColor="gray.200" />}
            spacing="5"
            align="stretch"
          >
            {/* Hstacks to organize the details of the post */}
            <HStack spacing={4}>
              <Flex width="70%" h="400px" align={"center"} justify={"center"}>
                <Image
                  src={post?.imageUrl}
                  alt="Post Image"
                  objectFit="cover"
                  maxW="100%"
                  maxH="100%"
                />
              </Flex>
              <Flex width="30%" h="400px">
                <VStack
                  width="100%"
                  spacing="5"
                  align="stretch"
                  divider={<StackDivider borderColor="gray.200" />}
                >
                  <Flex h="300px">
                    <SellerCard user={user}></SellerCard>
                  </Flex>
                  <Flex h="100px">
                    <RatingDisplay
                      rating={user?.userRating}
                      reviews={user?.totalReviews}
                    ></RatingDisplay>
                  </Flex>
                </VStack>
              </Flex>
            </HStack>

            <HStack spacing={4}>
              <Flex width="70%" h="200px">
                <PostPageCard post={post}></PostPageCard>
              </Flex>
              <Flex width="30%" h="200px">
                For future Map/online payment
              </Flex>
            </HStack>

            <Box h="200px" bg="pink.100">
              For future recommendations
            </Box>
          </VStack>
        </LoadingWrapper>
      </Box>
    </>
  );
};
export default PostInfoPage;
