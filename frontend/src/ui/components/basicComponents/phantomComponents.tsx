import React from "react";
import { Box } from "@chakra-ui/react";

export function PhantomPostCard() {
  return (
    <Box maxW="300px" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="3"> Phantom part 1: image</Box>
      <Box p="3"> Phantom part 2: the rest</Box>
    </Box>
  );
}
