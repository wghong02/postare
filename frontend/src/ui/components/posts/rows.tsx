import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Post } from "@/lib/model";
import { UserPublicPostCard } from "./cards";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export function UserPublicPostRow({
	posts,
	postsPerPage,
	currentPage,
	handleNextPage,
	handlePrevPage,
	reachedEnd,
}: {
	posts: Post[];
	postsPerPage: number;
	currentPage: number;
	handleNextPage: () => void;
	handlePrevPage: () => void;
	reachedEnd: boolean;
}) {
	// this is the horizontal rows of cards of posts. number of cards each page is determined by the size of the page
	// content of each page is decided by the index of posts.
	// Logic to calculate pagination
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

	return (
		<Box>
			<Flex
				direction="row"
				wrap="wrap"
				justifyItems="center"
				alignItems="center"
			>
				<IconButton
					aria-label="Previous Page"
					icon={<MdKeyboardArrowLeft />}
					onClick={handlePrevPage}
					size="lg"
					disabled={currentPage === 1}
				/>

				{currentPosts.length > 0 ? (
					currentPosts.map((post, index) => (
						<UserPublicPostCard key={index} post={post} />
					))
				) : (
					<p>No posts available</p>
				)}

				<IconButton
					aria-label="Next Page"
					icon={<MdKeyboardArrowRight />}
					onClick={handleNextPage}
					size="lg"
					disabled={reachedEnd}
				/>
			</Flex>
		</Box>
	);
}
