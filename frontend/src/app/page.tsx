"use client";
import React from "react";
import { Flex } from "@chakra-ui/react";
import Header from "@/ui/components/web/Header";
import MostViewedPage from "@/ui/components/posts/MostViewedPage";

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
