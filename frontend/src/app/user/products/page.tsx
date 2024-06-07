"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import Sidebar from "@/ui/components/web/Sidebar";
import UserProductCard from "@/ui/components/products/UserProductCard";
import { getUserProducts, uploadProduct } from "@/utils/productUtils";
import { jwtDecode } from "jwt-decode";
import UploadProductForm from "@/ui/components/products/UploadProductForm";
import { UploadFormData } from "@/lib/productFunctionTypes";
import { Product } from "@/lib/model";

const UserProductPage = () => {
  // product page for the users to upload and delete and view products they own
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [hasFetched, setHasFetched] = useState(false); // to handle init state
  const [loading, setLoading] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // fetch product from the user
  const fetchProducts = async (query = "") => {
    setLoading(true);
    const token: any = localStorage.getItem("authToken");
    const decodedToken: any = jwtDecode(token);
    const userID = decodedToken.userID;

    try {
      const response = await getUserProducts(userID, query);
      setProducts(response || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setHasFetched(true); // Set hasFetched to true after loading is complete
    }
  };

  // default is not show delete
  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await uploadProduct(formData);
      console.log("Form submitted");
      onClose(); // Close the modal after form submission
      // Optionally refresh the product list
      fetchProducts();
    } catch (error) {
      console.error("Failed to upload product:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Flex>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          flex="1"
          p="4"
          marginLeft={isSidebarOpen ? "250px" : "0"}
          transition="margin-left 0.3s"
        >
          {/* can view products the user uploaded and upload new and delete existing products */}
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <>
              {hasFetched && (
                <>
                  <Button onClick={onOpen} mb="4">
                    Upload New Product
                  </Button>
                  <UploadProductForm
                    formData={formData}
                    isOpen={isOpen}
                    onClose={onClose}
                    handleChange={handleChange}
                    handleFormSubmit={handleFormSubmit}
                  />
                </>
              )}

              <Flex justify="space-between" wrap="wrap">
                {hasFetched && products.length === 0 ? (
                  <p>No products available</p>
                ) : (
                  products.map((product, index) => (
                    <UserProductCard key={index} product={product} />
                  ))
                )}
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </>
  );
};
export default UserProductPage;
