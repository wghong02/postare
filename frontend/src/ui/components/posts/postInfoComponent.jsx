import React from "react";
import { Box, Badge, Text, VStack } from "@chakra-ui/react";
import { timeAgo, isPostedWithin } from "@/utils/generalUtils";

function PostPageCard({ post }) {
  // card of post info
  // registerTime to record time, posted recently to check if post is new
  const registerTime = timeAgo(post.putOutDate);
  const postedRecent = isPostedWithin(post.putOutDate, "month");
  const isAvailable = post.status === "available";
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
        <Box fontWeight="bold" letterSpacing="wide" fontSize="lg" ml="2">
        post        </Box>
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

      <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2, // Ensures two decimal places in the output
          maximumFractionDigits: 2, // Ensures two decimal places even if the number is whole
        }).format(post.price / 100)}
      </Box>

      <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
        The post is in{" "}
        <Text as="span" fontWeight="semibold">
          {post.condition}
        </Text>
        {" condition."}
      </Box>

      <Box mt="1" as="h4" lineHeight="tight" fontSize="lg">
        Description: <Text as="span">{post.description}</Text>
      </Box>

      <Box mt="1" as="h4" lineHeight="tight" fontSize="lg">
        Details: <Text as="span">{post.postDetails}</Text>{" "}
      </Box>
    </Box>
  );
}

export default PostPageCard;
