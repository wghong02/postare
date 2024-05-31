"use client";
import React, { useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import Header from "@/ui/components/web/Header";
import MostViewedRow from "@/ui/components/products/mostViewedRow";

const HomePage = () => {
  // home page should have the header, rows of products in the middle

  // Handler functions for pagination
  const handlePageChange = (setPage: any, direction: any) => {
    setPage((prev: any) => prev + direction);
  };

  return (
    <>
      <Header />
      <Flex direction="column" align="center" m="4">
        <MostViewedRow title="Most Viewed Products" />
        {/* <ProductRow
          title="Closest Products"
          page={closestPage}
          onPageChange={(dir: any) => handlePageChange(setClosestPage, dir)}
        />
        <ProductRow
          title="Recommended Products"
          page={recommendedPage}
          onPageChange={(dir: any) => handlePageChange(setRecommendedPage, dir)}
        /> */}
      </Flex>
    </>
  );
};

export default HomePage;
