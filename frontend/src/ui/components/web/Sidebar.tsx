import React from "react";
import { Box, IconButton, VStack, Button } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

interface SidebarProps {
  // only used for sidebars
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  // side bar for user pages
  // can pull out or stay in

  // vertical stack for each button that direct to a different page
  return (
    <Box position="relative" minH="100vh" bg="gray.50">
      <Box
        position="absolute"
        left={isOpen ? "0" : "-250px"} // in screen if bar is open
        width="200px"
        bg="gray.100"
        color="black.50"
        transition="left 0.3s"
        height="100%"
        zIndex="10"
      >
        <VStack spacing="5" align="stretch">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow="md"
            fontFamily="'Roboto', sans-serif"
          >
            User Actions
          </Box>
          <Link as={NextLink} href="/user/home" passHref>
            <Button
              width="100%"
              colorScheme="blackAlpha"
              variant="ghost"
              shadow="md"
              fontFamily="'Roboto', sans-serif"
            >
              User Information
            </Button>
          </Link>
          <Link as={NextLink} href="/user/products" passHref>
            <Button
              width="100%"
              colorScheme="blackAlpha"
              variant="ghost"
              shadow="md"
              fontFamily="'Roboto', sans-serif"
            >
              Manage Products
            </Button>
          </Link>
          <Link as={NextLink} href="/user/orderHistory" passHref>
            <Button
              width="100%"
              colorScheme="blackAlpha"
              variant="ghost"
              shadow="md"
              fontFamily="'Roboto', sans-serif"
            >
              Order History
            </Button>
          </Link>
          <Link as={NextLink} href="/user/cart" passHref>
            <Button
              width="100%"
              colorScheme="blackAlpha"
              variant="ghost"
              shadow="md"
              fontFamily="'Roboto', sans-serif"
            >
              Shopping Cart
            </Button>
          </Link>
        </VStack>
      </Box>
      <IconButton
        icon={isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        position="absolute"
        left={isOpen ? "200px" : "0"}
        top="50%"
        transform="translateY(-50%)"
        zIndex="11"
        colorScheme="white"
        variant="ghost"
        size="lg"
      />
    </Box>
  );
};

export default Sidebar;
