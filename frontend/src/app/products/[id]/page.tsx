"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Image,
  StackDivider,
  HStack,
} from "@chakra-ui/react";
import { getProduct } from "@/utils/productUtils";
import { getUserInfo } from "@/utils/userUtils";
import { Product, User } from "@/lib/model";
import RatingDisplay from "@/ui/components/users/ratingComponent";
import { SellerCard } from "@/ui/components/users/userInfoComponent";
import ProductPageCard from "@/ui/components/products/productInfoComponent";
import { fetchSingleProduct, fetchUser } from "@/utils/fetchFunctions";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";

const ProductInfoPage = ({ params }: { params: { id: string } }) => {
  // product page for the users to upload and delete and view products they own
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const fetchData = async () => {
    const productData = await fetchSingleProduct(
      params.id,
      setProduct,
      getProduct
    );
    if (productData && productData.sellerId) {
      await fetchUser(productData.sellerId, setUser, getUserInfo);
    }
    return { product: productData, user };
  };

  const { loading, hasFetched } = useLoading(fetchData);

  return (
    <>
      <Box display="flex" justifyContent="center" mt="4">
        <LoadingWrapper loading={loading} hasFetched={hasFetched}>
          <VStack
            width="60%"
            divider={<StackDivider borderColor="gray.200" />}
            spacing="5"
            align="stretch"
          >
            {/* Hstacks to organize the details of the product */}
            <HStack spacing={4}>
              <Flex width="70%" h="400px" align={"center"} justify={"center"}>
                <Image
                  src={product?.imageUrl}
                  alt="Product Image"
                  objectFit="cover"
                  maxW="100%"
                  maxH="100%"
                />
              </Flex>
              <Flex width="30%" h="400px">
                <VStack
                  width="100%"
                  spacing="5"
                  align="stretch"
                  divider={<StackDivider borderColor="gray.200" />}
                >
                  <Flex h="300px">
                    <SellerCard user={user}></SellerCard>
                  </Flex>
                  <Flex h="100px">
                    <RatingDisplay
                      rating={user?.userRating}
                      reviews={user?.totalReviews}
                    ></RatingDisplay>
                  </Flex>
                </VStack>
              </Flex>
            </HStack>

            <HStack spacing={4}>
              <Flex width="70%" h="200px">
                <ProductPageCard product={product}></ProductPageCard>
              </Flex>
              <Flex width="30%" h="200px">
                For future Map/online payment
              </Flex>
            </HStack>

            <Box h="200px" bg="pink.100">
              For future recommendations
            </Box>
          </VStack>
        </LoadingWrapper>
      </Box>
    </>
  );
};
export default ProductInfoPage;
