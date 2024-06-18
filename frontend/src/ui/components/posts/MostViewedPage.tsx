import React, { useEffect, useState } from "react";
import PostRow from "@/ui/components/posts/PostRow";
import { getMostViewedPosts } from "@/utils/postUtils";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "../web/LoadingWrapper";
import { fetchPosts } from "@/utils/fetchFunctions";
import { Box } from "@chakra-ui/react";
import { Post } from "@/lib/model";

const MostViewedPage = () => {
  const [posts, setPosts] = useState<Post[] | null>([]);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    try {
      await fetchPosts("", setPosts, getMostViewedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; // Re-throw the error to handle it in useLoading
    }
  };

  const { loading, hasFetched } = useLoading(fetchData);

  const handlePageChange = (direction: number) => {
    setPage((prevPage) => prevPage + direction);
  };

  return (
    <Box display="flex" justifyContent="center" mt="4">
      <LoadingWrapper loading={loading} hasFetched={hasFetched}>
        <PostRow posts={posts} page={page} onPageChange={handlePageChange} />
      </LoadingWrapper>
    </Box>
  );
};

export default MostViewedPage;
