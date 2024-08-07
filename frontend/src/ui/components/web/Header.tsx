"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
	Flex,
	Box,
	Button,
	Input,
	FormControl,
	useToast,
} from "@chakra-ui/react";
import Link from "next/link";

const Header: React.FC = () => {
	const router = useRouter();
	const [authed, setAuthed] = useState<boolean | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const toast = useToast();

	useEffect(() => {
		const authToken = localStorage.getItem("authToken");
		setAuthed(authToken !== null);
	}, []);

	useEffect(() => {
		const query = new URLSearchParams(window.location.search).get(
			"description"
		);
		if (query) {
			setSearchQuery(query);
		}
	}, []);

	const handleLogOut = (): void => {
		localStorage.removeItem("authToken");
		setAuthed(false);
		router.push(`/`);
		showToast();
	};

	const showToast = () => {
		toast({
			title: "Logged out successfully",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
	};

	const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Set search query parameter and update the URL
		window.location.href = `/search?description=${encodeURIComponent(
			searchQuery
		)}`;
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
			minW="750px"
		>
			<Flex align="center" mr={5}>
				<Link href="/" passHref>
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
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<Button type="submit" colorScheme="blue" ml={2}>
							Search
						</Button>
					</FormControl>
				</form>
			</Box>

			<Box flex={1} maxW="300px">
				{authed != null && // will only show the buttons once the initial render finishes
					(authed ? (
						<Box>
							<Link href="/user/home" passHref>
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
						<Link href="/auth" passHref>
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
