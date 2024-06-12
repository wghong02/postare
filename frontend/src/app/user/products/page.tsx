"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import UserProductCard from "@/ui/components/products/UserProductCard";
import { getUserProducts, uploadProduct } from "@/utils/productUtils";
import { jwtDecode } from "jwt-decode";
import UploadProductForm from "@/ui/components/products/UploadProductForm";
import { UploadFormData } from "@/lib/types";
import { Product } from "@/lib/model";
import { useLoading } from "@/utils/generalUtils";
import LoadingWrapper from "@/ui/components/web/LoadingWrapper";
import { fetchProducts } from "@/utils/fetchFunctions";

const UserProductPage = () => {
  // product page for the users to upload and delete and view products they own
  const [products, setProducts] = useState<Product[]>([]);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // for the pop up chakra modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  // to upload the product
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    price: "",
    condition: "",
    productLocation: "",
    productDetails: "",
    imageUrl: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // fetch product from the user
  const fetchData = async () => {
    const token: string | null = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userID;
        await fetchProducts(
          { userID: userId, query: "" },
          setProducts,
          getUserProducts
        );
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Re-throw the error to handle it in useLoading
      }
    }
  };

  const { loading, hasFetched } = useLoading(fetchData);

  // default is not show delete
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await uploadProduct(formData);
      onClose(); // Close the modal after form submission
      // Optionally refresh the product list
      setNeedsRefresh(true);
    } catch (error) {
      console.error("Failed to upload product:", error);
    }
  };

  useEffect(() => {}), [needsRefresh]; // !!! edit to refresh on submit

  return (
    <>
      {/* can view products the user uploaded and upload new and delete existing products */}

      <Flex>
        <Button onClick={onOpen} mb="4">
          Upload New Product
        </Button>
      </Flex>

      <UploadProductForm
        formData={formData}
        isOpen={isOpen}
        onClose={onClose}
        handleChange={handleChange}
        handleFormSubmit={handleFormSubmit}
      />
      <LoadingWrapper
        loading={loading}
        hasFetched={hasFetched}
        hasData={products.length > 0}
      >
        <Flex justify="space-between" wrap="wrap">
          {products.map((product, index) => (
            <UserProductCard key={index} product={product} />
          ))}
        </Flex>
      </LoadingWrapper>
    </>
  );
};
export default UserProductPage;
