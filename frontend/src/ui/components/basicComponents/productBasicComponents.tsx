import { Box, Link } from "@chakra-ui/react";
import React from "react";

export const handleInfScroll = (
  loadMore: () => void,
  nextPage: () => void,
  loadingMore: boolean
) => {
  return () => {
    if (
      // to detect if reach the bottom of the page
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !loadingMore
    ) {
      loadMore();
      nextPage();
    }
  };
};

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      as="footer"
      width="100%"
      py="1"
      bg="gray.100"
      textAlign="center"
      position="fixed"
      bottom="0"
    >
      <Link onClick={scrollToTop} cursor="pointer" color="blue.500">
        Go back to the top
      </Link>
    </Box>
  );
}
