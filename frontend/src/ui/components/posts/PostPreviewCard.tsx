import React from "react";
import { Box, Image, Badge } from "@chakra-ui/react";
import { timeAgo, isPostedWithin } from "@/utils/generalUtils";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { Post } from "@/lib/model";

function PostPreviewCard({ post }: { post: Post }) {
  // card of each individual post
  // shows basic info of the post
  const registerTime = timeAgo(post.putOutTime);
  const postedRecent = isPostedWithin(post.putOutTime, "week");
  const isAvailable = post.isAvailable;
  const isHot = post.likes >= 500;
  return (
    <div>
      <Link as={NextLink} href={`/posts/${post.postId}`} passHref>
        <Box maxW="300px" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Image src={post.imageUrl} />
          {/* //show badges of new if new and not sold, sold if sold, hot if have many views */}
          <Box p="3">
            <Box display="flex" alignItems="baseline">
              <Box as="span" color="gray.600" fontSize="sm">
                {registerTime}
              </Box>
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="4"
              >
                {post.likes} likes
              </Box>
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="4"
              >
                {post.views} views
              </Box>
            </Box>
            <Box display="flex" alignItems="baseline">
              {postedRecent && isAvailable && (
                <Badge borderRadius="full" px="2" colorScheme="blue">
                  New
                </Badge>
              )}
              {!isAvailable && (
                <Badge borderRadius="full" px="2" colorScheme="gray">
                  Archived
                </Badge>
              )}
              {isHot && (
                <Badge borderRadius="full" px="2" colorScheme="red">
                  Hot
                </Badge>
              )}
              {(isHot || postedRecent) && <Box mr="4" />}
              <Box
                mt="1"
                fontWeight="semibold"
                lineHeight="tight"
                noOfLines={1}
              >
                {post.title}
              </Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </div>
  );
}

export default PostPreviewCard;
