import React from "react";
import { Box, Badge, Text, VStack } from "@chakra-ui/react";
import { timeAgo, isPostedWithin } from "@/utils/generalUtils";

function ProductPageCard({ product }) {
  // card of product info
  const registerTime = timeAgo(product.putOutDate);
  const postedRecent = isPostedWithin(product.putOutDate, "month")
  const isAvailable = (product.status === "available")

  return (
    <Box maxW="sm" borderRadius="lg" overflow="hidden">
      <Box align="stretch">
        <Box display="flex" alignItems="baseline">
          {postedRecent && isAvailable && <Badge borderRadius="full" px="2" colorScheme="blue">
            New
          </Badge>}
          {!isAvailable && <Badge borderRadius="full" px="2" colorScheme="gray">
            Sold
          </Badge>}
          <Box fontWeight="bold" letterSpacing="wide" fontSize="lg" ml="2">
            {product.title}
          </Box>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          Selling By{" "}
          <Text as="span" fontWeight="semibold">
            {product.username}
          </Text>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          Email{" "}
          <Text as="span" fontWeight="semibold">
            {product.userEmail}
          </Text>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          Seller was registered{" "}
          <Text as="span" fontWeight="semibold">
            {registerTime}
          </Text>
        </Box>

        <Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
          {product.totalItemsSold >= 100 && (
            <Badge borderRadius="full" px="2" colorScheme="yellow">
              Star Seller
            </Badge>
          )}{" "}
          Seller has sold{" "}
          <Text as="span" fontWeight="semibold">
            {product.totalItemsSold}
          </Text>{" "}
          items
        </Box>
      </Box>
    </Box>
  );
}

export default ProductPageCard;
