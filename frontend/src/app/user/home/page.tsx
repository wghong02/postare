"use client";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { UserHomeInfoComponent } from "@/ui/components/users/userInfoComponents";
import { getUserInfo } from "@/utils/userUtils";
import { UserInfo } from "@/lib/model";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";

const UserHomePage = () => {
  // user home page, allows each user to view and edit personal profile
  const [user, setUser] = useState<UserInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const userInfo = await getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; // Re-throw the error to handle it in useLoading
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Flex alignItems="center" justifyContent="center">
      {/* User card for now */}
      <LoadingWrapper loading={loading} hasFetched={hasFetched}>
        {user && <UserHomeInfoComponent user={user} />}
      </LoadingWrapper>
    </Flex>
  );
};
export default UserHomePage;
