"use client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";
import { register, login } from "@/utils/userUtils";
import { useRouter } from "next/navigation";

// Define types for form fields
type FormFields = {
  username: string;
  password: string;
  userEmail: string;
  phoneNumber: string;
  nickname: string;
};

type TouchedFields = {
  [key in keyof FormFields]: boolean;
};

const AuthForm = () => {
  const toast = useToast();

  const [formValues, setFormValues] = useState<FormFields>({
    username: "",
    password: "",
    userEmail: "",
    phoneNumber: "",
    nickname: "",
  });

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    username: false,
    password: false,
    userEmail: false,
    phoneNumber: false,
    nickname: false,
  });

  const [showRegister, setShowRegister] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  const clearForm = () => {
    setFormValues({
      username: "",
      password: "",
      userEmail: "",
      phoneNumber: "",
      nickname: "",
    });
    setTouchedFields({
      username: false,
      password: false,
      userEmail: false,
      phoneNumber: false,
      nickname: false,
    });
  };

  const handleRegisterClick = () => {
    setShowRegister(!showRegister);
    clearForm();
  };

  const handleSubmit = async () => {
    const { username, password, userEmail, phoneNumber, nickname } = formValues;

    if (showRegister) {
      if (
        touchedFields.username &&
        touchedFields.password &&
        touchedFields.userEmail &&
        touchedFields.nickname
      ) {
        try {
          await register({
            username,
            password,
            userEmail,
            phoneNumber,
            nickname,
          });
          toast({
            description: "Registration Successful.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          handleRegisterClick();
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
          username: true,
          password: true,
          userEmail: true,
          phoneNumber: true,
          nickname: true,
        });
        toast({
          description: "Please complete all required fields and try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      if (username && password) {
        try {
          await login({ username, password });
          toast({
            description: "Login Successful.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          window.location.href = "/";
        } catch (error: any) {
          toast({
            description: "Login failed, " + error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        setTouchedFields({
          username: true,
          password: true,
          userEmail: true,
          phoneNumber: true,
          nickname: true,
        });
        toast({
          description: "Please complete all required fields and try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const renderInputField = (
    label: string,
    name: keyof FormFields,
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
    <Flex direction="column" align="center" m="4">
      <Box w="300px" p="4" bg="white" borderRadius="md" boxShadow="lg">
        <Box fontSize="xl" mb="4" fontWeight={500}>
          {showRegister ? "Register" : "Log In"}
        </Box>
        {renderInputField("Username", "username", "text", true)}
        {renderInputField("Password", "password", "password", true)}
        {showRegister && (
          <>
            {renderInputField("Email", "userEmail", "email", true)}
            {renderInputField("Phone Number", "phoneNumber", "tel", false)}
            {renderInputField("Nickname", "nickname", "text", true)}
          </>
        )}
        <Button fontSize="md" mt="4" mb="4" onClick={handleSubmit}>
          {showRegister ? "Register" : "Log In"}
        </Button>
        <Text
          fontSize="sm"
          mb="4"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
          onClick={handleRegisterClick}
        >
          {showRegister
            ? "Have an account already? Log in here"
            : "Don't have an account? Register here"}
        </Text>
      </Box>
    </Flex>
  );
};

export default AuthForm;
