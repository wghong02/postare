import { React, useEffect, useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import PostCard from "@/ui/components/posts/PostCard";

const PostRow = ({ posts, page, onPageChange }) => {
  // a row of posts based on the specific needs. each post is presented as cards
  // posts are organized by
  const [currentPage, setCurrentPage] = useState(page || 0);
  const [currentPosts, setCurrentPosts] = useState([]);
  const [postsPerRow, setPostsPerRow] = useState(4); // default to 4 posts per row

  // set how many cards to show based on website size
  // load page when either window size changes or pagination is called
  useEffect(() => {
    const updatePostsPerRow = () => {
      const width = window.innerWidth;
      if (width < 800) {
        setPostsPerRow(1);
      } else if (width < 1200) {
        setPostsPerRow(2);
      } else if (width < 1600) {
        setPostsPerRow(3);
      } else {
        setPostsPerRow(4);
      }
    };

    const updateCurrentPosts = () => {
      const startIndex = currentPage * postsPerRow;
      const endIndex = startIndex + postsPerRow;
      setCurrentPosts(posts.slice(startIndex, endIndex));
    };

    updatePostsPerRow();
    updateCurrentPosts();

    window.addEventListener("resize", () => {
      updatePostsPerRow();
      updateCurrentPosts();
    });

    return () => {
      window.removeEventListener("resize", () => {
        updatePostsPerRow();
        updateCurrentPosts();
      });
    };
  }, [currentPage, posts, postsPerRow]);

  // handle pagination
  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
    onPageChange && onPageChange(direction);
  };

  return (
    <Box my="20px" w="full">
      <Flex justify="space-between" wrap="wrap">
        {currentPosts.length > 0 ? (
          currentPosts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))
        ) : (
          <p>No posts available</p>
        )}
      </Flex>
      <Flex justify="center" mt="4">
        <Button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage <= 0}
          mr="2"
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(1)}
          disabled={currentPage >= Math.ceil(posts.length / 10) - 1}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default PostRow;
