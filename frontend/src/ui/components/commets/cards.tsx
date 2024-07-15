import {
	Text,
	Box,
	HStack,
	Image,
	Link,
	VStack,
} from "@chakra-ui/react";
import { timeAgo } from "@/utils/generalUtils";
import { Comment, UserInfo } from "@/lib/model";
import { getUserPublicInfo } from "@/utils/userUtils";
import { useEffect, useState } from "react";
import NextLink from "next/link";

export function CommentCard({
	comment,
	setReplyName,
	setOnReply,
	authed,
}: {
	comment: Comment;
	setReplyName: React.Dispatch<React.SetStateAction<String>>;
	setOnReply: React.Dispatch<React.SetStateAction<boolean>>;
	authed: boolean;
}) {
	const commentTime = timeAgo(comment.commentTime);
	const [poster, setPoster] = useState<UserInfo | null>(null);

	const fetchData = async () => {
		try {
			const userInfo = await getUserPublicInfo(comment.posterId);
			setPoster(userInfo);
		} catch (error) {
			console.error("Error fetching comment user:", error);
		}
	};

	const handleSetReply = () => {
		if (authed) {
			if (poster) {
				setReplyName(poster.nickname);
			}
			setOnReply(true);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (poster) {
		return (
			<Box>
				<HStack spacing="4">
					<Image
						borderRadius="full"
						boxSize="35px"
						width="35px"
						src={poster.profilePicture}
						alt="User Profile Picture"
					/>
					<VStack spacing="0" align="initial">
						<HStack>
							<Link
								as={NextLink}
								href={`/users/public/${poster.userId}`}
								passHref
							>
								<Text fontWeight="500" fontSize="sm">
									{poster.nickname}
								</Text>
							</Link>
							<Box fontSize="xs" fontWeight="350">
								{commentTime}
							</Box>
						</HStack>

						<Text>{comment.comment}</Text>

						{authed && <Box
							fontSize="small"
							fontWeight="300"
							onClick={handleSetReply}
							_hover={{ color: "blue.500", cursor: "pointer" }}
							alignContent="initial"
						>
							Reply
						</Box>}
					</VStack>
				</HStack>
			</Box>
		);
	}
}
