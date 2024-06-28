import React from "react";
import {
  Box,
  Badge,
  Text,
  VStack,
  HStack,
  Link,
  Image,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { formatCounts, timeAgo } from "@/utils/generalUtils";
import { UserInfo } from "@/lib/model";

export function UserPublicInfoComponent({ user }: { user: UserInfo }) {
  // card of user info
  const countString = formatCounts(
    user.totalPosts,
    user.totalLikes,
    user.totalViews
  );
  const registerTime = timeAgo(user.registerTime);

  // info of the seller to put on the post page

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      ml="4"
      mt="4"
      style={{ overflowY: "auto" }}
    >
      <VStack spacing={4} align="center">
        <Box display="flex">
          <Image
            borderRadius="full"
            boxSize="100px"
            src={user.profilePicture}
            alt="User Profile Picture"
          />
        </Box>

        {/* add user's self intro here */}

        <Box mt="1" as="h4" lineHeight="tight" fontSize="lg">
          <Text as="span" fontWeight="semibold" fontSize="2xl">
            {user.nickname}
          </Text>
        </Box>

        <Box as="h4" lineHeight="tight" fontSize="lg">
          <Text ml="5" as="span" fontWeight="semibold" fontSize="sm">
            Registered {registerTime}, {countString}
          </Text>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          {user.totalLikes >= 100 && (
            <Badge borderRadius="full" px="2" colorScheme="yellow">
              Star User
            </Badge>
          )}{" "}
        </Box>
      </VStack>
    </Box>
  );
}
