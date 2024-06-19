import React, { useEffect, useState, useRef } from "react";
import { getMostViewedPosts } from "@/utils/postUtils";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "../web/LoadingWrapper";
import { fetchPosts } from "@/utils/fetchFunctions";
import { Box, Flex } from "@chakra-ui/react";
import { Post } from "@/lib/model";
import PostCard from "./PostCard";
import Masonry from "react-masonry-css";

const MostViewedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = async () => {
    try {
      await fetchPosts({ batch: currentPage, totalSize: 10 }, setPosts, getMostViewedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error; // Re-throw the error to handle it in useLoading
    }
  };

  const { loading, hasFetched } = useLoading(fetchData);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && !loading) {
          setLoadingMore(true);
          setcurrentPage(currentPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);

    return () => observer.current?.disconnect();
  }, [loadingMore, loading]);

  // useEffect(() => {
  //   if (currentPage > 0) {
  //     fetchData().finally(() => setLoadingMore(false));
  //   }
  // }, [currentPage]);

  const breakpointColumnsObj = {
    default: 4,
    1500: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Box display="flex" justifyContent="center" mt="4">
      <LoadingWrapper loading={loading} hasFetched={hasFetched}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {posts?.length > 0 ? (
            posts.map((post, index) => <PostCard key={index} post={post} />)
          ) : (
            <p>No posts available</p>
          )}
        </Masonry>
        <div ref={loadMoreRef} />
      </LoadingWrapper>
    </Box>
  );
};

export default MostViewedPage;
