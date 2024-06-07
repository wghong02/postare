"use client";
import { Box, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Sidebar from "@/ui/components/web/Sidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <Flex height="100vh">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}></Sidebar>
      <Box
        flex="1"
        p="4"
        ml={isSidebarOpen ? "250px" : "0"}
        transition="margin-left 0.3s"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default UserLayout;
