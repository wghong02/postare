import {
	Text,
	Box,
	useToast,
	HStack,
	Image,
	Link,
	VStack,
} from "@chakra-ui/react";
import { timeAgo } from "@/utils/generalUtils";
import { Comment, UserInfo } from "@/lib/model";
import { getSubCommentsByPostId } from "@/utils/commentUtils";
import { getUserPublicInfo } from "@/utils/userUtils";
import { useEffect, useState } from "react";
import NextLink from "next/link";

export function CommentCard({ comment }: { comment: Comment }) {
	const commentTime = timeAgo(comment.commentTime);
	const toast = useToast();
	const [poster, setPoster] = useState<UserInfo | null>(null);

	const fetchData = async () => {
		try {
			const userInfo = await getUserPublicInfo(comment.posterId);
			setPoster(userInfo);
		} catch (error) {
			console.error("Error fetching comment user:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Box>
			{poster && (
				<HStack spacing="4">
					<Image
						borderRadius="full"
						boxSize="35px"
						width="35px"
						src={poster.profilePicture}
						alt="User Profile Picture"
					/>
					<VStack spacing="0" align="initial">
						<Link
							as={NextLink}
							href={`/users/public/${poster.userId}`}
							passHref
						>
							<Text fontWeight="semibold" fontSize="md">
								{poster.nickname}
							</Text>
						</Link>

						<Text>{comment.comment}</Text>
					</VStack>
				</HStack>
			)}
		</Box>
	);
}
