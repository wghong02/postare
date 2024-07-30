"use client";
import {
	Box,
	Flex,
	Button,
	Input,
	FormControl,
	useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
	const router = useRouter();
	// header of the website for the entire website
	// includes a search bar in the middle, app icon and link to home on topleft
	// user login/logout organization on top right
	const [authed, setAuthed] = useState<boolean | null>(null);

	useEffect(() => {
		const authToken = localStorage.getItem("authToken");
		setAuthed(authToken !== null);
	}, [authed]);

	const handleLogOut = (): void => {
		localStorage.removeItem("authToken");
		setAuthed(false);
		showToast();
	};

	const toast = useToast();
	const showToast = () => {
		toast({
			title: "Logged out successfully",
			status: "success",
			duration: 3000, // Duration in milliseconds the notification should be displayed
			isClosable: true,
		});
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
			minW="735px"
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
						_hover={{ bg: "teal.400" }}
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
				{authed != null &&
					(authed ? (
						<Box>
							<Link as={NextLink} href="/user/home" passHref>
								<Button
									variant="ghost"
									shadow="md"
									fontFamily="'Roboto', sans-serif"
									bg="white"
									_hover={{ bg: "gray.300" }}
								>
									User Page
								</Button>
							</Link>

							<Button
								variant="ghost"
								shadow="md"
								fontFamily="'Roboto', sans-serif"
								bg="yellow"
								onClick={handleLogOut}
								ml="6"
								_hover={{ bg: "gray.300" }}
							>
								Logout
							</Button>
						</Box>
					) : (
						<Link as={NextLink} href="/auth" passHref>
							<Button
								variant="ghost"
								shadow="md"
								fontFamily="'Roboto', sans-serif"
								bg="white"
								_hover={{ bg: "gray.300" }}
							>
								Sign In
							</Button>
						</Link>
					))}
			</Box>
		</Flex>
	);
};

export default Header;
