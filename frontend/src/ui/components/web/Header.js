import { Box, Flex, Text, Button, Input, FormControl } from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

const Header = () => {
  // header of the website for the entire website
  // includes a search bar in the middle, app icon and link to home on topleft
  // user login/logout organization on top right
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const searchQuery = formData.get("searchInput");
    console.log("Searching for:", searchQuery);
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
            Marketplace
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
        <Link as={NextLink} href="/user/home" passHref>
          <Button
            colorScheme="blackAlpha"
            variant="ghost"
            shadow="md"
            fontFamily="'Roboto', sans-serif"
          >
            User Page
          </Button>
        </Link>
        <Button type="submit" colorScheme="black" ml={2}>
          Login
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
