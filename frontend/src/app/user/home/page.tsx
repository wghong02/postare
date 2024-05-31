"use client";
import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "@/ui/components/web/Header";
import Sidebar from "@/ui/components/web/Sidebar";

const UserHomePage = () => {
  // user home page, allows each user to view and edit personal profile
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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
        >
          {/* Please put main content(items) here */}
          <p>This is user home</p>
        </Box>
      </Flex>
    </>
  );
};
export default UserHomePage;
