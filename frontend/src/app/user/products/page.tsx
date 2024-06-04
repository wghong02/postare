"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import Header from "@/ui/components/web/Header";
import Sidebar from "@/ui/components/web/Sidebar";
import UserProductCard from "@/ui/components/products/userProductCard";
import { getUserProducts, uploadProduct } from "@/utils/productUtils";
import { jwtDecode } from "jwt-decode";

const UserProductPage = () => {
  // product page for the users to upload and delete and view products they own
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // for the pop up chakra modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  // to upload the product
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    productLocation: "",
    productDetails: "",
    imageUrl: "",
  });

  const handleChange = (e: any) => {
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
      <Header />
      <Flex>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          flex="1"
          p="4"
          marginLeft={isSidebarOpen ? "250px" : "0"}
          transition="margin-left 0.3s"
        >
          <Button onClick={onOpen} mb="4">
            Upload New Product
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Upload New Product</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Enter product name"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Product Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Product Price</FormLabel>
                  <Input
                    type="number"
                    name="price"
                    placeholder="Enter product price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl mt={5}>
                  <FormLabel>Product Condition</FormLabel>
                  <Input
                    type="text"
                    name="condition"
                    placeholder="Enter product condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl mt={6}>
                  <FormLabel>Product Location</FormLabel>
                  <Input
                    type="text"
                    name="productLocation"
                    placeholder="Enter product location"
                    value={formData.productLocation}
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <FormControl mt={7}>
                  <FormLabel>Product Details</FormLabel>
                  <Input
                    type="text"
                    name="productDetails"
                    placeholder="A more detailed description of the product"
                    value={formData.productDetails}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mt={8}>
                  <FormLabel>Product Image</FormLabel>
                  <Input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL for the product"
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleFormSubmit}>
                  Submit
                </Button>
                <Button variant="ghost">Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* can view products the user uploaded and upload new and delete existing products */}
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <Flex justify="space-between" wrap="wrap">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <UserProductCard key={index} product={product} />
                ))
              ) : (
                <p>No products available</p>
              )}
            </Flex>
          )}
        </Box>
      </Flex>
    </>
  );
};
export default UserProductPage;
