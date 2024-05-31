import { React, useEffect, useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import ProductCard from "@/ui/components/products/ProductCard";
import { searchProduct } from "@/utils/productUtils";

const ProductRow = ({ title, page, onPageChange }) => {
  // a row of products based on the specific needs. each product is presented as cards
  // products are organized by page
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // preloading with useEffect
  useEffect(() => {
    const fetchProducts = async (query) => {
      setLoading(true);
      try {
        const response = await searchProduct(query);
        setProducts(response || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Box my="20px" w="full">
      <Text fontSize="xl" mb="4">
        {title}
      </Text>
      <Flex justify="space-between">
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((product) => <ProductCard product={product} />)
        )}
      </Flex>
      <Flex justify="center" mt="4">
        <Button onClick={() => onPageChange(-1)} disabled={page <= 0} mr="2">
          Previous
        </Button>
        <Button onClick={() => onPageChange(1)}>Next</Button>
      </Flex>
    </Box>
  );
};

export default ProductRow;
