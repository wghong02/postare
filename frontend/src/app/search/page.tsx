"use client";
import React, { useEffect, useState } from "react";
import { Box, Flex, Spinner, Grid } from "@chakra-ui/react";
import Header from "@/ui/components/web/Header";
import ProductCard from "@/ui/components/products/ProductCard";
import { searchProduct } from "@/utils/productUtils";
import { Product } from "@/lib/model";

const SearchPage = () => {
  // show search results of product cards
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse the query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const query: any = searchParams.get("query");

    if (query) {
      const fetchProducts = async () => {
        try {
          const response = await searchProduct({ description: query });
          setProducts(response);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, []);

  return (
    <Box>
      <Header></Header>
      <Box p={4} width="65%" mx="auto">
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.productID} product={product} />
              ))
            ) : (
              <p>No products found.</p>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
