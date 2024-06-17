import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { timeAgo } from "@/utils/generalUtils";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { deletePost } from "@/utils/postUtils";

function UserPostCard({ post }) {
  const registerTime = timeAgo(post.putOutDate);
  const postID = post.postID;

  // to delete the post
  const deleteOnClick = async (postID) => {
    try {
      await deletePost(postID);
      window.location.href = `/user/posts`; // Inform parent component about the deletion
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Box>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        width="1000px"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src={post.imageUrl}
          alt="Post Image"
        />

        <Stack>
          <CardBody>
            <Heading size="md">{post.title}</Heading>

            <Text py="2">{post.description}</Text>
            <Text py="3">Post posted {registerTime}</Text>
          </CardBody>

          <CardFooter>
            <Link as={NextLink} href={`/posts/${postID}`} passHref>
              <Button variant="solid" colorScheme="blue" mr="6">
                View
              </Button>
            </Link>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => deleteOnClick(postID)}
            >
              Delete
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </Box>
  );
}

export default UserPostCard;
