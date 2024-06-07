import React, { useEffect, useState } from "react";
import ProductRow from "@/ui/components/products/ProductRow";
import { getMostViewedProducts } from "@/utils/productUtils";

const MostViewedRow = ({ title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchProducts = async (query) => {
      try {
        const response = await getMostViewedProducts(query);
        setProducts(response || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePageChange = (direction) => {
    setPage((prevPage) => prevPage + direction);
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <ProductRow
      title={title}
      products={products}
      page={page}
      onPageChange={handlePageChange}
    />
  );
};

export default MostViewedRow;
