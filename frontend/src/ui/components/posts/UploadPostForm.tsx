import React, { ChangeEvent, useState } from "react";
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
  Text,
  useToast,
  FormErrorMessage,
  Flex,
  Box,
} from "@chakra-ui/react";
import { UploadFormData, TouchedUploadFields } from "@/lib/types";
import { uploadPost } from "@/utils/postUtils";

const UploadPostForm = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const toast = useToast();

  const [formValues, setFormValues] = useState<UploadFormData>({
    title: "",
    description: "",
    postDetails: "",
    imageUrl: "",
  });

  const [touchedFields, setTouchedFields] = useState<TouchedUploadFields>({
    title: false,
    description: false,
    postDetails: false,
    imageUrl: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  const handleSubmit = async () => {
    const { title, description, postDetails, imageUrl } = formValues;

    if (
      touchedFields.title &&
      touchedFields.description &&
      touchedFields.postDetails &&
      touchedFields.imageUrl
    ) {
      try {
        await uploadPost({
          title,
          description,
          postDetails,
          imageUrl,
        });
        toast({
          description: "Upload Successful.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error: any) {
        toast({
          description: "Registration failed, " + error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      setTouchedFields({
        title: true,
        description: true,
        postDetails: true,
        imageUrl: true,
      });
      toast({
        description: "Please complete all required fields and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderInputField = (
    label: string,
    name: keyof UploadFormData,
    type: string,
    isRequired: boolean
  ) => (
    <FormControl
      isInvalid={touchedFields[name] && !formValues[name] && isRequired}
      mt="4"
    >
      <FormLabel>
        {label}
        {isRequired && (
          <Text as="span" color="red">
            *
          </Text>
        )}
      </FormLabel>
      <Input
        type={type}
        name={name}
        value={formValues[name]}
        onChange={handleChange}
      />
      {touchedFields[name] && !formValues[name] && isRequired && (
        <FormErrorMessage>{label} is required.</FormErrorMessage>
      )}
    </FormControl>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {renderInputField("Title", "title", "text", true)}
          {renderInputField("Description", "description", "text", true)}
          {renderInputField("PostDetails", "postDetails", "text", true)}
          {renderInputField("ImageUrl", "imageUrl", "text", true)}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Upload
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadPostForm;
