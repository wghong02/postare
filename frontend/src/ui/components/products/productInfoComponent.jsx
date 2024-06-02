import React from "react";
import { Box, Badge, Text, VStack } from "@chakra-ui/react";
import { timeAgo, isPostedWithin } from "@/utils/generalUtils";

function ProductPageCard({ product }) {
  // card of product info
  // registerTime to record time, posted recently to check if product is new
  const registerTime = timeAgo(product.putOutDate);
  const postedRecent = isPostedWithin(product.putOutDate, "month");
  const isAvailable = product.status === "available";
  const isHot = product.views >= 500;

  // put all information of the product out
  return (
    <Box borderRadius="lg" overflow="auto">
      <Box display="flex" alignItems="baseline">
        {postedRecent && isAvailable && (
          <Badge borderRadius="full" px="2" colorScheme="blue" mr="4">
            New
          </Badge>
        )}
        {!isAvailable && (
          <Badge borderRadius="full" px="2" colorScheme="gray">
            Sold
          </Badge>
        )}
        <Box fontWeight="bold" letterSpacing="wide" fontSize="lg" ml="2">
          {product.title}
        </Box>
        <Box as="span" ml="8" color="gray.600" fontSize="sm">
          {registerTime}
        </Box>
        <Text fontSize={"md"} ml={"8"}>
          {" "}
          {product.productLocation}{" "}
        </Text>
      </Box>

      {isHot && (
        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          <Badge borderRadius="full" px="2" colorScheme="red" mr="8">
            Hot
          </Badge>
          {product.views} {"views"}
        </Box>
      )}

      <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2, // Ensures two decimal places in the output
          maximumFractionDigits: 2, // Ensures two decimal places even if the number is whole
        }).format(product.price / 100)}
      </Box>

      <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
        The product is in{" "}
        <Text as="span" fontWeight="semibold">
          {product.condition}
        </Text>
        {" condition."}
      </Box>

      <Box mt="1" as="h4" lineHeight="tight" fontSize="lg">
        Description: <Text as="span">{product.description}</Text>
      </Box>

      <Box mt="1" as="h4" lineHeight="tight" fontSize="lg">
        Details: <Text as="span">{product.productDetails}</Text>{" "}
      </Box>
    </Box>
  );
}

export default ProductPageCard;
