import {
	Badge,
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	Heading,
	Image,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";
import { isPostedWithin, timeAgo } from "@/utils/generalUtils";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { deletePost } from "@/utils/postUtils";
import { Post } from "@/lib/model";

export function UserPostCard({ post }: { post: Post }) {
	const uploadedTime = timeAgo(post.putOutTime);
	const postId = post.postId;
	const toast = useToast();

	// to delete the post, shown as button on the card
	const deleteOnClick = async (postId: string) => {
		try {
			await deletePost(postId);
			toast({
				description: "Delete Successful.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			await new Promise((resolve) => setTimeout(resolve, 2000));
			window.location.href = `/user/posts`; // Inform parent component about the deletion
		} catch (error: any) {
			toast({
				description: error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Box m="3" borderWidth="1px" borderRadius="lg" boxShadow="md">
			<Card direction="row" overflow="hidden" width="500px" height="300px">
				<Image
					objectFit="cover"
					maxW="240px"
					src={post.imageUrl}
					alt="Post Image"
				/>

				<Stack height="300px">
					<CardBody>
						<Heading size="md">{post.title}</Heading>

						<Text py="1">{post.description}</Text>
						<Text py="1">Post posted {uploadedTime}</Text>
					</CardBody>

					<CardFooter mt="-3">
						<Link as={NextLink} href={`/posts/${postId}`} passHref>
							<Button variant="solid" colorScheme="blue" mr="6">
								View
							</Button>
						</Link>
						<Button
							variant="solid"
							colorScheme="red"
							onClick={() => deleteOnClick(postId)}
						>
							Delete
						</Button>
					</CardFooter>
				</Stack>
			</Card>
		</Box>
	);
}

export function PostPreviewCard({ post }: { post: Post }) {
	// card of each individual post
	// shows basic info of the post
	const registerTime = timeAgo(post.putOutTime);
	const postedRecent = isPostedWithin(post.putOutTime, "week");
	const isAvailable = post.isAvailable;
	const isHot = post.likes >= 500;
	return (
		<div>
			<Link as={NextLink} href={`/posts/${post.postId}`} passHref>
				<Box
					maxW="300px"
					borderWidth="1px"
					borderRadius="lg"
					overflow="hidden"
					boxShadow="md"
					m="2"
				>
					<Image src={post.imageUrl} />
					{/* //show badges of new if new and available, archived, hot if have many views */}
					<Box p="3">
						<Box display="flex" alignItems="baseline">
							<Box as="span" color="gray.600" fontSize="sm">
								{registerTime}
							</Box>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="xs"
								textTransform="uppercase"
								ml="4"
							>
								{post.likes} likes
							</Box>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="xs"
								textTransform="uppercase"
								ml="4"
							>
								{post.views} views
							</Box>
						</Box>
						<Box display="flex" alignItems="baseline">
							{postedRecent && isAvailable && (
								<Badge borderRadius="full" px="2" colorScheme="blue">
									New
								</Badge>
							)}
							{!isAvailable && (
								<Badge borderRadius="full" px="2" colorScheme="gray">
									Archived
								</Badge>
							)}
							{isHot && (
								<Badge borderRadius="full" px="2" colorScheme="red">
									Hot
								</Badge>
							)}
							{(isHot || postedRecent) && <Box mr="4" />}
							<Box
								mt="1"
								fontWeight="semibold"
								lineHeight="tight"
								noOfLines={1}
							>
								{post.title}
							</Box>
						</Box>
					</Box>
				</Box>
			</Link>
		</div>
	);
}

export function UserPublicPostCard({ post }: { post: Post }) {
	// card of the breif info of each post, mostly in recom. page
	const postId = post.postId;
	const registerTime = timeAgo(post.putOutTime);

	return (
		<Box>
			<Link as={NextLink} href={`/posts/${postId}`} passHref>
				<Card
					direction="column"
					overflow="hidden"
					variant="outline"
					width="400px"
					height="340px"
					margin="2"
				>
					<Image
						objectFit="scale-down"
						width="400px"
						height="240px"
						src={post.imageUrl}
						alt="Post Image"
					/>

					<CardBody>
						<Heading size="md">{post.title}</Heading>

						<Box display="flex" alignItems="baseline" mt="4">
							<Box as="span" color="gray.600" fontSize="sm">
								{registerTime}
							</Box>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="xs"
								textTransform="uppercase"
								ml="4"
							>
								{post.likes} likes
							</Box>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="xs"
								textTransform="uppercase"
								ml="4"
							>
								{post.views} views
							</Box>
						</Box>
					</CardBody>
				</Card>
			</Link>
		</Box>
	);
}

export function LikedPostCard({ post }: { post: Post }) {
	const uploadedTime = timeAgo(post.putOutTime);

	return (
		<Box m="3" borderWidth="1px" borderRadius="lg" boxShadow="md">
			<Card direction="row" overflow="hidden" width="500px" height="300px">
				<Image
					objectFit="cover"
					maxW="240px"
					src={post.imageUrl}
					alt="Post Image"
				/>

				<Stack height="300px">
					<CardBody>
						<Link as={NextLink} href={`/posts/${post.postId}`} passHref>
							<Heading size="md">{post.title}</Heading>
						</Link>

						<Box display="flex" alignItems="baseline" mt="4">
							<Box as="span" color="gray.600" fontSize="sm">
								{uploadedTime}
							</Box>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="xs"
								textTransform="uppercase"
								ml="4"
							>
								{post.likes} likes
							</Box>
							<Box
								color="gray.500"
								fontWeight="semibold"
								letterSpacing="wide"
								fontSize="xs"
								textTransform="uppercase"
								ml="4"
							>
								{post.views} views
							</Box>
						</Box>
						<Text py="4">{post.description}</Text>
					</CardBody>
				</Stack>
			</Card>
		</Box>
	);
}
