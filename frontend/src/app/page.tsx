"use client";
import React from "react";
import { Flex } from "@chakra-ui/react";
import MostViewedPage from "@/ui/pages/posts/MostViewedPage";

const HomePage = () => {
  // home page should have the header, rows of posts in the middle

  // Handler functions for pagination

  return (
    <>
      <Flex direction="column" align="center" m="4">
        <MostViewedPage />
      </Flex>
    </>
  );
};

export default HomePage;
