import React, { useRef, useState } from "react";
import {
	Box,
	Badge,
	Text,
	VStack,
	Image,
	Input,
	HStack,
	Link,
	IconButton,
	Textarea,
	Button,
	useDisclosure,
	Collapse,
	useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { timeAgo, formatCounts } from "@/utils/generalUtils";
import { UserInfo } from "@/lib/model";
import { EditIcon } from "@chakra-ui/icons";
import { isCleanComment, isValidNickname } from "@/utils/generalUtils";

export function UserHomeInfoComponent({ user }: { user: UserInfo }) {
	const registerTime = timeAgo(user.registerTime);

	// State to manage editable fields
	const username = user.username;
	const [userEmail, setUserEmail] = useState(user.userEmail);
	const [profilePicture, setProfilePicture] = useState(user.profilePicture);
	const [phoneNumber, setPhoneNumber] = useState(user.userPhone || "");
	const [nickname, setNickname] = useState(user.nickname);
	const [bio, setBio] = useState(user.bio);
	const toast = useToast();

	// useDisclosure hook to handle slide visibility
	const { isOpen, onOpen, onClose } = useDisclosure();

	// State to manage original values for canceling changes
	const [originalValues, setOriginalValues] = useState({
		userEmail: user.userEmail,
		profilePicture: user.profilePicture,
		phoneNumber: user.userPhone || "",
		nickname: user.nickname,
		bio: user.bio || "",
	});

	// Ref for the hidden file input
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle file input change for profile picture
	const handleProfilePictureChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.onloadend = () => {
				const newProfilePicture = reader.result as string;
				setProfilePicture(newProfilePicture);
				if (newProfilePicture !== originalValues.profilePicture) {
					console.log("Opening slide - profile picture changed");
					onOpen();
				} else {
					console.log("Closing slide - profile picture unchanged");
					onClose();
				}
			};
			reader.readAsDataURL(file);
		}
	};

	// Handle click on edit button
	const handleEditClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Handle input change and show prompt if there are changes
	const handleInputChange = (
		setter: React.Dispatch<React.SetStateAction<string>>,
		value: string,
		originalValue: string
	) => {
		setter(value);
		if (value !== originalValue) {
			onOpen();
		} else {
			onClose();
		}
	};

	// Handle save changes
	const handleSaveChanges = () => {
		if (isCleanComment(bio) && isValidNickname(nickname)) {
		} else {
			toast({
				description:
					"Please fill in all required fields following the requirements and try again",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}

		// call backend
		onClose();
	};

	// Handle cancel changes
	const handleCancelChanges = () => {
		setUserEmail(originalValues.userEmail);
		setProfilePicture(originalValues.profilePicture);
		setPhoneNumber(originalValues.phoneNumber);
		setNickname(originalValues.nickname);
		setBio(originalValues.bio);
		onClose();
	};

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
			<VStack spacing={4} align="center" width="70vw">
				<Box
					color="gray.500"
					fontWeight="semibold"
					letterSpacing="wide"
					fontSize="md"
				>
					User Information
				</Box>

				<Box display="flex" flexDirection="column" alignItems="center" mt="1">
					<Text as="span" fontWeight="semibold" mb="2">
						Profile Picture
					</Text>
					<Box position="relative">
						<Image
							borderRadius="full"
							boxSize="150px"
							src={profilePicture}
							alt="Profile Picture"
						/>
						<IconButton
							size="sm"
							icon={<EditIcon />}
							position="absolute"
							top="5px"
							right="5px"
							onClick={handleEditClick}
							aria-label="Edit profile picture"
						/>
						<Input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							onChange={handleProfilePictureChange}
							display="none"
						/>
					</Box>
				</Box>

				<Box display="flex" flexDirection="column" alignItems="center" mt="1">
					<Text as="span" fontWeight="semibold">
						Username
					</Text>
					<Input
						value={username}
						mt="2"
						textAlign="center"
						width="300px"
						isDisabled
						textColor="black"
					/>
				</Box>

				<Box display="flex" flexDirection="column" alignItems="center" mt="1">
					<Text as="span" fontWeight="semibold">
						Email
					</Text>
					<Input
						type="email"
						value={userEmail}
						onChange={(e) =>
							handleInputChange(
								setUserEmail,
								e.target.value,
								originalValues.userEmail
							)
						}
						mt="2"
						textAlign="center"
						width="300px"
					/>
				</Box>

				<Box display="flex" flexDirection="column" alignItems="center" mt="1">
					<Text as="span" fontWeight="semibold">
						Phone Number
					</Text>
					<Input
						value={phoneNumber}
						onChange={(e) =>
							handleInputChange(
								setPhoneNumber,
								e.target.value,
								originalValues.phoneNumber
							)
						}
						mt="2"
						textAlign="center"
						width="300px"
					/>
				</Box>

				<Box display="flex" flexDirection="column" alignItems="center" mt="1">
					<Text as="span" fontWeight="semibold">
						Nickname
					</Text>
					<Input
						value={nickname}
						onChange={(e) =>
							handleInputChange(
								setNickname,
								e.target.value,
								originalValues.nickname
							)
						}
						mt="2"
						textAlign="center"
						width="300px"
						isInvalid={!isValidNickname(nickname)}
					/>
				</Box>

				<Box display="flex" flexDirection="column" alignItems="center" mt="1">
					<Text as="span" fontWeight="semibold">
						Bio
					</Text>
					<Textarea
						value={bio}
						onChange={(e) =>
							handleInputChange(setBio, e.target.value, originalValues.bio)
						}
						mt="2"
						textAlign="center"
						width="300px"
						isInvalid={!isCleanComment(bio)}
					/>
				</Box>

				<Box display="flex" flexDirection="column" alignItems="center" mt="1">
					<Text as="span" fontWeight="semibold" mt="2">
						You were registered {registerTime}
					</Text>
				</Box>

				{user.totalLikes >= 100 && (
					<Box display="flex" flexDirection="column" alignItems="center" mt="1">
						<Badge borderRadius="full" px="2" colorScheme="yellow">
							Star User
						</Badge>
					</Box>
				)}
			</VStack>

			<Collapse in={isOpen} style={{ zIndex: 10 }}>
				<Box
					width="70vw"
					p="4"
					boxShadow="md"
					display="flex"
					justifyContent="flex-end"
				>
					<Button variant="ghost" onClick={handleCancelChanges} shadow="md">
						Cancel
					</Button>
					<Button
						colorScheme="teal"
						onClick={handleSaveChanges}
						shadow="md"
						ml="2"
					>
						Save
					</Button>
				</Box>
			</Collapse>
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
