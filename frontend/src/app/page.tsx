"use client";
import React from "react";
import { Flex } from "@chakra-ui/react";
import Header from "@/ui/components/web/Header";
import MostViewedRow from "@/ui/components/posts/MostViewedRow";

const HomePage = () => {
  // home page should have the header, rows of posts in the middle

  // Handler functions for pagination

  return (
    <>
      <Flex direction="column" align="center" m="4">
        <MostViewedRow title="Most Viewed Posts" />
      </Flex>
    </>
  );
};

export default HomePage;
