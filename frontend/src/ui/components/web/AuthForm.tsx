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
} from "@chakra-ui/react";
import { useState } from "react";
import { register, login } from "@/utils/userUtils";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  // router for redirect
  const router = useRouter();

  // fields that we need are to be entered by user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // to show different forms
  const [showRegister, setShowRegister] = useState(false);
  // to handle error, that only shows when fields are not touched
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
    userEmail: false,
  });

  // handle different field change
  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
    setTouchedFields({ ...touchedFields, username: true });
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    setTouchedFields({ ...touchedFields, password: true });
  };

  const handleEmailChange = (e: any) => {
    setUserEmail(e.target.value);
    setTouchedFields({ ...touchedFields, userEmail: true });
  };
  const handlePhoneNumberChange = (e: any) => setPhoneNumber(e.target.value);
  const handleAddressChange = (e: any) => setAddress(e.target.value);

  // for error checking
  const isUsernameError = username === "";
  const isPasswordError = password === "";
  const isEmailError = userEmail === "";

  // swap to the other form
  const handleRegisterClick = () => {
    setShowRegister(!showRegister);
    clearForm();
  };

  // clears the input when swapping form
  function clearForm() {
    setUsername("");
    setPassword("");
    setUserEmail("");
    setPhoneNumber("");
    setAddress("");
    setTouchedFields({ username: false, password: false, userEmail: false });
  }

  const handleRegister = async () => {
    // call util to register
    if (!isUsernameError && !isPasswordError && !isEmailError) {
      try {
        await register({
          username,
          password,
          userEmail,
          phoneNumber,
          address,
        });
        alert("Registration successful");
        handleRegisterClick();
      } catch (error: any) {
        alert("Registration failed: " + error.message);
      }
    }
  };

  const handleLogin = async () => {
    // call util to login
    if (!isUsernameError && !isPasswordError) {
      try {
        await login({
          username,
          password,
        });
        alert("Login successful");
        window.location.href = "/";
      } catch (error: any) {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <Flex>
      {!showRegister && (
        <Flex
          direction="column"
          m="4"
          justify="center"
          align="center"
          w="300px"
          p="4"
          bg="white"
          borderRadius="md"
          boxShadow="lg"
        >
          <Box fontSize="xl" mb="4">
            Log In
          </Box>
          <FormControl isInvalid={touchedFields.username && isUsernameError}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
            {touchedFields.username && isUsernameError && (
              <FormErrorMessage>Username is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isInvalid={touchedFields.password && isPasswordError}
            mt="4"
          >
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {touchedFields.password && isPasswordError && (
              <FormErrorMessage>password is required.</FormErrorMessage>
            )}
          </FormControl>
          <Button fontSize="md" mt="4" mb="4" onClick={handleLogin}>
            Log In
          </Button>

          <Text
            fontSize="sm"
            mb="4"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={handleRegisterClick}
          >
            Don't have an account? Register here
          </Text>
        </Flex>
      )}
      {showRegister && (
        <Flex
          direction="column"
          m="4"
          justify="center"
          align="center"
          w="300px"
          p="4"
          bg="white"
          borderRadius="md"
          boxShadow="lg"
        >
          <Box fontSize="xl" mb="4">
            Register
          </Box>
          <FormControl isInvalid={touchedFields.username && isUsernameError}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />

            {touchedFields.username && isUsernameError && (
              <FormErrorMessage>username is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isInvalid={touchedFields.password && isPasswordError}
            mt="4"
          >
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
            {touchedFields.password && isPasswordError && (
              <FormErrorMessage>password is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isInvalid={touchedFields.userEmail && isEmailError}
            mt="4"
          >
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={userEmail}
              onChange={handleEmailChange}
            />
            {touchedFields.userEmail && isEmailError && (
              <FormErrorMessage>email is required.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt="4">
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </FormControl>
          <FormControl mt="4">
            <FormLabel>Address</FormLabel>
            <Input type="text" value={address} onChange={handleAddressChange} />
          </FormControl>
          <Button fontSize="md" mt="4" mb="4" onClick={handleRegister}>
            Register
          </Button>

          <Text
            fontSize="sm"
            mb="4"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={handleRegisterClick}
          >
            Have an account already? Log in here
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default AuthForm;
