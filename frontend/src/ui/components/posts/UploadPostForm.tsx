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
  Textarea,
} from "@chakra-ui/react";
import { UploadPostFormProps } from "@/lib/types";

const UploadPostForm: React.FC<UploadPostFormProps> = ({
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
        <ModalHeader>Upload New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Post Name</FormLabel>
            <Input
              type="text"
              name="title"
              placeholder="Enter post name"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Post Description</FormLabel>
            <Input
              type="text"
              name="description"
              placeholder="Enter post description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl mt={5}>
            <FormLabel>Post Image</FormLabel>
            <Input
              type="text"
              name="imageUrl"
              placeholder="Image URL for the post"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={6}>
            <FormLabel>Post Details</FormLabel>
            <Textarea 
            
              type="text"
              name="postDetails"
              placeholder="A more detailed description of the post"
              value={formData.postDetails}
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

export default UploadPostForm;
