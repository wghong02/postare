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

const PostInfoPage = ({ params }: { params: { id: string } }) => {
  // post page for the users to upload and delete and view posts they own
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const postData = await getPost(params.id);
      setPost(postData);
      if (postData && postData.postOwnerId) {
        try {
          const userInfo = await getUserPublicInfo(postData.postOwnerId);
          setUser(userInfo);
        } catch (error) {
          console.error("Error fetching posts:", error);
          throw error;
        } finally {
          setLoading(false);
          setHasFetched(true);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; 
    }
  };

  useEffect(() => {
    fetchData();
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
            <HStack spacing={4}>
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
                <Flex flexDirection="column" align="center">
                  <Icon as={CiHeart} boxSize="30px" />
                  <Text fontSize="sm">{post?.likes}</Text>
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
              <VStack minW="35%" height="100%" spacing="5" align={"left"}>
                {user && (
                  <Flex height="50px">
                    <PostOwnerInfoCard user={user}></PostOwnerInfoCard>
                  </Flex>
                )}
                <Flex height="calc(100% - 50px)" overflowY="auto">
                  <CommentSection></CommentSection>
                </Flex>
              </VStack>
            </HStack>

            {post && (
              <Flex width="100%" minH="100px">
                <PostPageSection post={post}></PostPageSection>
              </Flex>
            )}

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
