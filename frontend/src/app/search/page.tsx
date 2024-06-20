"use client";
import React, { useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import PostCard from "@/ui/components/posts/PostPreviewCard";
import { searchPostsByDescription } from "@/utils/postUtils";
import { Post } from "@/lib/model";
import { fetchPosts } from "@/utils/fetchFunctions";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { useLoading } from "@/utils/generalUtils";

const SearchPostsPage = () => {
  // show search results of post cards

  const [posts, setPosts] = useState<Post[]>([]); // posts to show
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postsToLoad, setPostsToLoad] = useState(20);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const query: string | null = searchParams.get("description");
      await fetchPosts({
        parameter: { description: query },
        setPosts: setPosts,
        postUtilFunction: searchPostsByDescription,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; // Re-throw the error to handle it in useLoading
    }
  };

  const { loading, hasFetched, error } = useLoading(fetchData);

  if (error) {
    return <p>Error loading posts: {error}</p>; // !!! error page
  }

  return (
    <Box p={4} width="65%" mx="auto">
      <LoadingWrapper loading={loading} hasFetched={hasFetched}>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </Grid>
      </LoadingWrapper>
    </Box>
  );
};

export default SearchPostsPage;
