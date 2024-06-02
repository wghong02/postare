import React from "react";
import { Box, Badge, Text, VStack } from "@chakra-ui/react";
import { timeAgo } from "@/utils/generalUtils";

function UserCard({ user }) {
  // card of user info
  const registerTime = timeAgo(user.registerDate);

  // info of the seller to put on the product page
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
            Seller Information
          </Box>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          Selling By{" "}
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
          Seller was registered{" "}
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
          Seller has sold{" "}
          <Text as="span" fontWeight="semibold">
            {user.totalItemsSold}
          </Text>{" "}
          items
        </Box>
      </VStack>
    </Box>
  );
}

export default UserCard;
