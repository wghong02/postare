"use client";
import React, { useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import ProductCard from "@/ui/components/products/ProductCard";
import { searchProductsByDescription } from "@/utils/productUtils";
import { Product } from "@/lib/model";
import { fetchProducts } from "@/utils/fetchFunctions";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { useLoading } from "@/utils/generalUtils";

const SearchProductsPage = () => {
  // show search results of product cards

  const [products, setProducts] = useState<Product[]>([]);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const query: string | null = searchParams.get("description");
      await fetchProducts(
        { description: query },
        setProducts,
        searchProductsByDescription
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error; // Re-throw the error to handle it in useLoading
    }
  };

  const { loading, hasFetched, error } = useLoading(fetchData);

  if (error) {
    return <p>Error loading products: {error}</p>; // !!! error page
  }

  return (
    <Box p={4} width="65%" mx="auto"  >
      <LoadingWrapper loading={loading} hasFetched={hasFetched}>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </Grid>
      </LoadingWrapper>
    </Box>
  );
};

export default SearchProductsPage;
