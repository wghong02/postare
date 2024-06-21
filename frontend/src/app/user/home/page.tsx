"use client";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { UserHomeInfoComponent } from "@/ui/components/users/userInfoComponents";
import { jwtDecode } from "jwt-decode";
import { getUserInfo } from "@/utils/userUtils";
import { UserInfo } from "@/lib/model";
import { fetchUser } from "@/utils/fetchFunctions";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";

const UserHomePage = () => {
  // user home page, allows each user to view and edit personal profile
  const [user, setUser] = useState<UserInfo | null>(null);
  const fetchData = async () => {
    const token: string | null = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;
        await fetchUser({
          parameter: userId,
          setUser: setUser,
          userUtilFunction: getUserInfo,
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Re-throw the error to handle it in useLoading
      }
    }
  };
  const { loading, hasFetched } = useLoading(fetchData);

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
