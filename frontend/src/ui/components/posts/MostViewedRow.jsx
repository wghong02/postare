import React, { useEffect, useState } from "react";
import PostRow from "@/ui/components/posts/PostRow";
import { getMostViewedPosts } from "@/utils/postUtils";

const MostViewedRow = ({ title }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchPosts = async (query) => {
      try {
        const response = await getMostViewedPosts(query);
        setPosts(response || []);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePageChange = (direction) => {
    setPage((prevPage) => prevPage + direction);
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <PostRow
      title={title}
      posts={posts}
      page={page}
      onPageChange={handlePageChange}
    />
  );
};

export default MostViewedRow;
