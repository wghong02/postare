"use client";
import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/ui/components/web/Sidebar";

const UserOrderHistoryPage = () => {
  // page for users to view the products bought, list 1 product per row
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Flex>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          flex="1"
          p="4"
          marginLeft={isSidebarOpen ? "250px" : "0"}
          transition="margin-left 0.3s"
        >
          {/* Please put main content(items) here */}
          <p>This is order history page</p>
        </Box>
      </Flex>
    </>
  );
};
export default UserOrderHistoryPage;
