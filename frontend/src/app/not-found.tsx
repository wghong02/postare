import NextLink from "next/link";
import { Box, Link } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      mt="4"
    >
      <Box fontWeight="semibold" letterSpacing="wide" fontSize="4xl">
        Page Not Found
      </Box>
      <Box
        color="gray.400"
        fontWeight="semibold"
        letterSpacing="wide"
        fontSize="md"
      >
        Could not find the requested resource
      </Box>
      <Link href="/">Return Home</Link>
    </Box>
  );
}
