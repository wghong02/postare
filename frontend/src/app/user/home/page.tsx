"use client";
import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "@/ui/components/web/Header";
import Sidebar from "@/ui/components/web/Sidebar";
import { UserCard } from "@/ui/components/users/userInfoComponent";
import { jwtDecode } from "jwt-decode";
import { getUserInfo } from "@/utils/userUtils";
import { User } from "@/lib/model";

const UserHomePage = () => {
  // user home page, allows each user to view and edit personal profile
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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
    <>
      <Header />
      <Flex>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          flex="1"
          p="4"
          marginLeft={isSidebarOpen ? "250px" : "0"}
          transition="margin-left 0.3s"
          alignItems="center"
          justifyContent="center"
        >
          {/* User card for now */}
          {loading ? <p>Loading...</p> : user && <UserCard user={user} />}
        </Box>
      </Flex>
    </>
  );
};
export default UserHomePage;
