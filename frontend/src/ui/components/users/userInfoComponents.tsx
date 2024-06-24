import React from "react";
import {
  Box,
  Badge,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  HStack,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { timeAgo } from "@/utils/generalUtils";
import { UserInfo } from "@/lib/model";

export function UserHomeInfoComponent({ user }: { user: UserInfo }) {
  // card of user info
  const registerTime = timeAgo(user.registerTime);

  // info of the seller to put on the post page

  // TODO: use form and editable, make some attributes editable on the page, and shows other information

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

export function PostOwnerInfoCard({ user }: { user: UserInfo }) {
  // card of user info
  const registerTime = timeAgo(user.registerTime);

  // info of the seller to put on the post page
  return (
    <Link as={NextLink} href={`/users/${user.userId}`} passHref>
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
