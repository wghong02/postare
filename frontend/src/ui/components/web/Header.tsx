"use client";
import { Box, Flex, Text, Button, Input, FormControl } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();
  // header of the website for the entire website
  // includes a search bar in the middle, app icon and link to home on topleft
  // user login/logout organization on top right
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthed(authToken !== null);
  }, []);

  const handleLogOut = (): void => {
    localStorage.removeItem("authToken");
    setAuthed(false);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get("searchInput") as string;
    // console.log("Searching for:", searchQuery);
    if (searchQuery === "") {
      router.push(`/`);
    } else {
      window.location.href = `/search?description=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={2}
      bg="teal.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Link as={NextLink} href="/" passHref>
          <Button
            width="100%"
            colorScheme="blackAlpha"
            variant="ghost"
            fontFamily="'Roboto', sans-serif"
            fontSize="md"
            fontWeight="bold"
          >
            Postare
          </Button>
        </Link>
      </Flex>

      {/* Search Bar */}
      <Box flex={1} maxW="600px">
        <form onSubmit={handleSearchSubmit}>
          <FormControl display="flex" alignItems="center">
            <Input
              name="searchInput"
              type="text"
              placeholder="Search..."
              bg="white"
              color="black"
              _placeholder={{ color: "gray.500" }}
            />
            <Button type="submit" colorScheme="blue" ml={2}>
              Search
            </Button>
          </FormControl>
        </form>
      </Box>

      <Box flex={1} maxW="300px">
        {authed && (
          <Link as={NextLink} href="/user/home" passHref>
            <Button
              variant="ghost"
              shadow="md"
              fontFamily="'Roboto', sans-serif"
              bg="white"
            >
              User Page
            </Button>
          </Link>
        )}
        {authed && (
          <Button
            variant="ghost"
            shadow="md"
            fontFamily="'Roboto', sans-serif"
            bg="yellow"
            onClick={handleLogOut}
            ml="6"
          >
            Logout
          </Button>
        )}

        {!authed && (
          <Link as={NextLink} href="/auth" passHref>
            <Button
              variant="ghost"
              shadow="md"
              fontFamily="'Roboto', sans-serif"
              bg="yellow"
            >
              Login
            </Button>
          </Link>
        )}
      </Box>
    </Flex>
  );
};

export default Header;
