import React from "react";
import { Box, Container, Flex, Heading, Link, Text } from "@chakra-ui/react";

const UpdateHistoryPage = () => {
	// home page should have the header, rows of posts in the middle

	return (
		<Container maxW="container.lg" p={4}>
			<Box mb={4}>
				<Heading as="h2" size="xl" mb={4}>
					Update History
				</Heading>
				<Flex mb={4} wrap="wrap" gap={4}>
					<Link
						href="#v1.1"
						color="teal.500"
						_hover={{ textDecoration: "underline" }}
					>
						Version 1.1
					</Link>

					<Link
						href="#v1.0"
						color="teal.500"
						_hover={{ textDecoration: "underline" }}
					>
						Version 1.0
					</Link>
				</Flex>
			</Box>

			<Box mb={8}>
				<Heading as="h1" id="v1.1" size="lg" mb={2}>
					Version 1.1, Aug 6, 2024
				</Heading>
				<Text>
					First update of the app, introducing comments, likes, liked history,
					and dynamic view counting.
				</Text>
			</Box>

			<Box mb={8}>
				<Heading as="h1" id="v1.0" size="lg" mb={2}>
					Version 1.0, Jun 30, 2024
				</Heading>
				<Text>
					This is the beginning of the app. It introduces basic features like
					create user account, view posts, upload posts, delete post, search
					post and most viewed page.
				</Text>
			</Box>
		</Container>
	);
};

export default UpdateHistoryPage;
