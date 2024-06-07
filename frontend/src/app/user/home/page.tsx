"use client";
import React, { useEffect, useState } from "react";
import { Flex, Spinner } from "@chakra-ui/react";
import { UserCard } from "@/ui/components/users/userInfoComponent";
import { jwtDecode } from "jwt-decode";
import { getUserInfo } from "@/utils/userUtils";
import { User } from "@/lib/model";

const UserHomePage = () => {
  // user home page, allows each user to view and edit personal profile
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async (userId: number) => {
      try {
        const response = await getUserInfo(userId);
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch the corresponding user:", error);
      } finally {
        setLoading(false);
      }
    };
    const token: any = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userID;

        fetchUser(userId);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <Flex alignItems="center" justifyContent="center">
      {/* User card for now */}
      {loading ? <Spinner size="xl" /> : user && <UserCard user={user} />}
    </Flex>
  );
};
export default UserHomePage;
