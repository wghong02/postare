import React from "react";
import { Box, Image, Badge } from "@chakra-ui/react";
import { timeAgo, isPostedWithin } from "@/utils/generalUtils";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { Product } from "@/lib/model";

export function ProductPageCard(product: Product): React.ReactElement {
  // card of each individual product
  // shows basic info of the product
  const registerTime = timeAgo(product.putOutTime);
  const postedRecent = isPostedWithin(product.putOutTime, "month");
  const isAvailable = product.status === "available";
  const isHot = product.views >= 500;

  return (
    <Link as={NextLink} href={`/products/${product.productId}`} passHref>
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Image src={product.imageUrl} />
        {/* //show badges of new if new and not sold, sold if sold, hot if have many views */}
        <Box p="6">
          <Box display="flex" alignItems="baseline">
            {postedRecent && isAvailable && (
              <Badge borderRadius="full" px="2" colorScheme="blue">
                New
              </Badge>
            )}
            {!isAvailable && (
              <Badge borderRadius="full" px="2" colorScheme="gray">
                Sold
              </Badge>
            )}
            {isHot && (
              <Badge borderRadius="full" px="2" colorScheme="red">
                Hot
              </Badge>
            )}
            {(isHot || postedRecent) && <Box mr="4" />}
            <Box as="span" color="gray.600" fontSize="sm">
              {registerTime}
            </Box>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="4"
            >
              {product.productLocation}
            </Box>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="4"
            >
              {product.views} views
            </Box>
          </Box>

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            noOfLines={1}
          >
            {product.title}
          </Box>

          <Box>
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2, // Ensures two decimal places in the output
              maximumFractionDigits: 2, // Ensures two decimal places even if the number is whole
            }).format(product.price / 100)}
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
