"use client";
import React, { useEffect, useState } from "react";
import { Box, Spinner, Grid } from "@chakra-ui/react";
import ProductCard from "@/ui/components/products/ProductCard";
import { searchProductsByDescription } from "@/utils/productUtils";
import { Product } from "@/lib/model";
import { fetchProducts } from "@/utils/fetchFunctions";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";

const SearchProductsPage = () => {
  // show search results of product cards
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Parse the query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const query: any = searchParams.get("description");

    if (query) {
      fetchProducts({description: query}, setProducts, searchProductsByDescription);
    }
    setLoading(false);
    setHasFetched(true);
  }, []);

  return (
    <Box p={4} width="65%" mx="auto">
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
