import { React, useEffect, useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import ProductCard from "@/ui/components/products/ProductCard";

const ProductRow = ({ title, products, page, onPageChange }) => {
  // a row of products based on the specific needs. each product is presented as cards
  // products are organized by
  const [currentPage, setCurrentPage] = useState(page || 0);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [productsPerRow, setProductsPerRow] = useState(4); // default to 10 products per row

  useEffect(() => {
    const updateProductsPerRow = () => {
      const width = window.innerWidth;
      if (width < 800) {
        setProductsPerRow(1);
      } else if (width < 1200) {
        setProductsPerRow(2);
      } else if (width < 1600) {
        setProductsPerRow(3);
      } else {
        setProductsPerRow(4);
      }
    };

    const updateCurrentProducts = () => {
      const startIndex = currentPage * productsPerRow;
      const endIndex = startIndex + productsPerRow;
      setCurrentProducts(products.slice(startIndex, endIndex));
    };

    updateProductsPerRow();
    updateCurrentProducts();

    window.addEventListener("resize", () => {
      updateProductsPerRow();
      updateCurrentProducts();
    });

    return () => {
      window.removeEventListener("resize", () => {
        updateProductsPerRow();
        updateCurrentProducts();
      });
    };
  }, [currentPage, products, productsPerRow]);

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => prevPage + direction);
    onPageChange && onPageChange(direction);
  };

  return (
    <Box my="20px" w="full">
      <Text fontSize="xl" mb="4">
        {title}
      </Text>
      <Flex justify="space-between" wrap="wrap">
        {currentProducts.length > 0 ? (
          currentProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p>No products available</p>
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
          disabled={currentPage >= Math.ceil(products.length / 10) - 1}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default ProductRow;
