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
    <Flex height="calc(100vh - 56px)">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}></Sidebar>
      <Box
        p="4"
        ml={isSidebarOpen ? "200px" : "0"}
        transition="margin-left 0.3s"
        overflowY="hidden"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default UserLayout;
