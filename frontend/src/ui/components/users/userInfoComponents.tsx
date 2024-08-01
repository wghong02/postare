import React from "react";
import {
	Box,
	Badge,
	Text,
	VStack,
	Image,
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
	Editable,
	EditableInput,
	EditableTextarea,
	EditablePreview,
	HStack,
	Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { timeAgo, formatCounts } from "@/utils/generalUtils";
import { UserInfo } from "@/lib/model";

export function UserHomeInfoComponent({ user }: { user: UserInfo }) {
	// card of user info
	const registerTime = timeAgo(user.registerTime);

	// info of the seller to put on user's home page

	// TODO: use form and editable, make some attributes editable on the page, and shows other information

	return (
		<Box
			display="flex"
			width="100%"
			height="100%"
			flexDirection="column"
			alignItems="center"
			mt="4"
			style={{ overflowY: "auto" }}
		>
			<VStack spacing={4} align="center">
				<Box display="flex">
					<Box
						color="gray.500"
						fontWeight="semibold"
						letterSpacing="wide"
						fontSize="md"
						ml="2"
					>
						User Information
					</Box>
				</Box>

				<Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
					Username{" "}
					<Text as="span" fontWeight="semibold">
						{user.username}
					</Text>
				</Box>

				<Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
					Email{" "}
					<Text as="span" fontWeight="semibold">
						{user.userEmail}
					</Text>
				</Box>

				<Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
					You were registered{" "}
					<Text as="span" fontWeight="semibold">
						{registerTime}
					</Text>
				</Box>

				<Box mt="1" as="h4" lineHeight="tight" noOfLines={1} fontSize="lg">
					{user.totalLikes >= 100 && (
						<Badge borderRadius="full" px="2" colorScheme="yellow">
							Star User
						</Badge>
					)}{" "}
				</Box>
			</VStack>
		</Box>
	);
}

export function PostOwnerInfoCard({ user }: { user: UserInfo }) {
	// card of user info
	const countString = formatCounts(
		user.totalPosts,
		user.totalLikes,
		user.totalViews
	);
	const registerTime = timeAgo(user.registerTime);

	// info of the poster on each post page
	return (
		<Box>
			<HStack>
				<Box display="flex" mr="4">
					<Image
						borderRadius="full"
						boxSize="50px"
						width="50px"
						src={user.profilePicture}
						alt="User Profile Picture"
					/>
				</Box>
				<Box>
					<Link as={NextLink} href={`/users/public/${user.userId}`} passHref>
						<Text fontWeight="semibold" fontSize="lg">
							{user.nickname}
						</Text>
					</Link>
					<Text fontWeight="semibold" fontSize="sm">
						{countString}
					</Text>
				</Box>
			</HStack>
		</Box>
	);
}
