import React, { ChangeEvent, FormEvent } from "react";
import {
  Button,
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
} from "@chakra-ui/react";
import { UploadProductFormProps } from "@/lib/types";

const UploadProductForm: React.FC<UploadProductFormProps> = ({
  formData,
  isOpen,
  onClose,
  handleChange,
  handleFormSubmit,
}) => {
  return (
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
  );
};

export default UploadProductForm;
