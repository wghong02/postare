import React from "react";
import { Box, Badge, Text, Input } from "@chakra-ui/react";
import { timeAgo, isPostedWithin } from "@/utils/generalUtils";
import { Post, Comment } from "@/lib/model";

export function PostPageSection({ post }: { post: Post }) {
  // card of post info
  // registerTime to record time, posted recently to check if post is new
  const registerTime = timeAgo(post.putOutTime);
  const postedRecent = isPostedWithin(post.putOutTime, "month");
  const isAvailable = post.isAvailable;
  const isHot = post.views >= 500;

  // put all information of the post out
  return (
    <Box borderRadius="lg" overflow="auto">
      <Box display="flex" alignItems="baseline">
        {postedRecent && isAvailable && (
          <Badge borderRadius="full" px="2" colorScheme="blue" mr="4">
            New
          </Badge>
        )}
        {!isAvailable && (
          <Badge borderRadius="full" px="2" colorScheme="gray">
            Sold
          </Badge>
        )}
        <Box fontWeight={500} letterSpacing="wide" fontSize="lg" ml="2">
          {post.title}
        </Box>
        <Box as="span" ml="8" color="gray.600" fontSize="sm">
          {registerTime}
        </Box>
      </Box>

      {isHot && (
        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          <Badge borderRadius="full" px="2" colorScheme="red" mr="8">
            Hot
          </Badge>
          {post.views} {"views"}
        </Box>
      )}

      <Box mt="1" as="h4" lineHeight="tight" fontSize="md" fontWeight={450}>
        <Text as="span">{post.description}</Text>
      </Box>

      <Box mt="1" as="h4" lineHeight="tight" fontSize="md" fontWeight={350}>
        <Text as="span">{post.postDetails}</Text>{" "}
      </Box>
    </Box>
  );
}

export function CommentSection() {
  return (
    <Box width="100%">
      {/* add to display comments related to this post */}
      <Text fontSize="large" fontWeight="bold">
        {" "}
        Comments{" "}
      </Text>
      <Input mt="20px" size="sm" placeholder="add a comment"></Input>
    </Box>
  );
}
