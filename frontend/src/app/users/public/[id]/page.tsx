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
import { getUserPosts } from "@/utils/postUtils";
import { getUserPublicInfo } from "@/utils/userUtils";
import { Post, UserInfo } from "@/lib/model";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { UserPublicInfoComponent } from "@/ui/components/users/userPublicInfoComponents";

const UserPublicInfoPage = ({ params }: { params: { id: string } }) => {
  // to view the posts and info of a user
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const userId = parseInt(params.id);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserPublicInfo(userId);
      console.log(userInfo)
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="center" mt="30" ml="50" mr="50">
        <LoadingWrapper loading={loading} hasFetched={hasFetched}>
          {user && (
            <UserPublicInfoComponent user={user}></UserPublicInfoComponent>
          )}
        </LoadingWrapper>
      </Box>
    </>
  );
};
export default UserPublicInfoPage;
