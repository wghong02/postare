import React from "react";
import {
  Box,
  Badge,
  Text,
  VStack,
  Image,
  HStack,
  Link,
} from "@chakra-ui/react";
import { timeAgo } from "@/utils/generalUtils";

export function UserCard({ user }) {
  // card of user info
  const registerTime = timeAgo(user.registerDate);

  // info of the seller to put on the post page
  return (
    <Box maxW="sm" borderRadius="lg" overflow="hidden">
      <VStack spacing={4} align="center">
        <Box display="flex" alignItems="baseline">
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="md"
            ml="2"
          >
            User Information
          </Box>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          Username{" "}
          <Text as="span" fontWeight="semibold">
            {user.username}
          </Text>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          Email{" "}
          <Text as="span" fontWeight="semibold">
            {user.userEmail}
          </Text>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          You were registered{" "}
          <Text as="span" fontWeight="semibold">
            {registerTime}
          </Text>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          {user.totalItemsSold >= 100 && (
            <Badge borderRadius="full" px="2" colorScheme="yellow">
              Star Seller
            </Badge>
          )}{" "}
          You have sold{" "}
          <Text as="span" fontWeight="semibold">
            {user.totalItemsSold}
          </Text>{" "}
          items
        </Box>
      </VStack>
    </Box>
  );
}

export function PostOwnerInfoCard({ user }) {
  // card of user info
  const registerTime = timeAgo(user.registerDate);

  // info of the seller to put on the post page
  return (
    <Link href={`/users/${user.userId}`} passHref>
      <Box>
        <HStack>
          {/* add the user's profile picture */}
          {/* <Image
        src={user?.profilePicture}
        objectFit="cover"
        maxW="100%"
        maxH="100%"
      /> */}
          <Text fontWeight="semibold">
            {/* TODO: add a link to user's page */}
            {user.username}
          </Text>
        </HStack>
      </Box>
    </Link>
  );
}
